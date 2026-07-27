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
    });

  const pages = [
    { url: "", date: new Date().toISOString() },
    { url: "/blog", date: new Date().toISOString() },
    { url: "/resume", date: new Date().toISOString() },
    ...posts.map((post) => ({
      url: `/blog/${post.slug}`,
      date: new Date(post.date).toISOString(),
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    ({ url, date }) => `  <url>
    <loc>${escapeXml(`${SITE_URL}${url}`)}</loc>
    <lastmod>${escapeXml(date)}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(xml);
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
