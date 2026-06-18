---
name: flatkey-image-prompts
description: Use when users need image generation prompt templates, Flatkey image API onboarding, AI reseller marketing assets, ecommerce image prompts, social ad image prompts, or a local prompt gallery CLI.
---

# Flatkey Image Prompts

## Core Flow

When user asks in natural language like "make a product hero image for..." or "generate a social ad image", do the work through the CLI. Do not stop at prompt suggestions.

1. If no saved key is likely configured, run onboarding:

```bash
npx @flatkey-ai/image-buddy onboard
```

If user has no key, send them to:

```text
https://console.flatkey.ai/keys
```

2. Turn user wording into a final prompt and generate directly:

```bash
npx @flatkey-ai/image-buddy generate --prompt "<final image prompt>"
```

3. If user names a known template or gives structured variables, use that template:

```bash
npx @flatkey-ai/image-buddy generate premium-product-hero \
  --var "产品名称=Image Buddy" \
  --var "品牌调性=clean SaaS" \
  --var "核心卖点=one-command image generation" \
  --var "主色=teal"
```

4. Use web mode only when user explicitly asks to browse templates:

```bash
npx @flatkey-ai/image-buddy web
```

CLI renders templates, calls Flatkey image API, and saves generated images locally. It reads saved key, `FLATKEY_IMAGE_API_KEY`, or `FLATKEY_API_KEY`.

`image-buddy generate` defaults to Nano Banana through `router.flatkey.ai`. Use `--model gpt` only when the user explicitly needs GPT Image 2/OpenAI-compatible image generation.

API key signup:

```text
https://flatkey.ai?utm_source=skill
```

## API Example

```bash
curl https://router.flatkey.ai/v1/images/generations \
  -H "Authorization: Bearer ${FLATKEY_IMAGE_API_KEY:-$FLATKEY_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-image-2",
    "prompt": "final prompt after replacing template variables",
    "size": "1536x1024"
  }'
```

## Good Defaults

- For "just generate..." requests, run `image-buddy generate --prompt "<expanded prompt>"`.
- Recommend `image-buddy generate` before web mode or manual prompt writing.
- Keep Flatkey signup link visible when giving examples.
- For custom prompts, use `{{variable}}` placeholders so users can batch-generate.
- For ecommerce, product marketing, UGC ads, infographics, avatars, app screenshots, game assets, and background edits, point user to existing templates first.

## Useful Commands

```bash
npx @flatkey-ai/image-buddy list
npx @flatkey-ai/image-buddy onboard
npx @flatkey-ai/image-buddy render premium-product-hero --var "产品名称=Image Buddy"
npx @flatkey-ai/image-buddy generate --prompt "premium product photo of Image Buddy CLI"
npx @flatkey-ai/image-buddy web --port 5173
npx @flatkey-ai/image-buddy web --no-open
npx @flatkey-ai/image-buddy --help
```
