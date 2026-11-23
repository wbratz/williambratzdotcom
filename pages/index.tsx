import React from "react";
import ContactCallout from "../src/components/ContactCallout";
import Layout from "../src/components/Layout";
import styles from "../styles/Context.module.css";

type HomeProps = {
  featuredPosts: PostSummary[];
};

type PostSummary = {
  title: string;
  slug: string;
  date: string;
  description: string;
};

const Arrow = () => <span aria-hidden="true">↗</span>;
const Next = () => <span aria-hidden="true">→</span>;

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));

const problems = [
  {
    name: "Too slow",
    problem: "Context arrives after the user stopped waiting",
    fix: "Have it ready before it’s asked for",
    body: "I predict the context an agent will need and load it ahead of time, with priority lanes so background loading can’t crowd out a live conversation.",
    receipt: "−65% retrieval latency · identical answers",
  },
  {
    name: "Too much",
    problem: "Bloat buries the signal and burns money",
    fix: "Trace every token to its source",
    body: "I find out what the model actually receives before cutting anything, so the savings come from real waste instead of guesses.",
    receipt: "99%+ of a runaway request traced to one cause",
  },
  {
    name: "Wrong",
    problem: "The agent sends the question to the wrong tool",
    fix: "Route questions to the right tool",
    body: "A wrong tool can produce a plausible, wrong answer. I make routing measurable, so changes to a tool, prompt, or model can be checked against example questions before a customer finds the mistake.",
    receipt: "routing measurable across every tool",
  },
  {
    name: "Missing",
    problem: "The one rule or past decision that would have changed the answer",
    fix: "Deliver knowledge at the moment it applies",
    body: "A memory layer that files every rule where it’s needed and hands it to the agent the instant it touches the code that rule covers.",
    receipt: "right rule read first · 95% of runs",
  },
];

