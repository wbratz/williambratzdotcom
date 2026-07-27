import Link from "next/link";
import React from "react";
import Header from "./header";
import styles from "../../styles/Home.module.css";

export default function Layout({ children }) {
  return (
    <div className={styles.site}>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>
      <Header />

      <main id="main-content" className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        <div>
          <Link href="/" legacyBehavior>
            <a className={styles.footerName}>William Bratz</a>
          </Link>
          <p>
            Production AI systems, distributed systems, and knowledge that compounds.
          </p>
        </div>
        <nav aria-label="Social and contact links">
          <a href="mailto:WilliamBratz615@gmail.com">Email</a>
          <a href="https://github.com/wbratz" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/williambratz"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a href="/rss.xml">RSS</a>
        </nav>
      </footer>
    </div>
  );
}
