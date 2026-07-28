import Head from "next/head";
import Link from "next/link";
import ContactCallout from "../src/components/ContactCallout";
import Layout from "../src/components/Layout";
import styles from "../styles/AiEngineering.module.css";

const SITE_URL = "https://www.williambratz.com";

const Arrow = () => <span aria-hidden="true">↗</span>;

export default function AiEngineering() {
  return (
    <Layout>
      <Head>
        <title>AI Engineering &amp; LLM Systems | William Bratz</title>
        <meta
          name="description"
          content="William Bratz builds production LLM agents, MCP infrastructure, AI developer tools, durable context systems, evaluations, and reliable distributed software."
        />
        <link rel="canonical" href={`${SITE_URL}/ai-engineering`} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={`${SITE_URL}/ai-engineering`} />
        <meta
          property="og:title"
          content="AI Engineering & LLM Systems | William Bratz"
        />
        <meta
          property="og:description"
          content="Production LLM agents, MCP infrastructure, durable context, evaluations, and distributed systems."
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <article className={styles.page}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>
            Senior Software Engineer · Production AI
          </p>
          <h1>AI engineering that survives contact with production.</h1>
          <p className={styles.lede}>
            I build the systems around capable models: tools, orchestration,
            context, evaluation, observability, and the distributed
            infrastructure that makes an agent dependable. My work spans
            customer-facing conversational AI, high-volume MCP platforms, and
            open-source systems for long-context reasoning and durable
            organizational knowledge.
          </p>
          <div className={styles.actions}>
            <Link href="/resume" legacyBehavior>
              <a className={styles.primaryAction}>View résumé</a>
            </Link>
            <Link href="/projects" legacyBehavior>
              <a className={styles.secondaryAction}>Explore projects</a>
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
        </header>

        <section className={styles.section} aria-labelledby="capabilities">
          <div className={styles.sectionHeading}>
            <p>Capabilities</p>
            <h2 id="capabilities">
              The model is one component. The product is the whole system.
            </h2>
          </div>
          <div className={styles.capabilityGrid}>
            <article>
              <span>01</span>
              <h3>LLM agents and orchestration</h3>
              <p>
                Tool-calling agents, structured outputs, multi-step workflows,
                model experiments, and operating contracts that keep autonomy
                inside explicit boundaries.
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>MCP infrastructure</h3>
              <p>
                MCP servers, clients, gateways, federation, and production
                integrations connecting conversational systems to real services
                at meaningful scale.
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>Context and knowledge systems</h3>
              <p>
                Source-grounded knowledge, recursive long-context analysis, and
                durable links between product intent, engineering decisions,
                implementations, and evidence.
              </p>
            </article>
            <article>
              <span>04</span>
              <h3>Reliability and evaluation</h3>
              <p>
                Observability, load testing, failure isolation, cost controls,
                evaluations, deployment safety, and feedback loops built for
                production behavior rather than demo behavior.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="proof">
          <div className={styles.sectionHeading}>
            <p>Public proof</p>
            <h2 id="proof">Systems you can inspect, run, and challenge.</h2>
          </div>
          <div className={styles.proofGrid}>
            <article className={styles.featuredProof}>
              <p className={styles.cardType}>Knowledge infrastructure</p>
              <h3>The Vault</h3>
              <p>
                A persistent, source-grounded knowledge system that gives people
                and agents focused context while preserving the evidence and
                decisions behind it.
              </p>
              <ul>
                <li>
                  product decisions connected to engineering implementation
                </li>
                <li>immutable evidence and regenerable synthesis</li>
                <li>automated ingest, query, and health workflows</li>
              </ul>
              <div className={styles.cardLinks}>
                <Link href="/projects/vault" legacyBehavior>
                  <a>Explore the architecture</a>
                </Link>
                <a
                  href="https://github.com/wbratz/vault-scaffold"
                  target="_blank"
                  rel="noreferrer"
                >
                  Scaffold a Vault <Arrow />
                </a>
              </div>
            </article>

            <article>
              <p className={styles.cardType}>Agent developer tools</p>
              <h3>Billy&apos;s AI Skills</h3>
              <p>
                Tested Recursive Language Model plugins for Claude Code and
                OpenAI Codex, with bounded fanout, dry-run planning, local-model
                support, and a public demonstration corpus.
              </p>
              <div className={styles.cardLinks}>
                <a
                  href="https://github.com/wbratz/billys-ai-skills"
                  target="_blank"
                  rel="noreferrer"
                >
                  Run the demo <Arrow />
                </a>
                <a
                  href="https://github.com/wbratz/billys-ai-skills/releases/tag/v0.1.0"
                  target="_blank"
                  rel="noreferrer"
                >
                  View the release <Arrow />
                </a>
              </div>
            </article>

            <article>
              <p className={styles.cardType}>Applied AI product</p>
              <h3>Hugo</h3>
              <p>
                A self-hosted Slack reading assistant that curates RSS feeds,
                ranks technical articles with Claude, summarizes links and
                threads, and delivers a focused daily digest.
              </p>
              <div className={styles.cardLinks}>
                <a
                  href="https://github.com/wbratz/hugo-slack-bot"
                  target="_blank"
                  rel="noreferrer"
                >
                  View the source <Arrow />
                </a>
              </div>
            </article>
          </div>
        </section>

        <section
          className={styles.section}
          aria-labelledby="engineering-record"
        >
          <div className={styles.sectionHeading}>
            <p>Engineering record</p>
            <h2 id="engineering-record">
              Eleven years of distributed systems behind the AI work.
            </h2>
          </div>
          <div className={styles.record}>
            <p>
              My AI work is grounded in backend and platform engineering across
              identity, underwriting, analytics, and conversational systems. I
              have built with Python, FastAPI, FastMCP, C#, .NET, Kafka,
              Kubernetes, cloud messaging, and production observability.
            </p>
            <p>
              That background shapes how I approach agents: explicit contracts,
              measurable boundaries, evidence from production, and graceful
              failure. I am based in Tri-Cities, Tennessee and work remotely.
            </p>
          </div>
          <Link href="/resume" legacyBehavior>
            <a className={styles.recordLink}>
              Read the full engineering record <span aria-hidden="true">→</span>
            </a>
          </Link>
        </section>

        <div className={styles.contact}>
          <ContactCallout
            title="Building an AI product that has to work outside the demo?"
            body="I am interested in remote senior software engineering roles focused on production AI, agent platforms, MCP infrastructure, and distributed systems."
          />
        </div>
      </article>
    </Layout>
  );
}
