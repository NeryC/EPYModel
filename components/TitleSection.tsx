import React, { useMemo } from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { MAIN_GRAPH } from "../utils/constants";
import { selectLastUpdateDate } from "../store/reducers/graphInfoSlice";

interface TitleSectionProps {
  tab?: string;
}

export function TitleSection({ tab = MAIN_GRAPH }: TitleSectionProps) {
  const { t } = useTranslation("common");
  const lastUpdateDate = useSelector(selectLastUpdateDate);

  const isMainGraph = tab === MAIN_GRAPH;

  const { title, description, containerClass, borderClass } = useMemo(() => {
    const title = isMainGraph ? t("home-title") : t("simulation-title");

    let description = isMainGraph
      ? t("home-description")
      : t("simulation-description");

    // Add last update date to description if on main graph and date is available
    if (isMainGraph && lastUpdateDate) {
      const date = new Date(lastUpdateDate);
      const formattedDate = date.toLocaleDateString(
        t("dateSeparator") === "%e de %b, %Y" ? "es-ES" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
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
  }, [isMainGraph, t, lastUpdateDate]);

  return (
    <div className={containerClass}>
      <span className="font-bold text-black text-2xl mb-2">{title}</span>
      <span className={borderClass}>{description}</span>
    </div>
  );
}
