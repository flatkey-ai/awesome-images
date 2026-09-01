import fs from "node:fs";
import path from "node:path";
import { demoPrompts } from "../src/demo-prompts.js";
import { industries, prompts } from "../src/prompts.js";

const root = process.cwd();
const catalogDir = path.join(root, "catalog");
const docsDir = path.join(root, "docs");
const repositoryUrl = "https://github.com/flatkey-ai/awesome-images";
const industryLabels = Object.fromEntries(industries.map((industry) => [industry.id, industry.name]));

const source = {
  label: "Flatkey image prompt library",
  platform: "GitHub",
  url: repositoryUrl,
  license: "Flatkey-owned"
};

const entries = prompts
  .map((prompt) => ({
    slug: prompt.id,
    model: prompt.model,
    industry: prompt.industry,
    category: prompt.category,
    title: { zh: prompt.title },
    description: { zh: prompt.description },
    prompt: prompt.prompt,
    variables: prompt.variables,
    tags: [prompt.category, prompt.badge].filter(Boolean).map((tag) => tag.toLowerCase()),
    apiUseCase: prompt.apiUseCase,
    artifact: { kind: "image", ratio: prompt.aspectRatio },
    source,
    status: "published",
    file: "src/prompts.js"
  }))
  .sort((a, b) =>
    a.industry.localeCompare(b.industry) ||
    a.category.localeCompare(b.category) ||
    a.slug.localeCompare(b.slug)
  );

const assets = demoPrompts.map((item) => ({
  slug: item.id,
  title: item.title,
  industry: item.industry ?? "marketing-advertising",
  category: item.category.toLowerCase().replaceAll(" ", "-"),
  url: item.image,
  prompt: item.prompt,
  source: "assets/"
}));

const catalog = {
  schemaVersion: "1.0",
  kind: "image-prompt-library",
  repository: repositoryUrl,
  generatedFrom: "src/prompts.js",
  entries
};

fs.mkdirSync(catalogDir, { recursive: true });
fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(path.join(catalogDir, "prompts.json"), `${JSON.stringify(catalog, null, 2)}\n`);
fs.writeFileSync(path.join(catalogDir, "assets.json"), `${JSON.stringify({
  schemaVersion: "1.0",
  kind: "image-demo-assets",
  repository: repositoryUrl,
  generatedFrom: "src/demo-prompts.js",
  assets
}, null, 2)}\n`);

const lines = [
  "# Image prompt index",
  "",
  `Published templates: **${entries.length}**`,
  `Demo assets: **${assets.length}**`,
  "",
  "The machine-readable catalog is available at [`catalog/prompts.json`](../catalog/prompts.json).",
  ""
];

let currentIndustry = "";
for (const entry of entries) {
  if (entry.industry !== currentIndustry) {
    currentIndustry = entry.industry;
    if (lines.at(-1) !== "") lines.push("");
    lines.push(`## ${industryLabels[currentIndustry] ?? currentIndustry}`, "");
  }
  lines.push(`- [${entry.title.zh ?? entry.slug}](../${entry.file}) — ${entry.category} · ${entry.model}`);
}

lines.push("", "## Demo assets", "", "The gallery assets are kept separately from reusable templates so a preview image is never mistaken for its source prompt.", "");
for (const asset of assets) {
  lines.push(`- [${asset.title}](../${asset.url}) — ${industryLabels[asset.industry] ?? asset.industry}`);
}

fs.writeFileSync(path.join(docsDir, "prompt-index.md"), `${lines.join("\n")}\n`);
console.log(`✓ wrote catalog/prompts.json (${entries.length} templates) and catalog/assets.json (${assets.length} demo assets)`);
