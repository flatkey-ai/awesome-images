# Flatkey 画像生成プロンプトライブラリ

[English](README.md) | [中文](README_zh.md) | [日本語](README_ja.md) | [Español](README_es.md) | [Português](README_pt.md) | [Tiếng Việt](README_vi.md)

AI API リセラー、成長施策ページ、ユーザーオンボーディング向けの画像生成プロンプトライブラリです。ユーザーはテンプレートを閲覧し、プロンプトをコピーし、変数を置き換え、Flatkey API key を登録して、OpenAI 互換の画像 API で画像を生成できます。

API key を取得：<https://flatkey.ai?utm_source=skill>

## 価値

- **利用開始の摩擦を下げる**：空のプロンプト欄から始めず、実用的なテンプレートから始められます。
- **API コンバージョンを高める**：各テンプレートカードから Flatkey API key 登録へ誘導します。
- **商用ユースケースを広くカバー**：商品マーケティング、EC 画像、SNS 広告、インフォグラフィック、アバター、App スクリーンショット、ゲーム素材、画像編集。
- **バッチ処理に向く**：テンプレートは `{{variable}}` プレースホルダーを使うため、アプリ側で値を置き換えて API に送れます。
- **マーケティング素材として使える**：prompt gallery、チュートリアル、ランディングページ、オンボーディング資料に適しています。

## 収録テンプレート

現在 12 個の高頻度な画像生成テンプレートを収録しています：

- プレミアム商品ヒーロービジュアル
- 白背景 EC メイン画像
- UGC 広告カバーフレーム
- Liquid glass Bento インフォグラフィック
- 創業者引用カード
- 統一スタイルのアバターセット
- App Store スクリーンショットポスター
- YouTube サムネイル
- イベントポスター KV
- ゲーム小道具コンセプトシート
- 被写体を保持した背景差し替え
- ファッション Lookbook コラージュ

各テンプレートには以下が含まれます：

- タイトルと用途
- カテゴリと推奨モデル
- 置き換え可能な変数
- 完整なプロンプト本文
- API 用途メモ
- プロンプトコピー ボタン
- Flatkey API key 登録リンク

## CLI 利用

CLI で直接画像を生成します：

```bash
npx @flatkey-ai/image-buddy onboard
npx @flatkey-ai/image-buddy generate premium-product-hero \
  --var "产品名称=Image Buddy" \
  --var "品牌调性=clean SaaS" \
  --var "核心卖点=one-command image generation" \
  --var "主色=teal"
```

`onboard` は Flatkey API key の入力を促し、ローカルに保存します。key がない場合は <https://console.flatkey.ai/keys> で取得できます。CLI は保存済み key、`FLATKEY_IMAGE_API_KEY`、または `FLATKEY_API_KEY` を読み取り、Flatkey 画像 API を呼び出し、画像をローカルに保存します。デフォルトでは Web UI を起動しません。

npm release 前にソースから実行する場合：

```bash
npx github:flatkey-ai/awesome-images
```

便利なオプション：

```bash
npx @flatkey-ai/image-buddy web --port 5173
npx @flatkey-ai/image-buddy web --no-open
npx @flatkey-ai/image-buddy --help
```

開発者向けコマンド：

```bash
npm install
npm test
npm run build
```

## ユーザーフロー

1. `npx @flatkey-ai/image-buddy generate <template-id>` または `npx @flatkey-ai/image-buddy generate --prompt "..."` を実行します。
2. カテゴリまたはキーワードでテンプレートを探します。
3. テンプレートを展開し、プロンプトをコピーします。
4. `{{product_name}}`、`{{core_benefit}}`、`{{brand_color}}` などの変数を置き換えます。
5. <https://flatkey.ai?utm_source=skill> で Flatkey API key を登録します。
6. Flatkey の OpenAI 互換画像 API を呼び出して画像を生成します。

## API 例

```bash
curl https://api.flatkey.ai/v1/images/generations \
  -H "Authorization: Bearer $FLATKEY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-image-2",
    "prompt": "final prompt after replacing template variables",
    "size": "1536x1024"
  }'
```

## テンプレート構造

すべてのテンプレートは [src/prompts.js](src/prompts.js) にあります。

新しいテンプレートはオブジェクトを追加します：

```js
{
  id: "unique-template-id",
  title: "Template title",
  category: "product",
  badge: "Hero",
  aspectRatio: "16:9",
  model: "gpt-image-2",
  apiUseCase: "Best-fit API use case.",
  description: "Template description.",
  variables: ["product_name", "core_benefit"],
  prompt: "Create a commercial hero image for {{product_name}}..."
}
```

追加後に実行：

```bash
npm test
```

検証ツールはテンプレート数、カテゴリ、変数、プロンプト長、Flatkey 登録リンクを確認します。

## Release 公開

公開は GitHub Release から実行されます。

1. npm automation token を GitHub repository secrets に `NPM_PUBLISH_TOKEN` として追加します。
2. `v1.2.3` または `1.2.3` の tag で GitHub Release を作成します。
3. workflow が `package.json` と `package-lock.json` を release version に設定します。
4. workflow が検証、ビルド、`npm publish --access public` を実行します。

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=flatkey-ai/awesome-images&type=Date)](https://www.star-history.com/#flatkey-ai/awesome-images&Date)
