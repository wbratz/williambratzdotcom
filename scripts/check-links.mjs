import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";

const outputRoot = resolve("out");

if (!existsSync(outputRoot)) {
  console.error("out/ does not exist. Run npm run build first.");
  process.exit(1);
}

const htmlFiles = walk(outputRoot).filter((file) => extname(file) === ".html");
const errors = [];

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const pageIds = collectIds(html);
  const attributes = html.matchAll(/\b(?:href|src)=["']([^"'<>]+)["']/gi);

  for (const [, rawTarget] of attributes) {
    if (shouldIgnore(rawTarget)) continue;

    const target = new URL(rawTarget, pageUrl(file));
    const targetFile = resolveTarget(target.pathname);

    if (!targetFile) {
      errors.push(`${routeFor(file)} -> ${rawTarget} (missing target)`);
      continue;
    }

    if (!target.hash) continue;

    const targetIds =
      targetFile === file
        ? pageIds
        : collectIds(readFileSync(targetFile, "utf8"));
    const fragment = decodeURIComponent(target.hash.slice(1));

    if (!targetIds.has(fragment)) {
      errors.push(`${routeFor(file)} -> ${rawTarget} (missing fragment)`);
    }
  }
}

if (errors.length > 0) {
  console.error(`Found ${errors.length} broken internal link(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Checked ${htmlFiles.length} HTML files. All internal links resolve.`,
);

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? walk(path) : path;
  });
}

function collectIds(html) {
  return new Set(
    [...html.matchAll(/\bid=["']([^"'<>]+)["']/gi)].map((match) => match[1]),
  );
}

function shouldIgnore(target) {
  return (
    target.startsWith("http://") ||
    target.startsWith("https://") ||
    target.startsWith("mailto:") ||
    target.startsWith("tel:") ||
    target.startsWith("data:") ||
    target.startsWith("javascript:")
  );
}

function pageUrl(file) {
  return new URL(routeFor(file), "https://www.williambratz.com");
}

function routeFor(file) {
  const path = relative(outputRoot, file).replaceAll("\\", "/");
  if (path === "index.html") return "/";
  return `/${path.replace(/index\.html$/, "")}`;
}

function resolveTarget(pathname) {
  const decodedPath = decodeURIComponent(pathname);
  const relativePath = decodedPath.replace(/^\/+/, "");
  const candidates = [
    resolve(outputRoot, relativePath),
    resolve(outputRoot, relativePath, "index.html"),
    resolve(outputRoot, `${relativePath}.html`),
  ];

  for (const candidate of candidates) {
    if (!candidate.startsWith(outputRoot)) return null;
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }

  return null;
}
