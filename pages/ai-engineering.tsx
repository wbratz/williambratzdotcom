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
            Senior Software Engineer · Context engineering
          </p>
          <h1>AI engineering, built around context</h1>
          <p className={styles.lede}>
            I build the systems around capable models: the tools they call, the
            context they&apos;re handed, and the tests that prove it worked.
            Most of my work is context engineering, for production agents that
            answer customers and for coding agents that write code.
          </p>
          <div className={styles.actions}>
            <Link href="/production-agents" legacyBehavior>
              <a className={styles.primaryAction}>
                Context for production agents
              </a>
            </Link>
            <Link href="/coding-agents" legacyBehavior>
              <a className={styles.secondaryAction}>
                Context for coding agents
              </a>
            </Link>
          </div>
        </header>

        <section className={styles.section} aria-labelledby="capabilities">
          <div className={styles.sectionHeading}>
            <p>Capabilities</p>
            <h2 id="capabilities">
              The model is one component. Context decides the result
            </h2>
          </div>
          <div className={styles.capabilityGrid}>
            <article>
              <span>01</span>
              <h3>Context for production agents</h3>
              <p>
                Faster retrieval, context loaded before it&apos;s needed, lean
                prompts, and tool routing you can measure.
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>Context for coding agents</h3>
              <p>
                Domain knowledge filed where it applies and delivered at the
                moment of the edit, proven with blind A/B tests.
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>MCP infrastructure</h3>
              <p>
                MCP servers, gateways, and tool contracts that tell the model
                exactly what each tool returns.
              </p>
            </article>
            <article>
              <span>04</span>
              <h3>Evaluation and reliability</h3>
              <p>
                Blind replays, backtested alerts, and observability. Measure
                first, then change.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="proof">
          <div className={styles.sectionHeading}>
            <p>Public proof</p>
            <h2 id="proof">Systems you can inspect, run, and challenge</h2>
          </div>
          <div className={styles.proofGrid}>
            <article className={styles.featuredProof}>
              <p className={styles.cardType}>Knowledge infrastructure</p>
              <h3>The Vault</h3>
              <p>
                Persistent context for people and coding agents. Sources stay
                untouched, and a rule reaches the agent when it edits the file
                the rule governs.
              </p>
              <ul>
                <li>rules delivered at the moment of the edit</li>
                <li>knowledge filed where it applies</li>
                <li>untouched sources and nightly synthesis</li>
              </ul>
              <div className={styles.cardLinks}>
                <Link href="/projects/vault" legacyBehavior>
                  <a>How it works</a>
                </Link>
                <Link href="/blog/proving-the-vaults-value" legacyBehavior>
                  <a>Proving its value</a>
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
              Eleven years of distributed systems behind the AI work
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
              measurable results, evidence from production, and graceful
              failure. I&apos;m based in Tri-Cities, Tennessee, and work
              remotely.
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
            title="Building agents that need better context?"
            body="I'm open to remote senior and staff roles in context engineering, agent platforms, and MCP infrastructure."
          />
        </div>
      </article>
    </Layout>
  );
}
