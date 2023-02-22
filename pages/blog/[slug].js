import React from "react";
import Layout from "../../src/components/Layout";
import styles from "../../styles/blog.module.css";
import fs from "fs";
import html from "remark-html";
import highlight from "remark-highlight.js";
import unified from "unified";
import markdown from "remark-parse";
import matter from "gray-matter";
import images from "remark-images";

function BlogPostPage(props) {
  return (
    <Layout>
      <div className={styles.blogPostContainer}>
        <div className={styles.blogPostBanner}>
          <img src={props.blog.banner} />
        </div>
        <div className={styles.blogPostTitle}>
          <h1>{props.blog.title}</h1>
        </div>
        <div className={styles.blogPostContent}>
          <section
            dangerouslySetInnerHTML={{ __html: props.blog.content }}
          ></section>
        </div>
      </div>
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

  return {
    props: {
      blog: {
        ...data,
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
