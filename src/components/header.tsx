import Head from "next/head";
import React, { useState } from "react";
import styles from "../../styles/Home.module.css";
import Link from "next/link";
import ReactGA from "react-ga";

export default function Header({ navIsOpen, setNavIsOpen }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const setNavStyle = () => {
    setMobileNavOpen(!mobileNavOpen);
  };

  ReactGA.initialize("UA-184834329-1", {
    gaOptions: {
      siteSpeedSampleRate: 100,
    },
  });

  const fireEvent = (eventName: string, eventMessage: string) => {
    ReactGA.event({
      category: "User",
      action: eventMessage,
    });
  };
  return (
    <>
      <Head>
        <title>William Bratz dot com</title>
        <link rel="icon" href="/newIcon.ico" />
        <meta
          name="description"
          content="William Bratz dot com, personal website for William Bratz, Software Engineer. Currently hosting a technology blog, but is the home for whatever idea comes to my mind at any given time."
        ></meta>
      </Head>

      <nav className={styles.nav}>
        <div className={styles.logo}>
          <Link href="/">
            <a>
              <img
                src="/headerphoto.jpg"
                alt="Handsome"
                onClick={() => fireEvent("", "Handsome man clicked")}
              />
            </a>
          </Link>
        </div>
        <ul className={mobileNavOpen ? styles.navActive : styles.navLinks}>
          <li>
            <Link href="../blog">
              <a>BLOG</a>
            </Link>
          </li>
          <li>
            <Link href="../resume">
              <a>RESUME</a>
            </Link>
          </li>
        </ul>
        <div
          className={styles.burger}
          onClick={() => {
            navIsOpen ? setNavIsOpen(false) : setNavIsOpen(true);
          }}
        >
          <div className={styles.line1}></div>
          <div className={styles.line2}></div>
          <div className={styles.line3}></div>
        </div>
      </nav>
    </>
  );
}
