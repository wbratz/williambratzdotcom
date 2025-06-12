import Link from "next/link";
import Layout from "../src/components/Layout";
import styles from "../styles/Resume.module.css";

export default function Resume() {
  return (
    <Layout>
      <div className={styles.resumeContainer}>
        <div className={styles.resumeLogo}>
          <div className={styles.resumePdf}>
            <Link href="/WilliamBratz-resume.pdf" legacyBehavior>
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
              <Link href="mailto:WilliamBratz615@gmail.com" legacyBehavior>
                <a>Email</a>
              </Link>{" "}
              |{" "}
              <Link href="http://www.linkedin.com/in/williambratz" legacyBehavior>
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
            Senior Software Engineer
            <br></br>2020 - Present
            <br></br>
            <i>
              Carvana LLC., A pioneer in the online car buying experience and the second largest used car retailer in the United States.
            </i>
            <p>
              <b>Summary</b>:{" "}
              <ul>
                <li>Played a pivotal role on the Verifications platform team, comprising seven engineers, focusing on a core domain vital for Carvana's competitive advantage.</li>
                <li>Led end-to-end project cycles from requirement gathering and solution architecture to production release and post-launch support.</li>
                <li>Specialized in designing and implementing microservices in a distributed environment, utilizing Kubernetes with three regions hosting approximately three auto-scaling pods each.</li>
                <li>Managed multiple microservices tailored to generate and verify requirements crucial for the business.</li>
                <li>Ensured smooth inter-service communication through REST API calls, Azure service bus messages/topics, and asynchronous commands in queues.</li>
                <li>Engaged with external systems via Kafka for efficient cross-domain interactions.</li>
                <li>Our primary tech stack includes Azure Kubernetes, Azure SQL, CosmosDB, Azure Service Bus, Kafka, and .NET Core.</li>
              </ul>
            </p>
            <p>
              <u>Insurance OCR</u>: Spearheaded a visionary project that stemmed from my innovative hackathon idea: using Optical Character Recognition (OCR) to process insurance documents. As the Technical Lead, I bridged the gap between business needs and technical solutions, translating high-level objectives into actionable technical tasks
            </p>
            <ul>
              <li>Conceptualized and architected a solution aligning with business objectives, thereby ensuring goal congruence.</li>
              <li>Effectively communicated the design rationale, underlying concept, and associated technical details to team members via comprehensive documentation and team meetings.</li>
              <li>Dynamically adjusted and implemented the design to accommodate evolving requirements, showcasing agility and responsiveness.</li>
              <li>Enhanced existing applications with features to support the new design, demonstrating adaptability.</li>
              <li>Performed thorough end-to-end testing to ensure robust functionality and reliability.</li>
              <li>Swiftly delivered a Proof of Concept within a tight 3-day timeframe, highlighting efficiency and rapid prototyping skills.</li>
              <li>Realized a significant decrease in verification time and achieved a remarkable less than 2% error rate, outperforming previous survey-based methods and streamlining the verification process.</li>
            </ul>
            <p>
              <u>Insurance Survey</u>: Collaborated across several Verifications engineering teams within Carvana to significantly reduce the time customer service advocates spend on insurance-related tasks. We achieved a monumental reduction, bringing the time down from over 20 minutes to under 4 minutes per instance.
            </p>
            <ul>
                <li>Conceptualized and designed a greenfield microservice, facilitating asynchronous work item generation for advocates based on events and ensuring efficient tracking to completion.</li>
                <li>Conveyed design principles and technical underpinnings to team members through meticulous documentation and team discussions.</li>
                <li>Responsive to changes, iterating on the initial design to meet evolving requirements.</li>
                <li>Augmented existing applications with necessary features, ensuring seamless integration with the new service.</li>
                <li>Conducted rigorous end-to-end testing, ensuring reliable functionality and user experience.</li>
                <li>Proactively supported other teams to meet project deadlines, exemplifying teamwork and dedication.</li>
                <li>Engaged in UI development as required, employing React and Typescript to deliver intuitive interfaces.</li>
            </ul>
            <p>
              <u>Application Right Sizing</u>: Initiative to evaluate current application resource utilization, 
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
          <b>CoStar Group</b>
          <br></br>
            Software Engineer
          <br></br>2015 - 2020
          <br></br>
          <i>
              CoStar Group is the leading provider of analytics for the
              commercial real estate and multifamily industries, as well as
              benchmarking data for the global hospitality industry. Originally
              employed by STR (Smith Travel Research), STR was acquired by
              CoStar in October of 2019. Our tech stack utilized an on-prem data
              center, with SQL Server, .NET Core, and JavaScript libraries such as React, jQuery.
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
                  <li>Spring 2022 Merit List</li>
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
                <Link href="https://github.com/wbratz/williambratzdotcom">Github repo</Link>
            </b>
            <br></br>
            Personal website to test out languages, coding paradigms, and
            general technology-related fun.
            <br></br>
            Utilized Next.js and React; deployed on Heroku with Continuous Deployment.
          </div>
          <div className={styles.resumeMainContent}>
            <b>Sunny's Light,{" "}
                <Link href="https://SunnysLight.org">SunnysLight.org</Link>
            </b>
            <br></br>
            501(c)(3) Non-profit founded by my wife and I following the
            stillbirth of our daughter Sunny.
            <br></br>
            Utilized React, .NET Core 3.1 API, Azure SQL Server database. Developed a custom stripe integration. Hosted on Azure App Services. The front end is containerized using Docker, with Continuous Deployment through Azure DevOps.
        </div>
        </div>
      </div>
    </Layout>
  );
}
