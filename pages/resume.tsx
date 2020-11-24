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
          <div className={styles.resumeInfo}>INFO</div>
          <div className={styles.resumeInfoContent}>
            107 Connie Drive
            <br></br>
            Hendersonville TN, 37075
            <p>(615) 210-9939</p>
            <p>WilliamBratz615@gmail.com</p>
          </div>
          <div className={styles.resumeInfo}>SKILLS</div>
          <div className={styles.resumeInfoContent}>
            Doin Stuff
            <br></br> &#9733; &#9733; &#9733; &#9733; &#9733;
            <p>
              Doin Other stuff
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
            Did you even see all the stuff on the left I can do!? Wild right?
          </div>
          <div className={styles.resumeMainHeading}>EMPLOYMENT HISTORY</div>
          <div className={styles.resumeMainContent}>
            Job Place Name
            <br></br>2015 - Current
            <br></br>Fancy Title
            <p>Stuff I did at this place was this.</p>
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
