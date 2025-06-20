import { memo } from "react";
import { useTranslation } from "next-i18next";
import {
  mainSubtitleTypes,
  simulationSubtitleTypes,
} from "../../utils/descriptions";

type MainSubtitleType = (typeof mainSubtitleTypes)[number];
type SimulationSubtitleType = (typeof simulationSubtitleTypes)[number];

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
    <div className="whitespace-pre-line pt-2 text-base text-text-secondary">
      {t(`${type}-subtitle`)}
    </div>
  );
});

export default Subtitle;
