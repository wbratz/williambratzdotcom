import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const outputRoot = resolve("out");
const productionHost = "www.williambratz.com";
const timeoutMs = 15_000;

if (!existsSync(outputRoot)) {
  console.error("out/ does not exist. Run npm run build first.");
  process.exit(1);
}

const htmlFiles = walk(outputRoot).filter((file) => extname(file) === ".html");
const links = new Map();

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(/\bhref=["'](https?:\/\/[^"'<>]+)["']/gi)) {
    const url = decodeHtml(match[1]);
    if (new URL(url).host === productionHost) continue;
    const sources = links.get(url) ?? [];
    sources.push(file.replace(`${outputRoot}/`, ""));
    links.set(url, sources);
  }
}

const failures = [];
const results = await mapWithConcurrency(
  [...links],
  6,
  async ([url, sources]) => {
    const result = await check(url);
    if (!result.ok) failures.push({ url, sources, ...result });
    return result;
  },
);

if (failures.length > 0) {
  console.error(`Found ${failures.length} broken external link(s):`);
  for (const failure of failures) {
    console.error(
      `- ${failure.url} (${failure.reason}; linked from ${failure.sources.join(", ")})`,
    );
  }
  process.exit(1);
}

const restricted = results.filter((result) => result.restricted).length;
console.log(
  `Checked ${links.size} external links. All destinations responded${restricted ? `; ${restricted} restricted automated access but did not report a missing page` : ""}.`,
);

async function check(url) {
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: AbortSignal.timeout(timeoutMs),
        headers: {
          "user-agent":
            "WilliamBratz.com link monitor (+https://www.williambratz.com)",
          range: "bytes=0-1024",
        },
      });

      if (response.status === 404 || response.status === 410) {
        if (new URL(url).hostname.endsWith("linkedin.com")) {
          return { ok: true, restricted: true };
        }
        return { ok: false, reason: `HTTP ${response.status}` };
      }
      if (response.status >= 500) {
        lastError = `HTTP ${response.status}`;
        continue;
      }
      if ([401, 403, 405, 429].includes(response.status)) {
        return { ok: true, restricted: true };
      }
      return { ok: response.ok, reason: `HTTP ${response.status}` };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
  }
  return { ok: false, reason: lastError ?? "request failed" };
}

async function mapWithConcurrency(items, limit, operation) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await operation(items[index]);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker()),
  );
  return results;
}

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? walk(path) : path;
  });
}

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}
