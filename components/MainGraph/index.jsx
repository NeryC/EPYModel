import SelectedLines from "./SelectedLines";
import { parseD3 } from "../../utils/constants";
import Graph from "./Graph";
import { useSelector } from "react-redux";
import { selectRawData } from "../../store/reducers/graphInfoSlice";
import { useTranslation } from "next-i18next";
import { DownloadButton } from "../utils/DownloadButton";
import Subtitle from "../utils/Subtitle";

const MainGraph = ({ type }) => {
  const { t } = useTranslation("common");
  const rawData = useSelector(selectRawData(type));
  const data = JSON.parse(JSON.stringify(rawData));
  parseD3(data);

  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-white mb-3 md:mb-6 py-3 md:py-6 flex flex-col border border-gray-theme text-black">
      <div className="px-3 md:px-6">
        <div className="border-b-2 text-2xl md:mb-2 font-bold flex flex-col w-full pb-2 md:pb-4">
          <div className="flex justify-between">
            {t(`${type}-title`)}
            <DownloadButton page="main" type={type} />
          </div>
          <Subtitle page="main" type={type} />
        </div>
        <SelectedLines type={type} />
      </div>
      <Graph type={type} data={data} />
    </div>
  );
};

export default MainGraph;
