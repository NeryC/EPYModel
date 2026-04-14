import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

// Contenido fallback bilingüe mientras next-i18next hidrata
const FALLBACK: Record<string, Record<string, string>> = {
  es: {
    title: "Página no encontrada",
    desc: "La página que buscas no existe o fue movida.",
    home: "Volver al inicio",
  },
  en: {
    title: "Page not found",
    desc: "The page you are looking for does not exist or has been moved.",
    home: "Back to home",
  },
};

export default function NotFound() {
  const { t } = useTranslation("common");
  const { locale } = useRouter();
  const fb = FALLBACK[locale ?? "es"] ?? FALLBACK.es;

  return (
    <>
      <Head>
        <title>404 — EPIModel</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-back px-4 text-center">
        <p className="text-8xl font-bold text-deep-blue mb-4">404</p>
        <h1 className="text-2xl font-bold text-black mb-2">
          {t("page-404-title", fb.title)}
        </h1>
        <p className="text-text-secondary mb-8">
          {t("page-404-desc", fb.desc)}
        </p>
        <Link
          href="/"
          className="px-6 py-2 bg-deep-blue text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          {t("page-404-home", fb.home)}
        </Link>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "es", ["common"])),
  },
});
