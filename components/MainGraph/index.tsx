import SelectedLines from "./SelectedLines";
import { parseD3 } from "./utils";
import Graph from "./Graph";
import { useSelector } from "react-redux";
import { selectRawData } from "../../store/reducers/graphInfoSlice";
import { useTranslation } from "next-i18next";
import { DownloadButton } from "../utils/DownloadButton";
import Subtitle from "../utils/Subtitle";
import DataTable from "../utils/DataTable";
import { linesDescriptions } from "../../utils/descriptions";
import { useMemo } from "react";

interface MainGraphProps {
  type: "reported" | "hospitalized" | "ICU" | "deceases";
  dimensions: {
    width: number;
    height: number;
    svgWidth: number;
    svgHeight: number;
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
}

const MainGraph = ({ type, dimensions }: MainGraphProps) => {
  const { t } = useTranslation("common");
  const rawData = useSelector(selectRawData(type));
  const data = useMemo(() => {
    const clone = JSON.parse(JSON.stringify(rawData));
    parseD3(clone);
    return clone;
  }, [rawData]);

  const tableColumns = useMemo(
    () => linesDescriptions(type).map((desc) => ({ key: desc.name, label: t(desc.label) })),
    [type, t]
  );

  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-white mb-3 md:mb-6 py-3 md:py-6 flex flex-col border border-gray-theme text-black">
      <div className="px-3 md:px-6">
        <div className="border-b-2 md:mb-2 font-bold flex flex-col w-full pb-2 md:pb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl">{t(`${type}-title`)}</h2>
            <DownloadButton page={"main"} type={type} />
          </div>
          <Subtitle page={"main"} type={type} />
        </div>
        <SelectedLines type={type} />
      </div>
      <Graph type={type} data={data} dimensions={dimensions} />
      <DataTable title={t(`${type}-title`)} data={rawData} dateField="fecha" columns={tableColumns} />
    </div>
  );
};

export default MainGraph;
