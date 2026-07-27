const fs = require("fs");
const matter = require("gray-matter");
const path = require("path");

const SITE_URL = "https://www.williambratz.com";
const root = path.join(__dirname, "..");
const contentDirectory = path.join(root, "contents");
const publicDirectory = path.join(root, "public");

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const posts = fs
  .readdirSync(contentDirectory)
  .filter((filename) => filename.endsWith(".md"))
  .map((filename) => {
    const raw = fs.readFileSync(path.join(contentDirectory, filename), "utf8");
    return matter(raw).data;
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const sitemapPages = [
  { url: "", date: posts[0].date },
  { url: "/blog", date: posts[0].date },
  { url: "/resume", date: "2026-07-27" },
  ...posts.map((post) => ({ url: `/blog/${post.slug}`, date: post.date })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPages
  .map(
    ({ url, date }) => `  <url>
    <loc>${escapeXml(`${SITE_URL}${url}`)}</loc>
    <lastmod>${new Date(date).toISOString()}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const rss = `<?xml version="1.0" encoding="UTF-8"?>
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
</rss>
`;

fs.writeFileSync(path.join(publicDirectory, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(publicDirectory, "rss.xml"), rss);

console.log(`Generated sitemap.xml and rss.xml for ${posts.length} posts.`);
