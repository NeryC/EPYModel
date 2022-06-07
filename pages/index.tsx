import Head from "next/head";
import Layout from "../components/Layout";
import Simulation from "../components/Graph/Simulation";
import Sidebar from "../components/Sidebar";

import schc from "../public/exampleData/SCHC.json";
import vcit from "../public/exampleData/VCIT.json";
import portfolio from "../public/exampleData/portfolio.json";

const portfolioData = {
  name: "Portfolio",
  color: "#ffffff",
  items: portfolio.map((d) => ({ ...d, date: new Date(d.date) }))
};
const schcData = {
  name: "SCHC",
  color: "#d53e4f",
  items: schc.map((d) => ({ ...d, date: new Date(d.date) }))
};
const vcitData = {
  name: "VCIT",
  color: "#5e4fa2",
  items: vcit.map((d) => ({ ...d, date: new Date(d.date) }))
};

const dimensions = {
  width: 1400,
  height: 400,
  margin: {
    top: 30,
    right: 30,
    bottom: 30,
    left: 60
  }
};

export default function Home() {
  return (
    <>
      <Head>
        <title>EPYMODEL</title>
        <meta name="description" content="EPYMODEL" />
        <link
          href="https://www.uaa.edu.py/cdn/images/560cb5c8fdf530a9635a95eab14b.png"
          rel="icon"
        />
      </Head>

      <Layout>
        <div className="flex">
          <Sidebar />
          <Simulation data={[portfolioData, schcData, vcitData]}
          dimensions={dimensions}/>
        </div>
      </Layout>
    </>
  );
}
