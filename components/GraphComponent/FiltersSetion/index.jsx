import React from "react";
import { useTranslation } from "next-i18next";

export const FiltersSection = () => {
  const { t } = useTranslation("common");
  return <div className="font-bold">{t("filters")}</div>;
};
