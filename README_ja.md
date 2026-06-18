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

GitHub から直接プロンプトライブラリを実行します：

```bash
npx github:flatkey-ai/awesome-images
```

CLI はローカルのプロンプトギャラリーを起動し、ブラウザを自動で開きます。プロジェクト設定は不要です。

便利なオプション：

```bash
npx github:flatkey-ai/awesome-images --port 5173
npx github:flatkey-ai/awesome-images --no-open
npx github:flatkey-ai/awesome-images --help
```

開発者向けコマンド：

```bash
npm install
npm test
npm run build
```

## ユーザーフロー

1. `npx github:flatkey-ai/awesome-images` を実行してプロンプトライブラリを開きます。
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

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=flatkey-ai/awesome-images&type=Date)](https://www.star-history.com/#flatkey-ai/awesome-images&Date)
