/* eslint-disable @next/next/no-page-custom-font */
import { useRef } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "../components/Layout";
import MainGraph from "../components/MainGraph";
import { initMain, selectGraphData } from "../store/reducers/graphInfoSlice";
import { wrapper } from "../store/store";
import { axiosInstance } from "../utils";
import { TitleSection } from "../components/TitleSection";
import { MAIN_GRAPH } from "../utils/constants";
import useDimensions from "../hooks/useDimensions";

const Graphs = () => {
  const containerRef = useRef(null);
  const graphsStatus = useSelector(selectGraphData(MAIN_GRAPH));
  const dimensions = useDimensions(containerRef, 534);
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
        <div
          className="flex flex-col pt-2 px-2 md:pt-6 md:px-6 text-default-text bg-back"
          ref={containerRef}
        >
          <TitleSection />
          {dimensions.width > 0 &&
            graphsStatus.map(({ type, isReady }) => {
              return isReady ? (
                <MainGraph type={type} key={type} dimensions={dimensions} />
              ) : null;
            })}
        </div>
      </Layout>
    </>
  );
};

export const getStaticProps = wrapper.getStaticProps(
  (store) =>
    async ({ locale }) => {
      const [reported, hospitalized, icu, deceases] = await Promise.all([
        axiosInstance.get("/projection-r"),
        axiosInstance.get("/projection-h"),
        axiosInstance.get("/projection-u"),
        axiosInstance.get("/projection-f"),
      ]);

      store.dispatch(
        initMain({
          reported: reported.data,
          hospitalized: hospitalized.data,
          ICU: icu.data,
          deceases: deceases.data,
        })
      );

      return {
        props: {
          ...(await serverSideTranslations(locale, ["common"])),
        },
      };
    }
);

export default Graphs;
