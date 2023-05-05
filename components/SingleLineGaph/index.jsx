import Graph from "./Graph";
import { useSelector } from "react-redux";
import { selectRawDataSimulation } from "../../store/reducers/graphInfoSlice";
import { simulationDescriptions } from "../../utils/descriptions";
import { useTranslation } from "next-i18next";
import { DownloadButton } from "./DownloadButton";

const SingleLineGaph = ({ type }) => {
  const rawData = useSelector(selectRawDataSimulation(type));
  const { t } = useTranslation("common");

  let shouldShowSubtitle = () => {
    const subtitle = simulationDescriptions[type];
    if (subtitle)
      return (
        <div className="text-base w-4/5 text-text-secondary whitespace-pre-line">
          {t(`${type}-subtitle`)}
        </div>
      );
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-white p-3 md:p-6 flex flex-col border border-gray-theme text-black h-fit">
      <div className="border-b-2 text-2xl md:mb-2 font-bold flex flex-col w-full pb-4">
        <div className="flex justify-between">
          {t(type)}
          <DownloadButton type={type} data={rawData} />
        </div>
        {shouldShowSubtitle()}
      </div>
      <Graph type={type} data={rawData} />
    </div>
  );
};

export default SingleLineGaph;
