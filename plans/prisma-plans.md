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
- [x] `prisma/seed/seed.ts` ファイルの作成
- [x] `articles.json` を`prisma/seed`ディレクトリに移動
- [x] `categories.json` を`prisma/seed`ディレクトリに作成、`articles.json`から全カテゴリを抽出し、`schema.prisma`のモデルに従ってJSON配列を作成。
- [x] `categories.json` を読み込む処理の実装、
    - Zod schemaをz.object()とTypeScript satisfiesを使って作成。Prismaの作成したCategory用のInputに合致しているか確認
    - Schemaに合致していないものが発見されたらErrorをthrowして終了
    - 読み込んだらprintする。まだPrismaの事は考えない。
- [ ] `articles.json` を読み込む処理の実装、読み込んだらprintする。まだPrismaの事は考えない。
    - Zod schemaをz.object()とTypeScript satisfiesを使って作成。Prismaの作成したArticle用のInputに合致しているか確認するためのSchema。
    - Schemaに合致していないものが発見されたらErrorをthrowして終了
- [ ] Categoryの更新処理を実装
	- `categories.json`から読み込んだデータがすべてもれなく上記のZod Schemaに合致致していれば、prisma.category.upsertでDBにないものだけ挿入。upsertのwhereはnameの一致を確認。
- [ ] Articleの更新処理を実装
	- `categories.json`から読み込んだデータがすべてもれなく上記のZod Schemaに合致致していれば、prisma.article.upsertでDBにないものだけ挿入。upsertのwhereはidの一致を確認。tagsはconnectOrCreateを使用
- [x] `seed.ts`を実行する`tsx --env-file .env ...`の形式のコマンドを`package.json` > `scripts`に追加
- [ ] 上記コマンドで`seed.ts`を実行
    - エラーがあればエラーメッセージを分析して原因を報告。まだ解決はしない、ソースコードを編集しない。
    - エラーがなければ、sqlite3 CLIで結果を確認するための一連のコマンドを提示、実行はしない。

## 5. Prismaクライアントの利用
- [ ] アプリケーションコードからのPrismaクライアントのインポートと利用方法の検討
- [ ] `getSearchResult` 関数をPrismaクライアントを使用するように変更
