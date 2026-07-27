import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import html from "remark-html";
import highlight from "remark-highlight.js";
import images from "remark-images";
import markdown from "remark-parse";
import unified from "unified";
import Layout from "../../src/components/Layout";
import {
  getAdjacentPosts,
  getPostBySlug,
  getPostSlugs,
  getRelatedPosts,
  getSeriesPosts,
  PostSummary,
} from "../../src/lib/content";
import styles from "../../styles/blog.module.css";

type Article = PostSummary & {
  content: string;
};

type BlogPostProps = {
  blog: Article;
  seriesPosts: PostSummary[];
  relatedPosts: PostSummary[];
  adjacent: {
    newer: PostSummary | null;
    older: PostSummary | null;
  };
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));

export default function BlogPostPage({
  blog,
  seriesPosts,
  relatedPosts,
  adjacent,
}: BlogPostProps) {
  const canonicalUrl = `https://www.williambratz.com/blog/${blog.slug}`;
  const socialImage = blog.banner
    ? `https://www.williambratz.com/${blog.banner.replace(/^(\.\.\/|\.\/)/, "")}`
    : undefined;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.description,
    datePublished: new Date(`${blog.date}T00:00:00Z`).toISOString(),
    dateModified: new Date(`${blog.updated || blog.date}T00:00:00Z`).toISOString(),
    keywords: blog.topics.join(", "),
    author: {
      "@type": "Person",
      name: "William Bratz",
      url: "https://www.williambratz.com",
    },
    mainEntityOfPage: canonicalUrl,
    ...(socialImage ? { image: socialImage } : {}),
  };

  return (
    <Layout>
      <Head>
        <title>{blog.title} | William Bratz</title>
        <meta name="description" content={blog.description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.description} />
        <meta
          property="article:published_time"
          content={new Date(`${blog.date}T00:00:00Z`).toISOString()}
        />
        {blog.updated && (
          <meta
            property="article:modified_time"
            content={new Date(`${blog.updated}T00:00:00Z`).toISOString()}
          />
        )}
        {blog.topics.map((topic) => (
          <meta property="article:tag" content={topic} key={topic} />
        ))}
        {socialImage && <meta property="og:image" content={socialImage} />}
        {socialImage && <meta property="og:image:alt" content={blog.imageAlt} />}
        <meta
          name="twitter:card"
          content={socialImage ? "summary_large_image" : "summary"}
        />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.description} />
        {socialImage && <meta name="twitter:image" content={socialImage} />}
        {socialImage && <meta name="twitter:image:alt" content={blog.imageAlt} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <article className={styles.blogPostContainer}>
        <div className={styles.blogPostBanner}>
          <img src={blog.banner} alt={blog.imageAlt} />
        </div>
        <header className={styles.blogPostTitle}>
          <p className={styles.blogPostMeta}>
            <time dateTime={blog.date}>{formatDate(blog.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{blog.readingTime} min read</span>
            {blog.updated && blog.updated !== blog.date && (
              <>
                <span aria-hidden="true">·</span>
                <span>Updated {formatDate(blog.updated)}</span>
              </>
            )}
          </p>
          <h1>{blog.title}</h1>
          <ul className={styles.articleTopics} aria-label="Article topics">
            {blog.topics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </header>

        {blog.series && seriesPosts.length > 1 && (
          <aside className={styles.series} aria-labelledby="series-title">
            <div>
              <p>Series</p>
              <h2 id="series-title">{blog.series}</h2>
            </div>
            <ol>
              {seriesPosts.map((post) => (
                <li key={post.slug}>
                  {post.slug === blog.slug ? (
                    <span aria-current="page">{post.title}</span>
                  ) : (
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  )}
                </li>
              ))}
            </ol>
          </aside>
        )}

        <div className={styles.blogPostContent}>
          <section dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>

        <nav className={styles.articlePagination} aria-label="Adjacent essays">
          {adjacent.older ? (
            <Link href={`/blog/${adjacent.older.slug}`} legacyBehavior>
              <a>
                <span>Older essay</span>
                <strong>{adjacent.older.title}</strong>
              </a>
            </Link>
          ) : (
            <span />
          )}
          {adjacent.newer && (
            <Link href={`/blog/${adjacent.newer.slug}`} legacyBehavior>
              <a className={styles.newerPost}>
                <span>Newer essay</span>
                <strong>{adjacent.newer.title}</strong>
              </a>
            </Link>
          )}
        </nav>

        {relatedPosts.length > 0 && (
          <section className={styles.related} aria-labelledby="related-title">
            <p>Keep reading</p>
            <h2 id="related-title">Related essays</h2>
            <div>
              {relatedPosts.map((post) => (
                <article key={post.slug}>
                  <p>{post.topics.slice(0, 2).join(" · ")}</p>
                  <h3>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p>{post.description}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </article>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<BlogPostProps> = async (context) => {
  const slug = String(context.params?.slug);
  const post = getPostBySlug(slug);
  const processor = unified().use(markdown).use(highlight).use(images).use(html);
  const result = await processor.process(post.body);
  const { body, ...summary } = post;

  return {
    props: {
      blog: {
        ...summary,
        content: String(result.contents),
      },
      seriesPosts: post.series ? getSeriesPosts(post.series) : [],
      relatedPosts: getRelatedPosts(slug),
      adjacent: getAdjacentPosts(slug),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: getPostSlugs().map((slug) => ({ params: { slug } })),
  fallback: false,
});
