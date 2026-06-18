import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const cli = ["node", "bin/image-buddy.js"];

const list = await run([...cli, "list", "--json"]);
assert.equal(list.code, 0);
const templates = JSON.parse(list.stdout);
assert.ok(Array.isArray(templates));
assert.ok(templates.some((item) => item.id === "premium-product-hero"));

const show = await run([...cli, "show", "premium-product-hero", "--json"]);
assert.equal(show.code, 0);
assert.equal(JSON.parse(show.stdout).id, "premium-product-hero");

const render = await run([
  ...cli,
  "render",
  "premium-product-hero",
  "--var",
  "产品名称=Image Buddy",
  "--var",
  "品牌调性=clean SaaS",
  "--var",
  "核心卖点=one-command image generation",
  "--var",
  "主色=teal"
]);
assert.equal(render.code, 0);
assert.match(render.stdout, /Image Buddy/);
assert.doesNotMatch(render.stdout, /\{\{产品名称\}\}/);

const generateNoKey = await run([...cli, "generate", "--prompt", "premium product photo of Image Buddy"], {
  FLATKEY_IMAGE_API_KEY: "",
  FLATKEY_API_KEY: ""
});
assert.notEqual(generateNoKey.code, 0);
assert.match(generateNoKey.stderr, /FLATKEY_IMAGE_API_KEY|FLATKEY_API_KEY/);

const calls = [];
const server = createServer(async (request, response) => {
  const chunks = [];
  request.on("data", (chunk) => chunks.push(chunk));
  await once(request, "end");
  calls.push({
    url: request.url,
    method: request.method,
    authorization: request.headers.authorization,
    body: JSON.parse(Buffer.concat(chunks).toString("utf8"))
  });
  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ data: [{ b64_json: Buffer.from("image").toString("base64") }] }));
});
server.listen(0, "127.0.0.1");
await once(server, "listening");
const outDir = await mkdtemp(path.join(os.tmpdir(), "image-buddy-"));
const port = server.address().port;
const generate = await run([
  ...cli,
  "generate",
  "--prompt",
  "premium product photo of Image Buddy",
  "--api-key",
  "flatkey-test",
  "--base-url",
  `http://127.0.0.1:${port}`,
  "--out",
  outDir,
  "--json"
]);
server.close();
assert.equal(generate.code, 0, generate.stderr);
assert.equal(calls[0].url, "/v1/images/generations");
assert.equal(calls[0].method, "POST");
assert.equal(calls[0].authorization, "Bearer flatkey-test");
assert.equal(calls[0].body.model, "gpt-image-2");
const generatePayload = JSON.parse(generate.stdout);
assert.equal(await readFile(generatePayload.artifacts[0].path, "utf8"), "image");
await rm(outDir, { recursive: true, force: true });

const help = await run([...cli, "--help"]);
assert.equal(help.code, 0);
assert.match(help.stdout, /image-buddy generate/);
assert.match(help.stdout, /image-buddy web/);

function run(command, env = {}) {
  const child = spawn(command[0], command.slice(1), {
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, ...env }
  });
  let stdout = "";
  let stderr = "";
  child.stdout.on("data", (chunk) => {
    stdout += chunk;
  });
  child.stderr.on("data", (chunk) => {
    stderr += chunk;
  });
  return once(child, "close").then(([code]) => ({ code, stdout, stderr }));
}
