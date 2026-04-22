import { useTranslation } from "next-i18next";
import Tooltip from "../../../utils/Tooltip";

const VFilteredInput = ({ vFiltered, handleVFilteredChange }) => {
  const { t } = useTranslation("common");

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="text-xs md:text-sm font-bold flex items-center gap-1 pr-2">
        <label htmlFor="filtered">{t("v_filtered")}</label>
        <Tooltip text={t("v_filtered-description")} />
      </div>
      <input
        id="filtered"
        type="number"
        min="1"
        max="5000"
        value={vFiltered}
        onChange={handleVFilteredChange}
        className="border border-gray-theme rounded-md p-1"
      />
    </div>
  );
};

export default VFilteredInput;
