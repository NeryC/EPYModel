import React, { useMemo } from "react";
import { selectLastUpdateDate } from "../store/reducers/graphInfoSlice";
import { useDateFormat } from "../hooks/useDateFormat";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";

interface TitleSectionProps {
  tab?: "main" | "simulation";
}

interface TitleSectionData {
  title: string;
  description: string;
  containerClass: string;
  borderClass: string;
}

export function TitleSection({ tab = "main" }: TitleSectionProps) {
  const { t } = useTranslation("common");
  const { formatDate } = useDateFormat();
  const lastUpdateDate = useSelector(selectLastUpdateDate);

  const isMainGraph = tab === "main";

  const { title, description, containerClass, borderClass } =
    useMemo((): TitleSectionData => {
      const title = isMainGraph ? t("home-title") : t("simulation-title");

      let description = isMainGraph
        ? t("home-description")
        : t("simulation-description");

      // Add last update date to description if on main graph and date is available
      if (isMainGraph && lastUpdateDate) {
        const formattedDate = formatDate(lastUpdateDate);
        description += ` - ${t("updated-until")} ${formattedDate}`;
      }

      const borderClass = `text-lg md:text-xl ${
        isMainGraph ? "border-b border-gray-theme pb-5" : ""
      }`;

      const containerClass = `flex flex-col mt-3 mb-5 ${
        !isMainGraph ? "grow justify-center" : ""
      }`;

      return {
        title,
        description,
        containerClass,
        borderClass,
      };
    }, [isMainGraph, t, lastUpdateDate, formatDate]);

  return (
    <div className={containerClass}>
      <span className="font-bold text-black text-2xl mb-2">{title}</span>
      <span className={borderClass}>{description}</span>
    </div>
  );
}

export default TitleSection;
