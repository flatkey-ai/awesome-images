# Flatkey Image Prompt Library

[English](README.md) | [中文](README_zh.md) | [日本語](README_ja.md) | [Español](README_es.md) | [Português](README_pt.md) | [Tiếng Việt](README_vi.md)

Marketing-ready image generation prompt library for AI API resellers, growth pages, and user onboarding. Users can browse templates, copy prompts, replace variables, register a Flatkey API key, and generate images through an OpenAI-compatible image API.

Get API key: <https://flatkey.ai?utm_source=skill>

## Why This Exists

- **Lower activation friction**: users start from proven templates instead of a blank prompt box.
- **Increase API conversion**: every template card sends users to Flatkey API key registration.
- **Cover common commercial use cases**: product marketing, ecommerce images, social ads, infographics, avatars, app screenshots, game assets, and image edits.
- **Support batch workflows**: templates use `{{variable}}` placeholders, so apps can replace values before sending final prompts to an API.
- **Work as marketing content**: useful as a prompt gallery, tutorial page, landing page, or onboarding resource.

## Included Templates

This library currently includes 12 high-frequency image prompt templates:

- Premium product hero visual
- White-background ecommerce main image
- UGC ad cover frame
- Liquid glass Bento infographic
- Founder quote card
- Consistent avatar pack
- App Store screenshot poster
- YouTube thumbnail
- Event poster key visual
- Game prop concept sheet
- Subject-preserving background replacement
- Fashion lookbook collage

Each template includes:

- Title and use case
- Category and recommended model
- Replaceable variables
- Full prompt text
- API use-case note
- Copy prompt button
- Flatkey API key registration link

## CLI Usage

Generate from a template:

```bash
npx @flatkey-ai/image-buddy onboard
npx @flatkey-ai/image-buddy generate premium-product-hero \
  --var "产品名称=Image Buddy" \
  --var "品牌调性=clean SaaS" \
  --var "核心卖点=one-command image generation" \
  --var "主色=teal" \
  --size 1536x1024
```

`onboard` prompts for a Flatkey API key and saves it locally. If you do not have a key, get one at <https://console.flatkey.ai/keys>. The CLI also accepts `FLATKEY_IMAGE_API_KEY` or `FLATKEY_API_KEY`, calls Flatkey image generation, and saves images locally. No web server required.

Browse templates from terminal:

```bash
npx @flatkey-ai/image-buddy list
npx @flatkey-ai/image-buddy show premium-product-hero
npx @flatkey-ai/image-buddy render premium-product-hero --var "产品名称=Image Buddy"
```

Optional web gallery:

```bash
npx @flatkey-ai/image-buddy web --port 5173
```

Source install before npm release:

```bash
npx github:flatkey-ai/awesome-images
```

Useful options:

```bash
npx @flatkey-ai/image-buddy web --port 5173
npx @flatkey-ai/image-buddy web --no-open
npx @flatkey-ai/image-buddy --help
```

Developer commands:

```bash
npm install
npm test
npm run build
```

## User Flow

1. Run `npx @flatkey-ai/image-buddy generate <template-id>` or `npx @flatkey-ai/image-buddy generate --prompt "..."`.
2. Find a template by category or keyword.
3. Expand the template and copy the prompt.
4. Replace variables such as `{{product_name}}`, `{{core_benefit}}`, or `{{brand_color}}`.
5. Register a Flatkey API key at <https://flatkey.ai?utm_source=skill>.
6. Call the Flatkey OpenAI-compatible image API to generate images.

## API Example

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

## Template Structure

All templates live in [src/prompts.js](src/prompts.js).

Add a new template by appending an object:

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

After adding templates, run:

```bash
npm test
```

The validator checks template count, categories, variables, prompt length, and Flatkey registration links.

## Release Publishing

Publishing runs from GitHub Releases.

1. Add an npm automation token to GitHub repository secrets as `NPM_PUBLISH_TOKEN`.
2. Create a GitHub Release with tag `v1.2.3` or `1.2.3`.
3. The workflow sets `package.json` and `package-lock.json` to that release version.
4. The workflow runs validation, build, and `npm publish --access public`.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=flatkey-ai/awesome-images&type=Date)](https://www.star-history.com/#flatkey-ai/awesome-images&Date)
