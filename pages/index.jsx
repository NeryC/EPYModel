/* eslint-disable @next/next/no-page-custom-font */
import Head from "next/head";
import Layout from "../components/Layout";
import MainGraph from "../components/MainGraph";
import { initMain, selectGraphData } from "../store/reducers/graphInfoSlice";
import { useSelector } from "react-redux";
import { wrapper } from "../store/store";
import { axiosInstance } from "../utils";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { TitleSection } from "../components/TitleSection";

export default function Graphs() {
  const graphsStatus = useSelector(selectGraphData("main"));
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
          <TitleSection />
          {graphsStatus.map(({ type, isReady }) => {
            if (isReady) return <MainGraph type={type} key={type} />;
          })}
        </div>
      </Layout>
    </>
  );
}

export const getStaticProps = wrapper.getStaticProps(
  (store) => async (locale) => {
    const reported = await axiosInstance(`/projection-r`);
    const hospitalized = await axiosInstance(`/projection-h`);
    const ICU = await axiosInstance(`/projection-u`);
    const deceases = await axiosInstance(`/projection-f`);

    store.dispatch(
      initMain({
        reported: reported.data,
        hospitalized: hospitalized.data,
        ICU: ICU.data,
        deceases: deceases.data,
      })
    );
    return {
      props: {
        ...(await serverSideTranslations(locale.locale, ["common"])),
      },
    };
  }
);
