import { useTranslation } from "next-i18next";
import Tooltip from "../../../utils/Tooltip";

const UCIInput = ({ UCI, handleUCIChange }) => {
  const { t } = useTranslation("common");

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="text-xs md:text-sm font-bold flex items-center gap-1 pr-2">
        <label htmlFor="uci_input">{t("uci-setting")}</label>
        <Tooltip text={t("uci-setting-description")} />
      </div>
      <input
        type="number"
        id="uci_input"
        min="1"
        max="3000"
        value={UCI}
        onChange={handleUCIChange}
        className="border border-gray-theme rounded-md p-1"
      />
    </div>
  );
};

export default UCIInput;
