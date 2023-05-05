import SelectedLines from "./SelectedLines";
import { graphDescriptions } from "../../utils/descriptions";
import { parseD3 } from "../../utils/constants";
import Graph from "./Graph";
import { useSelector } from "react-redux";
import { selectRawData } from "../../store/reducers/graphInfoSlice";
import { useTranslation } from "next-i18next";
import { DownloadButton } from "./DownloadButton";

const GraphComponent = ({ type }) => {
  const { t } = useTranslation("common");
  const rawData = useSelector(selectRawData(type));
  const data = JSON.parse(JSON.stringify(rawData));
  parseD3(data);

  let shouldShowSubtitle = () => {
    const subtitle = graphDescriptions[type];
    if (subtitle)
      return (
        <div className="text-base w-4/5 text-text-secondary whitespace-pre-line">
          {t(`${type}-subtitle`)}
        </div>
      );
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-white mb-3 md:mb-6 p-3 md:p-6 flex flex-col border border-gray-theme text-black">
      <div className="border-b-2 text-2xl md:mb-2 font-bold flex flex-col w-full pb-4">
        <div className="flex justify-between">
          {t(`${type}-title`)}
          <DownloadButton type={type} />
        </div>
        {shouldShowSubtitle()}
      </div>
      <SelectedLines type={type} />
      <Graph type={type} data={data} />
    </div>
  );
};

export default GraphComponent;
