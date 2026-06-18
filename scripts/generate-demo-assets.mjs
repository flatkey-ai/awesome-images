import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { demoPrompts } from "../src/demo-prompts.js";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const assetsDir = path.join(root, "assets");
const apiKey = process.env.FLATKEY_IMAGE_API_KEY || process.env.FLATKEY_API_KEY;
const baseUrl = String(process.env.FLATKEY_IMAGE_BASE_URL || "https://router.flatkey.ai").replace(/\/+$/, "");

if (!apiKey) {
  console.error("Set FLATKEY_IMAGE_API_KEY or FLATKEY_API_KEY.");
  process.exit(1);
}

await mkdir(assetsDir, { recursive: true });

for (const demo of demoPrompts) {
  const outputPath = path.join(root, demo.image);
  if (await exists(outputPath)) {
    console.log(`Skipping ${demo.id} -> ${demo.image}`);
    continue;
  }
  console.log(`Generating ${demo.id} -> ${demo.image}`);
  const payload = await generateDemoImage(demo);
  const part = payload.candidates?.flatMap((candidate) => candidate?.content?.parts || [])
    .find((item) => item?.inlineData?.data);
  if (!part?.inlineData?.data) throw new Error(`No image data for ${demo.id}: ${JSON.stringify(payload).slice(0, 500)}`);
  await writeFile(outputPath, Buffer.from(part.inlineData.data, "base64"));
}

console.log(`Generated ${demoPrompts.length} demo images in ${assetsDir}`);

async function generateDemoImage(demo) {
  let lastPayload = {};
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const response = await fetch(`${baseUrl}/v1beta/models/nano-banana-pro-preview:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: demo.prompt }] }],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
          imageGenerationConfig: { aspectRatio: "9:16", imageSize: "1K" }
        }
      })
    });
    lastPayload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(lastPayload?.error?.message || lastPayload?.message || `HTTP ${response.status}`);
    if (lastPayload.candidates?.some((candidate) => candidate?.content?.parts?.some((part) => part?.inlineData?.data))) {
      return lastPayload;
    }
    console.log(`Retrying ${demo.id}: no image data on attempt ${attempt}`);
  }
  return lastPayload;
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}
