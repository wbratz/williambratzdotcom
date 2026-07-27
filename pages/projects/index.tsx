import Head from "next/head";
import Link from "next/link";
import Layout from "../../src/components/Layout";
import styles from "../../styles/Projects.module.css";

const SITE_URL = "https://www.williambratz.com";

export default function Projects() {
  return (
    <Layout>
      <Head>
        <title>Projects | William Bratz</title>
        <meta
          name="description"
          content="Selected projects by William Bratz in AI knowledge infrastructure, agent systems, and engineering practice."
        />
        <link rel="canonical" href={`${SITE_URL}/projects`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/projects`} />
        <meta property="og:title" content="Projects | William Bratz" />
        <meta
          property="og:description"
          content="Systems and tools for production AI, durable context, and better engineering decisions."
        />
        <meta name="twitter:card" content="summary" />
      </Head>

      <div className={styles.projects}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>Selected projects</p>
          <h1>Systems that make AI more useful in the real world.</h1>
          <p>
            My projects focus on the infrastructure around intelligent systems:
            context, evidence, tools, operating boundaries, and the workflows that
            connect an idea to production.
          </p>
        </header>

        <section className={styles.projectList} aria-label="Project list">
          <article className={styles.featuredProject}>
            <div className={styles.projectCopy}>
              <p className={styles.projectType}>Knowledge infrastructure</p>
              <h2>The Vault</h2>
              <p>
                A persistent, source-grounded wiki that turns product and engineering
                evidence into focused context for people and AI agents.
              </p>
              <ul>
                <li>Immutable evidence and regenerable synthesis</li>
                <li>Repository, topic, and organization-level context</li>
                <li>Automated ingest, compile, query, and health workflows</li>
              </ul>
              <div className={styles.actions}>
                <Link href="/projects/vault">Explore The Vault</Link>
                <a
                  href="https://github.com/wbratz/vault-scaffold"
                  target="_blank"
                  rel="noreferrer"
                >
                  Scaffold your own <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
            <img
              src="/blogContent/bridging-the-gap/vault-mental-model.svg"
              alt="The Vault turns immutable evidence into a linked wiki used by people, AI agents, and automation."
              width="1200"
              height="760"
            />
          </article>

          <article className={styles.comingNext}>
            <p className={styles.projectType}>More work</p>
            <h2>Built carefully, documented when ready.</h2>
            <p>
              I will add projects when they can be explained with enough detail to be
              useful, including the tradeoffs and operational lessons.
            </p>
          </article>
        </section>
      </div>
    </Layout>
  );
}
