import Graph from "./Graph";
import Subtitle from "../utils/Subtitle";
import { DownloadButton } from "../utils/DownloadButton";
import { SimulationSubtitleType } from "../../utils/descriptions";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import {
  DataPoint,
  selectRawDataSimulation,
} from "../../store/reducers/graphInfoSlice";

interface SimulationGraphProps {
  /** Type of simulation to display */
  type: SimulationSubtitleType;
}

/**
 * SimulationGraph Component
 * 
 * Displays a simulation graph with title, subtitle, and download functionality.
 * Renders different types of simulation data based on the provided type prop.
 * 
 * @param props - Component props
 * @param props.type - Type of simulation to display
 * @returns JSX element representing the simulation graph
 */
const SimulationGraph = ({ type }: SimulationGraphProps) => {
  const rawData = useSelector(selectRawDataSimulation(type)) as DataPoint[];
  const { t } = useTranslation("common");
  const titleKey = `${type}-simulation`;

  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-white p-3 md:p-6 flex flex-col border border-gray-theme text-black h-fit">
      <div className="border-b-2 text-2xl md:mb-2 font-bold flex justify-between items-center pb-4">
        <span>{t(titleKey)}</span>
        <DownloadButton page="simulation" type={type} data={rawData} />
      </div>
      <Subtitle page="simulation" type={type} />
      <Graph type={type} data={rawData} />
    </div>
  );
};

export default SimulationGraph;
