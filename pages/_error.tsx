import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextPageContext } from "next";
import { useTranslation } from "next-i18next";

interface ErrorPageProps {
  statusCode?: number;
}

// Contenido fallback bilingüe mientras next-i18next hidrata
const FALLBACK: Record<string, Record<string, string>> = {
  es: {
    title: "Error del servidor",
    desc: "Ocurrió un error en el servidor. Por favor, intente nuevamente más tarde.",
    home: "Volver al inicio",
  },
  en: {
    title: "Server error",
    desc: "A server error occurred. Please try again later.",
    home: "Back to home",
  },
};

export default function ErrorPage({ statusCode }: ErrorPageProps) {
  const { t } = useTranslation("common");
  const { locale } = useRouter();
  const fb = FALLBACK[locale ?? "es"] ?? FALLBACK.es;

  return (
    <>
      <Head>
        <title>{statusCode ?? "Error"} — EPIModel</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-back px-4 text-center">
        <p className="text-8xl font-bold text-deep-blue mb-4">{statusCode ?? "Error"}</p>
        <h1 className="text-2xl font-bold text-black mb-2">
          {t("page-error-title", fb.title)}
        </h1>
        <p className="text-text-secondary mb-8">
          {t("page-error-desc", fb.desc)}
        </p>
        <Link
          href="/"
          className="px-6 py-2 bg-deep-blue text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          {t("page-error-home", fb.home)}
        </Link>
      </div>
    </>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? 500 : 404;
  return { statusCode };
};
