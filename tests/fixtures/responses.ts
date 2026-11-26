import type { DataPoint } from "../../types/api";

export const fakeDataPoint = (fecha: string, value: number): DataPoint => ({
  fecha,
  value,
  uncertainty_lower: value * 0.9,
  uncertainty_upper: value * 1.1,
});

export const fakeProjectionResponse = {
  R: [fakeDataPoint("2024-01-01", 10), fakeDataPoint("2024-01-02", 12)],
  H: [fakeDataPoint("2024-01-01", 5), fakeDataPoint("2024-01-02", 6)],
  U: [fakeDataPoint("2024-01-01", 2), fakeDataPoint("2024-01-02", 3)],
  F: [fakeDataPoint("2024-01-01", 1), fakeDataPoint("2024-01-02", 1)],
};

export const fakeSimulationResponse = {
  cumulative: [fakeDataPoint("day-0", 1), fakeDataPoint("day-1", 2)],
  cumulative_deaths: [fakeDataPoint("day-0", 0), fakeDataPoint("day-1", 0)],
  exposed: [fakeDataPoint("day-0", 1), fakeDataPoint("day-1", 1)],
  hospitalized: [fakeDataPoint("day-0", 0), fakeDataPoint("day-1", 0)],
  immune: [fakeDataPoint("day-0", 0), fakeDataPoint("day-1", 0)],
  infectious: [fakeDataPoint("day-0", 1), fakeDataPoint("day-1", 1)],
  susceptible: [fakeDataPoint("day-0", 1000), fakeDataPoint("day-1", 999)],
  uci: [fakeDataPoint("day-0", 0), fakeDataPoint("day-1", 0)],
};

/** Respuesta de GET /api/v1/simulation-defaults (valores reales del CSV del modelo R). */
export const fakeSimulationDefaults = {
  startDate: "2022-12-24",
  Rt: [1.1, 1.2, 1.3, 0.8, 0.7, 0.9],
  UCI_threshold: 100,
  V_filtered: 1000,
  lambda_I_to_H: 0.003,
  estimatedRt: 3.25,
  fractions: {
    lambda_I_to_F: 0.000033,
    lambda_H_to_U: 0.15,
    lambda_H_to_F: 0.0753,
    lambda_U_to_F: 0.4465,
  },
};
