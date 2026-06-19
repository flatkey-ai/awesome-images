# Flatkey 生图提示词模板库

[English](README.md) | [中文](README_zh.md) | [日本語](README_ja.md) | [Español](README_es.md) | [Português](README_pt.md) | [Tiếng Việt](README_vi.md)

Image Buddy 是一个商业化生图提示词库 + CLI，用 [Flatkey.ai](https://flatkey.ai?utm_source=skill) 生成可直接使用的营销图片。Flatkey.ai 通常比常见直连生图 API 路线便宜约 40%，这个库负责把低成本生图变成更容易落地的产品图、广告图、头像、App 图、电商图和素材图。

获取 API key：<https://flatkey.ai?utm_source=skill>

## 你会得到什么

- **更低生成成本**：用 Flatkey.ai 生图，通常比常见直连 API 路线便宜约 40%。
- **可商业化使用的提示词库**：覆盖产品营销、电商、社媒广告、UI 截图、头像、海报、游戏素材和图像编辑。
- **Flatkey 生图 demo**：运行 `image-buddy web` 打开本地 demo gallery，填 Flatkey key 后直接生成图片。
- **CLI 优先工作流**：一次 onboard 保存 key，之后用一句话或模板 hint 直接生成。

## 包含两个东西

**Skill**：给用户贴给 AI 的安装提示词。AI 背后实际会安装并调用 CLI。

复制这段给你的 AI 助手：

```text
Install and use the Flatkey Image Buddy skill from https://github.com/flatkey-ai/awesome-images.
When I ask for an image, use image-buddy CLI with Flatkey. First run image-buddy onboard if needed, then generate the image from my short prompt or from a template hint. Do not stop at suggesting prompts.
```

**CLI**：负责 onboard 和生成图片。

- `image-buddy onboard`：保存 Flatkey API key 到本地。
- `image-buddy generate --prompt "..."`：用一句话生成图片。
- `image-buddy generate avatar-pack "地雷妹"`：用模板 + hint 生成图片。
- `image-buddy web`：打开可选 demo gallery。

## 使用价值

- **降低激活门槛**：用户不用从空白 prompt 开始，可以直接使用验证过的模板。
- **提升 API 转化**：每张模板卡片都引导用户注册 Flatkey API key。
- **覆盖常见商业场景**：产品营销、电商图片、社媒广告、信息图、头像、App 截图、游戏素材和图像编辑。
- **支持批量工作流**：模板使用 `{{变量}}` 占位，应用可以先替换变量，再把最终 prompt 发给 API。
- **适合营销内容**：可作为 prompt gallery、教程页、落地页或用户引导资源。

## 内置模板

当前包含 12 个高频生图提示词模板：

- 高端产品主视觉
- 白底电商主图
- UGC 广告封面帧
- 液态玻璃 Bento 信息图
- 创始人金句卡
- 统一风格头像组
- App Store 截图海报
- YouTube 缩略图
- 活动海报主 KV
- 游戏道具设定图
- 保留主体换背景
- 服装 Lookbook 拼贴

每个模板包含：

- 标题和使用场景
- 分类和推荐模型
- 可替换变量
- 完整提示词
- API 使用建议
- 复制提示词按钮
- Flatkey API key 注册链接

## CLI 使用

用一句话直接生成：

```bash
npx @flatkey-ai/image-buddy onboard
npx @flatkey-ai/image-buddy generate --prompt "为 AI 生图 API CLI 生成一张高级产品主视觉，clean SaaS 风格，teal 点缀，商业摄影光效"
```

直接生成图片：

```bash
npx @flatkey-ai/image-buddy onboard
npx @flatkey-ai/image-buddy generate avatar-pack "地雷妹"
```

需要精确控制模板变量时，再传 `--var`：

```bash
npx @flatkey-ai/image-buddy generate premium-product-hero \
  --var "产品名称=Image Buddy" \
  --var "品牌调性=clean SaaS" \
  --var "核心卖点=one-command image generation" \
  --var "主色=teal"
```

模板 id 后面的普通文本会作为 hint 自动填充缺失变量，用户不用先学每个 `--var` 名字。

`onboard` 会提示输入 Flatkey API key 并保存到本地。没有 key 可去 <https://console.flatkey.ai/keys> 获取。CLI 也会读取 `FLATKEY_IMAGE_API_KEY` 或 `FLATKEY_API_KEY`，调用 Flatkey 生图 API，并把图片保存到本地。默认不启动网页。

`generate` 默认通过 `router.flatkey.ai` 调用 Nano Banana，更适合直接 CLI 生成。需要 OpenAI 兼容的 GPT Image 2 endpoint 时再传 `--model gpt`。

如果 npm release 还没发布，可从源码运行：

```bash
npx github:flatkey-ai/awesome-images
```

常用选项：

```bash
npx @flatkey-ai/image-buddy web --port 5173
npx @flatkey-ai/image-buddy web --no-open
npx @flatkey-ai/image-buddy --help
```

开发者命令：

```bash
npm install
npm test
npm run build
```

## 用户流程

1. 运行 `npx @flatkey-ai/image-buddy generate <template-id>` 或 `npx @flatkey-ai/image-buddy generate --prompt "..."`。
2. 按分类或关键词找到模板。
3. 展开模板并复制提示词。
4. 替换 `{{product_name}}`、`{{core_benefit}}`、`{{brand_color}}` 等变量。
5. 在 <https://flatkey.ai?utm_source=skill> 注册 Flatkey API key。
6. 运行 `image-buddy generate` 生成图片并保存到本地。


## 模板结构

所有模板位于 [src/prompts.js](src/prompts.js)。

新增模板时追加对象：

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

新增后运行：

```bash
npm test
```

校验器会检查模板数量、分类、变量、提示词长度和 Flatkey 注册链接。

## Release 发布

发布由 GitHub Release 触发。

1. 在 GitHub repository secrets 里添加 npm automation token，名称为 `NPM_PUBLISH_TOKEN`。
2. 创建 GitHub Release，tag 使用 `v1.2.3` 或 `1.2.3`。
3. workflow 会把 `package.json` 和 `package-lock.json` 设置为 release 版本。
4. workflow 会运行校验、构建，然后执行 `npm publish --access public`。

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=flatkey-ai/awesome-images&type=Date)](https://www.star-history.com/#flatkey-ai/awesome-images&Date)
