import Head from "next/head";
import Layout from "../components/Layout";
import React, { useMemo } from "react";
import SimulationFilter from "../components/SimulationGraph/SimulationFilter/SimulationFilter";
import SimulationGraph from "../components/SimulationGraph/SimulationGraph";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { TitleSection } from "../components/TitleSection";
import { useSelector } from "react-redux";
import { wrapper } from "../store/store";
import { apiService } from "../services/api";
import { SimulationData as ApiSimulationData } from "../types/api";

import {
  selectSimulationGraphData,
  selectSimulationLoading,
  setSimulation,
} from "../store/reducers/graphInfoSlice";

/* eslint-disable @next/next/no-page-custom-font */

function Simulador() {
  const graphsStatus = useSelector(selectSimulationGraphData);
  const isSimulating = useSelector(selectSimulationLoading);

  const readyGraphs = useMemo(
    () => graphsStatus.filter(({ isReady }) => isReady),
    [graphsStatus]
  );

  return (
    <>
      <Head>
        <meta name="description" content="Gráficos del COVID-19 en Paraguay" />
      </Head>
      <Layout>
        <main className="flex flex-col pt-2 px-2 md:pt-6 md:px-6 text-default-text bg-back">
          <div className="flex flex-col md:flex-row justify-between gap-3 border-b border-gray-theme pb-5 mb-6">
            <TitleSection tab={"simulation"} />
            <SimulationFilter />
          </div>
          <div className="relative">
            {isSimulating && (
              <div
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-lg bg-white/70 backdrop-blur-sm"
                aria-live="polite"
                aria-label="Simulation in progress"
              >
                <svg
                  className="animate-spin h-10 w-10 text-indigo-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="text-indigo-600 font-semibold text-lg">
                  Simulando...
                </span>
              </div>
            )}
            <div className={`grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 mb-6 w-full${isSimulating ? " pointer-events-none select-none opacity-40" : ""}`}>
              {readyGraphs.map(({ type }) => (
                <SimulationGraph key={type} type={type} />
              ))}
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
  (store) =>
    async ({ locale }) => {
      try {
        // Use the new API service to fetch first simulation data
        const chartData: ApiSimulationData = await apiService.getFirstSimulationData();

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
            ...(await serverSideTranslations(locale ?? "es", ["common"])),
          },
          revalidate: 3600, // Re-fetch cada hora
        };
      } catch (error) {
        console.error("Error fetching simulation data:", error);

        return {
          props: {
            ...(await serverSideTranslations(locale ?? "es", ["common"])),
          },
          revalidate: 3600, // Re-fetch cada hora
        };
      }
    }
);

export default React.memo(Simulador);
