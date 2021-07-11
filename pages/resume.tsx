import Link from "next/link";
import Layout from "../src/components/Layout";
import styles from "../styles/Resume.module.css";

export default function Resume() {
  return (
    <Layout>
      <div className={styles.resumeContainer}>
        <div className={styles.resumeLogo}>
          <div className={styles.resumePdf}>
            <Link href="/williambratzResume.pdf">
              <a>
                <img src="https://img.icons8.com/color/48/000000/pdf.png" />
              </a>
            </Link>
          </div>
          <div className={styles.resumeName}>
            <h1>William Bratz</h1>
          </div>
          <div className={styles.resumeTitle}>
            <h2>Full Stack Developer</h2>
          </div>
        </div>
        <div className={styles.resumeSidebar}>
          <div className={styles.resumeInfo}>CONTACT INFO</div>
          <div className={styles.resumeSubInfo}>
            <b>ADDRESS</b>
          </div>
          <div className={styles.resumeInfoContent}>
            107 Connie Drive
            <br></br>
            Hendersonville TN, 37075
          </div>
          <div className={styles.resumeSubInfo}>
            <b>PHONE</b>
          </div>
          <div className={styles.resumeInfoContent}>(615) 210-9939</div>
          <div className={styles.resumeSubInfo}>
            <b>EMAIL</b>
          </div>
          <div className={styles.resumeInfoContent}>
            WilliamBratz615@gmail.com
          </div>
          <div className={styles.resumeInfo}>APPLICABLE SKILLS</div>
          <div className={styles.resumeInfoContent}>
            <br></br>
            C#/.NET
            <br></br> &#9733; &#9733; &#9733; &#9733; &#9733;
            <p>
              React JS
              <br></br> &#9733; &#9733; &#9733; &#9733;
            </p>
            <p>
              Azure DevOps
              <br></br> &#9733; &#9733; &#9733; &#9733;
            </p>
            <p>
              Kubernetes
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
            <p>
              Docker
              <br></br> &#9733; &#9733; &#9733; &#9733;
            </p>
            <p>
              TeamCity
              <br></br> &#9733; &#9733; &#9733; &#9733;
            </p>
            <p>
              Octopus Deploy
              <br></br> &#9733; &#9733; &#9733; &#9733;
            </p>
            <p>
              SQL Server
              <br></br> &#9733; &#9733; &#9733; &#9733; &#9733;
            </p>
            <p>
              Javascript
              <br></br> &#9733; &#9733; &#9733; &#9733;
            </p>
            <p>
              HTML
              <br></br> &#9733; &#9733; &#9733; &#9733; &#9733;
            </p>
            <p>
              CSS
              <br></br> &#9733; &#9733; &#9733; &#9733;
            </p>
          </div>
        </div>
        <div className={styles.resumeMainbar}>
          <div className={styles.resumeMainHeading}>PROFILE</div>
          <div className={styles.resumeMainContent}>
            Hello! I am William Bratz, but everyone calls me Billy. I am a full
            stack developer with extensive experience in developing enterprise
            full stack web applications, microservice architecture, and cloud
            development using Azure, and AWS.
            <p></p>I am comfortable in any environment, but thrive in fast paced
            surroundings with projects that require me to learn and grow my
            skills. Learning and improving are more than goals of mine, they are
            passions.
            <p></p> Thank you and I look forward to working with you soon!
          </div>
          <div className={styles.resumeMainHeading}>EMPLOYMENT HISTORY</div>
          <div className={styles.resumeMainInfo}>Carvana</div>
          <div className={styles.resumeMainContent}>
            Software Engineer II
            <br></br>2020 - Present
            <ul>
              <p>
                At Carvana, I work with microservices deployed to Azure service
                fabric and kubernetes. One of my primary responsibilities is to
                migrate these microservices from service fabric to kubernetes.
                Some of my other responsibilities include:
              </p>
              <li>
                Develop, and deploy scalable microservices that receive over
                100,000 requests an hour.
              </li>
              <li>Utilize splunk to troubleshoot/monitor services.</li>
              <li>RESTful API development using .net core.</li>
              <li>Maintaining unit test coverage using nUnit/xUnit.</li>
              <li>Conversion of .net framework applications to .net core.</li>
              <li>Continuous Delivery (CD) using Azure DevOps</li>
              <li>Review pull requests for teammates.</li>
            </ul>
          </div>
          <div className={styles.resumeMainInfo}>STR</div>
          <div className={styles.resumeMainContent}>
            Software Engineer II (Full Stack)
            <br></br>2015 - 2020
            <ul>
              <p>
                At STR my primary role was to architect and develop web
                applications utilizing Javascript (React, Typescript), C# (.NET
                Core), and SQL Server or DynamoDB. Outside of my main job I also
                took on additional responsibilities such as:
              </p>
              <li>Team Lead for "Instant Insights Project".</li>
              <li>
                Developing cloud applications using AWS Lambda, Step Functions,
                and DynamoDb.
              </li>
              <li>
                Hosting multiple Lunch and learns for the development
                organization.
              </li>
              <li>
                Taking part in multiple company development groups tasked with
                researching and improving company implementation of technology
                area (Architecture, C#, Front end).
              </li>
              <li>
                I also obtained multiple company awards for outstanding
                performance.
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
            2021 - 2022
            <br></br>
            <b>
              <Link href="https://www.volstate.edu/news/spring-2021-deans-list-and-honor-roll">
                2021 Dean's List
              </Link>
            </b>
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
            Uses Next JS, React, deployed to Heroku with CD.
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
            stripe integration, Azure App Services, front end is containerized
            using docker. CD using Azure DevOps.
          </div>
        </div>
      </div>
    </Layout>
  );
}
