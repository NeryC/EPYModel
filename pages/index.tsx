import Head from "next/head";
import Layout from "../components/Layout";
import MainGraph from "../components/MainGraph";
import useDimensions from "../hooks/useDimensions";
import { GetStaticProps } from "next";
import {
  initMain,
  selectMainGraphData,
} from "../store/reducers/graphInfoSlice";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { TitleSection } from "../components";
import { useMemo, useRef, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { wrapper } from "../store/store";
import { apiService } from "../services/api";
import { ProjectionData, DataPoint } from "../types/api";
/* eslint-disable @next/next/no-page-custom-font */

// --- Type Definitions ---
interface GraphStatus {
  type: "reported" | "hospitalized" | "ICU" | "deceases";
  isReady: boolean;
}

interface Dimensions {
  width: number;
  height: number;
  svgWidth: number;
  svgHeight: number;
  left: number;
  top: number;
  right: number;
  bottom: number;
}

// Legacy interface - keeping for backward compatibility
interface ProjectionResponse {
  reported: DataPoint[];
  hospitalized: DataPoint[];
  ICU: DataPoint[];
  deceases: DataPoint[];
}

// --- Component Definition ---
function Graphs(): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphsStatus: GraphStatus[] = useSelector(selectMainGraphData);
  const dimensions: Dimensions = useDimensions(containerRef, 534);
  const { t } = useTranslation("common");

  // Memoize the filtered graphs to prevent unnecessary re-renders
  const readyGraphs = useMemo(
    () => graphsStatus.filter(({ isReady }) => isReady),
    [graphsStatus]
  );

  const totalGraphs = graphsStatus.length;
  const loadedCount = readyGraphs.length;
  const isLoading = dimensions.width > 0 && loadedCount < totalGraphs;

  // Tras 8 segundos sin datos, mostrar banner de error
  const [showLoadError, setShowLoadError] = useState(false);
  useEffect(() => {
    if (!isLoading) {
      setShowLoadError(false);
      return;
    }
    const timer = setTimeout(() => setShowLoadError(true), 8000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  // Memoize the head content to prevent unnecessary re-renders
  const headContent = useMemo(
    () => (
      <Head>
        <title>Proyecciones COVID-19 Paraguay | EPIModel</title>
        <meta name="description" content="Proyecciones epidemiológicas de COVID-19 en Paraguay: infectados, hospitalizados, UCI y fallecidos. Proyecto PINV20-40, CONACYT." />
      </Head>
    ),
    []
  );

  return (
    <>
      {headContent}
      <Layout>
        <main
          id="main-content"
          className="flex flex-col pt-2 px-2 md:pt-6 md:px-6 text-default-text bg-back max-w-screen-2xl mx-auto w-full"
          ref={containerRef}
          aria-label="Proyecciones COVID-19 Paraguay"
        >
          <TitleSection />
          {dimensions.width > 0 && (
            <>
              {isLoading && !showLoadError && (
                <div className="flex flex-col items-center justify-center py-16 gap-4 text-text-secondary">
                  <div
                    className="h-10 w-10 border-4 border-gray-300 border-t-deep-blue rounded-full animate-spin"
                    role="status"
                    aria-label={t("loading-data")}
                  />
                  <p className="text-base font-medium">
                    {loadedCount === 0 ? t("loading-data") : t("loading-graphs")}
                  </p>
                  {loadedCount > 0 && (
                    <p className="text-sm text-gray-400">
                      {loadedCount}/{totalGraphs} {t("graphs-container").toLowerCase()}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">{t("loading-hint")}</p>
                </div>
              )}
              {isLoading && showLoadError && (
                <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-4">
                  <div className="h-12 w-12 text-red-400">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-black">{t("error-loading-title")}</p>
                  <p className="text-text-secondary max-w-sm">{t("error-loading-desc")}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-deep-blue text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
                  >
                    {t("error-loading-retry")}
                  </button>
                </div>
              )}
              {readyGraphs.length > 0 && (
                <section aria-label={t("graphs-container")}>
                  {readyGraphs.map(({ type }: GraphStatus) => (
                    <MainGraph key={type} type={type} dimensions={dimensions} />
                  ))}
                </section>
              )}
            </>
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
        // Use the new API service to fetch projections data
        const projectionData: ProjectionData = await apiService.getProjections({
          format: 'json'
        });

        // Transform the data to match the expected format
        const formattedData: ProjectionResponse = {
          reported: projectionData.reported,
          hospitalized: projectionData.hospitalized,
          ICU: projectionData.ICU,
          deceases: projectionData.deceases,
        };

        store.dispatch(initMain(formattedData));

        return {
          props: {
            ...(await serverSideTranslations(locale ?? "es", ["common"])),
          },
          revalidate: 3600, // Re-fetch cada hora
        };
      } catch (error) {
        console.error("Error fetching projection data:", error);

        // Return fallback props even if data fetching fails
        return {
          props: {
            ...(await serverSideTranslations(locale ?? "es", ["common"])),
          },
          revalidate: 3600, // Re-fetch cada hora
        };
      }
    }
);

export default Graphs;
