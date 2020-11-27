import Layout from "../src/components/Layout";
import styles from "../styles/Resume.module.css";

export default function Resume() {
  return (
    <Layout>
      <div className={styles.resumeContainer}>
        <div className={styles.resumeLogo}>
          <div className={styles.resumeName}>
            <h1>William Bratz</h1>
          </div>
          <div className={styles.resumeTitle}>
            <h2>Full Stack Developer</h2>
          </div>
        </div>
        <div className={styles.resumeSidebar}>
          <div className={styles.resumeInfo}>CONTACT INFO</div>
          <div className={styles.resumeSubInfo}>ADDRESS</div>
          <div className={styles.resumeInfoContent}>
            107 Connie Drive
            <br></br>
            Hendersonville TN, 37075
          </div>
          <div className={styles.resumeSubInfo}>PHONE</div>
          <div className={styles.resumeInfoContent}>(615) 210-9939</div>
          <div className={styles.resumeSubInfo}>Email</div>
          <div className={styles.resumeInfoContent}>
            WilliamBratz615@gmail.com
          </div>
          <div className={styles.resumeInfo}>APPLICABLE SKILLS</div>
          <div className={styles.resumeInfoContent}>
            Doin Stuff
            <br></br> &#9733; &#9733; &#9733; &#9733; &#9733;
            <p>
              Payin' the bills
              <br></br> &#9733; &#9733; &#9733; &#9733; &#9733;
            </p>
            <p>
              Expert Level stuff
              <br></br> &#9733; &#9733; &#9733; &#9733; &#9733;
            </p>
            <p>
              Stuff that doesn't even exist yet
              <br></br> &#9733; &#9733; &#9733; &#9733; &#9733;
            </p>
            <p>
              That stuff too
              <br></br> &#9733; &#9733; &#9733; &#9733; &#9733;
            </p>
          </div>
        </div>
        <div className={styles.resumeMainbar}>
          <div className={styles.resumeMainHeading}>ABOUT ME</div>
          <div className={styles.resumeMainContent}>
            This will probably go away
          </div>
          <div className={styles.resumeMainHeading}>EMPLOYMENT HISTORY</div>
          <div className={styles.resumeMainInfo}>STR</div>
          <div className={styles.resumeMainContent}>
            Software Engineer II (Full Stack)
            <br></br>2015 - Present
            <p>
              Architected and developed, web applications. Utilizing a SQL
              Server back end, C# (.NET Core) in the middle tier. Javascript
              (React, Typescript, JQuery), MVC, HTML, CSS for the front end.
            </p>
            Hosted monthly department wide SQL Server learning sessions where I
            would tackle common questions about SQL Server development, and demo
            sql server query practices.
            <p>
              Hosted multiple Lunch and learns about various topics, ranging
              from SQL Server query tuning to GraphQL.
            </p>
          </div>
          <div className={styles.resumeMainHeading}>EDUCATION</div>
          <div className={styles.resumeMainContent}>
            Degree, school Place
            <br></br>
            Year Start - Year End
          </div>
          <div className={styles.resumeMainHeading}>PERSONAL PROJECTS</div>
          <div className={styles.resumeMainContent}>
            Project Name, Github repo
            <br></br>
            This thing does this because I do stuff sometimes, woop woop
          </div>
        </div>
      </div>
    </Layout>
  );
}
