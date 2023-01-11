import Head from "next/head";
import Layout from "../components/Layout";
import GraphComponent from "../components/GraphComponent";
import {
  initGraphData,
  selectGraphData,
} from "../store/reducers/graphInfoSlice";
import { useSelector } from "react-redux";
import { wrapper } from "../store/store";
import { axiosInstance } from "../utils";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Graphs() {
  const graphsStatus = useSelector(selectGraphData);
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
        <div className="flex flex-col p-2 md:p-6">
          {graphsStatus.map(({ type, isReady }) => {
            if (isReady) return <GraphComponent type={type} key={type} />;
          })}
        </div>
      </Layout>
    </>
  );
}

export const getStaticProps = wrapper.getStaticProps(
  (store) => async (locale) => {
    const reported = await axiosInstance(`/proyeccionR`);
    const hospitalized = await axiosInstance(`/proyeccionH`);
    const ICU = await axiosInstance(`/proyeccionU`);
    const deceases = await axiosInstance(`/proyeccionF`);

    store.dispatch(
      initGraphData({
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
      revalidate: 60,
    };
  }
);
