import Head from "next/head";
import Link from "next/link";
import Layout from "../../src/components/Layout";
import styles from "../../styles/VaultProject.module.css";

const SITE_URL = "https://www.williambratz.com";

const workflow = [
  {
    number: "01",
    title: "Ingest",
    description:
      "Collect pull requests, architecture decisions, product documents, meeting notes, issue records, and meaningful AI sessions without rewriting the originals.",
  },
  {
    number: "02",
    title: "Compile",
    description:
      "Extract typed facts, update focused wiki pages, connect related evidence, surface contradictions, and rebuild lightweight indexes.",
  },
  {
    number: "03",
    title: "Use",
    description:
      "Load the smallest relevant map into a working session, follow citations when needed, and verify important claims against current code.",
  },
  {
    number: "04",
    title: "Maintain",
    description:
      "Audit broken links, stale claims, orphaned pages, missed runs, and gaps between the evidence layer and the current synthesis.",
  },
];

const safeguards = [
  {
    title: "Raw evidence is immutable",
    description:
      "Automation appends source artifacts but does not quietly rewrite them. The wiki can be rebuilt from the evidence layer.",
  },
  {
    title: "The model does not hold the pen",
    description:
      "Untrusted text is reduced to validated, typed output. Deterministic code writes trusted files and provenance.",
  },
  {
    title: "Authority depends on the page",
    description:
      "Reference material can accept safe additions. Opinionated standards and patterns require human promotion.",
  },
  {
    title: "Failure stays visible",
    description:
      "Cadences fail loudly, caches are validated before replacement, concurrent runs are locked, and every operation leaves an audit entry.",
  },
];

