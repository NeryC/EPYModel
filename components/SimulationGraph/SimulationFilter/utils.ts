import { apiService, ApiServiceError } from "../../../services/api";
import { SimulationQueryParams, SimulationData } from "../../../types/api";
import { NumericConstraints, NumericInputError } from "./types";

/**
 * Convierte el texto de un campo numérico en un valor válido o en un motivo de error.
 * Nunca "corrige" lo escrito: el campo muestra siempre lo que el usuario tipeó.
 */
export const parseNumericInput = (
  text: string,
  { MIN, MAX }: NumericConstraints,
): { value: number | null; error: NumericInputError | null } => {
  const trimmed = text.trim();
  const value = trimmed === "" ? NaN : Number(trimmed);
  if (Number.isNaN(value)) return { value: null, error: "required" };
  if (value < MIN || value > MAX) return { value: null, error: "out-of-range" };
  return { value, error: null };
};

/** Porcentaje legible según el idioma: 0.015 → "1,5 %" (es) / "1.5%" (en). */
export const formatPercent = (fraction: number, locale: string): string =>
  new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(fraction);

/**
 * Clave de traducción (y datos) para explicar al usuario por qué falló una simulación.
 */
export const getSimulationErrorKey = (
  error: unknown,
): { key: string; minutes?: number } => {
  if (!(error instanceof ApiServiceError)) return { key: "simulation-error" };
  if (error.status === undefined) return { key: "error-network" };
  if (error.status === 429) {
    return {
      key: "error-rate-limited",
      minutes: Math.max(1, Math.ceil((error.retryAfterSeconds ?? 900) / 60)),
    };
  }
  if (error.status === 400) return { key: "error-invalid-params" };
  if (error.status === 422) return { key: "error-not-converged" };
  if (error.status >= 500) return { key: "error-server" };
  return { key: "simulation-error" };
};

interface SimulationFilters {
  Rt: string | number[];
  UCI_threshold: string | number;
  V_filtered: string | number;
  lambda_I_to_H: string | number;
}

/**
 * Request filtered simulation data using the new API service
 * @param filters - Simulation parameters
 * @returns Promise with simulation data
 */
export const requestFilteredData = async (
  filters: SimulationFilters,
): Promise<SimulationData> => {
  const { Rt, UCI_threshold, V_filtered, lambda_I_to_H } = filters;

  // Convert numbers to strings as expected by the API
  const params: SimulationQueryParams = {
    Rt: typeof Rt === "string" ? Rt : JSON.stringify(Rt),
    UCI_threshold: UCI_threshold.toString(),
    V_filtered: V_filtered.toString(),
    lambda_I_to_H: lambda_I_to_H.toString(),
  };

  try {
    return await apiService.getSimulation(params);
  } catch (error) {
    // Re-throw with more context
    if (error instanceof ApiServiceError) {
      throw error;
    }
    throw new ApiServiceError(
      `Failed to fetch filtered simulation data: ${error instanceof Error ? error.message : "Unknown error"}`,
      undefined,
      "FILTERED_SIMULATION_ERROR",
    );
  }
};
