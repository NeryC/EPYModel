import { useTranslation } from "next-i18next";

export const TitleSection = ({ tab = "main" }) => {
  const { t } = useTranslation("common");
  return (
    <div className="flex flex-col mt-3 mb-5">
      <span className="font-bold text-black text-2xl mb-2">
        {tab == "main" ? t("home-title") : "Simulaciones Covid-19 en Paraguay"}
      </span>
      <span className="text-xl border-b border-gray-theme pb-5">
        {tab == "main"
          ? t("home-description")
          : "Estas son simulaciones realizadas con los algoritmos de generacion"}
      </span>
    </div>
  );
};
