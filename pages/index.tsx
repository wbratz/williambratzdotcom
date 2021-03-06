import Layout from "../src/components/Layout";
import styles from "../styles/index.module.css";
import Icon from "../src/components/svgs/svgWrapper";
import React, { useEffect } from "react";

export default function Home() {
  const handleScroll = () => {
    const scroll = document.querySelectorAll(".scroll");

    for (const el of scroll) {
      if (el instanceof HTMLElement) {
        var rateAmount: number = (el.dataset.rate as unknown) as number;
        var reversePoint: number = (el.dataset.reversepos as unknown) as number;

        var pos = window.pageYOffset * rateAmount;

        if (el.dataset.direction === "vertical") {
          el.style.transform = "translate3d(0px, " + pos + "px, 0px)";
        } else {
          if (pos >= reversePoint && reversePoint > 0){
            var newZero = (window.pageYOffset * -(rateAmount)) + pos + reversePoint
            var difference = pos - newZero
            
            var newPos = newZero - difference

            el.style.transform = "translate3d(" + newPos + "px, 0px, 0px)";
          }
          else if(pos <= reversePoint && reversePoint < 0) {

            var newZero = (window.pageYOffset * -(rateAmount)) - -(reversePoint)
            var newPos = newZero - -(reversePoint)

            el.style.transform = "translate3d(" + newPos + "px, 0px, 0px)";
          }
          else{
            el.style.transform = "translate3d(" + pos + "px, 0px, 0px)";
          }
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  return (
    <Layout>
      <div className={styles.parallaxSection}>
        <section>
          <ul>
            <li className="scroll" data-rate="-4" data-direction="vertical">
              William{" "}
            </li>
            <li className="scroll" data-rate="-2" data-direction="horizontal">
              Bratz{" "}
            </li>
            <li className="scroll" data-rate="2" data-direction="vertical">
              dot{" "}
            </li>
            <li className="scroll" data-rate="4" data-direction="horizontal">
              com{" "}
            </li>
          </ul>
        </section>
      </div>
      <div className={styles.outerContainer}>
        <div className={styles.innerContainer}>
          <div className={styles.langbox}>
            <div className="scroll" data-rate=".9" data-direction="horizontal" data-reversepos="395">
              <Icon icon="Nextjs" />
            </div>
          </div>
          <div className={styles.langbox}>
            <div className="scroll" data-rate=".9" data-direction="horizontal" data-reversepos="395">
              <Icon icon="React" color="#61DAFB" />
            </div>
          </div>
          <div className={styles.langbox}>
            <div className="scroll" data-rate=".9" data-direction="horizontal" data-reversepos="395">
              <Icon icon="Typescript" color="#007acc" />
            </div>
          </div>
        </div>
        <div className={styles.innerContainer}>
          <div className={styles.langboxRight}>
            <div className="scroll" data-rate="-.9" data-direction="horizontal" data-reversepos="-395">
              <svg viewBox="0 0 130 130">
                <path
                  fill="#1572B6"
                  d="M18.814 114.123l-10.054-112.771h110.48l-10.064 112.754-45.243 12.543-45.119-12.526z"
                ></path>
                <path
                  fill="#33A9DC"
                  d="M64.001 117.062l36.559-10.136 8.601-96.354h-45.16v106.49z"
                ></path>
                <path
                  fill="#fff"
                  d="M64.001 51.429h18.302l1.264-14.163h-19.566v-13.831h34.681999999999995l-.332 3.711-3.4 38.114h-30.95v-13.831z"
                ></path>
                <path
                  fill="#EBEBEB"
                  d="M64.083 87.349l-.061.018-15.403-4.159-.985-11.031h-13.882l1.937 21.717 28.331 7.863.063-.018v-14.39z"
                ></path>
                <path
                  fill="#fff"
                  d="M81.127 64.675l-1.666 18.522-15.426 4.164v14.39l28.354-7.858.208-2.337 2.406-26.881h-13.876z"
                ></path>
                <path
                  fill="#EBEBEB"
                  d="M64.048 23.435v13.831000000000001h-33.407999999999994l-.277-3.108-.63-7.012-.331-3.711h34.646zM64.001 51.431v13.831000000000001h-15.209l-.277-3.108-.631-7.012-.33-3.711h16.447z"
                ></path>
              </svg>
            </div>
          </div>
          <div className={styles.langboxRight}>
            <div className="scroll" data-rate="-.9" data-direction="horizontal" data-reversepos="-395">
              <Icon icon="Heroku" color="#6762A6" />
            </div>
          </div>
          <div className={styles.langboxRight}>
            <div className="scroll" data-rate="-.9" data-direction="horizontal" data-reversepos="-395">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="26 -29 256 186.355"
                width="64"
                height="46"
              >
                <linearGradient
                  id="A"
                  gradientUnits="userSpaceOnUse"
                  x1="103.253"
                  y1="39.101"
                  x2="119.015"
                  y2="39.101"
                >
                  <stop offset="0" stopColor="#e96f0b" />
                  <stop offset="1" stopColor="#f37901" />
                </linearGradient>
                <g fill="#757575">
                  <path d="M158.217 127.973l4.353 11.426h-8.434l4.08-11.426zm-1.632-3.8l-9.522 25.03h3.537l2.448-6.8h10.6l2.448 6.8h3.537l-9.522-25.03h-3.537zm51.417 25.03h3.265v-25.03h-3.265v25.03zm-33.462-14.7c1.088-1.632 3.265-2.993 5.44-2.993 4.353 0 6.53 2.993 6.53 7.345v10.6h-3.265V139.4c0-3.537-1.904-4.897-4.353-4.897-2.72 0-4.625 2.72-4.625 5.17v9.522h-3.265v-17.4h3.265l.272 2.72zm14.7 9.52c0-3.8 3.537-5.985 7.617-5.985 2.448 0 4.08.544 4.625 1.088v-.544c0-2.72-2.176-4.08-4.353-4.08-1.904 0-3.537.816-4.08 2.448l-2.993-1.36c.544-1.632 2.72-4.08 7.073-4.08 4.08 0 7.617 2.448 7.617 7.345v10.338h-2.993v-2.448h-.272c-.816 1.36-2.72 2.993-5.713 2.993-3.537 0-6.53-2.176-6.53-5.713m12.242-2.176s-1.36-1.088-4.08-1.088c-3.265 0-4.625 1.904-4.625 3.265 0 1.904 1.904 2.72 3.537 2.72 2.448 0 5.17-2.176 5.17-4.897" />
                  <path
                    d="M215.892 156.8l3.8-8.978-6.8-15.78h3.265l5.17 11.97 5.17-11.97h3.265l-10.6 24.757h-3.265zm47.88-19.043c-.816-2.176-2.72-3.537-4.625-3.537-2.72 0-5.17 2.448-5.17 5.985s2.448 5.985 5.17 5.985c1.904 0 3.8-1.36 4.625-3.265l2.72 1.632c-1.36 2.993-4.08 4.897-7.345 4.897-4.625 0-8.434-4.08-8.434-9.25 0-5.44 3.8-9.25 8.434-9.25 3.265 0 5.985 1.904 7.345 4.897l-2.72 1.904z"
                    fillRule="evenodd"
                  />
                  <path d="M275.47 149.738c4.353 0 6.53-2.448 6.53-5.44 0-6.53-9.522-4.08-9.522-7.9 0-1.36 1.088-2.176 2.993-2.176s3.8.816 4.625 2.176l1.904-1.904c-1.088-1.36-4.08-3.265-6.8-3.265-4.08 0-6.257 2.448-6.257 5.44 0 6.257 9.794 4.08 9.794 7.345 0 1.632-1.088 2.72-3.265 2.72s-3.265-1.36-4.353-2.72l-2.448 1.904c1.632 1.632 4.08 3.8 6.8 3.8zm-31.013-.545h3.265v-17.4h-3.265v17.4z" />
                  <path
                    d="M245.817 123.35c1.36 0 2.176 1.088 2.176 2.176 0 1.36-1.088 2.176-2.176 2.176s-2.176-1.088-2.176-2.176 1.088-2.176 2.176-2.176zm-4.625 23.123l.544 2.448h-3.265c-2.993 0-4.353-2.176-4.353-5.44v-8.434h-3.265v-3.265h3.265v-5.17h3.265v5.17h3.8v3.265h-3.8v8.978c0 2.448 1.904 2.448 3.8 2.448z"
                    fillRule="evenodd"
                  />
                  <path d="M40.7 134.23v4.08h9.522c-.272 2.176-1.088 3.8-2.176 4.897-1.36 1.36-3.537 2.993-7.345 2.993-5.713 0-10.338-4.625-10.338-10.6 0-5.713 4.625-10.6 10.338-10.6 3.265 0 5.44 1.36 7.073 2.72l2.72-2.72c-2.448-2.176-5.44-4.08-9.794-4.08-7.9 0-14.7 6.53-14.7 14.42s6.8 14.42 14.7 14.42c4.353 0 7.617-1.36 10.066-4.08 2.72-2.72 3.537-6.257 3.537-9.25 0-.816 0-1.904-.272-2.448H40.7zm24.213-3.264c-5.17 0-9.25 3.8-9.25 9.25s4.08 9.25 9.25 9.25a9.17 9.17 0 0 0 9.25-9.25c0-5.44-4.08-9.25-9.25-9.25zm0 14.963c-2.72 0-5.17-2.448-5.17-5.713s2.448-5.713 5.17-5.713 5.17 2.176 5.17 5.713-2.448 5.713-5.17 5.713zm44.607-13.06c-1.088-1.088-2.72-2.176-5.17-2.176-4.625 0-8.706 4.08-8.706 9.25s4.08 9.25 8.706 9.25c2.176 0 4.08-1.088 4.897-2.176h.272v1.36c0 3.537-1.904 5.44-4.897 5.44-2.448 0-4.08-1.904-4.625-3.265l-3.537 1.36c1.088 2.448 3.8 5.44 8.162 5.44 4.897 0 8.978-2.72 8.978-9.794V130.7h-3.8v2.176zm-4.625 13.058c-2.72 0-4.897-2.448-4.897-5.713s2.176-5.713 4.897-5.713 4.897 2.448 4.897 5.713-2.176 5.713-4.897 5.713zm-19.86-14.962c-5.17 0-9.25 3.8-9.25 9.25s4.08 9.25 9.25 9.25a9.17 9.17 0 0 0 9.25-9.25c.272-5.44-4.08-9.25-9.25-9.25zm0 14.963c-2.72 0-5.17-2.448-5.17-5.713s2.448-5.713 5.17-5.713 5.17 2.176 5.17 5.713-2.448 5.713-5.17 5.713zm31.558-24.756h4.08v28.293h-4.08v-28.293zm15.235 24.758c-2.176 0-3.537-1.088-4.625-2.72l12.514-5.17-.544-1.088c-.816-2.176-3.265-5.985-7.9-5.985-4.897 0-8.706 3.8-8.706 9.25a9.17 9.17 0 0 0 9.25 9.25c4.353 0 6.8-2.72 7.9-4.08l-3.265-2.176c-1.088 1.632-2.448 2.72-4.625 2.72zm-.272-11.426c1.632 0 2.993.816 3.537 2.176l-8.434 3.537c0-4.08 2.72-5.713 4.897-5.713z" />
                </g>
                <g fillRule="evenodd">
                  <path
                    d="M148.15 96.688h-46.52c-5.713 0-10.338-4.625-10.338-10.338V64.04c0-5.713 4.625-10.338 10.338-10.338h29.382V21.057c0-5.713 4.625-10.338 10.338-10.338h32.646v85.696H148.15z"
                    fill="#ffc517"
                  />
                  <path
                    d="M206.642 96.688h-32.646v-115.35c0-5.713 4.625-10.338 10.338-10.338h22.308c5.713 0 10.338 4.625 10.338 10.338V86.35c-.272 5.713-4.897 10.338-10.338 10.338z"
                    fill="#f57e02"
                  />
                  <path
                    d="M119 39.1v12a3.8 3.8 0 0 1-3.8 3.8h-12V23.3L119 39.1z"
                    fill="url(#A)"
                    transform="matrix(2.72051 0 0 2.72051 -107.03294 -52.668438)"
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <section></section>
      <h1 className="scroll" data-rate="-.6" data-direction="vertical">
        Built With
      </h1>
    </Layout>
  );
}
