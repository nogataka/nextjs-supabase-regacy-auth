"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Navbar() {
  const { signOut, session } = useAuth();

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* アプリタイトル */}
        <Link href="/" className="text-xl font-bold hover:text-blue-300 transition-colors">
          AuthApp
        </Link>

        {/* 右側のユーザー情報とボタン */}
        <div className="flex items-center space-x-4">
          {session?.user ? (
            <>
              <div className="flex space-x-2">
                <Link 
                  href="/dashboard" 
                  className="px-3 py-1 text-sm"
                >
                  ダッシュボード
                </Link>
                <Link 
                  href="/profile" 
                  className="px-3 py-1 text-sm"
                >
                  プロフィール
                </Link>
              </div>
              <span className="hidden md:inline-block text-gray-300">
                {session.user.email}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => signOut()}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
                >
                  ログアウト
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-sm transition-colors"
            >
              ログイン
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 
