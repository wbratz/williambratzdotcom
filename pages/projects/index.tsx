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
            context, evidence, tools, operating boundaries, and the workflows
            that connect an idea to production.
          </p>
        </header>

        <section className={styles.projectList} aria-label="Project list">
          <article className={styles.featuredProject}>
            <div className={styles.projectCopy}>
              <p className={styles.projectType}>Knowledge infrastructure</p>
              <h2>The Vault</h2>
              <p>
                A persistent, source-grounded wiki that turns product and
                engineering evidence into focused context for people and AI
                agents.
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

          <div className={styles.productCaseStudies}>
            <article className={styles.productCaseStudy}>
              <figure className={styles.productVisual}>
                <img
                  src="/projects/billys-ai-skills-1280.png"
                  sizes="(max-width: 760px) calc(100vw - 4.5rem), 560px"
                  alt="Billy's AI Skills maps a large source field through a controller and focused agents into an evidence-backed result."
                  width="1280"
                  height="640"
                  loading="lazy"
                />
                <figcaption>
                  A controller inspects large context, delegates focused work,
                  and converges the evidence into one answer.
                </figcaption>
              </figure>
              <div className={styles.caseStudyCopy}>
                <p className={styles.projectType}>Agent infrastructure</p>
                <h2>Billy&apos;s AI Skills</h2>
                <p>
                  Cross-client Recursive Language Model workflows for Claude
                  Code and OpenAI Codex, built to reason across repositories,
                  documents, logs, transcripts, and other large source sets.
                </p>
                <ul>
                  <li>Bounded fanout, cost controls, and dry-run planning</li>
                  <li>Tested Claude and Codex marketplace implementations</li>
                  <li>
                    A public product-launch corpus with a reproducible terminal
                    demonstration
                  </li>
                </ul>
                <p className={styles.productNote}>
                  The project keeps raw context outside the main conversation,
                  delegates focused questions over chunks, and returns a
                  source-grounded synthesis. The example requires no private
                  data or provider credentials.
                </p>
                <div className={styles.actions}>
                  <a
                    href="https://github.com/wbratz/billys-ai-skills"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Run the demo <span aria-hidden="true">↗</span>
                  </a>
                  <a
                    href="https://github.com/wbratz/billys-ai-skills/releases/tag/v0.1.0"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View v0.1.0 <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </article>

            <article className={styles.productCaseStudy}>
              <figure className={styles.productVisual}>
                <img
                  src="/projects/neverending-story-pointer-800.webp"
                  srcSet="/projects/neverending-story-pointer-480.webp 480w, /projects/neverending-story-pointer-800.webp 800w"
                  sizes="(max-width: 760px) calc(100vw - 4.5rem), 560px"
                  alt="A Neverending Story Pointer room with story details, a timer, estimation choices, a participant, sharing controls, and history."
                  width="800"
                  height="596"
                  loading="lazy"
                />
                <figcaption>
                  One room holds the story, estimates, participants, timer,
                  reveal controls, and history.
                </figcaption>
              </figure>
              <div className={styles.caseStudyCopy}>
                <p className={styles.projectType}>Real-time collaboration</p>
                <h2>Neverending Story Pointer</h2>
                <p>
                  A free, no-sign-up planning-poker room for teams that need to
                  move from private estimates to a useful conversation without
                  ceremony.
                </p>
                <ul>
                  <li>Shareable rooms with no account setup</li>
                  <li>Private voting with deliberate reveal and reset</li>
                  <li>
                    Story context, participant state, a timer, and history in
                    one place
                  </li>
                </ul>
                <p className={styles.productNote}>
                  The product keeps facilitation intentionally narrow: one room,
                  one story, one reveal. Its Blazor WebAssembly client delivers
                  an application-like workflow from a simple link.
                </p>
                <div className={styles.actions}>
                  <a
                    href="https://neverendingstorypointer.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open the app <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </article>

            <article className={styles.productCaseStudy}>
              <figure className={styles.productVisual}>
                <img
                  src="/projects/how-unique-is-a-guid-800.webp"
                  srcSet="/projects/how-unique-is-a-guid-480.webp 480w, /projects/how-unique-is-a-guid-800.webp 800w"
                  sizes="(max-width: 760px) calc(100vw - 4.5rem), 560px"
                  alt="How Unique Is a GUID showing a field of identifiers, a generated GUID, and an explanation of its digital fingerprint."
                  width="800"
                  height="556"
                  loading="lazy"
                />
                <figcaption>
                  The opening interaction makes an astronomical identifier space
                  tangible before introducing the calculators.
                </figcaption>
              </figure>
              <div className={styles.caseStudyCopy}>
                <p className={styles.projectType}>Interactive explanation</p>
                <h2>How Unique Is a GUID?</h2>
                <p>
                  An interactive explanation that turns 122 bits of randomness
                  and abstract collision probability into something people can
                  see, calculate, and reason about.
                </p>
                <ul>
                  <li>
                    Arbitrary-precision collision and birthday-paradox
                    calculations
                  </li>
                  <li>Personal witness models and human-scale comparisons</li>
                  <li>Cryptographically secure v4 generation in the browser</li>
                </ul>
                <p className={styles.productNote}>
                  One React and TypeScript codebase supports GUID and UUID
                  terminology through a build-time vocabulary layer. The
                  mathematics and interactions stay identical while the language
                  matches each reader.
                </p>
                <div className={styles.actions}>
                  <a
                    href="https://howuniqueisaguid.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open the app <span aria-hidden="true">↗</span>
                  </a>
                  <a
                    href="https://github.com/wbratz/HowUniqueIsAGuid"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View source <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </Layout>
  );
}