export default function Home({ featuredPosts }: HomeProps) {
  return (
    <Layout>
      <div className={styles.page}>
        <section className={styles.hero} aria-labelledby="home-title">
          <div>
            <p className={styles.kicker}>
              Context engineering for production and coding agents
            </p>
            <h1 id="home-title">
              Stop teaching your agents{" "}
              <span className={styles.accent}>the same thing twice.</span>
            </h1>
            <p className={styles.promise}>
              I build context systems that remember what you learn, bring it to
              agents when it matters, and test whether it helps.
            </p>
            <p className={styles.intro}>
              I&apos;m William “Billy” Bratz, a senior software engineer focused
              on context engineering: what production agents are handed when
              they answer, and what coding agents know when they write code.
            </p>
            <div className={styles.actions}>
              <a className={styles.primaryAction} href="#proof">
                See the proof
              </a>
              <a
                className={styles.secondaryAction}
                href="/blog/proving-the-vaults-value"
              >
                Proving the Vault&apos;s value
              </a>
            </div>
          </div>

          <figure className={styles.trace}>
            <div
              className={styles.traceWindow}
              role="img"
              aria-label="Illustrative coding agent session. The work request asks for an 8 second timeout in prod. The agent starts editing config/prod.json, the Vault hands it the rule that prod values live in the config service, the agent reverts that edit, reads the setting from the config service instead, and the tests pass. The change is accepted with no blocker or major bugs."
            >
              <div className={styles.traceBar} aria-hidden="true">
                <span>claude code · session</span>
                <span>illustrative</span>
              </div>
              <div className={styles.traceBody} aria-hidden="true">
                <p className={styles.traceLine}>
                  <span>request</span>
                  <span>Use an 8s timeout for the payments client in prod</span>
                </p>
                <p className={styles.traceLine}>
                  <span>vault</span>
                  <span>map loaded · 2 decisions, 1 runbook</span>
                </p>
                <p className={styles.traceLine}>
                  <span>edit</span>
                  <span>config/prod.json</span>
                </p>
                <p className={styles.traceRule}>
                  <span>rule · arrives at the edit</span>
                  Prod values live in the config service. Don&apos;t hard-code
                  them in prod.json.
                </p>
                <p className={styles.traceLine}>
                  <span>edit</span>
                  <span>reverted config/prod.json</span>
                </p>
                <p className={styles.traceLine}>
                  <span>edit</span>
                  <span>settings/payments.py → reads PAYMENTS_TIMEOUT</span>
                </p>
                <p className={styles.traceLine}>
                  <span>tests</span>
                  <span className={styles.traceDone}>48 passed</span>
                </p>
              </div>
              <div className={styles.traceFoot} aria-hidden="true">
                <span>review · accepted as is</span>
                <span>0 blocker or major bugs</span>
              </div>
            </div>
            <figcaption>
              The rule reaches the agent the moment it opens the file it
              governs, and it corrects course before anything ships.
            </figcaption>
          </figure>
        </section>

        <section
          id="proof"
          className={styles.proof}
          aria-labelledby="proof-title"
        >
          <h2 id="proof-title" className={styles.label}>
            Measured, not claimed
          </h2>
          <div className={styles.statGrid}>
            <div className={styles.stat}>
              <p className={styles.statValue}>−65%</p>
              <p className={styles.statText}>
                Retrieval latency for a{" "}
                <span className={styles.highlight}>live agent</span>, with 100%
                identical answers.
              </p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statValue}>47% less</p>
              <p className={styles.statText}>
                Cost per accepted change in the{" "}
                <span className={styles.highlight}>Opus study runs</span> with
                domain context: $7.79 down to $4.12.
              </p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statValue}>9 → 0</p>
              <p className={styles.statText}>
                Blocker and major bugs in the{" "}
                <span className={styles.highlight}>Opus study runs</span>,
                without vs with domain context.
              </p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statValue}>0 → 6 of 8</p>
              <p className={styles.statText}>
                <span className={styles.highlight}>Coding agent</span>{" "}
                implementations done to our coding standards. Each rule pops up
                the moment the agent starts editing a file it applies to.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="problem-title">
          <p className={styles.label}>The problem</p>
          <h2 id="problem-title">
            Four ways agents lose the context they need
          </h2>
          <p className={styles.sectionLede}>
            A capable model can still struggle when context arrives too late,
            arrives in excess, points to the wrong tool, or omits a decisive
            fact. Each failure suggests a different engineering fix.
          </p>
          <ul className={styles.problemList}>
            {problems.map((item) => (
              <li key={item.name}>
                <div>
                  <p className={styles.cardTag}>{item.name}</p>
                  <p className={styles.cardProblem}>{item.problem}</p>
                </div>
                <div>
                  <h3>{item.fix}</h3>
                  <p className={styles.cardBody}>{item.body}</p>
                </div>
                <p className={styles.cardProof}>{item.receipt}</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          className={`${styles.section} ${styles.split}`}
          aria-labelledby="production-title"
        >
          <div>
            <p className={styles.label}>Production agents</p>
            <h2 id="production-title">
              The right context, at the right moment, at the right cost
            </h2>
            <p className={styles.sectionLede}>
              A customer-facing agent has a few seconds and a token budget per
              turn. I&apos;m focused on the layer between the model and the
              systems it calls: how fast context arrives, how much of it the
              model carries, and how tools tell the model what they do.
            </p>
            <div className={styles.links}>
              <a href="/production-agents">
                Context for production agents <Next />
              </a>
            </div>
          </div>
          <ul className={styles.list}>
            <li>
              <p className={styles.listTitle}>Faster retrieval, same answers</p>
              <p className={styles.listBody}>
                65% faster at the median, with 100% identical output.
              </p>
            </li>
            <li>
              <p className={styles.listTitle}>Context bloat, taken apart</p>
              <p className={styles.listBody}>
                A runaway token bill turned out to be over 99% inherited
                conversation history, already there before any tool ran.
              </p>
            </li>
            <li>
              <p className={styles.listTitle}>Measure before you cut</p>
              <p className={styles.listBody}>
                Forwarding full tool schemas looked expensive. Measured: 0% more
                input tokens.
              </p>
            </li>
            <li>
              <p className={styles.listTitle}>Tools the model can read</p>
              <p className={styles.listBody}>
                Output schemas on every tool, plus example questions that test
                whether an agent picks the right one.
              </p>
            </li>
          </ul>
        </section>

        <section
          className={`${styles.section} ${styles.split}`}
          aria-labelledby="coding-title"
        >
          <div>
            <p className={styles.label}>Coding agents</p>
            <h2 id="coding-title">
              Give a coding agent your team&apos;s context, and it writes your
              team&apos;s code
            </h2>
            <p className={styles.sectionLede}>
              Claude Code can program. It doesn&apos;t know why your system is
              shaped the way it is, which decisions are settled, or which
              mistakes already hurt you. I built The Vault to tell it, and
              tested the difference with blind replays of real engineering work.
            </p>
            <ul className={styles.bulletList}>
              <li>
                Agents with the Vault push back on work requests that ask for
                something that already exists. Without it, none did.
              </li>
              <li>
                An ontology layer files each rule where it applies. Agents read
                the right rule before their first edit 95% of the time, vs 76%
                without it.
              </li>
            </ul>
            <div className={styles.links}>
              <a href="/coding-agents">
                Context for coding agents <Next />
              </a>
              <a href="/blog/proving-the-vaults-value">
                Proving the Vault&apos;s value <Next />
              </a>
            </div>
          </div>
          <div className={styles.panel}>
            <p className={styles.panelLabel}>
              Opus runs: with the Vault vs without
            </p>
            <div className={styles.statGrid}>
              <div className={styles.stat}>
                <p className={styles.statValue}>+45%</p>
                <p className={styles.statText}>accepted changes</p>
              </div>
              <div className={styles.stat}>
                <p className={styles.statValue}>Zero</p>
                <p className={styles.statText}>blocker or major bugs</p>
              </div>
              <div className={styles.stat}>
                <p className={styles.statValue}>−47%</p>
                <p className={styles.statText}>cost per accepted change</p>
              </div>
              <div className={styles.stat}>
                <p className={styles.statValue}>−29%</p>
                <p className={styles.statText}>time per change</p>
              </div>
            </div>
            <p className={styles.note}>
              Same model, same real work requests, blind judges.
            </p>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="dogfooding-title">
          <p className={styles.label}>Dogfooding</p>
          <h2 id="dogfooding-title">
            I use AI to make AI better, and I check its work
          </h2>
          <div className={styles.cardGrid}>
            <article className={`${styles.card} ${styles.cardPlain}`}>
              <h3>Agents review agent code</h3>
              <p className={styles.cardBody}>
                Every change I push gets two fresh AI reviewers, never a fork of
                my own session, because a fork already agrees with me.
              </p>
            </article>
            <article className={`${styles.card} ${styles.cardPlain}`}>
              <h3>Blind judges, real review standards</h3>
              <p className={styles.cardBody}>
                My A/B tests grade agent PRs with blind model judges, scorecards
                built from 1,277 real human review comments, and two ranking
                passes in different orders.
              </p>
            </article>
            <article className={`${styles.card} ${styles.cardPlain}`}>
              <h3>The model proposes, code decides</h3>
              <p className={styles.cardBody}>
                Models extract and judge. Plain code writes the files, checks
                every citation, and overrules an “approved” verdict when the
                build is red.
              </p>
            </article>
            <article className={`${styles.card} ${styles.cardPlain}`}>
              <h3>When inefficiencies arise, test and correct</h3>
              <p className={styles.cardBody}>
                A blind test flagged a workflow step that doubled cost without
                improving results. Cutting it halved the cost.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="writing-title">
          <p className={styles.label}>Writing</p>
          <h2 id="writing-title">
            Ideas about context, with the evidence behind them
          </h2>
          <div className={styles.writingList}>
            {featuredPosts.map((post) => (
              <article key={post.slug}>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <div>
                  <h3>
                    <a href={`/blog/${post.slug}`}>{post.title}</a>
                  </h3>
                  <p>{post.description}</p>
                </div>
              </article>
            ))}
          </div>
          <div className={styles.links}>
            <a href="/blog">
              Browse all writing <Next />
            </a>
          </div>
        </section>

        <section
          id="projects"
          className={styles.section}
          aria-labelledby="projects-title"
        >
          <p className={styles.label}>Open source</p>
          <h2 id="projects-title">Context tools you can run</h2>
          <div className={styles.projectGrid}>
            <article
              className={`${styles.card} ${styles.cardBoxed} ${styles.projectFeatured}`}
            >
              <h3>The Vault</h3>
              <p className={styles.cardBody}>
                Persistent context for people and coding agents. Sources stay
                untouched, a nightly compile turns them into linked pages, and
                each agent session loads the smallest map that fits its task. A
                rule reaches the agent when it edits the file the rule governs.
              </p>
              <div className={styles.cardLinks}>
                <a href="/projects/vault">
                  How it works <Next />
                </a>
                <a
                  href="https://github.com/wbratz/vault-scaffold"
                  target="_blank"
                  rel="noreferrer"
                >
                  Scaffold your own <Arrow />
                </a>
              </div>
            </article>
            <article className={styles.card}>
              <h3>Billy&apos;s AI Skills</h3>
              <p className={styles.cardBody}>
                Recursive Language Model plugins for Claude Code and Codex. An
                agent reasons over sources far bigger than its context window by
                sending focused questions over chunks, with budgets and dry
                runs.
              </p>
              <div className={styles.cardLinks}>
                <a
                  href="https://github.com/wbratz/billys-ai-skills"
                  target="_blank"
                  rel="noreferrer"
                >
                  Run the demo <Arrow />
                </a>
              </div>
            </article>
            <article className={styles.card}>
              <h3>Hugo</h3>
              <p className={styles.cardBody}>
                Context curation for people. A Slack assistant that ranks
                technical RSS with Claude and posts a short daily digest instead
                of a firehose.
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
          <p className={styles.also}>
            Also:{" "}
            <a
              href="https://neverendingstorypointer.com"
              target="_blank"
              rel="noreferrer"
            >
              Neverending Story Pointer
            </a>
            , free planning poker, and{" "}
            <a
              href="https://howuniqueisaguid.com"
              target="_blank"
              rel="noreferrer"
            >
              How Unique Is a GUID?
            </a>
            , an interactive probability explainer.
          </p>
        </section>

        <div className={styles.contact}>
          <ContactCallout
            title="Building agents that need better context?"
            body="Ask me a question, compare notes, or invite me to talk it through with your team."
          />
        </div>
      </div>
    </Layout>
  );
}
