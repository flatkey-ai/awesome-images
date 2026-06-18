import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const flatkeyUrl = "https://flatkey.ai?utm_source=skill";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const { prompts, categories } = await import(
  pathToFileURL(path.join(root, "src", "prompts.js")).href
);
const html = await readFile(path.join(root, "index.html"), "utf8");
const app = await readFile(path.join(root, "src", "app.js"), "utf8");
const readme = await readFile(path.join(root, "README.md"), "utf8");
const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
const skill = await readFile(
  path.join(root, "skills", "flatkey-image-prompts", "SKILL.md"),
  "utf8"
);
const publishWorkflow = await readFile(
  path.join(root, ".github", "workflows", "publish.yml"),
  "utf8"
);
const releaseScript = await readFile(
  path.join(root, "scripts", "prepare-npm-release.mjs"),
  "utf8"
);

assert(Array.isArray(prompts), "prompts must be an array");
assert(prompts.length >= 12, "library needs at least 12 prompt templates");
assert(Array.isArray(categories), "categories must be an array");
assert(categories.length >= 6, "library needs at least 6 categories");
assert(html.includes(flatkeyUrl), "index.html must link to Flatkey with utm_source=skill");
assert(app.includes(flatkeyUrl), "app.js must link to Flatkey with utm_source=skill");
assert(packageJson.private !== true, "package must be publishable for CLI usage");
assert(packageJson.name === "@flatkey-ai/image-buddy", "package name must be @flatkey-ai/image-buddy");
assert(packageJson.bin?.["image-buddy"], "package must expose image-buddy CLI");
assert(readme.includes("npx"), "README must explain npx CLI usage");
assert(readme.includes("npx @flatkey-ai/image-buddy"), "README must explain npm package CLI usage");
assert(!readme.includes("npm run dev"), "README must not make npm run dev the user-facing path");
assert(skill.includes("name: flatkey-image-prompts"), "skill must define flatkey-image-prompts");
assert(skill.includes("npx @flatkey-ai/image-buddy"), "skill must route users to image-buddy CLI");
assert(skill.includes(flatkeyUrl), "skill must include Flatkey registration link");

const cliPath = path.join(root, packageJson.bin["image-buddy"]);
await access(cliPath, constants.X_OK);
const cli = await readFile(cliPath, "utf8");
assert(cli.startsWith("#!/usr/bin/env node"), "CLI must have node shebang");
assert(cli.includes("image-buddy generate"), "CLI help must expose generate command");
assert(cli.includes("image-buddy web"), "CLI help must expose web command");
assert(cli.includes("/v1/images/generations"), "CLI must call Flatkey image generation API");
assert(cli.includes("FLATKEY_IMAGE_API_KEY"), "CLI must read Flatkey image API key");
assert(cli.includes("Flatkey image prompt library running"), "CLI must start the prompt library server");
assert(
  publishWorkflow.includes("release:") && publishWorkflow.includes("types: [published]"),
  "publish workflow must run from published GitHub releases"
);
assert(
  publishWorkflow.includes("NPM_PUBLISH_TOKEN") && publishWorkflow.includes("npm publish"),
  "publish workflow must publish to npm with NPM_PUBLISH_TOKEN"
);
assert(
  publishWorkflow.includes("npm run prepare:release"),
  "publish workflow must prepare package version from release tag"
);
assert(
  releaseScript.includes("github.event.release.tag_name") || releaseScript.includes("GITHUB_REF_NAME"),
  "release script must derive version from GitHub release tag"
);

const ids = new Set();
for (const prompt of prompts) {
  assert(prompt.id && !ids.has(prompt.id), `duplicate or missing id: ${prompt.id}`);
  ids.add(prompt.id);
  assert(prompt.title?.length > 4, `${prompt.id} missing title`);
  assert(prompt.category, `${prompt.id} missing category`);
  assert(categories.some((category) => category.id === prompt.category), `${prompt.id} has unknown category`);
  assert(prompt.description?.length > 16, `${prompt.id} missing description`);
  assert(prompt.prompt?.length > 120, `${prompt.id} prompt too short`);
  assert(prompt.prompt.includes("{{") && prompt.prompt.includes("}}"), `${prompt.id} must include variables`);
  assert(Array.isArray(prompt.variables) && prompt.variables.length >= 2, `${prompt.id} needs at least 2 variables`);
  assert(prompt.aspectRatio, `${prompt.id} missing aspect ratio`);
  assert(prompt.apiUseCase?.length > 8, `${prompt.id} missing API use case`);
}

console.log(`Validated ${prompts.length} prompt templates and ${categories.length} categories.`);
