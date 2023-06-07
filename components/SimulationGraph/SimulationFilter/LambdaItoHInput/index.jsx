import { useTranslation } from "next-i18next";

function LambdaItoHInput({ lambdaItoH, handleLambdaItoHChange }) {
  const { t } = useTranslation("common");
  return (
    <div className="flex flex-col md:flex-row justify-between items-center">
      <label htmlFor="lambda" className="md:text-sm dark:text-white font-bold">
        {t("lambda_I_to_H")}
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
    </div>
  );
}

export default LambdaItoHInput;
