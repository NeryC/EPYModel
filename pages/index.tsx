import Head from "next/head";
import Layout from "../components/Layout";
import MainGraph from "../components/MainGraph";
import useDimensions from "../hooks/useDimensions";
import { axiosInstance } from "../utils";
import { GetStaticProps } from "next";
import { initMain, selectGraphData } from "../store/reducers/graphInfoSlice";
import { MAIN_GRAPH } from "../utils/constants";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { TitleSection } from "../components";
import { useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { wrapper } from "../store/store";
/* eslint-disable @next/next/no-page-custom-font */

// --- Type Definitions ---
interface GraphStatus {
  type: string;
  isReady: boolean;
}

interface Dimensions {
  width: number;
  height: number;
}

interface DataPoint {
  fecha: string;
  [key: string]: any;
}

interface AxiosResponse<T> {
  data: T;
}

interface ProjectionResponse {
  reported: DataPoint[];
  hospitalized: DataPoint[];
  ICU: DataPoint[];
  deceases: DataPoint[];
}

// --- Component Definition ---
function Graphs(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphsStatus: GraphStatus[] = useSelector(selectGraphData(MAIN_GRAPH));
  const dimensions: Dimensions = useDimensions(containerRef, 534);

  // Memoize the filtered graphs to prevent unnecessary re-renders
  const readyGraphs = useMemo(
    () => graphsStatus.filter(({ isReady }) => isReady),
    [graphsStatus]
  );

  // Memoize the head content to prevent unnecessary re-renders
  const headContent = useMemo(
    () => (
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
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
          crossOrigin="anonymous"
        />
      </Head>
    ),
    []
  );

  return (
    <>
      {headContent}
      <Layout>
        <main
          className="flex flex-col pt-2 px-2 md:pt-6 md:px-6 text-default-text bg-back"
          ref={containerRef}
          role="main"
          aria-label="COVID-19 Graphs Dashboard"
        >
          <TitleSection />
          {dimensions.width > 0 && readyGraphs.length > 0 && (
            <section aria-label="Graphs Container">
              {readyGraphs.map(({ type }: GraphStatus) => (
                <MainGraph key={type} type={type} dimensions={dimensions} />
              ))}
            </section>
          )}
        </main>
      </Layout>
    </>
  );
}

// --- Static Props Generation ---
export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
  (store) =>
    async ({ locale }) => {
      try {
        const [reported, hospitalized, icu, deceases]: AxiosResponse<
          DataPoint[]
        >[] = await Promise.all([
          axiosInstance.get("/projection-r"),
          axiosInstance.get("/projection-h"),
          axiosInstance.get("/projection-u"),
          axiosInstance.get("/projection-f"),
        ]);

        const projectionData: ProjectionResponse = {
          reported: reported.data,
          hospitalized: hospitalized.data,
          ICU: icu.data,
          deceases: deceases.data,
        };

        store.dispatch(initMain(projectionData));

        return {
          props: {
            ...(await serverSideTranslations(locale, ["common"])),
          },
        };
      } catch (error) {
        console.error("Error fetching projection data:", error);

        // Return fallback props even if data fetching fails
        return {
          props: {
            ...(await serverSideTranslations(locale, ["common"])),
          },
        };
      }
    }
);

export default Graphs;
