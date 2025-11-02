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
- [x] Node.jsでTypeScriptを実行するため`tsx`の導入
- [x] https://tsx.is/typescript#tsconfig-json にしたがってtsconfig.jsonを更新。以下の設定で既存のtsconfig.jsonにて未定義のものはコメントとともに追加、すでに設定済みのものは既存のtsconfig.jsonを優先
```
{
	"compilerOptions": {

		// Treat files as modules even if it doesn't use import/export
		"moduleDetection": "force",

		// Ignore module structure
		"module": "Preserve",

		// Allow JSON modules to be imported
		"resolveJsonModule": true,

		// Allow JS files to be imported from TS and vice versa
		"allowJs": true,

		// Use correct ESM import behavior
		"esModuleInterop": true,

		// Disallow features that require cross-file awareness
		"isolatedModules": true,
	},
}
```
- [ ] @prisma/adapter-better-sqlite3のインストール
- [ ] `prisma/seed/seed.ts` ファイルの作成
- [ ] `articles.json` を`prisma/seed`ディレクトリに移動
- [ ] `articles.json` を読み込む処理の実装
- [ ] `categories.json` を`prisma/seed`ディレクトリに作成、`articles.json`から全カテゴリを抽出し、`schema.prisma`のモデルに従ってJSON配列を作成。
- [ ] 読み込んだデータを`Article`, `Category`, `Tag`モデルに変換し、データベースに保存する処理の実装
    - Zod schemaをz.object()とTypeScript satisfiesを使って作成。Prismaの作成したCategory用のInputに合致しているか確認するためのSchema。
    - Zod schemaをz.object()とTypeScript satisfiesを使って作成。Prismaの作成したArticle用のInputに合致しているか確認するためのSchema。
    - `categories.json`を読み込み、上記のSchemaに合致しているかチェック、違反していればErrorをthrowして終了
	- `categories.json`が上記のSchemaにすべて合致していれば、prisma.category.upsertでDBにないものだけ挿入。upsertのwhereはnameの一致を確認。
	- `articles.json`を読み込み、上記のSchemaに合致しているかチェック、違反していればErrorをthrowして終了
	- `articles.json`が上記のSchemaにすべて合致していれば、prisma.article.upsertでDBにないものだけ挿入。upsertのwhereはidの一致を確認。tagsはconnectOrCreateを使用

## 5. Prismaクライアントの利用
- [ ] アプリケーションコードからのPrismaクライアントのインポートと利用方法の検討
- [ ] `getSearchResult` 関数をPrismaクライアントを使用するように変更
