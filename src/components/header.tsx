import Head from "next/head";
import React from "react";
import styles from "../../styles/Home.module.css";
import Link from "next/link";

export default function Header({navIsOpen, setNavIsOpen}) {

      return(
        <>
        <Head>
        <title>William Bratz dot com</title>
        <link rel="icon" href="/newIcon.ico" />
         </Head>

        <header className={styles.header}>
          <div className={styles.logo}>
            <Link href="/"><a><img src="/headerphoto.jpg" alt="Handsome"/></a></Link>
          </div>
        <div className={styles.headerRight}>
          <Link href="resume"><a>Resume</a></Link>
          <a href="javascript:void(0)" onClick={ () => {navIsOpen ? setNavIsOpen(false) : setNavIsOpen(true)}}>Tech Stack</a>
        </div>
      </header>  
      </>
      )
}