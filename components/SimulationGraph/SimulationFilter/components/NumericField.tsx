import { useTranslation } from "next-i18next";
import Tooltip from "../../../utils/Tooltip";
import { NumericFieldProps } from "../types";

interface Props extends NumericFieldProps {
  id: string;
  labelKey: string;
  descriptionKey: string;
}

/**
 * Campo numérico del simulador: muestra exactamente lo que escribe el usuario
 * y, si no es válido, un mensaje que explica el rango permitido.
 */
export const NumericField = ({
  id,
  labelKey,
  descriptionKey,
  field,
  constraints,
}: Props) => {
  const { t, i18n } = useTranslation("common");
  const errorId = `${id}-error`;
  const fmt = (n: number) => n.toLocaleString(i18n.language);
  const range = { min: fmt(constraints.MIN), max: fmt(constraints.MAX) };

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="text-xs md:text-sm font-bold flex items-center gap-1 pr-2">
        <label htmlFor={id}>{t(labelKey)}</label>
        <Tooltip text={t(descriptionKey, range)} />
      </div>
      <input
        type="number"
        inputMode="numeric"
        id={id}
        min={constraints.MIN}
        max={constraints.MAX}
        value={field.text}
        onChange={field.onChange}
        aria-invalid={field.error ? true : undefined}
        aria-describedby={field.error ? errorId : undefined}
        className={`border rounded-md p-1 ${
          field.error ? "border-red-500 outline-red-500" : "border-gray-theme"
        }`}
      />
      {field.error && (
        <p id={errorId} className="text-xs text-red-700">
          {field.error === "required"
            ? t("field-required")
            : t("field-out-of-range", range)}
        </p>
      )}
    </div>
  );
};
