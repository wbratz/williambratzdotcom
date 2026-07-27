import fs from "fs";
import matter from "gray-matter";
import Head from "next/head";
import Link from "next/link";
import path from "path";
import React from "react";
import Layout from "../src/components/Layout";
import styles from "../styles/blog.module.css";

const SITE_URL = "https://www.williambratz.com";

export default function Blog({ blogs }) {
  return (
    <Layout>
      <Head>
        <title>Writing | William Bratz</title>
        <meta
          name="description"
          content="Essays by William Bratz on production AI systems, software design, distributed systems, and engineering knowledge."
        />
        <link rel="canonical" href={`${SITE_URL}/blog`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/blog`} />
        <meta property="og:title" content="Writing | William Bratz" />
        <meta
          property="og:description"
          content="Essays on production AI systems, software design, distributed systems, and engineering knowledge."
        />
        <meta name="twitter:card" content="summary" />
      </Head>

      <div className={styles.blogContainer}>
        <header className={styles.blogIndexHeader}>
          <p>Writing</p>
          <h1>Notes from building, operating, and thinking.</h1>
          <div>
            Essays about production AI systems, distributed software, engineering
            judgment, and the knowledge teams build together.
          </div>
        </header>
        <ul className={styles.blogList}>
          {blogs.map((blog) => (
            <li key={blog.slug}>
              <article className={styles.blogSummaryWrapper}>
                <Link href={`/blog/${blog.slug}`} legacyBehavior>
                  <a className={styles.blogSummaryPhoto} aria-label={`Read ${blog.title}`}>
                    <img src={blog.photo} alt="" />
                  </a>
                </Link>
                <div className={styles.blogSummaryPosts}>
                  <time dateTime={new Date(blog.date).toISOString()}>
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(blog.date))}
                  </time>
                  <h2 className={styles.blogSummaryTitle}>
                    <Link href={`/blog/${blog.slug}`} legacyBehavior>
                      <a>{blog.title}</a>
                    </Link>
                  </h2>
                  <p className={styles.blogSummaryContent}>{blog.description}</p>
                  <Link href={`/blog/${blog.slug}`} legacyBehavior>
                    <a className={styles.readMore}>Read essay <span aria-hidden="true">→</span></a>
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const contentDirectory = path.join(process.cwd(), "contents");
  const blogs = fs
    .readdirSync(contentDirectory)
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(contentDirectory, filename), "utf8");
      return matter(raw).data;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return { props: { blogs } };
}
