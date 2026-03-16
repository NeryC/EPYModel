// API Types for epimodel-next
// Based on newBack endpoints and response structure

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface DataPoint {
  fecha: string;
  day?: number;
  value?: number;
  uncertainty_lower?: number;
  uncertainty_upper?: number;
  [key: string]: any;
}

export interface ProjectionData {
  reported: DataPoint[];
  hospitalized: DataPoint[];
  ICU: DataPoint[];
  deceases: DataPoint[];
}

export interface SimulationData {
  cumulative: DataPoint[];
  cumulative_deaths: DataPoint[];
  exposed: DataPoint[];
  hospitalized: DataPoint[];
  immune: DataPoint[];
  infectious: DataPoint[];
  susceptible: DataPoint[];
  uci: DataPoint[];
}

export interface SimulationParams {
  Rt: string | number[];
  UCI_threshold: number;
  V_filtered: number;
  lambda_I_to_H: number;
}

export interface SimulationQueryParams {
  Rt: string;
  UCI_threshold: string;
  V_filtered: string;
  lambda_I_to_H: string;
}

export interface ProjectionQueryParams {
  format?: 'json' | 'csv';
}

// ApiError type moved to services/api.ts to avoid conflicts

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}
