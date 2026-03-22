import { useTranslation } from "next-i18next";
import Tooltip from "../../../utils/Tooltip";

function LambdaItoHInput({ lambdaItoH, handleLambdaItoHChange }) {
  const { t } = useTranslation("common");
  return (
    <div className="flex flex-col md:flex-row justify-between items-center">
      <div className="md:text-sm font-bold flex items-center gap-1 pr-2">
        <label htmlFor="lambda">{t("lambda_I_to_H")}</label>
        <Tooltip text={t("lambda_I_to_H-description")} />
      </div>
      <div className="min-h-[44px] w-full flex items-center mt-2 md:mt-0 md:ml-3">
        <input
          id="lambda"
          type="range"
          min="0"
          max="1"
          step="0.1"
          className="w-full h-4 appearance-none overflow-hidden rounded-lg bg-gray-400 styledRange"
          value={lambdaItoH}
          onChange={handleLambdaItoHChange}
          aria-valuetext={`${lambdaItoH * 100} ${t("percent")}`}
        />
      </div>
      <span className="w-20 text-center">{lambdaItoH * 100}%</span>
    </div>
  );
}

export default LambdaItoHInput;
