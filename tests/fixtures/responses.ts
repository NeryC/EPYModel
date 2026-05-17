import type { DataPoint } from '../../types/api';

export const fakeDataPoint = (fecha: string, value: number): DataPoint => ({
  fecha,
  value,
  uncertainty_lower: value * 0.9,
  uncertainty_upper: value * 1.1,
});

export const fakeProjectionResponse = {
  R: [fakeDataPoint('2024-01-01', 10), fakeDataPoint('2024-01-02', 12)],
  H: [fakeDataPoint('2024-01-01', 5), fakeDataPoint('2024-01-02', 6)],
  U: [fakeDataPoint('2024-01-01', 2), fakeDataPoint('2024-01-02', 3)],
  F: [fakeDataPoint('2024-01-01', 1), fakeDataPoint('2024-01-02', 1)],
};

export const fakeSimulationResponse = {
  cumulative: [fakeDataPoint('day-0', 1), fakeDataPoint('day-1', 2)],
  cumulative_deaths: [fakeDataPoint('day-0', 0), fakeDataPoint('day-1', 0)],
  exposed: [fakeDataPoint('day-0', 1), fakeDataPoint('day-1', 1)],
  hospitalized: [fakeDataPoint('day-0', 0), fakeDataPoint('day-1', 0)],
  immune: [fakeDataPoint('day-0', 0), fakeDataPoint('day-1', 0)],
  infectious: [fakeDataPoint('day-0', 1), fakeDataPoint('day-1', 1)],
  susceptible: [fakeDataPoint('day-0', 1000), fakeDataPoint('day-1', 999)],
  uci: [fakeDataPoint('day-0', 0), fakeDataPoint('day-1', 0)],
};
