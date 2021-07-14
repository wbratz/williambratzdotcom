import Link from "next/link";
import Layout from "../src/components/Layout";
import styles from "../styles/Resume.module.css";

export default function Resume() {
  return (
    <Layout>
      <div className={styles.resumeOops}>
        <div className={styles.resumeLogo}>
          <h4>Sorry, this page is not yet mobile friendly.</h4>
          <h5>One day it will be, just not TO-DAY.</h5>
          <h5>
            You can download my resume{" "}
            <Link href="/WilliamBratz-resume.pdf">
              <a>
                <u>here</u>{" "}
              </a>
            </Link>
            or you can visit my{" "}
            <Link href="http://www.linkedin.com/in/williambratz">
              <a>
                <u>LinkedIn </u>
              </a>
            </Link>
          </h5>
        </div>
      </div>
      <div className={styles.resumeContainer}>
        <div className={styles.resumeLogo}>
          <div className={styles.resumePdf}>
            <Link href="/WilliamBratz-resume.pdf">
              <a>
                <img src="https://img.icons8.com/color/48/000000/pdf.png" />
              </a>
            </Link>
          </div>
          <div className={styles.resumeName}>
            <h1>William Bratz</h1>
          </div>
          <div className={styles.resumeTitle}>
            <p>
              <Link href="mailto:WilliamBratz615@gmail.com">
                <a>Email</a>
              </Link>{" "}
              |{" "}
              <Link href="http://www.linkedin.com/in/williambratz">
                <a>LinkedIn</a>
              </Link>
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
          <div className={styles.resumeMainHeading}>
            PROFESSIONAL EXPERIENCE
          </div>
          <div className={styles.resumeMainInfo}>
            <b>Carvana</b>
          </div>
          <div className={styles.resumeMainContent}>
            Software Engineer II
            <br></br>2020 - Present
            <br></br>
            <i>
              Carvana LLC., Provides customers a unique car buying experience
              completely online and is the second largest used car retailer in
              the US.
            </i>
            <p>
              <u>UW Service</u>: Microservice that handles customer purchase
              events. Receives more than 130,000 requests/hr.
            </p>
            <ul>
              <li>
                Added additional endpoints and modules to extend functionality.
              </li>
              <li>Wrote unit tests to maintain code coverage.</li>
              <li>
                Converted service from .NET Framework 4.6.2 to .NET Core 3.1.
              </li>
              <li>
                Converted from Azure Service Fabric to Azure Kubernetes Service.
              </li>
              <li>Responsible for CICD using Azure DevOps</li>
              <li>
                Handled deployments, testing, troubleshooting in all
                environments (dev, test, uat, production).
              </li>
              <li>Encrypting connection strings to sensitive services</li>
              <li>
                Technologies used: .NET Core, nUnit, Swagger, Kubernetes, Azure,
                Serilog, Splunk, SQL Server, Git, Azure Service Bus, Docker.
              </li>
            </ul>
            <p>
              <u>VW Service</u>: Microservice responsible for handling
              verification related tasks by listening to message queues. When a
              message is received the service then logs information, transforms
              data, and starts processes specific to the received message type.
            </p>
            <ul>
              <li>
                Added additional modules and functionality including message
                queue listeners, and endpoints.
              </li>
              <li>
                Converted from Azure Service Fabric to Azure Kubernetes Service.
              </li>
              <li>
                Handled deployments, testing, troubleshooting in all
                environments (dev, test, uat, production).
              </li>
              <li>Wrote unit tests to maintain code coverage.</li>
              <li>Responsible for CICD using Azure DevOps</li>
              <li>Encrypting connection strings to sensitive services</li>
              <li>
                Technologies used: .NET Core, xUnit, Swagger, Kubernetes, Azure,
                CosmosDB, Serilog, Splunk, Azure SQL, Git, Azure Service Bus,
                Docker.
              </li>
            </ul>
            <p>
              <u>Identity Verification</u>: Microservice responsible for
              identity verification. This application works primarily with 3rd
              party APIs to verify customer identity.
            </p>
            <ul>
              <li>Added additional modules and functionality.</li>
              <li>Wrote unit tests to maintain code coverage.</li>
              <li>
                Converted from Azure Service Fabric to Azure Kubernetes Service.
              </li>
              <li>Responsible for CICD using Azure DevOps</li>
              <li>
                Handled deployments, testing, troubleshooting in all
                environments (dev, test, uat, production).
              </li>
              <li>
                Added, and set up retrieval of sensitive 3rd party credentials
                using Azure Key Vault.
              </li>
              <li>
                Technologies used: .NET Core, xUnit, Swagger, Kubernetes, Azure,
                Serilog, Splunk, Azure SQL, Git, Docker.
              </li>
            </ul>
          </div>
          <div className={styles.resumeMainInfo}>
            <b>Sunny's Light</b>
          </div>
          <div className={styles.resumeMainContent}>
            Software Engineer
            <br></br>2019 - Present
            <br></br>
            <i>
              Nonprofit providing financial support to families who have lost a
              child through stillbirth.
            </i>
            <p>
              <u>SunnysLight.org</u>: Web application home page for the Sunny’s
              Light non-profit. The web application provides information on the
              organization, ways to donate, and information to receive support.
            </p>
            <ul>
              <li>
                Designed, developed, deployed, and maintained Web application
                that gives information on the nonprofit and allows users to
                donate.
              </li>
              <li>
                Utilized React to build a responsive modern web app utilizing
                components, hooks, modals, toast messages.
              </li>
              <li>
                Developed custom stripe payment integration providing a seamless
                and secure donation process.
              </li>
              <li>
                Developed 3rd party API to handle stripe payment processing,
                receipt generation, and user logging.
              </li>
              <li>
                Integrated Google Analytics to monitor performance, and user
                patterns to make informed future decisions.
              </li>
              <li>Containerized in Docker.</li>
              <li>Managed Github repository, with stories and backlog.</li>
              <li>
                Handle 90-day certificate generation with Certbot for https.
              </li>
              <li>
                Handle setup deployment and monitoring of web app through Azure
                App Service.
              </li>
              <li>
                Technologies Used: React, Azure App Services, Github, Azure
                DevOps, C#, Docker, Azure SQL .NET Core, React-GA, React
                Parallax, React Bootstrap, Docker.
              </li>
            </ul>
          </div>
          <div className={styles.resumeMainInfo}>
            <b>CoStar Group</b>
          </div>
          <div className={styles.resumeMainContent}>
            Software Engineer II (Full Stack)
            <br></br>2015 - 2020
            <br></br>
            <i>
              CoStar Group is the leading provider of analytics for the
              commercial real estate and multifamily industries, as well as
              benchmarking data for the global hospitality industry. Their
              leading brands include Apartments.com and Loopnet.com.
            </i>
            <p>
              <u>CoStar Suite</u>: Costar’s main product, providing analytics
              and benchmarking data in the form of maps, charts, graphs, and
              reports to over 200,000 professionals performing over 1 million
              searches per day.
            </p>
            <ul>
              <li>
                Part of a 3-person team collaborating with frontend teams to
                implement integration of STR’s global, hospitality, analytics,
                and benchmarking data into CoStar Suite.
              </li>
              <li>
                Developed report generation platform using AWS Lambda and AWS
                Step Functions.
              </li>
              <li>
                Developed multiple modules for translation and currency
                conversion utilizing factory, strategy, and command design
                patterns.
              </li>
              <li>
                Integrated new benchmarking and analytic data into existing
                tables then exposed data through entity-based endpoints to serve
                front end needs.
              </li>
              <li>
                Technologies used: .NET Core, SQL Server, Microsoft TFS, AWS,
                DynamoDb
              </li>
            </ul>
            <p>
              <u>Instant Insights</u>: Provide hospitality analytic data to
              hotel managers who are responsible for more than a single hotel.
            </p>
            <ul>
              <li>Tech Lead for project.</li>
              <li>
                Designed and developed a microservice architecture using REST
                APIs in .net core to calculate and serve data based on user
                selections, as input by our front end React website.
              </li>
              <li>
                Broke apart monolithic services and combined multiple related
                services into a series of microservices that can be reused
                throughout the organization.
              </li>
              <li>
                Developed front end components including drop downs, modals,
                forms, menus, graphs, charts and tables with variable columns
                and rows.
              </li>
              <li>
                Technologies used: React, Javascript, Typescript, Redux, Chart
                JS, Swagger. Net Core, Git.
              </li>
            </ul>
            <p>
              <u>OTHER ACTIVITIES</u>
            </p>
            <ul>
              <li>
                Developed STR central landing page populated with user specific
                apps using React, .NET Core.
              </li>
              <li>
                Developed various charts and components to be used across
                multiple applications using Chart JS and React.
              </li>
              <li>Hosted .Net Core REST API development Lunch and Learn.</li>
              <li>Hosted SQL Server Lunch and Learns on various topics.</li>
            </ul>
          </div>
          <div className={styles.resumeMainHeading}>TECHNICAL SKILLS</div>
          <div className={styles.resumeMainContent}>
            <u>Platforms</u>: Windows, Ubuntu, Mac OS.
            <br></br>
            <u>Software</u>: Visual Studio, VS Code, Azure.
            <br></br>
            <u>Languages</u>: C#, T-SQL, Javascript, Typescript, Python.
            <br></br>
            <u>Technologies</u>: .NET Core, .NET Framework, React, SQL Server.
            <br></br>
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
