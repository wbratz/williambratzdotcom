import Head from "next/head";
import Link from "next/link";
import React from "react";
import ContactCallout from "../src/components/ContactCallout";
import Layout from "../src/components/Layout";
import styles from "../styles/About.module.css";

const SITE_URL = "https://www.williambratz.com";

const ExternalLink = ({ href, children }) => (
  <a href={href} target="_blank" rel="noreferrer">
    {children} <span aria-hidden="true">↗</span>
  </a>
);

export default function About() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "William Bratz",
    alternateName: "Billy Bratz",
    url: `${SITE_URL}/about`,
    image: `${SITE_URL}/headerphoto.jpg`,
    jobTitle: "Senior Software Engineer",
    homeLocation: {
      "@type": "Place",
      name: "Tri-Cities, Tennessee",
    },
    sameAs: [
      "https://github.com/wbratz",
      "https://www.linkedin.com/in/williambratz",
    ],
  };

  return (
    <Layout>
      <Head>
        <title>About William Bratz | Production AI Engineer</title>
        <meta
          name="description"
          content="William Bratz is a senior software engineer in Tri-Cities, Tennessee, building production AI systems, distributed software, and durable knowledge infrastructure."
        />
        <link rel="canonical" href={`${SITE_URL}/about`} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={`${SITE_URL}/about`} />
        <meta property="og:title" content="About William Bratz" />
        <meta
          property="og:description"
          content="Production AI, distributed systems, open-source tools, and knowledge that compounds."
        />
        <meta property="og:image" content={`${SITE_URL}/headerphoto.jpg`} />
        <meta name="twitter:card" content="summary" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </Head>

      <article className={styles.about}>
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              Senior Software Engineer · Tri-Cities, Tennessee
            </p>
            <h1>I build systems, then preserve what they teach us.</h1>
            <p className={styles.lede}>
              I&apos;m William “Billy” Bratz. For 11 years, I&apos;ve built
              distributed systems across identity, underwriting, analytics, and
              conversational AI. Today my focus is production LLM agents, MCP
              infrastructure, and the context those systems need to make sound
              decisions.
            </p>
          </div>
          <img
            className={styles.portrait}
            src="/headerphoto.jpg"
            alt="William Bratz"
            width="150"
            height="125"
          />
        </header>

        <section className={styles.section} aria-labelledby="work-now">
          <div className={styles.sectionHeading}>
            <p>What I work on now</p>
            <h2 id="work-now">
              Making capable AI systems dependable in production.
            </h2>
          </div>
          <div className={styles.prose}>
            <p>
              The interesting part of AI engineering begins after the demo
              works. Production introduces real users, imperfect data, latency
              budgets, failure modes, shifting models, and consequences. I work
              on the tool, context, evaluation, observability, and reliability
              layers that help agent systems operate inside those constraints.
            </p>
            <p>
              I&apos;m especially interested in the boundary between product
              intent and engineering implementation. When the reason behind a
              decision disappears, both people and agents are forced to
              reconstruct it. Better context makes that reasoning durable,
              reviewable, and useful the next time a decision reaches code.
            </p>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="principles">
          <div className={styles.sectionHeading}>
            <p>How I work</p>
            <h2 id="principles">A few principles that keep showing up.</h2>
          </div>
          <div className={styles.principles}>
            <article>
              <span>01</span>
              <h3>Evidence beats confidence</h3>
              <p>
                Good decisions should survive contact with logs, traces, source
                material, and the people affected by them.
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>Production reveals the system</h3>
              <p>
                Architecture diagrams describe intent. Production behavior shows
                where the real boundaries, dependencies, and risks live.
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>Context should compound</h3>
              <p>
                Decisions, incidents, and implementations should make the next
                piece of work easier, not disappear into another chat or ticket.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="public-work">
          <div className={styles.sectionHeading}>
            <p>Work made public</p>
            <h2 id="public-work">
              Ideas become more useful when other people can test them.
            </h2>
          </div>
          <div className={styles.publicGrid}>
            <article className={styles.feature}>
              <p className={styles.cardType}>Open source</p>
              <h3>The Vault</h3>
              <p>
                A persistent LLM-maintained wiki that connects source evidence,
                product decisions, engineering implementations, and agent
                context.
              </p>
              <div className={styles.cardLinks}>
                <Link href="/projects/vault" legacyBehavior>
                  <a>Explore the project</a>
                </Link>
                <ExternalLink href="https://github.com/wbratz/vault-scaffold">
                  Scaffold your own
                </ExternalLink>
              </div>
            </article>
            <article className={styles.feature}>
              <p className={styles.cardType}>Writing</p>
              <h3>Notes from the work</h3>
              <p>
                I write about production AI, distributed systems, engineering
                judgment, and the organizational knowledge that source code
                alone cannot preserve.
              </p>
              <div className={styles.cardLinks}>
                <Link href="/blog" legacyBehavior>
                  <a>Browse the essays</a>
                </Link>
                <Link href="/blog/bridging-the-gap" legacyBehavior>
                  <a>Read the Vault field guide</a>
                </Link>
              </div>
            </article>
          </div>
        </section>

        <section
          className={styles.section}
          aria-labelledby="independent-products"
        >
          <div className={styles.sectionHeading}>
            <p>Independent products</p>
            <h2 id="independent-products">
              Small tools can still make an idea tangible.
            </h2>
          </div>
          <div className={styles.community}>
            <div>
              <p className={styles.cardType}>Free to use</p>
              <h3>Useful experiments, released into the world.</h3>
            </div>
            <div className={styles.productList}>
              <article>
                <h4>Neverending Story Pointer</h4>
                <p>
                  A free planning-poker app for teams that want a quick, shared
                  way to estimate work without turning the ceremony into the
                  work.
                </p>
                <ExternalLink href="https://neverendingstorypointer.com">
                  Open the pointing app
                </ExternalLink>
              </article>
              <article>
                <h4>How Unique Is a GUID?</h4>
                <p>
                  An interactive explanation of an enormous probability space,
                  with collision calculators, relatable comparisons, and a
                  secure v4 generator. Its vocabulary layer supports both GUID
                  and UUID terminology.
                </p>
                <div className={styles.productLinks}>
                  <ExternalLink href="https://howuniqueisaguid.com">
                    Explore the app
                  </ExternalLink>
                </div>
              </article>
            </div>
          </div>
        </section>

        <div className={styles.contact}>
          <ContactCallout
            title="Working on a hard system or a better way to preserve what your team knows?"
            body="I am always interested in thoughtful conversations about production AI, MCP, distributed systems, and durable engineering context."
          />
        </div>
      </article>
    </Layout>
  );
}
