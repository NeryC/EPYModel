/* eslint-disable @next/next/no-page-custom-font */
import Head from "next/head";
import { useSelector } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  selectGraphData,
  setSimulation,
} from "../store/reducers/graphInfoSlice";
import { wrapper } from "../store/store";
import { axiosInstance } from "../utils";
import Layout from "../components/Layout";
import SimulationGraph from "../components/SimulationGraph";
import { TitleSection } from "../components/TitleSection";
import SimulationFilter from "../components/SimulationGraph/SimulationFilter";
import { SIM_GRAPH } from "../utils/constants";

const Simulador = () => {
  const graphsStatus = useSelector(selectGraphData(SIM_GRAPH));
  return (
    <>
      <Head>
        <meta name="description" content="Gráficos del COVID-19 en Paraguay" />
        <link
          href="https://www.uaa.edu.py/cdn/images/560cb5c8fdf530a9635a95eab14b.png"
          rel="icon"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Layout>
        <div className="flex flex-col pt-2 px-2 md:pt-6 md:px-6 text-default-text bg-back">
          <div className="flex flex-col md:flex-row justify-between gap-3 border-b border-gray-theme pb-5 mb-6">
            <TitleSection tab={SIM_GRAPH} />
            <SimulationFilter />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 mb-6 w-full">
            {graphsStatus.map(({ type, isReady }) => {
              return isReady ? (
                <SimulationGraph type={type} key={type} />
              ) : null;
            })}
          </div>
        </div>
      </Layout>
    </>
  );
};

export const getStaticProps = wrapper.getStaticProps(
  (store) =>
    async ({ locale }) => {
      const response = await axiosInstance(`/get-first-simulation`);
      const chartData = response.data;
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
    }
);

export default Simulador;
