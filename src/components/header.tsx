import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";

const navigation = [
  { href: "/#about", label: "About", match: "/" },
  { href: "/blog", label: "Writing", match: "/blog" },
  { href: "/#projects", label: "Projects", match: "/projects" },
  { href: "/resume", label: "Résumé", match: "/resume" },
];

export default function Header() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [router.asPath]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  const isActive = (match: string) =>
    match === "/"
      ? router.pathname === "/"
      : router.pathname === match || router.pathname.startsWith(`${match}/`);

  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

  return (
    <>
      <Head>
        <title>William Bratz — Production AI &amp; Distributed Systems</title>
        <link rel="icon" href="/newIcon.ico" />
        <meta
          name="description"
          content="William Bratz builds production AI systems, MCP infrastructure, distributed systems, and durable organizational knowledge."
        />
      </Head>

      <header className={styles.siteHeader}>
        <nav className={styles.nav} aria-label="Primary navigation">
          <Link href="/" legacyBehavior>
            <a className={styles.wordmark} aria-label="William Bratz, home">
              <span aria-hidden="true">WB</span>
              <span>William Bratz</span>
            </a>
          </Link>

          <div
            id="primary-navigation"
            className={`${styles.navPanel} ${menuOpen ? styles.navPanelOpen : ""}`}
          >
            <ul className={styles.navLinks}>
              {navigation.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} legacyBehavior>
                    <a
                      className={isActive(item.match) ? styles.activeLink : undefined}
                      aria-current={isActive(item.match) ? "page" : undefined}
                    >
                      {item.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.navActions}>
            <button
              type="button"
              className={styles.themeToggle}
              onClick={() => setTheme(nextTheme)}
              aria-label={`Switch to ${nextTheme} theme`}
              title={`Switch to ${nextTheme} theme`}
            >
              {resolvedTheme === "dark" ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.4 15.2A8.5 8.5 0 0 1 8.8 3.6 8.5 8.5 0 1 0 20.4 15.2Z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              className={styles.menuButton}
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="primary-navigation"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}
