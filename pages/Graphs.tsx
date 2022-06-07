import { useContext, useEffect, useRef } from "react";
import { Context } from "../context/globalStore";
import Head from "next/head";
import Graph from "../components/Graph";
import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";

export default function Graphs({ GRAPHS_INFO }) {
  const { dispatch } = useContext(Context);
  const parentRef = useRef(null);
  useEffect(() => {
    dispatch({
      type: "SET_GRAPH_INFO",
      payload: {
        reported: GRAPHS_INFO.reported,
        hopitalized: GRAPHS_INFO.hopitalized,
        ICU: GRAPHS_INFO.ICU,
        deceases: GRAPHS_INFO.deceases,
      },
    });
  }, []);

  return (
    <>
      <Head>
        <meta name="description" content="Graficos del coid en paraguay" />
        <link
          href="https://www.uaa.edu.py/cdn/images/560cb5c8fdf530a9635a95eab14b.png"
          rel="icon"
        />
      </Head>
      <Layout>
        <div className="flex w-full relative">
          <Sidebar />
          <div className="w-full" ref={parentRef}>
            <Graph type="test" parentRef={parentRef}/>
          </div>
        </div>
      </Layout>

      {/* <Layout>
        {"aquita"}
      </Layout> */}
      {/* <Graph type="test" /> */}
      {/* <Graph1/>
      <Graph1/> Esta es la idea
      <Graph1/>
      <Graph1/> */}
    </>
  );
}

export async function getServerSideProps({ locale }) {
  let reported;
  let hopitalized;
  let ICU;
  let deceases;
  const baseUrl = 'http://epymodel.uaa.edu.py/';
  try {
    [reported, hopitalized, ICU, deceases] = await Promise.all([
      fetch(
        `${baseUrl}api/proyeccionR`
      ),
      fetch(
        `${baseUrl}api/proyeccionH`
      ),
      fetch(
        `${baseUrl}api/proyeccionU`
      ),
      fetch(
        `${baseUrl}api/proyeccionF`
      ),
    ]);
    reported = await reported.json();
    hopitalized = await hopitalized.json();
    ICU = await ICU.json();
    deceases = await deceases.json();
  } catch (error) {
    reported = {};
    hopitalized = {};
    ICU = {};
    deceases = {};
    console.log(error);
  }
  return {
    props: {
      GRAPHS_INFO: {
        reported: reported || [],
        hopitalized: hopitalized || [],
        ICU: ICU || [],
        deceases: deceases || []
      },
    }, // will be passed to the page component as props
  };
}

