#!/usr/bin/env node
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { access, mkdir, stat, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { extname, join, normalize, relative, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { categories, prompts } from "../src/prompts.js";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const packageJson = await import("../package.json", { with: { type: "json" } });

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] && !args[0].startsWith("-") ? args.shift() : "list";

  if (command === "help" || args.includes("--help") || args.includes("-h")) {
    printHelp();
    return;
  }
  if (command === "version" || args.includes("--version") || args.includes("-v")) {
    console.log(packageJson.default.version);
    return;
  }
  if (command === "list") return listTemplates(parseOptions(args));
  if (command === "show") return showTemplate(args);
  if (command === "render" || command === "prompt") return renderTemplate(args);
  if (command === "generate") return generateImage(args);
  if (command === "web" || command === "serve") return startWeb(parseWebOptions(args));

  throw new Error(`Unknown command: ${command}. Run image-buddy --help.`);
}

function parseOptions(args) {
  const options = { vars: {} };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--json") options.json = true;
    else if (arg === "--category") options.category = args[++index];
    else if (arg.startsWith("--category=")) options.category = arg.slice("--category=".length);
    else if (arg === "--var") addVar(options.vars, args[++index]);
    else if (arg.startsWith("--var=")) addVar(options.vars, arg.slice("--var=".length));
    else if (arg === "--prompt") options.prompt = args[++index];
    else if (arg.startsWith("--prompt=")) options.prompt = arg.slice("--prompt=".length);
    else if (arg === "--model") options.model = args[++index];
    else if (arg.startsWith("--model=")) options.model = arg.slice("--model=".length);
    else if (arg === "--size") options.size = args[++index];
    else if (arg.startsWith("--size=")) options.size = arg.slice("--size=".length);
    else if (arg === "--quality") options.quality = args[++index];
    else if (arg.startsWith("--quality=")) options.quality = arg.slice("--quality=".length);
    else if (arg === "--n") options.n = Number(args[++index]);
    else if (arg.startsWith("--n=")) options.n = Number(arg.slice("--n=".length));
    else if (arg === "--out") options.out = args[++index];
    else if (arg.startsWith("--out=")) options.out = arg.slice("--out=".length);
    else if (arg === "--api-key") options.apiKey = args[++index];
    else if (arg.startsWith("--api-key=")) options.apiKey = arg.slice("--api-key=".length);
    else if (arg === "--base-url") options.baseUrl = args[++index];
    else if (arg.startsWith("--base-url=")) options.baseUrl = arg.slice("--base-url=".length);
    else if (!options._) options._ = [arg];
    else options._.push(arg);
  }
  return options;
}

function parseWebOptions(args) {
  const parsed = {
    host: "127.0.0.1",
    port: 5173,
    open: true
  };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--no-open") parsed.open = false;
    else if (arg === "--host") parsed.host = args[++index] ?? parsed.host;
    else if (arg.startsWith("--host=")) parsed.host = arg.slice("--host=".length);
    else if (arg === "--port" || arg === "-p") parsed.port = Number(args[++index] ?? parsed.port);
    else if (arg.startsWith("--port=")) parsed.port = Number(arg.slice("--port=".length));
    else throw new Error(`Unknown web option: ${arg}`);
  }
  if (!Number.isInteger(parsed.port) || parsed.port < 1 || parsed.port > 65535) {
    throw new Error("Invalid --port value. Use a number from 1 to 65535.");
  }
  return parsed;
}

function addVar(vars, raw) {
  const index = String(raw || "").indexOf("=");
  if (index <= 0) throw new Error("--var must use key=value");
  vars[String(raw).slice(0, index)] = String(raw).slice(index + 1);
}

function listTemplates(options) {
  const items = prompts
    .filter((prompt) => !options.category || prompt.category === options.category)
    .map((prompt) => ({
      id: prompt.id,
      title: prompt.title,
      category: prompt.category,
      aspectRatio: prompt.aspectRatio,
      model: prompt.model
    }));
  if (options.json) {
    console.log(JSON.stringify(items, null, 2));
    return;
  }
  for (const item of items) {
    console.log(`${item.id}\t${item.category}\t${item.title}`);
  }
}

function showTemplate(args) {
  const options = parseOptions(args);
  const id = options._?.[0];
  const prompt = findPrompt(id);
  if (options.json) {
    console.log(JSON.stringify(prompt, null, 2));
    return;
  }
  console.log(`${prompt.title} (${prompt.id})`);
  console.log(`Category: ${categoryName(prompt.category)} | Aspect: ${prompt.aspectRatio} | Model: ${prompt.model}`);
  console.log(`Variables: ${prompt.variables.join(", ")}`);
  console.log("");
  console.log(prompt.prompt);
}

function renderTemplate(args) {
  const options = parseOptions(args);
  const id = options._?.[0];
  const template = findPrompt(id);
  const rendered = renderPrompt(template.prompt, options.vars);
  if (options.json) {
    console.log(JSON.stringify({ id: template.id, prompt: rendered, missing: missingVariables(rendered) }, null, 2));
    return;
  }
  console.log(rendered);
}

