import Header from "./header";
import styles from "../../styles/Home.module.css";
import React, { useState, useEffect } from "react";

export default function Layout(props) {
    const [navIsOpen, setNavIsOpen] = useState(false);

    useEffect(() => {
      if(navIsOpen){
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("main").style.marginRight = "250px";
      } else {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginRight = "0";
      }
    })
  
    return (
        <div id="main" className={styles.container}>
         <Header navIsOpen={navIsOpen} setNavIsOpen={setNavIsOpen} />
  
          <div id="mySidenav" className={styles.sidenav}>
            <a href="javascript:void(0)" className={styles.closebtn} onClick={ () => {setNavIsOpen(false)}}>&times;</a>
            <a href="https://nextjs.org/">Next JS</a>
            <a href="https://reactjs.org/">React</a>
            <a href="https://heroku.com/">Heroku</a>
          </div>
        
          <main className={styles.main}>
            {props.children}
          </main>
          
          <footer className={styles.footer}>
          </footer>
        </div>  
    );
  
}