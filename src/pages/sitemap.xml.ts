import type { APIRoute } from "astro";
import { getPosts, toDateString } from "../lib/posts";

const SITE_URL = "https://www.williambratz.com";
const staticPages = [
  "",
  "/about",
  "/ai-engineering",
  "/blog",
  "/projects",
  "/projects/vault",
  "/resume",
];

export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const newestDate = toDateString(posts[0].data.date);
  const pages = [
    ...staticPages.map((url) => ({ url, date: newestDate })),
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
