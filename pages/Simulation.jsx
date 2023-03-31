/* eslint-disable @next/next/no-page-custom-font */
import { useState } from "react";
import Head from "next/head";
import axios from "axios";
import {
  selectSingleLineGraphData,
  initSimulation,
} from "../store/reducers/graphInfoSlice";
import { wrapper } from "../store/store";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import SingleLineGaph from "../components/SingleLineGaph";
import { TitleSection } from "../components/TitleSection";

const ChartsPage = () => {
  const graphsStatus = useSelector(selectSingleLineGraphData);
  console.log("render page");
  return (
    <>
      <Head>
        <meta name="description" content="Graficos del covid en paraguay" />
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
          <TitleSection tab="simulation" />
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 mb-6 w-full">
            {graphsStatus.map(({ type, isReady }) => {
              if (isReady) return <SingleLineGaph type={type} key={type} />;
            })}
          </div>
        </div>
      </Layout>
    </>
  );
};

export const getStaticProps = wrapper.getStaticProps(
  (store) => async (locale) => {
    const response = await axios.get(
      "http://localhost:3001/get-first-simulation"
    );
    const chartData = response.data;
    store.dispatch(
      initSimulation({
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
        ...(await serverSideTranslations(locale.locale, ["common"])),
      },
    };
  }
);

export default ChartsPage;
