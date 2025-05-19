# Next.js Supabase Legacy Auth

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
