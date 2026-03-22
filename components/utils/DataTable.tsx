import { memo } from "react";
import { useTranslation } from "next-i18next";

interface DataTableProps {
  title: string;
  data: Record<string, unknown>[];
  dateField?: string;
  valueField?: string;
  /** Campos a mostrar como columnas (además del campo de fecha/día) */
  columns?: { key: string; label: string }[];
  /** Mostrar cada n-ésimo punto para no saturar la tabla */
  sampleEvery?: number;
}

/**
 * Tabla de datos accesible desplegable bajo cada gráfico.
 * Cumple WCAG 1.1.1 (alternativa textual para contenido no textual complejo).
 * Visible para todos mediante <details>/<summary>.
 */
const DataTable = memo(function DataTable({
  title,
  data,
  dateField = "fecha",
  valueField = "value",
  columns,
  sampleEvery = 10,
}: DataTableProps) {
  const { t } = useTranslation("common");

  if (!data || data.length === 0) return null;

  // Tomar una muestra representativa del dataset
  const sampled = data.filter((_, i) => i % sampleEvery === 0 || i === data.length - 1);

  const hasDateField = dateField in (data[0] ?? {});
  const rowField = hasDateField ? dateField : valueField === "value" ? "day" : dateField;

  return (
    <details className="px-3 md:px-6 mt-1 mb-2">
      <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 select-none w-fit">
        {t("view-data-table")}
      </summary>
      <div className="overflow-x-auto mt-2 rounded border border-gray-200">
        <table className="text-xs w-full border-collapse">
          <caption className="sr-only">
            {t("data-table-caption", { title })}
          </caption>
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-1 text-left font-semibold text-gray-600 border-b border-gray-200">
                {hasDateField ? t("data-table-date") : t("data-table-day")}
              </th>
              {columns
                ? columns.map((col) => (
                    <th key={col.key} scope="col" className="px-3 py-1 text-right font-semibold text-gray-600 border-b border-gray-200">
                      {col.label}
                    </th>
                  ))
                : (
                    <th scope="col" className="px-3 py-1 text-right font-semibold text-gray-600 border-b border-gray-200">
                      {t("data-table-value")}
                    </th>
                  )}
            </tr>
          </thead>
          <tbody>
            {sampled.map((row, i) => {
              const rowKey = String(row[rowField] ?? i);
              const displayKey = hasDateField
                ? rowKey
                : String(row["day"] ?? i);
              return (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-3 py-1 text-gray-700 border-b border-gray-100">{displayKey}</td>
                  {columns
                    ? columns.map((col) => (
                        <td key={col.key} className="px-3 py-1 text-right text-gray-700 border-b border-gray-100 tabular-nums">
                          {typeof row[col.key] === "number"
                            ? (row[col.key] as number).toLocaleString(undefined, { maximumFractionDigits: 2 })
                            : String(row[col.key] ?? "—")}
                        </td>
                      ))
                    : (
                        <td className="px-3 py-1 text-right text-gray-700 border-b border-gray-100 tabular-nums">
                          {typeof row[valueField] === "number"
                            ? (row[valueField] as number).toLocaleString(undefined, { maximumFractionDigits: 2 })
                            : String(row[valueField] ?? "—")}
                        </td>
                      )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </details>
  );
});

export default DataTable;
