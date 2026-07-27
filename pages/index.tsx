import fs from "fs";
import matter from "gray-matter";
import Head from "next/head";
import Link from "next/link";
import path from "path";
import React from "react";
import Layout from "../src/components/Layout";
import styles from "../styles/Homepage.module.css";

const SITE_URL = "https://www.williambratz.com";

type PostSummary = {
  title: string;
  slug: string;
  date: string;
  description: string;
};

type HomeProps = {
  featuredPosts: PostSummary[];
};

const Arrow = () => <span aria-hidden="true">↗</span>;

export default function Home({ featuredPosts }: HomeProps) {
  return (
    <Layout>
      <Head>
        <title>William Bratz | Production AI &amp; Distributed Systems</title>
        <meta
          name="description"
          content="William Bratz builds production AI systems, MCP infrastructure, distributed systems, and durable organizational knowledge."
        />
        <link rel="canonical" href={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta
          property="og:title"
          content="William Bratz | Production AI & Distributed Systems"
        />
        <meta
          property="og:description"
          content="Production AI systems, MCP infrastructure, distributed systems, and knowledge that compounds."
        />
        <meta name="twitter:card" content="summary" />
      </Head>

      <div className={styles.home}>
        <section className={styles.hero} aria-labelledby="home-title">
          <p className={styles.eyebrow}>
            Senior Software Engineer · Tri-Cities, Tennessee
          </p>
          <h1 id="home-title">
            I build production AI systems and the knowledge infrastructure that
            helps humans and agents understand them.
          </h1>
          <p className={styles.lede}>
            I&apos;m William “Billy” Bratz. My work sits where LLM agents, MCP
            infrastructure, distributed systems, and engineering judgment meet. I
            build systems that survive production, then turn what they teach us into
            context that compounds.
          </p>
          <div className={styles.actions}>
            <Link href="/blog" legacyBehavior>
              <a className={styles.primaryAction}>Read my work</a>
            </Link>
            <Link href="/resume" legacyBehavior>
              <a className={styles.secondaryAction}>View résumé</a>
            </Link>
            <a
              className={styles.textAction}
              href="https://github.com/wbratz"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <Arrow />
            </a>
          </div>
        </section>

        <section id="projects" className={styles.section} aria-labelledby="work-title">
          <div className={styles.sectionHeading}>
            <p>Selected work</p>
            <h2 id="work-title">Systems, tools, and ideas made concrete.</h2>
          </div>

          <div className={styles.projectGrid}>
            <article className={`${styles.project} ${styles.featuredProject}`}>
              <div>
                <p className={styles.projectType}>Open-source workflow</p>
                <h3>The Vault</h3>
                <p>
                  A persistent, LLM-maintained wiki that connects product decisions,
                  engineering implementations, raw evidence, and the context agents
                  need to make better decisions.
                </p>
              </div>
              <div className={styles.projectLinks}>
                <Link href="/projects/vault" legacyBehavior>
                  <a>Explore the system</a>
                </Link>
                <Link href="/blog/bridging-the-gap" legacyBehavior>
                  <a>Read the field guide</a>
                </Link>
                <a
                  href="https://github.com/wbratz/vault-scaffold"
                  target="_blank"
                  rel="noreferrer"
                >
                  Scaffold your own <Arrow />
                </a>
              </div>
            </article>

            <article className={styles.project}>
              <p className={styles.projectType}>Production systems</p>
              <h3>AI agents and MCP</h3>
              <p>
                Building and operating the tool, context, evaluation, and reliability
                layers behind customer-facing conversational AI.
              </p>
              <Link href="/resume" legacyBehavior>
                <a>See the engineering record</a>
              </Link>
            </article>

            <article className={styles.project}>
              <p className={styles.projectType}>Engineering practice</p>
              <h3>Theory-building series</h3>
              <p>
                Three essays about why software understanding lives beyond code and
                documents. I also write about what changes when the map can learn.
              </p>
              <Link href="/blog/programming-as-theory-building" legacyBehavior>
                <a>Start with part one</a>
              </Link>
            </article>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="writing-title">
          <div className={styles.sectionHeading}>
            <p>Selected writing</p>
            <h2 id="writing-title">Notes from building, operating, and thinking.</h2>
          </div>
          <div className={styles.writingList}>
            {featuredPosts.map((post) => (
              <article key={post.slug}>
                <time dateTime={new Date(post.date).toISOString()}>
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(post.date))}
                </time>
                <div>
                  <h3>
                    <Link href={`/blog/${post.slug}`} legacyBehavior>
                      <a>{post.title}</a>
                    </Link>
                  </h3>
                  <p>{post.description}</p>
                </div>
              </article>
            ))}
          </div>
          <Link href="/blog" legacyBehavior>
            <a className={styles.allWriting}>Browse all writing <span aria-hidden="true">→</span></a>
          </Link>
        </section>

        <section id="about" className={`${styles.section} ${styles.about}`} aria-labelledby="about-title">
          <div className={styles.sectionHeading}>
            <p>About</p>
            <h2 id="about-title">Production is where the real system introduces itself.</h2>
          </div>
          <div className={styles.aboutCopy}>
            <p>
              I&apos;ve spent 11 years building distributed systems across identity,
              underwriting, analytics, and conversational AI. I care about evidence,
              explicit decisions, operable systems, and the hard-won theory teams
              develop while making software work in the world.
            </p>
            <p>
              Today I&apos;m focused on production agent systems and on preserving the
              connection between why a product decision was made and how it was
              implemented. That is the idea behind The Vault and much of what I write
              about here.
            </p>
          </div>
        </section>

        <section className={styles.contact} aria-labelledby="contact-title">
          <p>Let&apos;s compare notes.</p>
          <h2 id="contact-title">
            Interested in production AI, MCP, or engineering knowledge systems?
          </h2>
          <a href="mailto:WilliamBratz615@gmail.com">
            WilliamBratz615@gmail.com <span aria-hidden="true">→</span>
          </a>
        </section>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const contentDirectory = path.join(process.cwd(), "contents");
  const featuredPosts = fs
    .readdirSync(contentDirectory)
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(contentDirectory, filename), "utf8");
      return matter(raw).data as PostSummary;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return { props: { featuredPosts } };
}
