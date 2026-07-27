const fs = require("fs");
const matter = require("gray-matter");
const path = require("path");

const CONTENT_DIRECTORY = path.join(process.cwd(), "contents");
const WORDS_PER_MINUTE = 225;

function requiredString(value, field, filename) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${filename}: frontmatter "${field}" must be a non-empty string`);
  }
  return value.trim();
}

function optionalString(value, field, filename) {
  if (value === undefined || value === null || value === "") return undefined;
  return requiredString(value, field, filename);
}

function normalizeDate(value, field, filename) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${filename}: frontmatter "${field}" must be a valid ISO date`);
  }
  return date.toISOString().slice(0, 10);
}

function normalizeMetadata(data, filename) {
  const slug = requiredString(data.slug, "slug", filename);
  const expectedSlug = filename.replace(/\.md$/, "");
  if (slug !== expectedSlug) {
    throw new Error(`${filename}: slug "${slug}" must match its filename`);
  }
  if (!Array.isArray(data.topics) || data.topics.length === 0) {
    throw new Error(`${filename}: frontmatter "topics" must contain at least one topic`);
  }
  const topics = data.topics.map((topic) => requiredString(topic, "topics", filename));
  const series = optionalString(data.series, "series", filename);
  const seriesOrder =
    data.seriesOrder === undefined ? undefined : Number(data.seriesOrder);
  if (series && (!Number.isInteger(seriesOrder) || seriesOrder < 1)) {
    throw new Error(`${filename}: a series post requires a positive integer seriesOrder`);
  }
  if (!series && seriesOrder !== undefined) {
    throw new Error(`${filename}: seriesOrder requires a series`);
  }
  if (typeof data.featured !== "boolean") {
    throw new Error(`${filename}: frontmatter "featured" must be true or false`);
  }

  const metadata = {
    title: requiredString(data.title, "title", filename),
    slug,
    date: normalizeDate(data.date, "date", filename),
    description: requiredString(data.description, "description", filename),
    photo: requiredString(data.photo, "photo", filename),
    banner: requiredString(data.banner, "banner", filename),
    imageAlt: requiredString(data.imageAlt, "imageAlt", filename),
    topics,
    featured: data.featured,
  };
  if (data.updated !== undefined) {
    metadata.updated = normalizeDate(data.updated, "updated", filename);
  }
  if (series) {
    metadata.series = series;
    metadata.seriesOrder = seriesOrder;
  }
  return metadata;
}

function readingTime(body) {
  const words = body.trim() ? body.trim().split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

function readPostFile(filename) {
  const raw = fs.readFileSync(path.join(CONTENT_DIRECTORY, filename), "utf8");
  const parsed = matter(raw);
  return {
    ...normalizeMetadata(parsed.data, filename),
    readingTime: readingTime(parsed.content),
    body: parsed.content,
  };
}

function getAllPosts() {
  const posts = fs
    .readdirSync(CONTENT_DIRECTORY)
    .filter((filename) => filename.endsWith(".md"))
    .map(readPostFile)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const slugs = new Set();
  for (const post of posts) {
    if (slugs.has(post.slug)) throw new Error(`duplicate post slug: ${post.slug}`);
    slugs.add(post.slug);
  }
  return posts;
}

function toSummary(post) {
  const { body, ...summary } = post;
  return summary;
}

function getAllPostSummaries() {
  return getAllPosts().map(toSummary);
}

function getPostBySlug(slug) {
  const post = getAllPosts().find((candidate) => candidate.slug === slug);
  if (!post) throw new Error(`post not found: ${slug}`);
  return post;
}

function getPostSlugs() {
  return getAllPosts().map((post) => post.slug);
}

function getAllTopics() {
  return Array.from(
    new Set(getAllPosts().flatMap((post) => post.topics))
  ).sort((a, b) => a.localeCompare(b));
}

function getSeriesPosts(series) {
  return getAllPosts()
    .filter((post) => post.series === series)
    .sort((a, b) => a.seriesOrder - b.seriesOrder)
    .map(toSummary);
}

function getRelatedPosts(slug, limit = 3) {
  const posts = getAllPosts();
  const current = posts.find((post) => post.slug === slug);
  if (!current) throw new Error(`post not found: ${slug}`);

  return posts
    .filter((post) => post.slug !== slug)
    .map((post) => ({
      post,
      score:
        (current.series && post.series === current.series ? 10 : 0) +
        post.topics.filter((topic) => current.topics.includes(topic)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(b.post.date).getTime() - new Date(a.post.date).getTime()
    )
    .slice(0, limit)
    .map(({ post }) => toSummary(post));
}

function getAdjacentPosts(slug) {
  const posts = getAllPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) throw new Error(`post not found: ${slug}`);
  return {
    newer: index > 0 ? toSummary(posts[index - 1]) : null,
    older: index < posts.length - 1 ? toSummary(posts[index + 1]) : null,
  };
}

module.exports = {
  getAdjacentPosts,
  getAllPosts,
  getAllPostSummaries,
  getAllTopics,
  getPostBySlug,
  getPostSlugs,
  getRelatedPosts,
  getSeriesPosts,
  toSummary,
};
