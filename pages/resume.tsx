import Link from "next/link";
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
            <br></br>
            C#/.NET
            <br></br> &#9733; &#9733; &#9733; &#9733; &#9733;
            <p>
              SQL Server
              <br></br> &#9733; &#9733; &#9733; &#9733; &#9733;
            </p>
            <p>
              HTML
              <br></br> &#9733; &#9733; &#9733; &#9733; &#9733;
            </p>
            <p>
              Javascript
              <br></br> &#9733; &#9733; &#9733; &#9733;
            </p>
            <p>
              React JS
              <br></br> &#9733; &#9733; &#9733; &#9733;
            </p>
            <p>
              CSS
              <br></br> &#9733; &#9733; &#9733; &#9733;
            </p>
            <p>
              Cloud Development
              <br></br> &#9733; &#9733; &#9733; &#9733;
            </p>
            <p>
              Azure
              <br></br> &#9733; &#9733; &#9733; &#9733;
            </p>
            <p>
              AWS
              <br></br> &#9733; &#9733; &#9733; &#9733;
            </p>
          </div>
        </div>
        <div className={styles.resumeMainbar}>
          <div className={styles.resumeMainHeading}>PROFILE</div>
          <div className={styles.resumeMainContent}>
            Hello! I am William Bratz, but everyone calls me Billy. I am a full
            stack developer with a specialization in middle tier and back end
            development. I have extensive experience in developing enterprise
            full stack web applications, developing a service oriented
            architecture, and have recently been lucky enough to do take on
            cloud development.
            <p></p>I am comfortable in any environment, but thrive in fast paced
            surroundings with projects that require me to learn and grow my
            skills. Learning and improving are more than goals of mine, they are
            passions.
            <p></p> Thank you and I look forward to working with you soon!
          </div>
          <div className={styles.resumeMainHeading}>EMPLOYMENT HISTORY</div>
          <div className={styles.resumeMainInfo}>STR</div>
          <div className={styles.resumeMainContent}>
            Software Engineer II (Full Stack)
            <br></br>2015 - Present
            <ul>
              <li>
                Architected and developed, web applications. Utilizing a SQL
                Server back end, C# (.NET Core) middle tier. Javascript (React,
                Typescript, JQuery), MVC, HTML, CSS front end.
              </li>
              <li>
                Hosted multiple Lunch and learns about various topics, ranging
                from SQL Server query tuning to GraphQL.
              </li>
              <li>
                Developed cloud applications using AWS Lambda, Step Functions,
                and DynamoDb.
              </li>
              <li>
                Obtained multiple company awards for outstanding performance.
              </li>
              <li>
                Active in multiple company development groups tasked with
                researching and improving company implementation of technology
                area (Architecture, C#, Front end).
              </li>
            </ul>
          </div>
          <div className={styles.resumeMainInfo}>U-Haul</div>
          <div className={styles.resumeMainContent}>
            Software Developer
            <br></br>2014 - 2015
            <ul>
              <li>
                Developed back end solutions for custom applications utilizing
                SQL Server.
              </li>
              <li>
                Tuned, wrote, architected stored procs, emphasis on tuning slow
                running or legacy code.
              </li>
              <li>
                Cube development utilizing SSAS, tabular and multidimensional.
                ETL utilizing custom in house applications as well as SSIS
                packages.
              </li>
              <li>
                SQL server admin duties, such as back ups, restores, snapshots,
                agent jobs.
              </li>
            </ul>
          </div>
          <div className={styles.resumeMainHeading}>EDUCATION</div>
          <div className={styles.resumeMainContent}>
            <b>
              Associates Degree in Applied Science, Computer Programming,
              Volunteer State
            </b>
            <br></br>
            Currently Enrolled
          </div>
          <div className={styles.resumeMainContent}>
            <b>
              University transfer program Bachelors Degree in computer science,
              AB Tech Community College
            </b>
            <br></br>
            2009 - 2011
          </div>
          <div className={styles.resumeMainHeading}>
            OPEN SOURCE CONTRIBUTIONS
          </div>
          <div className={styles.resumeMainContent}>RestSharp</div>
          <div className={styles.resumeMainContent}>NUnit</div>
          <div className={styles.resumeMainHeading}>PERSONAL PROJECTS</div>
          <div className={styles.resumeMainContent}>
            <b>
              William Bratz dot com,{" "}
              <Link href="https://github.com/wbratz/williambratzdotcom">
                Github repo
              </Link>
            </b>
            <br></br>
            Personal website to test out languages, coding paradigms, and
            general technology related fun.
            <br></br>
            Uses Next JS, React, deployed to Heroku utilizing CI/CD when merged
            to master.
          </div>
          <div className={styles.resumeMainContent}>
            <b>
              Sunny's Light,{" "}
              <Link href="https://SunnysLight.org">SunnysLight.org</Link>
            </b>
            <br></br>
            501(c)(3) Non-profit founded by my wife and I following the
            stillbirth of our daughter Sunny.
            <br></br>
            Uses React, .NET Core 3.1 Api. Azure SQL Server database. Custom
            stripe integration, 100% running in the cloud utilizing Azure App
            Services, front end is containerized using docker. CI/CD using Azure
            DevOps pipelines.
          </div>
        </div>
      </div>
    </Layout>
  );
}
