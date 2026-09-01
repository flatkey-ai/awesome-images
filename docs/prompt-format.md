# Image prompt format

The reusable image templates live in `src/prompts.js`. The generated catalog in `catalog/prompts.json` is the stable hand-off format for a model-detail page or another prompt gallery.

Each entry has two separate layers:

- `description`: a short, human-facing explanation of the use case.
- `prompt`: the complete model-facing prompt, including `{{variables}}` where the caller should provide values.

The catalog also keeps `industry` (business context) separate from `category` (production shape). This lets a detail page answer both “what kind of work is this for?” and “what kind of image does it produce?” without duplicating templates.

## Required template fields

```js
{
  id: "unique-template-id",
  title: "中文标题",
  industry: "ecommerce-retail",
  category: "ecommerce",
  aspectRatio: "1:1",
  model: "gpt-image-2",
  description: "给人看的案例说明。",
  variables: ["产品", "材质"],
  prompt: "生成 {{产品}}，准确表现 {{材质}}。"
}
```

Use one primary industry per template. Put secondary contexts in `tags` when the same template is useful elsewhere. Keep prompts concrete: name the subject, composition, lighting, material, text policy, and output ratio. Avoid empty quality claims such as “masterpiece” or “8k”; specify what should be visible instead.

## Industry values

`automotive-mobility`, `beauty-wellness`, `creator-social`, `ecommerce-retail`, `education-training`, `fashion-apparel`, `finance`, `food-beverage`, `gaming`, `marketing-advertising`, `media-entertainment`, `pet-care`, `publishing`, `real-estate`, `software-saas`, `sports-fitness`, and `travel-hospitality`.

## Preview asset policy

Demo images in `assets/` are indexed in `catalog/assets.json` separately from reusable templates. A preview image may demonstrate a prompt, but it is not treated as the canonical source unless the prompt is recorded in `src/prompts.js`. Only commit assets that Flatkey is authorized to publish.
