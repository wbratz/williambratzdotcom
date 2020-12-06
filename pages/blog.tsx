import Layout from "../src/components/Layout";
import React from "react";
import styles from "../styles/blog.module.css";
import Link from "next/link";
import ReactGA from "react-ga";

export default function Blog(props) {
  function initializeReactGA() {
    ReactGA.initialize("UA-184834329-1");
    ReactGA.pageview("/blog");
  }
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
                        <a>Read More</a>
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
    .filter((fn) => fn.endsWith(".md"))
    .map((fn) => {
      const path = `${process.cwd()}/contents/${fn}`;
      const rawContent = fs.readFileSync(path, {
        encoding: "utf-8",
      });
      const { data } = matter(rawContent);

      return { ...data, id: uuid() };
    });

  // By returning { props: blogs }, the component
  // will receive `blogs` as a prop at build time
  return {
    props: { blogs },
  };
}