export default function VaultProject() {
  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: "The Vault",
    description:
      "A persistent, source-grounded knowledge system for product teams, engineers, and AI agents.",
    author: {
      "@type": "Person",
      name: "William Bratz",
      url: SITE_URL,
    },
    codeRepository: "https://github.com/wbratz/vault-scaffold",
    programmingLanguage: ["Python", "Markdown"],
    url: `${SITE_URL}/projects/vault`,
  };

  return (
    <Layout>
      <Head>
        <title>The Vault | William Bratz</title>
        <meta
          name="description"
          content="The architecture, operating model, safeguards, and adoption path behind The Vault, a persistent knowledge system for people and AI agents."
        />
        <link rel="canonical" href={`${SITE_URL}/projects/vault`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${SITE_URL}/projects/vault`} />
        <meta property="og:title" content="The Vault | William Bratz" />
        <meta
          property="og:description"
          content="A persistent, source-grounded knowledge system for product teams, engineers, and AI agents."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
        />
      </Head>

      <article className={styles.vault}>
        <header className={styles.hero}>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link href="/projects">Projects</Link>
            <span aria-hidden="true">/</span>
            <span>The Vault</span>
          </nav>
          <p className={styles.eyebrow}>Persistent context for humans and AI</p>
          <h1>The Vault</h1>
          <p className={styles.lede}>
            The Vault is a source-grounded knowledge system that connects product
            intent, engineering decisions, implementation evidence, and the AI
            sessions used to do the work.
          </p>
          <div className={styles.actions}>
            <a
              className={styles.primaryAction}
              href="https://github.com/wbratz/vault-scaffold"
              target="_blank"
              rel="noreferrer"
            >
              Scaffold your own <span aria-hidden="true">↗</span>
            </a>
            <Link href="/blog/bridging-the-gap" legacyBehavior>
              <a className={styles.secondaryAction}>Read the full essay</a>
            </Link>
          </div>
          <dl className={styles.summary}>
            <div>
              <dt>Storage</dt>
              <dd>Markdown and Git</dd>
            </div>
            <div>
              <dt>Engine</dt>
              <dd>Python CLI and typed models</dd>
            </div>
            <div>
              <dt>Interfaces</dt>
              <dd>AI sessions, terminal, and automation</dd>
            </div>
          </dl>
        </header>

        <section className={styles.intro} aria-labelledby="problem-title">
          <div className={styles.sectionLabel}>The problem</div>
          <div>
            <h2 id="problem-title">Organizations remember in fragments.</h2>
            <p>
              Product intent lives in documents and conversations. Engineering intent
              lives in code, pull requests, architecture decisions, and the memories
              of the people who made them. AI agents usually see only the task and the
              repository in front of them.
            </p>
            <p>
              The Vault preserves the links between those fragments. It gives people
              a way to follow a decision into what shipped, and gives an AI agent a
              focused starting theory before it changes code.
            </p>
          </div>
        </section>

        <figure className={styles.wideFigure}>
          <img
            src="/blogContent/bridging-the-gap/vault-mental-model.svg"
            alt="Immutable source evidence is compiled into a linked, source-grounded wiki used by product, engineering, AI agents, and automation."
            width="1200"
            height="760"
          />
          <figcaption>
            Evidence remains authoritative. The wiki is a useful, regenerable model
            of that evidence.
          </figcaption>
        </figure>

        <section className={styles.workflow} aria-labelledby="workflow-title">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionLabel}>Operating model</p>
            <h2 id="workflow-title">A compiler for organizational knowledge.</h2>
            <p>
              The system separates mechanical collection, model-assisted synthesis,
              everyday use, and health checks. Each stage has a different risk profile.
            </p>
          </div>
          <ol>
            {workflow.map((step) => (
              <li key={step.number}>
                <span>{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.implementation} aria-labelledby="implementation-title">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionLabel}>Implementation</p>
            <h2 id="implementation-title">Plain files, deliberate machinery.</h2>
            <p>
              The implementation is intentionally inspectable. The knowledge remains
              useful without a proprietary database or a running application.
            </p>
          </div>
          <div className={styles.implementationGrid}>
            <pre aria-label="Generic Vault directory structure">
              <code>{`vault/
├── SCHEMA.md
├── Global/
│   ├── Raw/
│   ├── Standards/
│   ├── Patterns/
│   ├── _hot.md
│   └── _index.md
├── Repos/
│   └── payments-api/
│       ├── Raw/
│       ├── Decisions/
│       ├── Stories/
│       ├── _hot.md
│       └── _index.md
└── Inbox/`}</code>
            </pre>
            <div className={styles.capabilities}>
              <div>
                <h3>Scoped context</h3>
                <p>
                  Small hot files and indexes load first. Deeper pages and raw sources
                  are followed only when the task needs them.
                </p>
              </div>
              <div>
                <h3>Portable configuration</h3>
                <p>
                  Repositories, topics, source paths, and exclusions are configuration.
                  Machine-specific paths stay outside the shared knowledge.
                </p>
              </div>
              <div>
                <h3>Operational CLI</h3>
                <p>
                  Ingest, compile, lint, search, doctor, and scheduling commands make
                  the memory loop testable and repeatable.
                </p>
              </div>
              <div>
                <h3>Self-healing cadence</h3>
                <p>
                  Scheduled work can catch up after missed runs. A diagnostic command
                  verifies credentials, hooks, paths, and schedules.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.example} aria-labelledby="example-title">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionLabel}>In practice</p>
            <h2 id="example-title">Ask about intent. Verify the implementation.</h2>
            <p>
              This fictional example shows the shape of a useful answer. The agent
              follows product intent through the decision that changed it, then checks
              the current code and tests.
            </p>
          </div>
          <figure className={styles.wideFigure}>
            <img
              src="/blogContent/bridging-the-gap/vault-claude-code-example.svg"
              alt="A fictional Claude Code terminal exchange that traces a PRD requirement through a decision, story, pull request, source code, and test before answering with citations."
              width="1200"
              height="900"
            />
            <figcaption>
              The goal is not a confident answer. It is a verifiable answer with a
              path back to intent and evidence.
            </figcaption>
          </figure>
        </section>

        <section className={styles.safeguards} aria-labelledby="safeguards-title">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionLabel}>Trust boundaries</p>
            <h2 id="safeguards-title">AI-assisted does not mean AI-authoritative.</h2>
            <p>
              A useful knowledge system needs stronger guarantees than “the model
              usually gets it right.”
            </p>
          </div>
          <div className={styles.safeguardGrid}>
            {safeguards.map((safeguard) => (
              <article key={safeguard.title}>
                <h3>{safeguard.title}</h3>
                <p>{safeguard.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.boundaries} aria-labelledby="boundaries-title">
          <div className={styles.sectionLabel}>What it is not</div>
          <div>
            <h2 id="boundaries-title">The Vault does not replace judgment.</h2>
            <ul>
              <li>It is not a claim that documentation becomes truth.</li>
              <li>It is not a reason to feed every document into every prompt.</li>
              <li>It is not a black box that hides where an answer came from.</li>
              <li>It is not permission for a model to rewrite organizational policy.</li>
            </ul>
            <p>
              It is a maintained map with receipts. People still own decisions, and
              the running system still gets the final vote.
            </p>
          </div>
        </section>

        <section className={styles.start} aria-labelledby="start-title">
          <p className={styles.sectionLabel}>Try the pattern</p>
          <h2 id="start-title">Start with one domain and one real workflow.</h2>
          <p>
            The public scaffold interviews you about your domain, creates a generic
            Raw and Wiki structure, writes the operating contract, seeds the first
            pages, and installs ingest, query, and lint instructions for your agent.
          </p>
          <div className={styles.actions}>
            <a
              className={styles.primaryAction}
              href="https://github.com/wbratz/vault-scaffold"
              target="_blank"
              rel="noreferrer"
            >
              Open vault-scaffold <span aria-hidden="true">↗</span>
            </a>
            <Link href="/blog/bridging-the-gap" legacyBehavior>
              <a className={styles.secondaryAction}>Read why I built it</a>
            </Link>
          </div>
        </section>
      </article>
    </Layout>
  );
}