async function generateImage(args) {
  const options = parseOptions(args);
  const id = options._?.[0];
  const prompt = options.prompt || renderPrompt(findPrompt(id).prompt, options.vars);
  const missing = missingVariables(prompt);
  if (missing.length) {
    throw new Error(`Missing variables: ${missing.join(", ")}. Pass --var key=value.`);
  }

  const apiKey = options.apiKey || process.env.FLATKEY_IMAGE_API_KEY || process.env.FLATKEY_API_KEY;
  if (!apiKey) {
    throw new Error("Set FLATKEY_IMAGE_API_KEY or FLATKEY_API_KEY, or pass --api-key.");
  }

  const baseUrl = String(options.baseUrl || process.env.FLATKEY_IMAGE_BASE_URL || "https://router.flatkey.ai").replace(/\/+$/, "");
  const body = {
    model: options.model || "gpt-image-2",
    prompt,
    n: clampNumber(options.n || 1, 1, 4)
  };
  if (options.size) body.size = options.size;
  if (options.quality) body.quality = options.quality;

  const response = await fetch(`${baseUrl}/v1/images/generations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error?.message || payload?.message || `Flatkey image API failed: HTTP ${response.status}`);
  }

  const artifacts = await persistImages(payload, options.out || "image-buddy-output");
  const result = { provider: "flatkey", endpoint: "/v1/images/generations", model: body.model, prompt, artifacts, raw: payload };
  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  if (!artifacts.length) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }
  for (const artifact of artifacts) {
    console.log(artifact.path || artifact.url);
  }
}

function findPrompt(id) {
  const prompt = prompts.find((item) => item.id === id);
  if (!prompt) {
    throw new Error(`Unknown template "${id}". Run image-buddy list.`);
  }
  return prompt;
}

function renderPrompt(template, vars) {
  return template.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (match, key) => vars[key] ?? match);
}

function missingVariables(prompt) {
  return Array.from(new Set(Array.from(prompt.matchAll(/\{\{\s*([^}]+?)\s*\}\}/g), (match) => match[1])));
}

function categoryName(id) {
  return categories.find((category) => category.id === id)?.name || id;
}

function clampNumber(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, Math.trunc(number)));
}

async function persistImages(payload, outDir) {
  const images = Array.isArray(payload?.data) ? payload.data : [];
  const artifacts = [];
  await mkdir(outDir, { recursive: true });
  for (let index = 0; index < images.length; index += 1) {
    const image = images[index];
    if (image.url) {
      artifacts.push({ index: index + 1, url: image.url });
      continue;
    }
    const data = image.b64_json || parseDataUrl(image.data_url)?.data;
    if (!data) continue;
    const mime = image.mime_type || parseDataUrl(image.data_url)?.mime || "image/png";
    const extension = mime.includes("jpeg") ? "jpg" : mime.split("/")[1] || "png";
    const filePath = resolve(outDir, `image-${String(index + 1).padStart(2, "0")}.${extension}`);
    await writeFile(filePath, Buffer.from(data, "base64"));
    artifacts.push({ index: index + 1, path: filePath, mime_type: mime });
  }
  return artifacts;
}

function parseDataUrl(value = "") {
  const match = String(value).match(/^data:([^;]+);base64,(.+)$/);
  return match ? { mime: match[1], data: match[2] } : null;
}

function startWeb(options) {
  const server = createServer(async (request, response) => {
    try {
      const filePath = await resolveRequestPath(request.url);
      response.writeHead(200, { "Content-Type": contentType(filePath) });
      createReadStream(filePath).pipe(response);
    } catch (error) {
      const status = error.code === "ENOENT" ? 404 : 500;
      response.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
      response.end(status === 404 ? "Not found" : "Server error");
    }
  });

  server.listen(options.port, options.host, () => {
    const address = server.address();
    const host = options.host === "0.0.0.0" ? "localhost" : options.host;
    const url = `http://${host}:${address.port}`;
    console.log(`Flatkey image prompt library running at ${url}`);
    console.log("Press Ctrl+C to stop.");
    if (options.open) openBrowser(url);
  });
}

async function resolveRequestPath(rawUrl = "/") {
  const url = new URL(rawUrl, "http://localhost");
  const pathname = decodeURIComponent(url.pathname);
  const normalizedPath = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  let filePath = join(root, normalizedPath);
  const isInsideRoot = !relative(root, filePath).startsWith("..");
  if (!isInsideRoot) {
    const error = new Error("Not found");
    error.code = "ENOENT";
    throw error;
  }
  const fileStat = await stat(filePath).catch(() => null);
  if (fileStat?.isDirectory()) filePath = join(filePath, "index.html");
  await access(filePath, constants.R_OK);
  return filePath;
}

function contentType(filePath) {
  return (
    {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".json": "application/json; charset=utf-8",
      ".svg": "image/svg+xml",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp"
    }[extname(filePath).toLowerCase()] ?? "application/octet-stream"
  );
}

function openBrowser(url) {
  const command = process.platform === "darwin" ? "open" : process.platform === "win32" ? "cmd" : "xdg-open";
  const args = process.platform === "win32" ? ["/c", "start", "", url] : [url];
  const child = spawn(command, args, { stdio: "ignore", detached: true });
  child.unref();
}

function printHelp() {
  console.log(`image-buddy

Flatkey image generation CLI.

Usage:
  image-buddy list [--category <id>] [--json]
  image-buddy show <template-id> [--json]
  image-buddy render <template-id> --var key=value [--json]
  image-buddy generate <template-id> --var key=value [options]
  image-buddy generate --prompt "final prompt" [options]
  image-buddy web [--port 5173] [--no-open]

Options:
  --var key=value       Replace template variable
  --api-key <key>       Defaults to FLATKEY_IMAGE_API_KEY or FLATKEY_API_KEY
  --base-url <url>      Defaults to https://router.flatkey.ai
  --model <model>       Defaults to gpt-image-2
  --size <size>         Example: 1536x1024
  --quality <quality>   Provider quality option
  --n <count>           1-4 images. Default: 1
  --out <dir>           Output dir. Default: image-buddy-output
  --json                Print JSON
  -v, --version         Print version
  -h, --help            Show help
`);
}
