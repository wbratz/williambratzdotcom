import React from "react";
import styles from "../../styles/ContactCallout.module.css";

type ContactCalloutProps = {
  title?: string;
  body?: string;
};

export default function ContactCallout({
  title = "Interested in production AI, MCP, or engineering knowledge systems?",
  body = "I enjoy comparing notes with people working through the same hard problems.",
}: ContactCalloutProps) {
  return (
    <section className={styles.callout} aria-labelledby="contact-title">
      <p className={styles.eyebrow}>Let&apos;s compare notes</p>
      <h2 id="contact-title">{title}</h2>
      <p className={styles.body}>{body}</p>
      <div className={styles.links}>
        <a href="mailto:WilliamBratz615@gmail.com">
          Send me an email <span aria-hidden="true">→</span>
        </a>
        <a
          href="https://www.linkedin.com/in/williambratz"
          target="_blank"
          rel="noreferrer"
        >
          Connect on LinkedIn <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
