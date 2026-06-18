# Flatkey 生图提示词模板库

[English](README.md) | [中文](README_zh.md) | [日本語](README_ja.md) | [Español](README_es.md) | [Português](README_pt.md) | [Tiếng Việt](README_vi.md)

面向 AI API 中转站、增长页面和用户 onboarding 的生图提示词模板库。用户可以浏览模板、复制提示词、替换变量、注册 Flatkey API key，并通过 OpenAI 兼容生图 API 生成图片。

获取 API key：<https://flatkey.ai?utm_source=skill>

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

直接从 GitHub 运行模板库：

```bash
npx github:flatkey-ai/awesome-images
```

CLI 会启动本地提示词图库，并自动打开浏览器。用户不需要配置项目。

常用选项：

```bash
npx github:flatkey-ai/awesome-images --port 5173
npx github:flatkey-ai/awesome-images --no-open
npx github:flatkey-ai/awesome-images --help
```

开发者命令：

```bash
npm install
npm test
npm run build
```

## 用户流程

1. 运行 `npx github:flatkey-ai/awesome-images` 打开提示词模板库。
2. 按分类或关键词找到模板。
3. 展开模板并复制提示词。
4. 替换 `{{product_name}}`、`{{core_benefit}}`、`{{brand_color}}` 等变量。
5. 在 <https://flatkey.ai?utm_source=skill> 注册 Flatkey API key。
6. 调用 Flatkey OpenAI 兼容生图 API 生成图片。

## API 示例

```bash
curl https://api.flatkey.ai/v1/images/generations \
  -H "Authorization: Bearer $FLATKEY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-image-2",
    "prompt": "替换模板变量后的最终提示词",
    "size": "1536x1024"
  }'
```

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

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=flatkey-ai/awesome-images&type=Date)](https://www.star-history.com/#flatkey-ai/awesome-images&Date)
