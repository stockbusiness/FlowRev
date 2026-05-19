# FlowRev

収益フロー管理プラットフォーム。売上・費用・キャッシュフローをリアルタイムで可視化・最適化します。

## 技術構成

| カテゴリ | 技術 |
|---|---|
| フレームワーク | Next.js 15 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS |
| UIコンポーネント | shadcn/ui |
| バックエンド | Supabase |
| ルーティング | App Router (`src/` ディレクトリ構成) |

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/stockbusiness/FlowRev.git
cd FlowRev
```

### 2. 依存パッケージのインストール

```bash
npm install
```

### 3. 環境変数の設定

```bash
cp .env.example .env.local
```

`.env.local` を開いて以下の値を設定します：

| 変数名 | 説明 | 取得場所 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | SupabaseプロジェクトのURL | Supabaseダッシュボード > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase公開匿名キー | Supabaseダッシュボード > Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabaseサービスロールキー（サーバーサイド用） | Supabaseダッシュボード > Settings > API |

### 4. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) でアプリが起動します。

### 5. shadcn/ui コンポーネントの追加（必要に応じて）

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
# など
```

## ディレクトリ構成

```
src/
├── app/
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # トップページ (/)
│   ├── globals.css         # グローバルスタイル
│   └── dashboard/
│       ├── layout.tsx      # ダッシュボードレイアウト
│       └── page.tsx        # ダッシュボードページ (/dashboard)
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx     # サイドバーナビゲーション
│   │   └── header.tsx      # ページヘッダー
│   └── ui/                 # shadcn/ui コンポーネント置き場
└── lib/
    ├── utils.ts            # ユーティリティ関数 (cn など)
    └── supabase/
        ├── client.ts       # クライアントサイド Supabase クライアント
        └── server.ts       # サーバーサイド Supabase クライアント
```

## 利用可能なスクリプト

```bash
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run start    # プロダクションサーバー起動
npm run lint     # ESLint 実行
```

## 今後の実装予定

- [ ] Supabase Authentication（ログイン・サインアップ）
- [ ] DBテーブル設計・マイグレーション
- [ ] 収益データの CRUD 機能
- [ ] グラフ・チャートコンポーネント
- [ ] レポート生成・エクスポート
