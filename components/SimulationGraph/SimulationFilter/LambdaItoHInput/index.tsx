import { useTranslation } from "next-i18next";
import Tooltip from "../../../utils/Tooltip";
import { NUMERIC_CONSTRAINTS } from "../constants";
import { NumericInputHook } from "../types";
import { formatPercent } from "../utils";

const { MIN, MAX, STEP } = NUMERIC_CONSTRAINTS.LAMBDA_I_TO_H;

/**
 * Slider de la fracción de infectados que se hospitaliza.
 * Paso de 0,5 % (antes 10 %: el valor realista ~1 % no se podía volver a elegir).
 */
function LambdaItoHInput({ field }: { field: NumericInputHook }) {
  const { t, i18n } = useTranslation("common");
  const value = field.value ?? MIN;
  const label = formatPercent(value, i18n.language);
  const range = {
    min: formatPercent(MIN, i18n.language),
    max: formatPercent(MAX, i18n.language),
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center">
      <div className="text-xs md:text-sm font-bold flex items-center gap-1 pr-2 shrink-0">
        <label htmlFor="lambda">{t("lambda_I_to_H")}</label>
        <Tooltip text={t("lambda_I_to_H-description", range)} />
      </div>
      <div className="min-h-[44px] w-full flex items-center mt-2 md:mt-0 md:ml-3">
        <input
          id="lambda"
          type="range"
          min={MIN}
          max={MAX}
          step={STEP}
          className="w-full h-4 appearance-none overflow-hidden rounded-lg bg-gray-400 styledRange"
          value={field.text}
          onChange={field.onChange}
          aria-valuetext={label}
        />
      </div>
      <span className="w-20 text-center" aria-hidden="true">
        {label}
      </span>
    </div>
  );
}

export default LambdaItoHInput;
