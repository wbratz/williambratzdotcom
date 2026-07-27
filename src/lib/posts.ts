import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

export type Post = CollectionEntry<"blog"> & {
  readingTime: number;
};

const WORDS_PER_MINUTE = 225;

export const toDateString = (date: Date) => date.toISOString().slice(0, 10);

export const formatDate = (date: Date, long = false) =>
  new Intl.DateTimeFormat("en-US", {
    month: long ? "long" : "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);

export async function getPosts(): Promise<Post[]> {
  const entries = await getCollection("blog");
  const posts = entries
    .map((entry) => {
      if (entry.data.slug !== entry.id.replace(/\.md$/, "")) {
        throw new Error(`${entry.id}: slug must match filename`);
      }
      const body = entry.body ?? "";
      const words = body.trim() ? body.trim().split(/\s+/).length : 0;
      return {
        ...entry,
        readingTime: Math.max(1, Math.ceil(words / WORDS_PER_MINUTE)),
      };
    })
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const slugs = new Set<string>();
  for (const post of posts) {
    if (slugs.has(post.data.slug)) {
      throw new Error(`Duplicate post slug: ${post.data.slug}`);
    }
    slugs.add(post.data.slug);
  }
  return posts;
}

export const getTopics = (posts: Post[]) =>
  Array.from(new Set(posts.flatMap((post) => post.data.topics))).sort((a, b) =>
    a.localeCompare(b),
  );

export const getSeriesPosts = (posts: Post[], series?: string) =>
  series
    ? posts
        .filter((post) => post.data.series === series)
        .sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0))
    : [];

export const getRelatedPosts = (posts: Post[], current: Post, limit = 3) =>
  posts
    .filter((post) => post.data.slug !== current.data.slug)
    .map((post) => ({
      post,
      score:
        (current.data.series && post.data.series === current.data.series ? 10 : 0) +
        post.data.topics.filter((topic) => current.data.topics.includes(topic)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || b.post.data.date.getTime() - a.post.data.date.getTime(),
    )
    .slice(0, limit)
    .map(({ post }) => post);

export function getAdjacentPosts(posts: Post[], current: Post) {
  const index = posts.findIndex((post) => post.data.slug === current.data.slug);
  return {
    newer: index > 0 ? posts[index - 1] : null,
    older: index < posts.length - 1 ? posts[index + 1] : null,
  };
}
