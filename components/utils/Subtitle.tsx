import { memo } from "react";
import { useTranslation } from "next-i18next";
import {
  MainSubtitleType,
  SimulationSubtitleType,
} from "../../utils/descriptions";

type SubtitleProps =
  | {
      page: "main";
      type: MainSubtitleType;
    }
  | {
      page: "simulation";
      type: SimulationSubtitleType;
    };

const Subtitle = memo(function Subtitle({ type }: SubtitleProps) {
  const { t } = useTranslation("common");

  return (
    <p className="whitespace-pre-line pt-2 text-base text-text-secondary">
      {t(`${type}-subtitle`)}
    </p>
  );
});

export default Subtitle;
