"use client"
import { useAuth } from "@/context/AuthContext";

/**
 * ログイン後のマイページ
 */
const MyPage = () => {
    const { user, session, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 pt-20 text-center lg:pt-32">
                <div className="flex justify-center items-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="ml-2">認証情報を読み込み中...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 pt-20 text-center lg:pt-32">
            <h1 className="text-2xl font-bold">
                ようこそ {user?.email} さん
            </h1>
            <div className="pt-10 space-y-4">
                <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
                    <p className="py-2 px-3 bg-gray-100 rounded mb-2">
                        <span className="font-semibold">セッション:</span> {session ? '有効' : '無効'}
                    </p>
                    <p className="py-2 px-3 bg-gray-100 rounded mb-2">
                        <span className="font-semibold">ユーザーID:</span> {user?.id || '取得できませんでした'}
                    </p>
                    <p className="py-2 px-3 bg-gray-100 rounded mb-2">
                        <span className="font-semibold">メールアドレス:</span> {user?.email || '取得できませんでした'}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default MyPage;