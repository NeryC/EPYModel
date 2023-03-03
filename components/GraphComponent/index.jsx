import SelectedLines from "./SelectedLines";
import { graphDescriptions } from "../../utils/descriptions";
import { parseD3 } from "../../utils/constants";
import Graph from "./Graph";
import { useSelector } from "react-redux";
import { selectRawData } from "../../store/reducers/graphInfoSlice";
import { useTranslation } from "next-i18next";
import { DownloadButton } from "./DownloadButton";
import { FiltersSection } from "./FiltersSetion";

const GraphComponent = ({ type }) => {
  const { t } = useTranslation("common");
  const rawData = useSelector(selectRawData(type));
  const data = JSON.parse(JSON.stringify(rawData));
  parseD3(data);

  let shouldShowSubtitle = () => {
    const subtitle = graphDescriptions[type]?.subtitle;
    if (subtitle)
      return (
        <div className="text-base px-4 pb-3 whitespace-pre-line">
          {t(`${type}-subtitle`)}
        </div>
      );
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-white mb-3 md:mb-6 p-3 md:p-6 flex flex-col border border-gray-theme text-black">
      <div className="border-b-2 pb-2 text-2xl mb-2 md:mb-4 font-bold flex flex-col w-full ">
        <div className="flex justify-between">
          {t(`${type}-title`)}
          <DownloadButton type={type} />
        </div>
        <SelectedLines type={type} />
      </div>
      <FiltersSection />
      {shouldShowSubtitle()}
      {/* escenarios por ahora deshabilitado */}
      {/* <div className="flex items-center justify-center text-sm">
        <span className="pr-2">{t("scenario")}</span>
        <ScenarioTooltip item={scenarios} top={false} type={type}>
          <FontAwesomeIcon icon={faInfoCircle} />
        </ScenarioTooltip>
        <MultiSelect type={type} />
      </div> */}
      <Graph type={type} data={data} />
    </div>
  );
};

export default GraphComponent;
