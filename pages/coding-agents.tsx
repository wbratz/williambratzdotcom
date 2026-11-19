import React from "react";
import ContactCallout from "../src/components/ContactCallout";
import Layout from "../src/components/Layout";
import styles from "../styles/Context.module.css";

const Arrow = () => <span aria-hidden="true">↗</span>;
const Next = () => <span aria-hidden="true">→</span>;

const results = [
  {
    setup: "Opus, no Vault",
    accepted: 11,
    bugs: "3 / 6",
    cost: "$7.79",
    minutes: "12.8",
  },
  {
    setup: "Opus + Vault",
    accepted: 16,
    bugs: "0 / 0",
    cost: "$4.12",
    minutes: "9.1",
    vault: true,
  },
  {
    setup: "Sonnet, no Vault",
    accepted: 7,
    bugs: "3 / 13",
    cost: "$4.70",
    minutes: "10.5",
  },
  {
    setup: "Sonnet + Vault",
    accepted: 8,
    bugs: "1 / 9",
    cost: "$3.31",
    minutes: "8.2",
    vault: true,
  },
];

export default function CodingAgents() {
  return (
    <Layout>
      <div className={styles.page}>
        <header className={styles.pageHero}>
          <p className={styles.eyebrow}>Context engineering · Coding agents</p>
          <h1>
            Give a coding agent your team&apos;s context, and it writes your
            team&apos;s code
          </h1>
          <p className={styles.lede}>
            Claude Code knows how to program. It doesn&apos;t know why your
            system is shaped the way it is, which decisions are settled, or
            which mistakes already hurt you. I built a knowledge layer that
            tells it, and proved the difference with blind tests on real
            tickets.
          </p>
        </header>

        <section className={styles.section} aria-labelledby="vault-title">
          <p className={styles.label}>The Vault</p>
          <h2 id="vault-title">A memory my agents and I keep together</h2>
          <div className={styles.stepGrid}>
            <article className={styles.card}>
              <h3>1 · Collect</h3>
              <p className={styles.cardBody}>
                Pull requests, design decisions, tickets, meeting notes, and
                agent sessions land as source files that are never edited.
              </p>
            </article>
            <article className={styles.card}>
              <h3>2 · Compile nightly</h3>
              <p className={styles.cardBody}>
                A model turns them into linked pages. Plain code writes the
                files and checks that every citation resolves.
              </p>
            </article>
            <article className={styles.card}>
              <h3>3 · Load the smallest map</h3>
              <p className={styles.cardBody}>
                A session starts from a short index and opens deeper pages only
                when the task needs them.
              </p>
            </article>
            <article className={styles.card}>
              <h3>4 · Rules at the edit</h3>
              <p className={styles.cardBody}>
                When an agent edits a file that a team rule covers, the rule is
                handed to it right then.
              </p>
            </article>
          </div>
          <div className={styles.statRow}>
            <p>
              <strong>97% leaner</strong> startup context: agents get a map, not
              the pages
            </p>
            <p>
              <strong>13k lines</strong> of Python, <strong>900+</strong> tests
            </p>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="proof-title">
          <p className={styles.label}>The proof</p>
          <h2 id="proof-title">
            Same tickets, same models, context on and off
          </h2>
          <p className={styles.sectionLede}>
            Each run started from the commit before the original work, with a
            snapshot of the Vault from that day and the answer removed. Blind
            judges scored every change against an answer key and 1,277 real
            review comments.
          </p>
          <div
            className={styles.tableWrap}
            role="region"
            aria-label="Results with and without the Vault"
            tabIndex={0}
          >
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Setup (24 runs each)</th>
                  <th scope="col">Accepted changes</th>
                  <th scope="col">Blocker / major bugs</th>
                  <th scope="col">$ per accepted change</th>
                  <th scope="col">Avg minutes</th>
                </tr>
              </thead>
              <tbody>
                {results.map((row) => (
                  <tr
                    key={row.setup}
                    className={row.vault ? styles.withVault : undefined}
                  >
                    <th scope="row">{row.setup}</th>
                    <td>{row.accepted}</td>
                    <td>{row.bugs}</td>
                    <td>{row.cost}</td>
                    <td>{row.minutes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.cardGrid}>
            <article className={`${styles.card} ${styles.cardPlain}`}>
              <p className={styles.cardFigure}>0 of 8 → 9 of 16</p>
              <p className={styles.cardBody}>
                Runs that pushed back on a ticket asking for a tool that already
                existed.
              </p>
            </article>
            <article className={`${styles.card} ${styles.cardPlain}`}>
              <p className={styles.cardFigure}>3.4 → 4.0</p>
              <p className={styles.cardBody}>
                Fit with the codebase, the score that moved most (out of 5,
                Opus).
              </p>
            </article>
          </div>
          <div className={styles.links}>
            <a href="/blog/proving-the-vaults-value">
              Full method and results <Next />
            </a>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="ontology-title">
          <p className={styles.label}>The ontology pipeline</p>
          <h2 id="ontology-title">
            File knowledge where it&apos;s needed, not where it was learned
          </h2>
          <p className={styles.sectionLede}>
            Knowledge tends to be filed where it was learned, so a rule learned
            on one project never reaches the other repositories it applies to. I
            solved it at the system level with the first four steps of Jessica
            Talisman&apos;s ontology pipeline.
          </p>
          <div className={styles.stepGrid}>
            <article className={styles.card}>
              <h3>1 · Vocabulary</h3>
              <p className={styles.cardBody}>
                One ID and one sourced definition per term. A concept needs two
                pages about it before it counts.
              </p>
            </article>
            <article className={styles.card}>
              <h3>2 · Metadata</h3>
              <p className={styles.cardBody}>
                Every page says what it&apos;s mainly about and, where it
                matters, when it applies. Checked on every write.
              </p>
            </article>
            <article className={styles.card}>
              <h3>3 · Taxonomy</h3>
              <p className={styles.cardBody}>
                Repositories roll up to teams and platform groups, so a rule for
                a group reaches every repository in it.
              </p>
            </article>
            <article className={styles.card}>
              <h3>4 · Thesaurus</h3>
              <p className={styles.cardBody}>
                Alternate names and known name collisions, so search finds a
                page by whatever name you use.
              </p>
            </article>
          </div>
          <div className={styles.figureRow}>
            <p className={styles.bigFigure}>
              95% <span>vs 76%</span>
            </p>
            <p>
              Agents read the right rule before their first edit, with the
              pipeline vs without, on rules filed far from the code they govern.
              Steps 5 and 6, a formal ontology and a knowledge graph, are
              skipped by design: the reader is a model reading prose.
            </p>
          </div>
        </section>

        <section
          className={`${styles.section} ${styles.split}`}
          aria-labelledby="edit-title"
        >
          <div>
            <p className={styles.label}>Rules at the edit</p>
            <h2 id="edit-title">Deliver the rule at the moment it applies</h2>
            <p className={styles.sectionLede}>
              A written rule only helps if the agent has it at the right moment.
              Each rule now arrives the moment the agent edits a file it covers,
              and agents correct course mid-edit.
            </p>
          </div>
          <div className={styles.panel}>
            <div className={styles.statGrid}>
              <div className={styles.stat}>
                <p className={styles.statValue}>0 → 6</p>
                <p className={styles.statText}>
                  of 8 implementations done to standard
                </p>
              </div>
              <div className={styles.stat}>
                <p className={styles.statValue}>0 → 5</p>
                <p className={styles.statText}>of 8 accepted as is</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="dogfood-title">
          <p className={styles.label}>Dogfooding</p>
          <h2 id="dogfood-title">I measure my own tooling the same way</h2>
          <div className={styles.projectGrid}>
            <article className={`${styles.card} ${styles.cardPlain}`}>
              <h3>What did the agent see?</h3>
              <p className={styles.cardBody}>
                A report reads my session logs back and shows what context each
                session was actually given: searches, hits, pages opened, and
                rules delivered.
              </p>
            </article>
            <article className={`${styles.card} ${styles.cardPlain}`}>
              <h3>What happened next?</h3>
              <p className={styles.cardBody}>
                Each session links to the changes it produced and to any later
                fix on the same lines, so quality is measured, not assumed.
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
          <div className={styles.links}>
            <a href="/projects/vault">
              The Vault architecture <Next />
            </a>
            <a
              href="https://github.com/wbratz/vault-scaffold"
              target="_blank"
              rel="noreferrer"
            >
              Start your own with vault-scaffold <Arrow />
            </a>
          </div>
        </section>

        <div className={styles.contact}>
          <ContactCallout
            title="Want your coding agents to write your team's code?"
            body="I'm always up for comparing notes on context for coding agents and knowledge systems that keep up."
          />
        </div>
      </div>
    </Layout>
  );
}
