# Prisma導入計画

## 1. Prisma初期設定
- [x] Prisma CLIのインストール
- [x] `prisma init` コマンドの実行
  - schema.prismaの設定はhttps://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/no-rust-engine に従ってNo Rust engineを使う
```
generator client {
  provider        = "prisma-client"
  output          = "../generated/prisma"
  engineType      = "client" // enable Prisma ORM without Rust
}
```
- [x] データベースプロバイダの設定（SQLite）
- [x] `.env` ファイルでのデータベース接続URLの設定、.gitignoreに.envを追加

## 2. スキーマ定義（`schema.prisma`）
- [x] `app/search/articles.json`のデータ構造に基づき、以下のモデルを定義します。

### Articleモデル
- `id`: Int (Primary Key, Auto-increment)
- `title`: String
- `article`: String
- `category`: String (Categoryモデルとのリレーションを考慮)
- `date`: DateTime
- `views`: Int
- `tags`: Tagモデルとの多対多リレーション

### Categoryモデル
- `id`: Int (Primary Key, Auto-increment)
- `name`: String (Unique)
- `articles`: Articleモデルとのリレーション

### Tagモデル
- `id`: Int (Primary Key, Auto-increment)
- `name`: String (Unique)
- `articles`: Articleモデルとの多対多リレーション

## 3. マイグレーション
- [x] `prisma migrate dev` コマンドの実行によるデータベーススキーマの作成

## 4. シードスクリプトの作成
`app/search/articles.json`のデータをデータベースに投入するためのシードスクリプトを作成します。
- [ ] Node.jsでTypeScriptを実行するため`tsx`の導入
- [ ] https://tsx.is/typescript#tsconfig-json にしたがって
- [ ] `prisma/seed/seed.ts` ファイルの作成
- [ ] `articles.json` を`prisma/seed`ディレクトリに移動
- [ ] `articles.json` を読み込む処理の実装
- [ ] 読み込んだデータを`Article`, `Category`, `Tag`モデルに変換し、データベースに保存する処理の実装
    - 既存のカテゴリやタグがあれば再利用し、なければ新規作成するロジック

## 5. Prismaクライアントの利用
- [ ] アプリケーションコードからのPrismaクライアントのインポートと利用方法の検討
- [ ] `getSearchResult` 関数をPrismaクライアントを使用するように変更
