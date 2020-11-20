import Head from "next/head";
import styles from "../styles/Home.module.css";
import react, { useState } from "react";

export default function Home() {
  const [navIsOpen, setNavIsOpen] = useState(false);

  const openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.left = "250px";
    setNavIsOpen(true);
  }

  const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    setNavIsOpen(false);
  }

  return (
    <div id="main">
    <div className={styles.container}>
      <Head>
        <title>William Bratz dot com</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
      <div className={styles.logo}>
      <img src="../public/headerPhoto.jpg" alt="Handsome"/>
      </div>
        <div className={styles.headerRight}>
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
        William Bratz dot com
      </main>

      <footer className={styles.footer}>
        
      </footer>
    </div>
    </div>
  );
}
