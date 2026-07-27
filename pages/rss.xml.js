import fs from "fs";
import matter from "gray-matter";
import path from "path";

const SITE_URL = "https://www.williambratz.com";

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export async function getServerSideProps({ res }) {
  const contentDirectory = path.join(process.cwd(), "contents");
  const posts = fs
    .readdirSync(contentDirectory)
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(contentDirectory, filename), "utf8");
      return matter(raw).data;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>William Bratz — Writing</title>
    <link>${SITE_URL}/blog</link>
    <description>Essays on production AI systems, distributed software, engineering judgment, and organizational knowledge.</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${posts
  .map(
    (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${escapeXml(post.slug)}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${escapeXml(post.slug)}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`
  )
  .join("\n")}
  </channel>
</rss>`;

  res.setHeader("Content-Type", "application/rss+xml");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(xml);
  res.end();

  return { props: {} };
}

export default function Rss() {
  return null;
}
