import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import Layout from "../src/components/Layout";
import {
  getAllPostSummaries,
  getAllTopics,
  PostSummary,
} from "../src/lib/content";
import styles from "../styles/blog.module.css";

const SITE_URL = "https://www.williambratz.com";

type BlogProps = {
  blogs: PostSummary[];
  topics: string[];
};

export default function Blog({ blogs, topics }: BlogProps) {
  const [activeTopic, setActiveTopic] = useState("All");
  const visibleBlogs =
    activeTopic === "All"
      ? blogs
      : blogs.filter((blog) => blog.topics.includes(activeTopic));

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
        <div className={styles.topicFilters} aria-label="Filter writing by topic">
          {["All", ...topics].map((topic) => (
            <button
              key={topic}
              type="button"
              className={activeTopic === topic ? styles.activeTopic : undefined}
              aria-pressed={activeTopic === topic}
              onClick={() => setActiveTopic(topic)}
            >
              {topic}
            </button>
          ))}
        </div>
        <p className={styles.resultCount} aria-live="polite">
          {visibleBlogs.length} {visibleBlogs.length === 1 ? "essay" : "essays"}
          {activeTopic === "All" ? "" : ` about ${activeTopic}`}
        </p>
        <ul className={styles.blogList}>
          {visibleBlogs.map((blog) => (
            <li key={blog.slug}>
              <article className={styles.blogSummaryWrapper}>
                <Link href={`/blog/${blog.slug}`} legacyBehavior>
                  <a className={styles.blogSummaryPhoto} aria-label={`Read ${blog.title}`}>
                    <img src={blog.photo} alt={blog.imageAlt} />
                  </a>
                </Link>
                <div className={styles.blogSummaryPosts}>
                  <time dateTime={blog.date}>
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      timeZone: "UTC",
                    }).format(new Date(`${blog.date}T00:00:00Z`))}
                  </time>
                  <h2 className={styles.blogSummaryTitle}>
                    <Link href={`/blog/${blog.slug}`} legacyBehavior>
                      <a>{blog.title}</a>
                    </Link>
                  </h2>
                  <p className={styles.blogSummaryContent}>{blog.description}</p>
                  <ul className={styles.topicList} aria-label="Topics">
                    {blog.topics.map((topic) => (
                      <li key={topic}>{topic}</li>
                    ))}
                  </ul>
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
  return {
    props: {
      blogs: getAllPostSummaries(),
      topics: getAllTopics(),
    },
  };
}
