import { useMemo } from "react";
import { selectLastUpdateDate } from "../store/reducers/graphInfoSlice";
import { useDateFormat } from "../hooks/useDateFormat";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";

interface TitleSectionProps {
  tab?: "main" | "simulation";
}

export function TitleSection({ tab = "main" }: TitleSectionProps) {
  const { t } = useTranslation("common");
  const { formatDate } = useDateFormat();
  const lastUpdateDate = useSelector(selectLastUpdateDate);
  const isMainGraph = tab === "main";

  const { title, description, source, containerClass, borderClass } = useMemo(() => {
    const title = isMainGraph ? t("home-title") : t("simulation-title");

    let description = isMainGraph ? t("home-description") : t("simulation-description");
    const source = isMainGraph ? t("home-description-source") : "";

    if (isMainGraph && lastUpdateDate) {
      const formattedDate = formatDate(lastUpdateDate);
      description += ` — ${t("updated-until")} ${formattedDate}`;
    }

    const borderClass = `text-sm md:text-base lg:text-lg ${
      isMainGraph ? "border-b border-gray-theme pb-4" : ""
    }`;

    const containerClass = `flex flex-col mt-2 mb-4 ${
      !isMainGraph ? "grow justify-center" : ""
    }`;

    return { title, description, source, containerClass, borderClass };
  }, [isMainGraph, t, lastUpdateDate, formatDate]);

  return (
    <div className={containerClass}>
      <h1 className="font-bold text-black text-xl md:text-2xl mb-1.5">{title}</h1>
      <p className={borderClass}>
        {description}
        {source && (
          <span className="block text-sm text-text-secondary mt-1">{source}</span>
        )}
      </p>
    </div>
  );
}

export default TitleSection;
