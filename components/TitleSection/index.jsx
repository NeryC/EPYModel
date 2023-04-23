import { useTranslation } from "next-i18next";

export const TitleSection = ({ tab = "main" }) => {
  const { t } = useTranslation("common");
  const borderClass = `text-xl ${
    tab == "main" && "border-b border-gray-theme pb-5"
  }`;
  const containerClass = `flex flex-col mt-3 mb-5 ${
    tab != "main" && "grow justify-center"
  } `;
  return (
    <div className={containerClass}>
      <span className="font-bold text-black text-2xl mb-2">
        {tab == "main" ? t("home-title") : "Simulaciones Covid-19 en Paraguay"}
      </span>
      <span className={borderClass}>
        {tab == "main"
          ? t("home-description")
          : "Estas son simulaciones realizadas con los algoritmos de generacion"}
      </span>
    </div>
  );
};
