import React from "react";
import Layout from "../../src/components/Layout";
import styles from "../../styles/blog.module.css";
import Head from "next/head";
import fs from "fs";
import html from "remark-html";
import highlight from "remark-highlight.js";
import unified from "unified";
import markdown from "remark-parse";
import matter from "gray-matter";
import images from "remark-images";

function BlogPostPage(props) {
  const canonicalUrl = `https://www.williambratz.com/blog/${props.blog.slug}`;
  const socialImage = props.blog.banner
    ? `https://www.williambratz.com/${props.blog.banner.replace(/^(\.\.\/|\.\/)/, "")}`
    : undefined;
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(props.blog.date));
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: props.blog.title,
    description: props.blog.description,
    datePublished: new Date(props.blog.date).toISOString(),
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
        <title>{props.blog.title} | William Bratz</title>
        <meta name="description" content={props.blog.description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={props.blog.title} />
        <meta property="og:description" content={props.blog.description} />
        <meta property="article:published_time" content={new Date(props.blog.date).toISOString()} />
        {socialImage && <meta property="og:image" content={socialImage} />}
        <meta name="twitter:card" content={socialImage ? "summary_large_image" : "summary"} />
        <meta name="twitter:title" content={props.blog.title} />
        <meta name="twitter:description" content={props.blog.description} />
        {socialImage && <meta name="twitter:image" content={socialImage} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <article className={styles.blogPostContainer}>
        <div className={styles.blogPostBanner}>
          <img src={props.blog.banner} alt="" />
        </div>
        <header className={styles.blogPostTitle}>
          <p className={styles.blogPostMeta}>
            <time dateTime={new Date(props.blog.date).toISOString()}>{formattedDate}</time>
            <span aria-hidden="true">·</span>
            <span>{props.blog.readingTime} min read</span>
          </p>
          <h1>{props.blog.title}</h1>
        </header>
        <div className={styles.blogPostContent}>
          <section
            dangerouslySetInnerHTML={{ __html: props.blog.content }}
          ></section>
        </div>
      </article>
    </Layout>
  );
}

// pass props to BlogPostPage component
export async function getStaticProps(context) {
  const { readFileSync } = fs;
  const { stringify } = JSON;
  const { process } = unified().use(markdown).use(highlight).use(images).use(html);
  const { data, content } = matter(readFileSync(`contents/${context.params.slug}.md`, "utf8"));
  const result = await process(content);
  const words = content.trim().split(/\s+/).length;

  return {
    props: {
      blog: {
        ...data,
        readingTime: Math.max(1, Math.ceil(words / 225)),
        content: result.contents,
      },
    },
  };
}

// generate HTML paths at build time
export async function getStaticPaths(context) {
  const { readdirSync } = fs;
  const files = readdirSync("contents", "utf8");
  const paths = files
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(".md", ""));
  return {
    paths: paths.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

export default BlogPostPage;
