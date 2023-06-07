import { useTranslation } from "next-i18next";
import { MAIN_GRAPH } from "../../utils/constants";

export const TitleSection = ({ tab = MAIN_GRAPH }) => {
  const { t } = useTranslation("common");
  const isMainGraph = tab === MAIN_GRAPH;
  const borderClass = `text-lg md:text-xl ${
    isMainGraph ? "border-b border-gray-theme pb-5" : ""
  }`;
  const containerClass = `flex flex-col mt-3 mb-5 ${
    !isMainGraph ? "grow justify-center" : ""
  }`;

  const title = isMainGraph
    ? t("home-title")
    : "Simulaciones del modelo SEIR-H para COVID-19";
  const description = isMainGraph
    ? t("home-description")
    : "Puedes simular escenarios segun el modelo SEIR-H";
  // agregar un link al articulo
  return (
    <div className={containerClass}>
      <span className="font-bold text-black text-2xl mb-2">{title}</span>
      <span className={borderClass}>{description}</span>
    </div>
  );
};
