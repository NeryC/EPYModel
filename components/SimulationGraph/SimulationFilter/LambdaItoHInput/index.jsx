import { useTranslation } from "next-i18next";
import Tooltip from "../../../utils/Tooltip";

function LambdaItoHInput({ lambdaItoH, handleLambdaItoHChange }) {
  const { t } = useTranslation("common");
  return (
    <div className="flex flex-col md:flex-row justify-between items-center">
      <label
        htmlFor="lambda"
        className="md:text-sm font-bold flex items-center gap-1 pr-2"
      >
        {t("lambda_I_to_H")}
        <Tooltip text={t("lambda_I_to_H-description")} />
      </label>
      <div className="h-8 w-full flex items-center mt-2 md:mt-0 md:ml-3">
        <input
          id="lambda"
          type="range"
          min="0"
          max="1"
          step="0.1"
          className="w-full h-4 appearance-none overflow-hidden rounded-lg bg-gray-400 styledRange"
          value={lambdaItoH}
          onChange={handleLambdaItoHChange}
        />
      </div>
      <span className="w-20 text-center">{lambdaItoH * 100}%</span>
    </div>
  );
}

export default LambdaItoHInput;
