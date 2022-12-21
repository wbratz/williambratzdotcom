import Link from "next/link";
import Layout from "../src/components/Layout";
import styles from "../styles/Resume.module.css";

export default function Resume() {
  return (
    <Layout>
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
              the United States.
            </i>
            <p>
              <b>Summary</b>:{" "}
              <i>
                Engineer within the Verifications platform, responsibilities
                include research and requirement gathering, architecting
                solutions for projects within our domain and spanning multiple
                teams, implementation, testing, documentation, releasing through
                multiple environments into production, post production support
                and monitoring. Utilizing microservice architecture with a
                nationwide distributed system in Azure spanning three regions.
                Our general tech stack is Azure Kubernetes, Azure SQL, CosmosDB,
                Azure service bus, Kafka, .net core.
              </i>
            </p>
            <p>
              <u>Insurance Survey</u>: Project spanning multiple Verifications engineering teams inside of 
              Carvana to decrease the amount of customer service advocate time spent on insurance related items. 
              Upon completion of this project time spent decreased from over 20 minutes per instance to less than 4.
            </p>
            <ul>
              <li>
                Designed greenfield microservice to handle generating advocate delivered work items asynchronously based on events, then track those work items to completion.
              </li>
              <li>
                Communicated design and concept to team members through team meetings, and documentation.              
              </li>
              <li>
                Implemented design, adjusted based on evolving requirements.              
              </li>
              <li>
                Implemented features in existing applications to support design.              
              </li>
              <li>
                End to end testing for new functionality.           
              </li>
              <li>
                Floated to other teams to help push the project over the line by the delivery date.           
              </li>
              <li>
                UI work as needed using React/Typescript.           
              </li>
            </ul>
            <p>
              <u>Insurance Survey</u>: Initiative to evaluate current application resource utilization, 
              and find ways to improve. An example of the result of the effort is memory usage in one 
              application went from over 1GB constant 1.5GB max to never going above 243MB which 
              translates to going from 60% - 80% total memory usage to less than 10%. 
              Ultimately I was able to decrease the TShirt size of most of our applications, 
              lowering our monthly running costs significantly.
            </p>
            <ul>
              <li>
                Investigated application usage over time using Grafana and Prometheus to identify normal usage, and adjust kubernetes pod resources to appropriate memory and CPU resources.              </li>
              <li>
                Provided recommendation and evidence to the team.              
              </li>
              <li>
                Implemented change.             
              </li>
              <li>
                Tracked and communicated results weekly for 60 days after release.             
              </li>
            </ul>
            <p>
              <u>Red to Green (R2G)</u>: Top company objective spanning multiple
              teams with the goal of converting red customers (customer that
              initiated the car buying process) to green (a customer who has
              completed the process) by utilizing automation to satisfy
              requirements. Saving 38,000 hours of customer service
              representative time per year. Additionally increased overall sales
              by an estimated 5% equating to $230,000,000 in additional revenue
              per year.
            </p>
            <ul>
              <li>
                Implemented microservice responsible for handling coordination
                of multi step operations related to the verification process.
              </li>
              <li>
                Collaborated across multiple teams to coordinate deployments,
                features, and design solutions.
              </li>
              <li>
                Developed fault tolerant solutions for handling multi step
                executions.
              </li>
              <li>
                Developed solutions to maximize code reuse and enforce standards
                in code.
              </li>
              <li>
                Implemented structured logging, into splunk with serilog,
                utilizing correlation Ids to track calls across multiple systems
                and context to enrich logs with useful information.
              </li>
              <li>
                Migrated microservice to Azure Kubernetes utilizing helm to
                control t-shirt size and min/max replicas and autoscaling, a
                team first.
              </li>
              <li>Created technical documentation.</li>
            </ul>
            <p>
              <u>CoBuyer</u>: Top company initiative to re-architect existing
              applications to allow customers to buy a car using a co buyer.
              Increasing sales by 7% and $613,000,000 in additional annual
              revenue.
            </p>
            <ul>
              <li>
                Researched and documented existing workflow spanning multiple
                services.
              </li>
              <li>Made design recommendations based on research.</li>
              <li>
                Assisted more junior developers in the ideation process and
                implementation.
              </li>
              <li>
                Hosted “how we work” sessions to get unfamiliar developers more
                familiar with the process and dependencies.
              </li>
              <li>
                Implemented design across multiple services within our domain.
              </li>
              <li>Updated technical documentation.</li>
              <li>Wrote unit tests to provide coverage for new code.</li>
            </ul>
            <p>
              <u>Deadline Approaching</u>: Automation of customer notification
              that the deadline to supply documentation is less than 4 hours
              away. The goal of this project was to minimize customer service
              representative calls to customers to remind them to supply
              documentation. Automating the process, saving the company
              $5,000,000 in man-hours a year.
            </p>
            <ul>
              <li>
                Researched and documented current state and dependencies to
                understand existing workflow.
              </li>
              <li>
                Architected solution to be integrated into multiple
                microservices within our domain.
              </li>
              <li>
                Collaborated with business partners and cross team engineers on
                design decisions.
              </li>
              <li>
                Tracked metrics to fine tune logic and increase cost savings.
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
            Software Engineer
            <br></br>2015 - 2020
            <br></br>
            <i>
              CoStar Group is the leading provider of analytics for the
              commercial real estate and multifamily industries, as well as
              benchmarking data for the global hospitality industry. Originally
              employed by STR (Smith Travel Research) , STR was acquired by
              CoStar in October of 2019. Our tech stack utilized an onprem data
              center, with SQL Server, .net core, Javascript (Ember, JQuery,
              React), and RabbitMQ.
            </i>
            <p>
              <u>STR Data integration</u>: With the CoStar acquisition of Smith
              Travel Research (STR) as an STR employee I was brought onto a
              CoStar team to assist in integrating STR data with CoStar Suite.
              CoStar’s primary subscription product that received over 1 million
              searches a day.
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
          </div>
          <div className={styles.resumeMainHeading}>TECHNICAL SKILLS</div>
          <div className={styles.resumeMainContent}>
            <u>Platforms</u>: Windows, Ubuntu, Mac OS.
            <br></br>
            <u>Software</u>: Visual Studio, VS Code, Azure.
            <br></br>
            <u>Languages</u>: C#, T-SQL, Javascript, Typescript, Python, Java, Go.
            <br></br>
            <u>Technologies</u>: .NET Core, .NET Framework, React, SQL Server.
            <br></br>
          </div>
          <div className={styles.resumeMainHeading}>EDUCATION</div>
          <div className={styles.resumeMainContent}>
            <b>B.S. Software Engineering, Arizona State University</b>
            <br></br>
            2022 - Present
          </div>
          <div className={styles.resumeMainContent}>
            <b>A.A.S, Computer Programming, Volunteer State</b>
            <br></br>
            2021 - 2022
            <br></br>
            <ul>
              <li>Phi Theta Kappa</li>
              <li>
                <b>
                  <Link href="https://www.volstate.edu/news/spring-2021-deans-list-and-honor-roll">
                    Spring 2021 Dean's List
                  </Link>
                </b>
              </li>
              <li>
                <b>
                  <Link href="https://www.volstate.edu/news/summer-2021-deans-list-and-honor-roll">
                    Summer 2021 Dean's List and Honor Roll
                  </Link>
                </b>
              </li>
              <li>
                <b>
                  <Link href="https://www.volstate.edu/news/fall-2021-deans-list-and-honor-roll">
                    Fall 2021 Dean's List and Honor Roll
                  </Link>
                </b>
              </li>
              <li>Sprint 2022 Merit List</li>
            </ul>
          </div>
          <div className={styles.resumeMainHeading}>
            OPEN SOURCE CONTRIBUTIONS
          </div>
          <div className={styles.resumeMainContent}>RestSharp</div>
          <div className={styles.resumeMainContent}>NUnit</div>
          <div className={styles.resumeMainHeading}>PERSONAL PROJECTS</div>
          <div className={styles.resumeMainContent}>
            <b>
              Neverending Story pointer,{" "}
              <Link href="https://neverendingstorypointer.com">
                Neverending Story Pointer
              </Link>
            </b>
            <br></br>
            Pointing Poker application to be used in agile grooming sessions.
            <br></br>
            Blazor app, utilizing GRPC streaming and HTTP2
          </div>
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
