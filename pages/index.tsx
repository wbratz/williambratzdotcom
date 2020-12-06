import Layout from "../src/components/Layout";
import ReactGA from "react-ga";

export default function Home() {
  function initializeReactGA() {
    ReactGA.initialize("G-405W0LWQ6E");
    ReactGA.pageview("/homepage");
  }
  initializeReactGA();
  return <Layout>William Bratz dot com</Layout>;
}
