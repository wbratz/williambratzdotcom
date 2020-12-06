import React from "react";
import Layout from "../../src/components/Layout";
import styles from "../../styles/blog.module.css";
import ReactGA from "react-ga";

function BlogPostPage(props) {
  function initializeReactGA() {
    ReactGA.initialize("G-405W0LWQ6E");
    ReactGA.pageview("/blogpost");
  }

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
  const fs = require("fs");
  const html = require("remark-html");
  const highlight = require("remark-highlight.js");
  const unified = require("unified");
  const markdown = require("remark-parse");
  const matter = require("gray-matter");
  const images = require("remark-images");

  const slug = context.params.slug; // get slug from params
  const path = `${process.cwd()}/contents/${slug}.md`;

  // read file content and store into rawContent variable
  const rawContent = fs.readFileSync(path, {
    encoding: "utf-8",
  });

  const { data, content } = matter(rawContent); // pass rawContent to gray-matter to get data and content

  const result = await unified()
    .use(markdown)
    .use(highlight) // highlight code block
    .use(html)
    .use(images)
    .process(content); // pass content to process

  return {
    props: {
      blog: {
        ...data,
        content: result.toString(),
      },
    },
  };
}

// generate HTML paths at build time
export async function getStaticPaths(context) {
  const fs = require("fs");

  const path = `${process.cwd()}/contents`;
  const files = fs.readdirSync(path, "utf-8");

  const markdownFileNames = files
    .filter((fn) => fn.endsWith(".md"))
    .map((fn) => fn.replace(".md", ""));

  return {
    paths: markdownFileNames.map((fileName) => {
      return {
        params: {
          slug: fileName,
        },
      };
    }),
    fallback: false,
  };
}

export default BlogPostPage;
