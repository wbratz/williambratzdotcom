import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";

const outputRoot = resolve("out");
const productionOrigin = "https://www.williambratz.com";

if (!existsSync(outputRoot)) {
  console.error("out/ does not exist. Run npm run build first.");
  process.exit(1);
}

const htmlFiles = walk(outputRoot).filter((file) => extname(file) === ".html");
const errors = [];
const seen = {
  title: new Map(),
  description: new Map(),
  canonical: new Map(),
};

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const route = routeFor(file);
  const title = textContent(match(html, /<title>([\s\S]*?)<\/title>/i));
  const description = meta(html, "name", "description");
  const canonical = link(html, "canonical");
  const ogTitle = meta(html, "property", "og:title");
  const ogDescription = meta(html, "property", "og:description");
  const ogUrl = meta(html, "property", "og:url");
  const ogImage = meta(html, "property", "og:image");
  const ogImageAlt = meta(html, "property", "og:image:alt");
  const twitterCard = meta(html, "name", "twitter:card");
  const twitterTitle = meta(html, "name", "twitter:title");
  const twitterDescription = meta(html, "name", "twitter:description");
  const twitterImage = meta(html, "name", "twitter:image");
  const twitterImageAlt = meta(html, "name", "twitter:image:alt");

  requireValue(route, "title", title);
  requireValue(route, "description", description);
  requireValue(route, "canonical", canonical);
  requireValue(route, "og:title", ogTitle);
  requireValue(route, "og:description", ogDescription);
  requireValue(route, "og:url", ogUrl);
  requireValue(route, "og:image", ogImage);
  requireValue(route, "og:image:alt", ogImageAlt);
  requireValue(route, "twitter:card", twitterCard);
  requireValue(route, "twitter:title", twitterTitle);
  requireValue(route, "twitter:description", twitterDescription);
  requireValue(route, "twitter:image", twitterImage);
  requireValue(route, "twitter:image:alt", twitterImageAlt);

  if (canonical && ogUrl && canonical !== ogUrl) {
    errors.push(`${route}: canonical and og:url do not match`);
  }
  if (title && ogTitle && title !== ogTitle) {
    errors.push(`${route}: title and og:title do not match`);
  }
  if (description && ogDescription && description !== ogDescription) {
    errors.push(`${route}: description and og:description do not match`);
  }
  if (ogImage && twitterImage && ogImage !== twitterImage) {
    errors.push(`${route}: Open Graph and Twitter images do not match`);
  }
  if (twitterCard && twitterCard !== "summary_large_image") {
    errors.push(`${route}: twitter:card must be summary_large_image`);
  }

  for (const [field, value] of Object.entries({
    title,
    description,
    canonical,
  })) {
    if (!value) continue;
    const priorRoute = seen[field].get(value);
    if (priorRoute) {
      errors.push(`${route}: duplicate ${field} also used by ${priorRoute}`);
    } else {
      seen[field].set(value, route);
    }
  }

  if (canonical) {
    let canonicalUrl;
    try {
      canonicalUrl = new URL(canonical);
    } catch {
      errors.push(`${route}: canonical is not a valid URL`);
    }
    if (canonicalUrl?.origin !== productionOrigin) {
      errors.push(`${route}: canonical must use ${productionOrigin}`);
    }
  }

  if (ogImage) {
    let imageUrl;
    try {
      imageUrl = new URL(ogImage);
    } catch {
      errors.push(`${route}: og:image is not a valid URL`);
    }
    if (imageUrl?.origin === productionOrigin) {
      const imagePath = resolve(
        outputRoot,
        decodeURIComponent(imageUrl.pathname).replace(/^\/+/, ""),
      );
      if (!imagePath.startsWith(outputRoot) || !existsSync(imagePath)) {
        errors.push(`${route}: social image is missing (${imageUrl.pathname})`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`Found ${errors.length} metadata issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Checked metadata for ${htmlFiles.length} HTML files. Titles, descriptions, canonical URLs, and social cards are complete.`,
);

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? walk(path) : path;
  });
}

function routeFor(file) {
  const path = relative(outputRoot, file).replaceAll("\\", "/");
  if (path === "index.html") return "/";
  return `/${path.replace(/index\.html$/, "")}`;
}

function match(html, pattern) {
  return html.match(pattern)?.[1]?.trim() ?? "";
}

function textContent(value) {
  return value
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function meta(html, attribute, value) {
  const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return match(
    html,
    new RegExp(
      `<meta\\s+(?=[^>]*\\b${attribute}=["']${escapedValue}["'])(?=[^>]*\\bcontent=["']([^"']+)["'])[^>]*>`,
      "i",
    ),
  );
}

function link(html, relation) {
  return match(
    html,
    new RegExp(
      `<link\\s+(?=[^>]*\\brel=["']${relation}["'])(?=[^>]*\\bhref=["']([^"']+)["'])[^>]*>`,
      "i",
    ),
  );
}

function requireValue(route, field, value) {
  if (!value) errors.push(`${route}: missing ${field}`);
}
