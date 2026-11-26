import { useTranslation } from "next-i18next";
import { CSS_CLASSES } from "../constants";

interface HeaderSectionProps {
  /** Fecha del día 0 de la simulación (YYYY-MM-DD). */
  startDate?: string;
  /** Rt efectivo estimado por el modelo R al inicio. */
  estimatedRt?: number;
}

/**
 * HeaderSection Component
 *
 * Título del formulario y, si se conocen, el punto de partida de la simulación
 * (fecha y Rt estimado por el modelo R), para interpretar los gráficos.
 */
export const HeaderSection = ({
  startDate,
  estimatedRt,
}: HeaderSectionProps) => {
  const { t, i18n } = useTranslation("common");

  const date = startDate
    ? new Intl.DateTimeFormat(i18n.language, {
        dateStyle: "long",
        timeZone: "UTC",
      }).format(new Date(`${startDate}T00:00:00Z`))
    : null;

  return (
    <div className="flex flex-col gap-1">
      <h2 className={CSS_CLASSES.TITLE}>{t("chart-setting")}</h2>
      {date && estimatedRt !== undefined && (
        <p className="text-xs text-gray-600">
          {t("simulation-start-note", {
            date,
            rt: estimatedRt.toLocaleString(i18n.language, {
              maximumFractionDigits: 1,
            }),
          })}
        </p>
      )}
    </div>
  );
};
