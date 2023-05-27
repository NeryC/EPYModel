import Graph from "./Graph";
import { useSelector } from "react-redux";
import { selectRawDataSimulation } from "../../store/reducers/graphInfoSlice";
import { useTranslation } from "next-i18next";
import { DownloadButton } from "../utils/DownloadButton";
import Subtitle from "../utils/Subtitle";
import { SIM_GRAPH } from "../../utils/constants";

const SimulationGraph = ({ type }) => {
  const rawData = useSelector(selectRawDataSimulation(type));
  const { t } = useTranslation("common");

  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-white p-3 md:p-6 flex flex-col border border-gray-theme text-black h-fit">
      <div className="border-b-2 text-2xl md:mb-2 font-bold flex justify-between items-center pb-4">
        <span>{t(type)}</span>
        <DownloadButton page={SIM_GRAPH} type={type} data={rawData} />
      </div>
      <Subtitle page={SIM_GRAPH} type={type} />
      <Graph type={type} data={rawData} />
    </div>
  );
};

export default SimulationGraph;
