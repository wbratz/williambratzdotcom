import type { APIRoute } from "astro";
import { getPosts, toDateString } from "../lib/posts";

const SITE_URL = "https://www.williambratz.com";
const staticPages = [
  "",
  "/ask",
  "/production-agents",
  "/coding-agents",
  "/about",
  "/ai-engineering",
  "/blog",
  "/projects",
  "/projects/vault",
  "/resume",
];
// Update these when static page copy changes so the search crawler revisits it.
const staticPageUpdates: Record<string, string> = {
  "": "2026-11-23T18:27:00Z",
  "/about": "2026-11-23T18:27:00Z",
  "/ask": "2026-11-23T18:27:00Z",
};

export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const newestDate = toDateString(posts[0].data.date);
  const pages = [
    ...staticPages.map((url) => ({
      url,
      date: staticPageUpdates[url] ?? newestDate,
    })),
    ...posts.map((post) => ({
      url: `/blog/${post.data.slug}`,
      date: toDateString(post.data.updated ?? post.data.date),
    })),
  ];

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    ({ url, date }) => `  <url>
    <loc>${SITE_URL}${url}</loc>
    <lastmod>${date}</lastmod>
  </url>`,
  )
  .join("\n")}
</urlset>
`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
