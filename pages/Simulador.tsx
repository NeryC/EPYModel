import Head from "next/head";
import Layout from "../components/Layout";
import React, { useMemo } from "react";
import SimulationFilter from "../components/SimulationGraph/SimulationFilter";
import SimulationGraph from "../components/SimulationGraph";
import { axiosInstance } from "../utils";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SIM_GRAPH } from "../utils/constants";
import { TitleSection } from "../components/TitleSection";
import { useSelector } from "react-redux";
import { wrapper } from "../store/store";

import {
  selectSimulationGraphData,
  setSimulation,
} from "../store/reducers/graphInfoSlice";

/* eslint-disable @next/next/no-page-custom-font */

// Import DataPoint type from the slice
type DataPoint = {
  fecha: string;
  [key: string]: any;
};

interface SimulationData {
  cumulative: DataPoint[];
  cumulative_deaths: DataPoint[];
  exposed: DataPoint[];
  hospitalized: DataPoint[];
  immune: DataPoint[];
  infectious: DataPoint[];
  susceptible: DataPoint[];
  uci: DataPoint[];
}

const FAVICON_URL =
  "https://www.uaa.edu.py/cdn/images/560cb5c8fdf530a9635a95eab14b.png";
const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900&display=swap";

function Simulador() {
  const graphsStatus = useSelector(selectSimulationGraphData);

  const readyGraphs = useMemo(
    () => graphsStatus.filter(({ isReady }) => isReady),
    [graphsStatus]
  );

  return (
    <>
      <Head>
        <meta name="description" content="Gráficos del COVID-19 en Paraguay" />
        <link href={FAVICON_URL} rel="icon" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link href={FONT_URL} rel="stylesheet" />
      </Head>
      <Layout>
        <div className="flex flex-col pt-2 px-2 md:pt-6 md:px-6 text-default-text bg-back">
          <div className="flex flex-col md:flex-row justify-between gap-3 border-b border-gray-theme pb-5 mb-6">
            <TitleSection tab={SIM_GRAPH} />
            <SimulationFilter />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 mb-6 w-full">
            {readyGraphs.map(({ type }) => (
              <SimulationGraph key={type} type={type} />
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
  (store) =>
    async ({ locale }) => {
      try {
        const response = await axiosInstance("/get-first-simulation");
        const chartData: SimulationData = response.data;

        store.dispatch(
          setSimulation({
            cumulative: chartData.cumulative,
            cumulative_deaths: chartData.cumulative_deaths,
            exposed: chartData.exposed,
            hospitalized: chartData.hospitalized,
            immune: chartData.immune,
            infectious: chartData.infectious,
            susceptible: chartData.susceptible,
            uci: chartData.uci,
          })
        );

        return {
          props: {
            ...(await serverSideTranslations(locale, ["common"])),
          },
        };
      } catch (error) {
        console.error("Error fetching simulation data:", error);

        return {
          props: {
            ...(await serverSideTranslations(locale, ["common"])),
          },
        };
      }
    }
);

export default React.memo(Simulador);
