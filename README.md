# Next.js Supabase Legacy Auth

## 関連プロジェクト
🔗 [NextAuth版リポジトリ](https://github.com/nogataka/nextjs-supabase-nextauth) - NextAuth.jsを使用した認証バージョン

<p align="center">
 Next.js 14とSupabaseを使用した認証機能のデモアプリケーション
</p>

## プロジェクト概要

このプロジェクトは、Next.js 14とSupabaseを使用した認証機能のデモアプリケーションです。最新のウェブ開発技術を活用し、セキュアで効率的な認証システムを提供します。

## 主な機能

- **フレームワーク**: 
  - Next.js 14 App Router
  - サーバーコンポーネント
  - クライアントコンポーネント
  - ミドルウェアサポート

- **認証**: 
  - Supabase認証
  - クッキーベースのセッション管理
  - サーバーサイドとクライアントサイドの両方で動作

- **スタイリング**:
  - Tailwind CSS
  - レスポンシブデザイン

- **開発環境**:
  - TypeScript
  - ESLint
  - 型安全性

## プロジェクト構造

```
.
├── app
│   ├── api             # APIエンドポイント
│   ├── dashboard       # ダッシュボードページ
│   ├── login           # ログインページ
│   ├── profile         # プロフィールページ
│   └── signup          # サインアップページ
├── components
│   └── Navbar.tsx      # ナビゲーションバーコンポーネント
├── context
│   └── AuthContext.tsx # 認証コンテキスト
└── middleware.ts       # 認証ミドルウェア
```

## 使用ツール・技術

### メイン依存関係
- **フレームワーク**: Next.js 14.1.0
- **言語**: TypeScript 5.1.3
- **UI**: React 18.2.0
- **認証**: Supabase
  - @supabase/auth-helpers-nextjs: ^0.8.7
  - @supabase/ssr: latest
  - @supabase/supabase-js: latest
- **スタイリング**: Tailwind CSS 3.3.3

### 開発ツール
- ESLint
- PostCSS
- Node.js

## セットアップ方法

1. リポジトリをクローン
   ```bash
   git clone https://github.com/nogataka/nextjs-supabase-regacy-auth.git
   cd nextjs-supabase-regacy-auth
   ```

2. 依存関係をインストール
   ```bash
   npm install
   ```

3. 環境変数を設定
   - `.env.local.sample`を`.env.local`にコピー
   - Supabaseプロジェクトの設定を追加

## 開発スクリプト

- `npm run dev`: 開発モードで起動
- `npm run build`: プロダクションビルド
- `npm start`: プロダクションモードで起動

## 環境変数

必要な環境変数:
- `NEXT_PUBLIC_SUPABASE_URL`: SupabaseプロジェクトのベースURL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: パブリックアクセス用のキー

**注意**: 秘密キーは公開しないでください。

## トラブルシューティング

- Supabaseの設定を確認
- 環境変数が正しく設定されているか確認
- Node.jsとnpmが最新バージョンであることを確認

## 貢献

プルリクエストや改善提案を歓迎します。詳細は`CONTRIBUTING.md`を参照してください。

## ライセンス

このプロジェクトは[MITライセンス](LICENSE)の下で公開されています。

## Supabase設定

### データベース設定

#### Notesテーブル作成

Supabaseダッシュボードで以下のSQLを実行してNotesテーブルを作成します：

```sql
-- Notesテーブルの作成
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    content TEXT,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    is_favorite BOOLEAN DEFAULT false,
    tags TEXT[],
    category_id UUID
);

-- RLS（Row Level Security）ポリシーの設定
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- ユーザー自身のデータのみ操作を許可するポリシー
CREATE POLICY "Users can manage their own notes" 
ON notes FOR ALL 
USING (auth.uid() = user_id);

-- インデックスの追加（パフォーマンス最適化）
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_created_at ON notes(created_at);
```

### 認証設定

1. Supabaseプロジェクトを作成
2. 認証設定
   - Email/Passwordサインアップを有効化
   - ソーシャルログイン（必要に応じて）を設定

### 環境変数設定

`.env.local`に以下の情報を追加：

```bash
# Supabase接続情報
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### セキュリティ推奨設定

1. 強力なパスワードポリシーを設定
2. 多要素認証（MFA）の有効化
3. IPアドレス制限の検討
4. 定期的なセキュリティ監査

### データベース拡張機能

以下の拡張機能の有効化を推奨：
- `uuid-ossp`: UUIDの生成
- `pgcrypto`: 暗号化機能

### バックアップと監視

1. 自動バックアップの設定
2. データベースメトリクスの監視
3. 異常検知アラートの設定
