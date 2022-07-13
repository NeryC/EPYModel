import { useContext, useEffect, useRef } from "react";
import { Context } from "../context/globalStore";
import Head from "next/head";
import Layout from "../components/Layout";
import GraphComponent from "../components/GraphComponent";

export default function Graphs2({ GRAPHS_INFO }) {
  const { state, dispatch } = useContext(Context);
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

  let description2 = `The graph shows the evolution of the proportions of positive cases that pass to be hospitalized, intensive care unit and deceased cases`
  let description1 = `The effective reproduction number, R, represents the number of new cases that is generated from a positive case, according to cases reported by the Ministry of Public Health and Social Welfare of Paraguay.
  When R = 1, each positive case infects only one more person and in this case the epidemic remains stable, observing a plateau in the number of cases.
  When R is greater than 1, each positive case infects more than one person and in this case the epidemic is expanding and increases positive cases.
  When R is less than 1, each positive case infects (on average) less than one person, and in this case the epidemic is in contraction and decreases positive cases.`

  return (
    <>
      <Head>
        <meta name="description" content="Graficos del covid en paraguay" />
        <link
          href="https://www.uaa.edu.py/cdn/images/560cb5c8fdf530a9635a95eab14b.png"
          rel="icon"
        />
      </Head>
      <Layout>
        <div className="flex flex-col p-6">
          {state.reported.data && <GraphComponent title="Projection of possible new Infected/Daily reported" graphInfo={state.reported}/>}
          {/* <GraphComponent type="reported" title="Projection of daily hospitalized patients with unlimited bed capacity"/>
          <GraphComponent type="reported" title="Projection of daily ICU hospitalized patients with unlimited bed capacity"/>
          <GraphComponent type="reported" title="Daily death projection"/>
          <GraphComponent type="reported" title="EFFECTIVE REPRODUCTION NUMBER" description={description1}/>
          <GraphComponent type="reported" title="PROPORTIONS" description={description2}/> */}
        </div>
      </Layout>
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

