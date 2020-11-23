import react from "react";
import styles from "../../styles/Home.module.css";


export default function Header({navIsOpen, setNavIsOpen}) {

      return(
    <header className={styles.header}>
      <div className={styles.logo}>
      <img src="/headerphoto.jpg" alt="Handsome"/>
      </div>
        <div className={styles.headerRight}>
          <a href="javascript:void(0)" onClick={navIsOpen ? setNavIsOpen(false) : setNavIsOpen(true)}>Tech Stack</a>
        </div>
      </header>
      )
}