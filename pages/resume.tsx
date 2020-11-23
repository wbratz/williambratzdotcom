import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState } from "react";

export default function Resume() {
  const [navIsOpen, setNavIsOpen] = useState(false);

  const openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginRight = "250px";
    setNavIsOpen(true);
  }

  const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
    setNavIsOpen(false);
  }

  return (
    <>
      <Head>
        <title>William Bratz dot com</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      
      <div id="main" className={styles.container}>
        <header className={styles.header}>
        <div className={styles.logo}>
        <a href="/"><img src="/headerphoto.jpg" alt="Handsome"/></a>
        </div>
        <div className={styles.headerRight}>
          <a href="#">Resume</a>
          <a href="javascript:void(0)" onClick={navIsOpen ? closeNav : openNav}>Tech Stack</a>
        </div>
      </header>

        <div id="mySidenav" className={styles.sidenav}>
          <a href="javascript:void(0)" className={styles.closebtn} onClick={closeNav}>&times;</a>
          <a href="https://nextjs.org/">Next JS</a>
          <a href="https://reactjs.org/">React</a>
          <a href="https://heroku.com/">Heroku</a>
        </div>
      
        <main className={styles.main}>
          Soon
        </main>
        
        <footer className={styles.footer}>
        </footer>
      </div>
    </>

  );
}
