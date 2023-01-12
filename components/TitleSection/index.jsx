import { useTranslation } from "next-i18next";

export const TitleSection = () => {
  const { t } = useTranslation("common");
  return (
    <div className="flex flex-col mt-3 mb-5">
      <span className="font-bold text-black text-2xl mb-2">
        {t("home-title")}
      </span>
      <span className="text-xl border-b border-gray-theme pb-5">
        {t("home-descrioption")}
      </span>
    </div>
  );
};
