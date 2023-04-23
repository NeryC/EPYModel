import Graph from "./Graph";
import { useSelector } from "react-redux";
import { selectRawDataSimulation } from "../../store/reducers/graphInfoSlice";
import { useTranslation } from "next-i18next";
// import { useTranslation } from "next-i18next";
// import { DownloadButton } from "./DownloadButton";

const SingleLineGaph = ({ type }) => {
  const rawData = useSelector(selectRawDataSimulation(type));
  const { t } = useTranslation("common");

  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-white p-3 md:p-6 flex flex-col border border-gray-theme text-black">
      <div className="border-b-2 text-2xl md:mb-2 font-bold flex flex-col w-full pb-4">
        <div className="flex justify-between">{t(type)}</div>
        {/* {shouldShowSubtitle()} */}
      </div>
      {/* <SelectedLines type={type} /> */}
      <Graph type={type} data={rawData} />
    </div>
  );
};

export default SingleLineGaph;
