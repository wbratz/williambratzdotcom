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
        <title>William “Billy” Bratz — Senior Software Engineer</title>
        <meta
          name="description"
          content="William Bratz is a senior software engineer building production LLM agent platforms and distributed systems."
        />
        <link rel="canonical" href="https://www.williambratz.com/resume" />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://www.williambratz.com/resume" />
        <meta property="og:title" content="William “Billy” Bratz — Senior Software Engineer" />
        <meta
          property="og:description"
          content="Senior software engineer building production LLM agent platforms and distributed systems."
        />
        <meta name="twitter:card" content="summary" />
      </Head>

      <article className={styles.resume}>
        <header className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Senior Software Engineer · Tri-Cities, Tennessee</p>
            <h1>William “Billy” Bratz</h1>
            <p className={styles.intro}>
              Senior software engineer with 11 years building distributed systems and,
              since late 2025, production LLM agent systems. I founded the MCP server
              and orchestrator that became my organization&apos;s LLM platform, and I
              turn difficult operational lessons into durable systems, standards, and
              writing.
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
            <ExternalLink href="https://williambratz.com">williambratz.com</ExternalLink>
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
              <h4>LLM Platform — Conversational AI</h4>
              <p className={styles.assignmentMeta}>
                Jun 2026–Present · Python, FastAPI, FastMCP, Kubernetes, Datadog
              </p>
              <ul>
                <li>
                  Operate an MCP platform serving more than 10 million weekly tool
                  calls, connecting conversational AI to production systems.
                </li>
                <li>
                  Root-caused a multi-service outage in minutes across a five-hop
                  request chain, halting a harmful redeploy and directing the recovery.
                </li>
                <li>
                  Demonstrated that an incident remained active after apparent
                  recovery because of timeout asymmetry, changing how the team
                  validates service health.
                </li>
                <li>
                  Designed and shipped a same-day in-cluster route that delivered a
                  double-digit p95 latency reduction while preserving the public path
                  as a safe fallback.
                </li>
                <li>
                  Found and corrected a CI isolation defect across 383 tests,
                  restoring zero-network unit-test guarantees.
                </li>
                <li>
                  Resolved an MCP HTTP 421 outage using APM evidence, then added a
                  dependency-host guard, pinned lockfile, monitors, and an audit of
                  sibling services.
                </li>
                <li>
                  Eliminated order-of-magnitude retry amplification and validated the
                  change under live production traffic.
                </li>
                <li>
                  Shipped three customer-context MCP tools, including the platform&apos;s
                  first MCP-to-MCP workflow, within service-level objectives.
                </li>
                <li>
                  Used production log analysis to isolate and correct a timestamp race,
                  then verified the fix under load.
                </li>
                <li>
                  Designed a split test for a model migration covering a significant
                  share of assistant traffic.
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
                  Founded an MCP server and orchestrator in December 2025—roughly 6,650
                  lines in six days, supported by a 445-line operator guide—which
                  became the foundation of the organization&apos;s LLM platform.
                </li>
                <li>
                  Built an autonomous delivery pipeline that completed 17 runs over
                  10.6 hours and produced 20 reviewable commits.
                </li>
                <li>
                  Created an internal marketplace of nine agent plugins and introduced
                  recursive language-model techniques for work beyond a model&apos;s
                  normal context window.
                </li>
                <li>
                  Designed the operating contract for a custom Claude Slack
                  integration used in production investigation and engineering
                  workflows.
                </li>
                <li>
                  Architected a fraud-analysis service with 13 ADRs, C4 diagrams, and
                  five runbooks to support a sixfold growth target.
                </li>
                <li>
                  Led a workload-identity migration spanning five shared packages and
                  more than five services; wrote the 1,000-line implementation
                  playbook used by other teams.
                </li>
                <li>
                  Reduced advocate insurance work from more than 20 minutes to under
                  four, and delivered an OCR proof of concept in three days with an
                  error rate below 2%.
                </li>
                <li>
                  Cut one service&apos;s memory ceiling from over 1.5 GB to under 243 MB,
                  reducing total memory utilization from 60–80% to below 10%.
                </li>
                <li>
                  Contributed across services to a top company rearchitecture
                  supporting co-buyers, while mentoring engineers on domain workflows
                  and dependencies.
                </li>
                <li>
                  Authored 15 architecture decisions and multiple engineering
                  standards and root-cause analyses. Opened 143 pull requests and
                  reviewed 177 across 20 repositories in 28 weeks; 58% of the work was
                  self-scoped.
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.role}>
            <div className={styles.roleHeading}>
              <div>
                <h3>CoStar Group <span>(formerly STR)</span></h3>
                <p>Software Engineer</p>
              </div>
              <p className={styles.meta}>2015–2020</p>
            </div>
            <ul>
              <li>
                Served as technical lead for Instant Insights, decomposing monolithic
                services into reusable .NET microservices and building a React and
                Redux analytics experience.
              </li>
              <li>
                Joined a three-person team integrating STR&apos;s global hospitality
                data into CoStar Suite, a product serving more than one million daily
                searches.
              </li>
              <li>
                Built a report-generation platform with AWS Lambda and Step Functions,
                plus reusable translation and currency-conversion modules.
              </li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Writing &amp; Open Source</h2>
          <div className={styles.features}>
            <div>
              <h3><ExternalLink href="https://williambratz.com/blog">WilliamBratz.com</ExternalLink></h3>
              <p>
                Eight essays on production engineering and AI systems, including
                “Production Reveals the System,” “From Chatbots to Persistent
                Organizational Memory,” and “Engineering in the Age of Agents.”
              </p>
            </div>
            <div>
              <h3>vaultkit</h3>
              <p>
                A personal, LLM-maintained knowledge engine: roughly 6,400 lines of
                Python, more than 320 tests, three scheduled maintenance cadences, and
                a scaffold adopted by four teams. The reusable{" "}
                <ExternalLink href="https://github.com/wbratz/vault-scaffold">
                  vault-scaffold workflow
                </ExternalLink>{" "}
                is available on GitHub.
              </p>
            </div>
            <div>
              <h3>Open-source contributor</h3>
              <p>
                Contributions to RestSharp and NUnit, plus Neverending Story Pointer,
                a real-time estimation app built with Blazor and gRPC streaming.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Community</h2>
          <div className={styles.roleHeading}>
            <div>
              <h3><ExternalLink href="https://sunnyslight.org">Sunny&apos;s Light Foundation</ExternalLink></h3>
              <p>Founder</p>
            </div>
            <p className={styles.meta}>2019–Present</p>
          </div>
          <p>
            Co-founded a 501(c)(3) supporting families after stillbirth. Designed,
            built, deployed, and continue to maintain its web and donation platform,
            including a custom Stripe integration and supporting .NET services.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Technical Skills</h2>
          <dl className={styles.skills}>
            <div><dt>Languages</dt><dd>Python, C#, TypeScript, JavaScript, SQL, GraphQL</dd></div>
            <div><dt>AI &amp; agents</dt><dd>Agent orchestration, MCP server/client/gateway federation, FastMCP, OpenAI and Anthropic APIs, PydanticAI, tool calling, structured output, RAG with Pinecone, prompt experiments, evaluations, observability, Claude plugins and skills</dd></div>
            <div><dt>Backend</dt><dd>FastAPI, asyncio, Pydantic v2, .NET Core, REST, JSON-RPC, gRPC, Kafka, Azure Service Bus, event-driven systems</dd></div>
            <div><dt>Data</dt><dd>Cosmos DB, Redis, PostgreSQL, Azure SQL, SQL Server, DynamoDB</dd></div>
            <div><dt>Platform</dt><dd>Kubernetes (AKS/GKE), Docker, Helm, Tekton, Flux, GitHub Actions, Azure DevOps, Lambda, Step Functions, Workload Identity, OIDC</dd></div>
            <div><dt>Observability</dt><dd>Datadog, Splunk, Prometheus, Grafana, OpenTelemetry, SLOs, Locust</dd></div>
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
              <p className={styles.subtle}>Phi Theta Kappa · Dean&apos;s List</p>
            </div>
          </div>
        </section>
      </article>
    </Layout>
  );
}
