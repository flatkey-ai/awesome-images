#!/usr/bin/env node
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { access, stat } from "node:fs/promises";
import { constants } from "node:fs";
import { extname, join, normalize, relative } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const packageJson = await import("../package.json", { with: { type: "json" } });

const options = parseArgs(process.argv.slice(2));

if (options.help) {
  printHelp();
  process.exit(0);
}

if (options.version) {
  console.log(packageJson.default.version);
  process.exit(0);
}

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
  if (options.open) {
    openBrowser(url);
  }
});

function parseArgs(args) {
  const parsed = {
    host: "127.0.0.1",
    port: 5173,
    open: true,
    help: false,
    version: false
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help" || arg === "-h") parsed.help = true;
    else if (arg === "--version" || arg === "-v") parsed.version = true;
    else if (arg === "--no-open") parsed.open = false;
    else if (arg === "--host") parsed.host = args[++index] ?? parsed.host;
    else if (arg.startsWith("--host=")) parsed.host = arg.slice("--host=".length);
    else if (arg === "--port" || arg === "-p") parsed.port = Number(args[++index] ?? parsed.port);
    else if (arg.startsWith("--port=")) parsed.port = Number(arg.slice("--port=".length));
    else {
      console.error(`Unknown option: ${arg}`);
      console.error("Run awesome-images --help for usage.");
      process.exit(1);
    }
  }

  if (!Number.isInteger(parsed.port) || parsed.port < 1 || parsed.port > 65535) {
    console.error("Invalid --port value. Use a number from 1 to 65535.");
    process.exit(1);
  }

  return parsed;
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
  if (fileStat?.isDirectory()) {
    filePath = join(filePath, "index.html");
  }

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
  const command =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
        ? "cmd"
        : "xdg-open";
  const args = process.platform === "win32" ? ["/c", "start", "", url] : [url];
  const child = spawn(command, args, { stdio: "ignore", detached: true });
  child.unref();
}

function printHelp() {
  console.log(`awesome-images

Run Flatkey image prompt library from CLI.

Usage:
  awesome-images [options]

Options:
  -p, --port <number>  Port to listen on. Default: 5173
      --host <host>    Host to bind. Default: 127.0.0.1
      --no-open        Do not open browser automatically
  -v, --version        Print version
  -h, --help           Show help
`);
}
