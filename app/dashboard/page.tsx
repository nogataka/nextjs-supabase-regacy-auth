"use client"

import { useEffect, useState, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Notesのデータ型を定義
interface Note {
  id: number;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
}

const DashboardPage = () => {
  const supabase = createClientComponentClient();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const [supabaseStatus, setSupabaseStatus] = useState<{
    connected: boolean;
    timestamp?: string;
    error?: string;
    authStatus?: string;
  }>({ connected: false });
  
  const { isLoading:isLoadingAuth, session } = useAuth();

  const checkSupabaseAuth = async () => {
    try {
      // ユーザーセッションの確認
      let authStatus = "未認証";
      const expiryTime = new Date((session?.expires_at || 0) * 1000);
      const now = new Date();
      const remainingMins = Math.round((expiryTime.getTime() - now.getTime()) / (1000 * 60));
      
      authStatus = `認証済み (トークン残り約${remainingMins}分)`;
      return authStatus;
    } catch (err) {
      console.error("認証確認エラー:", err);
      return "認証確認中にエラーが発生しました";
    }
  };

  // Supabase接続テスト（修正版）
  const testSupabaseConnection = async () => {
    try {
      setIsLoading(true);
      
      // 認証状態を確認
      const authStatus = await checkSupabaseAuth();
      
      try {
        // シンプルなテストクエリの実行
        // notesテーブルが存在するかの確認（COUNT(*)なので実データは返さない）
        const { count, error: tableError } = await supabase
          .from('notes')
          .select('*', { count: 'exact', head: true });
        
        if (tableError) {
          throw new Error(`テーブル接続エラー: ${tableError.message}`);
        }
        
        // 現在時刻を取得（クライアント側で生成）
        const timestamp = new Date().toISOString();
        
        // 接続成功情報を設定
        setSupabaseStatus({
          connected: true,
          timestamp: timestamp,
          authStatus
        });
        
        console.log("Supabase接続成功:", { tableExists: count !== null, timestamp, authStatus });
        
        // ノートの総数を取得（初期表示用）
        if (session?.user?.id) {
          await fetchNotes();
        }
      } catch (err: any) {
        console.error("Supabase接続テストエラー:", err);
        setSupabaseStatus({
          connected: false,
          error: err.message || 'Supabaseに接続できませんでした',
          authStatus
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ページロード時にSupabase接続をテスト
  useEffect(() => {
    if (!isLoadingAuth) {
      testSupabaseConnection();
    }
  }, [isLoadingAuth, session]);

  // ノートデータの取得
  const fetchNotes = async () => {
    if (!session?.user?.id) {
      console.log("セッションまたはユーザーIDがありません", session);
      setDebugInfo({ session });
      return;
    }

    try {
      setIsLoading(true);
      console.log("ノートの取得を開始します。ユーザーID:", session.user.id);
      
      // ユーザーIDをログに出力して確認する
      const userId = session.user.id;
      console.log("使用するユーザーID:", userId, "型:", typeof userId);
      
      // まずテーブル内の全データ数を取得する
      const { count: totalCount, error: countError } = await supabase
        .from('notes')
        .select('*', { count: 'exact', head: true });
        
      console.log("テーブル内の総データ数:", totalCount, "エラー:", countError);
      
      // ユーザーIDに関係なく全データを取得してみる
      const { data: allNotes, error: allNotesError } = await supabase
        .from('notes')
        .select('*')
        .limit(10);
        
      console.log("全ノート(10件まで):", allNotes?.length, "エラー:", allNotesError);
      if (allNotes && allNotes.length > 0) {
        console.log("最初のノートのuser_id:", allNotes[0].user_id, "型:", typeof allNotes[0].user_id);
      }

      // ノート情報を取得
      const query = supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      const { data: notesData, error: notesError } = await query;

      console.log("取得結果:", { notesData, notesError });
      setDebugInfo({ 
        session, 
        userId,
        totalCount, 
        allNotesCount: allNotes?.length, 
        queriedNotesCount: notesData?.length, 
        query: JSON.stringify(query),
        notesError,
        firstAllNote: allNotes && allNotes.length > 0 ? {
          id: allNotes[0].id,
          user_id: allNotes[0].user_id,
          user_id_type: typeof allNotes[0].user_id
        } : null
      });

      if (notesError) {
        throw notesError;
      }

      // データをステートにセット
      setNotes(notesData || []);
      setIsLoading(false);
    } catch (err) {
      console.error('ノート取得中にエラーが発生しました:', err);
      setError('ノートの読み込みに失敗しました');
      setDebugInfo({ error: err, session });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadNotes = async () => {
      if (!session?.user?.id) return;
      await fetchNotes();
      if (!isMounted) return;
    };

    if (session?.user?.id) {
      loadNotes();
    }

    // クリーンアップ関数
    return () => {
      isMounted = false;
    };
  }, [session]);

  // ノート作成処理
  const handleCreateNote = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) return;
    if (!title.trim() && !content.trim()) {
      alert('タイトルまたは内容を入力してください');
      return;
    }

    try {
      setIsCreating(true);
      
      const { error } = await supabase
        .from('notes')
        .insert([
          {
            user_id: session.user.id,
            title: title.trim() || null,
            content: content.trim() || null,
          }
        ]);

      if (error) throw error;

      // フォームをクリア
      setTitle("");
      setContent("");
      setShowForm(false);
      
      // ノート一覧を再取得
      await fetchNotes();
      
    } catch (err) {
      console.error('ノート作成中にエラーが発生しました:', err);
      alert('ノートの作成に失敗しました');
    } finally {
      setIsCreating(false);
    }
  };

  // データローディング中
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2">データを読み込み中...</p>
          {session && (
            <p className="mt-2 text-xs">ユーザーID: {session.user?.id}</p>
          )}
        </div>
      </div>
    );
  }

  // エラー発生時
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
          <p className="font-bold">エラー</p>
          <p>{error}</p>
          {debugInfo && (
            <div className="mt-4 p-3 bg-gray-100 rounded overflow-auto text-xs">
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">ダッシュボード</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {showForm ? "キャンセル" : "新規ノート作成"}
        </button>
      </div>

      {/* Supabase接続情報 */}
      <div className="mb-6 bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Supabase接続ステータス</h2>
        <div className="flex items-center space-x-2 mb-2">
          <div className={`h-3 w-3 rounded-full ${supabaseStatus.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>{supabaseStatus.connected ? '接続成功' : '接続エラー'}</span>
        </div>
        
        {supabaseStatus.connected ? (
          <div className="text-sm text-gray-600 mt-2 space-y-1">
            <p>接続テスト実行時刻: {new Date(supabaseStatus.timestamp || '').toLocaleString('ja-JP')}</p>
            <p>認証状態: {supabaseStatus.authStatus || '不明'}</p>
            <p>総ノート数: {notes.length}件</p>
          </div>
        ) : (
          <div className="text-sm text-red-600 mt-2">
            <p>{supabaseStatus.error}</p>
            <p>認証状態: {supabaseStatus.authStatus || '不明'}</p>
          </div>
        )}
        
        <button 
          onClick={testSupabaseConnection}
          className="mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded text-sm transition-colors"
        >
          接続テスト
        </button>
      </div>
      
      {/* デバッグ情報 */}
      <div className="mb-6 p-4 bg-gray-100 rounded text-xs">
        <h3 className="font-bold mb-2">デバッグ情報</h3>
        <p>ユーザーID: {session?.user?.id}</p>
        <p>メール: {session?.user?.email}</p>
        <p>ノート数: {notes.length}</p>
        {debugInfo && (
          <div className="mt-2 p-2 bg-white rounded overflow-auto max-h-40">
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </div>
      
      {showForm && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">新規ノート作成</h2>
          <form onSubmit={handleCreateNote} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                タイトル
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="タイトルを入力（省略可）"
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                内容
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="ノートの内容を入力"
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isCreating}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isCreating ? "作成中..." : "作成する"}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {notes.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p>ノートはまだありません。「新規ノート作成」ボタンからノートを作成してみましょう。</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <div 
              key={note.id} 
              className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2 border-b pb-2">{note.title || 'タイトルなし'}</h2>
              <p className="text-gray-600 mb-2 break-words">{note.content || '内容なし'}</p>
              <div className="text-sm text-gray-500">
                作成日: {new Date(note.created_at).toLocaleString('ja-JP')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage; 