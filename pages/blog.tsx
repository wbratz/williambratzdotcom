import Layout from "../src/components/Layout";
import React from "react";
import styles from "../styles/blog.module.css";
import Link from "next/link";

export default function Blog(props) {
  return (
    <Layout>
      <div className={styles.blogContainer}>
        <ul>
          {props.blogs.map((blog, idx) => {
            return (
              <div className={styles.blogSummaryWrapper}>
                <div className={styles.blogSummaryPhoto}>
                  <img src={blog.photo} />
                </div>
                <div className={styles.blogSummaryPosts}>
                  <li key={blog.id}>
                    <div className={styles.blogSummaryTitle}>{blog.title}</div>
                    <div className={styles.blogSummaryContent}>
                      {blog.description}
                    </div>
                    <p>
                      <Link href={`/blog/${blog.slug}`}>
                        <span>Read More</span>
                      </Link>
                    </p>
                  </li>
                </div>
              </div>
            );
          })}
        </ul>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const fs = require("fs");
  const matter = require("gray-matter");
  const { v4: uuid } = require("uuid");

  const files = fs.readdirSync(`${process.cwd()}/contents`, "utf-8");

  const blogs = files
    .filter((fn: string) => fn.endsWith(".md"))
    .map((fn: any) => {
      const path = `${process.cwd()}/contents/${fn}`;
      const rawContent = fs.readFileSync(path, {
        encoding: "utf-8",
      });
      const { data } = matter(rawContent);

      return { ...data, id: uuid() };
    });

  blogs.sort(function (a, b) {
    var keyA = new Date(a.date),
      keyB = new Date(b.date);

    if (keyA > keyB) return -1;
    if (keyA < keyB) return 1;
    return 0;
  });

  // By returning { props: blogs }, the component
  // will receive `blogs` as a prop at build time
  return {
    props: { blogs },
  };
}
