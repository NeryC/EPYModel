import { useTranslation } from "next-i18next";
import { MAIN_GRAPH } from "../../utils/constants";

export const TitleSection = ({ tab = MAIN_GRAPH }) => {
  const { t } = useTranslation("common");
  const borderClass = `text-lg md:text-xl ${
    tab == MAIN_GRAPH && "border-b border-gray-theme pb-5"
  }`;
  const containerClass = `flex flex-col mt-3 mb-5 ${
    tab != MAIN_GRAPH && "grow justify-center"
  } `;
  return (
    <div className={containerClass}>
      <span className="font-bold text-black text-2xl mb-2">
        {tab == MAIN_GRAPH
          ? t("home-title")
          : "Simulaciones Covid-19 en Paraguay"}
      </span>
      <span className={borderClass}>
        {tab == MAIN_GRAPH
          ? t("home-description")
          : "Estas son simulaciones realizadas con los algoritmos de generacion"}
      </span>
    </div>
  );
};
