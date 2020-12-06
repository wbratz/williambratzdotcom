import Head from "next/head";
import React, { useState } from "react";
import styles from "../../styles/Home.module.css";
import Link from "next/link";

export default function Header({ navIsOpen, setNavIsOpen }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const setNavStyle = () => {
    setMobileNavOpen(!mobileNavOpen);
  };

  return (
    <>
      <Head>
        <title>William Bratz dot com</title>
        <link rel="icon" href="/newIcon.ico" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        https://www.googletagmanager.com/gtag/js?id=UA-184834329-1'+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','UA-184834329-1');`,
          }}
        />
      </Head>
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=UA-184834329-1" height="0" width="0" style="display:none;visibility:hidden;"></iframe>`,
        }}
      />
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <Link href="/">
            <a>
              <img src="/headerphoto.jpg" alt="Handsome" />
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
          <li>
            <a
              href="javascript:void(0)"
              onClick={() => {
                navIsOpen ? setNavIsOpen(false) : setNavIsOpen(true);
              }}
            >
              TECH STACK
            </a>
          </li>
        </ul>
        <div
          className={styles.burger}
          onClick={() => {
            setNavStyle();
            console.log(mobileNavOpen);
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
