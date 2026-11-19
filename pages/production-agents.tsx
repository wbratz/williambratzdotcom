import React from "react";
import ContactCallout from "../src/components/ContactCallout";
import Layout from "../src/components/Layout";
import styles from "../styles/Context.module.css";

const Next = () => <span aria-hidden="true">→</span>;

export default function ProductionAgents() {
  return (
    <Layout>
      <div className={styles.page}>
        <header className={styles.pageHero}>
          <p className={styles.eyebrow}>
            Context engineering · Production agents
          </p>
          <h1>The right context, at the right moment, at the right cost.</h1>
          <p className={styles.lede}>
            A production agent has a few seconds and a token budget per turn.
            What it&apos;s handed, and when, decides the answer as often as the
            model does. Four levers matter.
          </p>
          <nav aria-label="On this page">
            <ul className={styles.jump}>
              <li>
                <a href="#fast">1 · Fast</a>
              </li>
              <li>
                <a href="#lean">2 · Lean</a>
              </li>
              <li>
                <a href="#right">3 · Right</a>
              </li>
              <li>
                <a href="#cheap">4 · Cheap</a>
              </li>
            </ul>
          </nav>
        </header>

        <section
          id="fast"
          className={`${styles.section} ${styles.split}`}
          aria-labelledby="fast-title"
        >
          <div>
            <p className={styles.label}>1 · Fast</p>
            <h2 id="fast-title">Context at the speed of conversation.</h2>
            <p className={styles.sectionLede}>
              A knowledge-search tool was too slow for a voice agent to use. I
              made it fast enough for live conversation without changing a
              single answer.
            </p>
            <p className={styles.sectionLede}>
              Some context can be fetched before the agent needs it. The catch
              is that background warming competes with live turns: one burst of
              it could stall unrelated live conversations. I built priority
              lanes and a cross-pod in-flight limiter, so warming waits in a
              queue instead of on the live path.
            </p>
          </div>
          <div className={styles.panel}>
            <div className={styles.statGrid}>
              <div className={styles.stat}>
                <p className={styles.statValue}>−65%</p>
                <p className={styles.statText}>latency at the median</p>
              </div>
              <div className={styles.stat}>
                <p className={styles.statValue}>−64%</p>
                <p className={styles.statText}>latency for the slowest 10%</p>
              </div>
              <div className={styles.stat}>
                <p className={styles.statValue}>−59%</p>
                <p className={styles.statText}>
                  on the first call after startup
                </p>
              </div>
              <div className={styles.stat}>
                <p className={styles.statValue}>100%</p>
                <p className={styles.statText}>identical answers</p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="lean"
          className={styles.section}
          aria-labelledby="lean-title"
        >
          <p className={styles.label}>2 · Lean</p>
          <h2 id="lean-title">Every token earns its place.</h2>
          <p className={styles.sectionLede}>
            Context bloat costs money and accuracy. Fixing it starts with
            knowing what the model actually receives, which is often not what
            anyone assumes.
          </p>
          <div className={styles.cardGrid}>
            <article className={styles.card}>
              <p className={styles.cardFigure}>99%+</p>
              <h3>Taking apart a runaway request</h3>
              <p className={styles.cardBody}>
                A chat agent ran up a huge token bill on one ordinary question,
                and the failed tool calls looked guilty. Per-call token logs and
                traces told a different story: the total was two model calls
                added together, and over 99% of the first call&apos;s context
                had arrived before any tool ran, inherited from conversation
                history. The fix belonged in the history, not the tools.
              </p>
            </article>
            <article className={styles.card}>
              <p className={styles.cardFigure}>+0%</p>
              <h3>Measure before you cut</h3>
              <p className={styles.cardBody}>
                Forwarding full output schemas to agents looked like a big token
                cost. I A/B-tested it: input tokens didn&apos;t move, because
                the agent framework keeps schemas as metadata and never sends
                them to the model. The effort went somewhere that mattered.
              </p>
            </article>
          </div>
        </section>

        <section
          id="right"
          className={styles.section}
          aria-labelledby="right-title"
        >
          <p className={styles.label}>3 · Right</p>
          <h2 id="right-title">Help the agent make the right call.</h2>
          <p className={styles.sectionLede}>
            An agent chooses tools from what the tools say about themselves.
            Most bad tool calls trace back to a tool that described itself
            badly.
          </p>
          <div className={styles.cardGrid}>
            <article className={`${styles.card} ${styles.cardPlain}`}>
              <h3>Never send a question to the wrong tool</h3>
              <p className={styles.cardBody}>
                The wrong tool means a confident, wrong answer. Every tool
                states exactly what it returns, and routing is measurable: any
                change to a tool, a prompt, or the model can be scored on
                whether questions still land in the right place, before a
                customer finds out.
              </p>
            </article>
            <article className={`${styles.card} ${styles.cardPlain}`}>
              <h3>Forgive mistakes only where provable</h3>
              <p className={styles.cardBody}>
                Agents call tools with the wrong argument names, and those calls
                simply failed. I added repair that renames an argument only when
                the mapping is provable, and about 9% of failed tool calls now
                recover on their own. It never guesses and never drops a filter,
                so a recovered call can&apos;t return the wrong answer.
              </p>
            </article>
          </div>
        </section>

        <section
          id="cheap"
          className={`${styles.section} ${styles.split}`}
          aria-labelledby="cheap-title"
        >
          <div>
            <p className={styles.label}>4 · Cheap</p>
            <h2 id="cheap-title">The right context is the cheaper context.</h2>
            <p className={styles.sectionLede}>
              Every token in context is paid for on every turn, at production
              traffic. The cheapest context is the piece the model never needed.
              The most expensive is the piece it was missing, because that
              becomes a retry, a wrong answer, or a hand-off to a person.
            </p>
          </div>
          <div className={styles.panel}>
            <p className={styles.statValue}>47% less</p>
            <p className={styles.statText}>
              Cost per accepted change when coding agents got the right context.
              Same model, same tickets.
            </p>
            <div className={styles.links}>
              <a href="/coding-agents">
                How I measured it <Next />
              </a>
            </div>
          </div>
        </section>

        <div className={styles.contact}>
          <ContactCallout
            title="Is your agent slow, bloated, or picking the wrong tools?"
            body="I'm always up for comparing notes on context engineering for production agents."
          />
        </div>
      </div>
    </Layout>
  );
}
