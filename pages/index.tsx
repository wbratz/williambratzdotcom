import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>William Bratz dot com</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <div className={styles.headerRight}>
          <a href="#techStack">Tech Stack</a>
        </div>
      </header>

      <div className={styles.logo}>
      <img src="/headerPhoto.jpg" alt="Handsome"/>
      </div>

      <main className={styles.main}>
        William Bratz dot com
      </main>

      <footer className={styles.footer}>
        
      </footer>
    </div>
  );
}
