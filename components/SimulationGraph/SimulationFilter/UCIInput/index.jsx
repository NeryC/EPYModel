import React from "react";
import { useTranslation } from "next-i18next";
import Tooltip from "../../../utils/Tooltip";

const UCIInput = ({ UCI, handleUCIChange }) => {
  const { t } = useTranslation("common");

  return (
    <div className="flex flex-col gap-1 w-full">
      <label
        htmlFor="uci_input"
        className="md:text-sm font-bold flex items-center gap-1 pr-2"
      >
        {t("uci-setting")}
        <Tooltip text={t("uci-setting-description")} />
      </label>
      <input
        type="number"
        id="uci_input"
        min="0"
        max="3000"
        value={UCI}
        onChange={handleUCIChange}
        className="border border-gray-theme rounded-md p-1"
      />
    </div>
  );
};

export default UCIInput;
