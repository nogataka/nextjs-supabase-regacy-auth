import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 保護されたルート（ログインが必要なページ）
const PROTECTED_ROUTES = ['/dashboard', '/profile']

// 認証ルート（ログイン済みの場合はダッシュボードへリダイレクト）
const AUTH_ROUTES = ['/login', '/signup']

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })
    
    // セッション情報を取得
    const { data: { session } } = await supabase.auth.getSession()
    
    // 現在のパスを取得
    const path = req.nextUrl.pathname
    
    // 保護されたルートにアクセスし、ログインしていない場合
    if (PROTECTED_ROUTES.some(route => path.startsWith(route)) && !session) {
        const redirectUrl = new URL('/login', req.url)
        // 元々アクセスしようとしていたURLを保存
        redirectUrl.searchParams.set('redirectTo', path)
        return NextResponse.redirect(redirectUrl)
    }
    
    // 認証ルート（ログイン・サインアップ）にアクセスし、ログイン済みの場合
    if (AUTH_ROUTES.includes(path) && session) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    
    return res
}

// ミドルウェアを適用するパスを指定
export const config = {
    matcher: [
        /*
         * 以下のパスに対してミドルウェアを適用する:
         * - /dashboard, /dashboard/* (ダッシュボード関連)
         * - /profile, /profile/* (プロフィール関連)
         * - /login (ログインページ)
         * - /signup (サインアップページ)
         */
        '/dashboard/:path*',
        '/profile/:path*',
        '/login',
        '/signup',
    ],
}
