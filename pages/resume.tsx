import Head from "next/head";
import Layout from "../src/components/Layout";
import styles from "../styles/Resume.module.css";

const ExternalLink = ({ href, children }) => (
  <a href={href} target="_blank" rel="noreferrer">
    {children}
  </a>
);

export default function Resume() {
  return (
    <Layout>
      <Head>
        <title>William “Billy” Bratz | Senior AI &amp; Software Engineer</title>
        <meta
          name="description"
          content="Resume for William Bratz, a senior software engineer building production LLM agent platforms, MCP infrastructure, and distributed systems."
        />
        <link rel="canonical" href="https://www.williambratz.com/resume" />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://www.williambratz.com/resume" />
        <meta
          property="og:title"
          content="William “Billy” Bratz | Senior Software Engineer"
        />
        <meta
          property="og:description"
          content="Senior software engineer building production LLM agent platforms and distributed systems."
        />
        <meta name="twitter:card" content="summary" />
      </Head>

      <article className={styles.resume}>
        <header className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>
              Senior Software Engineer · Tri-Cities, Tennessee
            </p>
            <h1>William “Billy” Bratz</h1>
            <p className={styles.intro}>
              Senior software engineer focused on context engineering for AI
              agents, with 11 years building distributed systems. I make
              production agents faster, leaner, and more accurate, and I give
              coding agents the domain context to write code that fits.
            </p>
          </div>

          <a
            className={styles.download}
            href="/WilliamBratz-resume.pdf"
            download
            aria-label="Download William Bratz's resume as a PDF"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14" />
            </svg>
            Download PDF
          </a>

          <nav className={styles.contact} aria-label="Resume contact links">
            <a href="mailto:WilliamBratz615@gmail.com">Email</a>
            <ExternalLink href="https://www.linkedin.com/in/williambratz">
              LinkedIn
            </ExternalLink>
            <ExternalLink href="https://github.com/wbratz">GitHub</ExternalLink>
            <ExternalLink href="https://williambratz.com">
              williambratz.com
            </ExternalLink>
          </nav>
        </header>

        <section className={styles.section}>
          <h2>Experience</h2>

          <div className={styles.role}>
            <div className={styles.roleHeading}>
              <div>
                <h3>Carvana</h3>
                <p>Senior Software Engineer II</p>
              </div>
              <p className={styles.meta}>2020–Present · Remote</p>
            </div>

            <div className={styles.assignment}>
              <h4>LLM Platform: Conversational AI</h4>
              <p className={styles.assignmentMeta}>
                Jun 2026–Present · Python, FastAPI, FastMCP, Kubernetes, Datadog
              </p>
              <ul>
                <li>
                  Cut retrieval latency for live agents by 65% with identical
                  answers, making knowledge search fast enough for real-time
                  voice conversations.
                </li>
                <li>
                  Built priority-aware context preloading, so agents have what
                  they need before they ask without background work slowing live
                  conversations.
                </li>
                <li>
                  Made agent tool routing measurable, so changes to tools,
                  prompts, or models can be scored before they reach customers.
                </li>
                <li>
                  Traced runaway token usage to its real source and measured
                  before cutting, keeping cost work focused on real waste.
                </li>
                <li>
                  Recovered failed agent tool calls automatically with argument
                  repair that acts only when the fix is provable.
                </li>
                <li>
                  Halved the error rate of a document-processing service by
                  adding a second provider behind a fast hedge, with rollback in
                  about a minute.
                </li>
                <li>
                  Found failures that raised no errors, and rebuilt latency
                  alerting by backtesting it against real incidents.
                </li>
                <li>
                  Diagnosed incidents across service boundaries, tracing root
                  causes beyond the team&apos;s own services and heading off
                  unnecessary redeploys.
                </li>
                <li>
                  Ran a controlled model-migration experiment and caught a flaw
                  that would have invalidated its results.
                </li>
              </ul>
            </div>

            <div className={styles.assignment}>
              <h4>Verifications &amp; Underwriting</h4>
              <p className={styles.assignmentMeta}>
                2020–Jun 2026 · .NET, Azure, Kafka, Kubernetes
              </p>
              <ul>
                <li>
                  Founded the team&apos;s first MCP server and agent
                  orchestrator, the foundation for its later agent work.
                </li>
                <li>
                  Started the company&apos;s first Claude Code plugin
                  marketplace and introduced techniques for reasoning over
                  sources larger than a model&apos;s context window.
                </li>
                <li>
                  Built an autonomous delivery pipeline that turns work requests
                  into reviewable commits.
                </li>
                <li>
                  Architected a fraud-analysis service from spike to production,
                  with decision records, architecture diagrams, and runbooks
                  designed for sixfold growth.
                </li>
                <li>
                  Led the team&apos;s first move to secretless workload identity
                  and wrote the playbook for the services that followed.
                </li>
                <li>
                  Cut a customer-advocate document task by more than 80%, and
                  delivered an OCR proof of concept in three days.
                </li>
                <li>Reduced a service&apos;s memory use by more than 80%.</li>
                <li>
                  Set standards others build on through architecture decision
                  records, coding standards, and root-cause analyses.
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.role}>
            <div className={styles.roleHeading}>
              <div>
                <h3>
                  CoStar Group <span>(formerly STR)</span>
                </h3>
                <p>Software Engineer</p>
              </div>
              <p className={styles.meta}>2015–2020</p>
            </div>
            <ul>
              <li>
                Served as technical lead for Instant Insights, decomposing
                monolithic services into reusable .NET microservices and
                building a React and Redux analytics experience.
              </li>
              <li>
                Joined a three-person team integrating STR&apos;s global
                hospitality data into CoStar Suite, a product serving more than
                one million daily searches.
              </li>
              <li>
                Built a report-generation platform with AWS Lambda and Step
                Functions, plus reusable translation and currency-conversion
                modules.
              </li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Writing &amp; Open Source</h2>
          <div className={styles.features}>
            <div>
              <h3>
                <ExternalLink href="https://williambratz.com/blog">
                  WilliamBratz.com
                </ExternalLink>
              </h3>
              <p>
                Ten essays on context engineering, production AI, and
                engineering practice, including “Testing the Vault&apos;s
                Value,” “When the Map Starts Learning,” and “Programming as
                Theory Building.”
              </p>
            </div>
            <div>
              <h3>vaultkit</h3>
              <p>
                An LLM-maintained knowledge engine that gives coding agents
                domain context. I replayed 12 real work requests blind with and
                without it, and accepted Opus changes went from 11 to 16 of 24,
                a small sample. The reusable{" "}
                <ExternalLink href="https://github.com/wbratz/vault-scaffold">
                  vault-scaffold workflow
                </ExternalLink>{" "}
                is on GitHub and in use by other teams.
              </p>
            </div>
            <div>
              <h3>
                <ExternalLink href="https://github.com/wbratz/billys-ai-skills">
                  Billy&apos;s AI Skills
                </ExternalLink>
              </h3>
              <p>
                Plugins that let Claude Code and OpenAI Codex reason over
                sources far larger than their context window, with budgets, dry
                runs, and a public demo.
              </p>
            </div>
            <div>
              <h3>
                <ExternalLink href="https://github.com/wbratz/hugo-slack-bot">
                  Hugo
                </ExternalLink>
              </h3>
              <p>
                A self-hosted Slack reading assistant that curates technical RSS
                feeds with Claude, summarizes URLs and threads on demand, and
                delivers a configurable daily digest.
              </p>
            </div>
            <div>
              <h3>Independent products and open source</h3>
              <p>
                Built{" "}
                <ExternalLink href="https://neverendingstorypointer.com">
                  Neverending Story Pointer
                </ExternalLink>
                , a free real-time estimation app, and{" "}
                <ExternalLink href="https://howuniqueisaguid.com">
                  How Unique Is a GUID?
                </ExternalLink>
                , an interactive probability experience also available for
                UUIDs. Contributions to RestSharp and NUnit.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Technical Skills</h2>
          <dl className={styles.skills}>
            <div>
              <dt>Languages</dt>
              <dd>Python, C#, TypeScript, JavaScript, SQL, GraphQL</dd>
            </div>
            <div>
              <dt>AI &amp; agents</dt>
              <dd>
                Agent orchestration, MCP server/client/gateway federation,
                FastMCP, OpenAI and Anthropic APIs, PydanticAI, tool calling,
                structured output, RAG with Pinecone, prompt experiments,
                evaluations, observability, Claude plugins and skills
              </dd>
            </div>
            <div>
              <dt>Backend</dt>
              <dd>
                FastAPI, asyncio, Pydantic v2, .NET Core, REST, JSON-RPC, gRPC,
                Kafka, Azure Service Bus, event-driven systems
              </dd>
            </div>
            <div>
              <dt>Data</dt>
              <dd>
                Cosmos DB, Redis, PostgreSQL, Azure SQL, SQL Server, DynamoDB
              </dd>
            </div>
            <div>
              <dt>Platform</dt>
              <dd>
                Kubernetes (AKS/GKE), Docker, Helm, Tekton, Flux, GitHub
                Actions, Azure DevOps, Lambda, Step Functions, Workload
                Identity, OIDC
              </dd>
            </div>
            <div>
              <dt>Observability</dt>
              <dd>
                Datadog, Splunk, Prometheus, Grafana, OpenTelemetry, SLOs,
                Locust
              </dd>
            </div>
          </dl>
        </section>

        <section className={styles.section}>
          <h2>Education</h2>
          <div className={styles.education}>
            <div>
              <h3>Arizona State University</h3>
              <p>B.S. Software Engineering · In progress</p>
            </div>
            <div>
              <h3>Volunteer State Community College</h3>
              <p>A.A.S. Computer Programming · 2022</p>
              <p className={styles.subtle}>
                Phi Theta Kappa · Dean&apos;s List
              </p>
            </div>
          </div>
        </section>
      </article>
    </Layout>
  );
}
