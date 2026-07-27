import type { APIRoute } from "astro";
import { getPosts, toDateString } from "../lib/posts";

const SITE_URL = "https://www.williambratz.com";
const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${SITE_URL}/blog/${escapeXml(post.data.slug)}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${escapeXml(post.data.slug)}</guid>
      <pubDate>${post.data.date.toUTCString()}</pubDate>
      <description>${escapeXml(post.data.description)}</description>
    </item>`,
    )
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>William Bratz | Writing</title>
    <link>${SITE_URL}/blog</link>
    <description>Essays on production AI systems, distributed software, engineering judgment, and organizational knowledge.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(`${toDateString(posts[0].data.date)}T00:00:00Z`).toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`,
    { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } },
  );
};
