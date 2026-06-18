import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const rawTag =
  process.env.RELEASE_TAG ||
  process.env.GITHUB_REF_NAME ||
  process.env.npm_config_release_tag ||
  "";
const version = rawTag.replace(/^refs\/tags\//, "").replace(/^v/, "");
const semver = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?$/;

if (!semver.test(version)) {
  console.error(`Invalid release tag "${rawTag}". Use tags like v1.2.3 or 1.2.3.`);
  process.exit(1);
}

await updateJson("package.json", (json) => {
  json.version = version;
  return json;
});

await updateJson("package-lock.json", (json) => {
  json.version = version;
  if (json.packages?.[""]) {
    json.packages[""].version = version;
  }
  return json;
});

console.log(`Prepared npm package version ${version} from release tag ${rawTag}.`);
console.log("GitHub release source: github.event.release.tag_name");

async function updateJson(fileName, update) {
  const filePath = path.join(root, fileName);
  const json = JSON.parse(await readFile(filePath, "utf8"));
  await writeFile(filePath, `${JSON.stringify(update(json), null, 2)}\n`);
}
