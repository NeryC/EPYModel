import { axiosInstance } from "../../../utils";

interface SimulationFilters {
  Rt: number;
  UCI_threshold: number;
  V_filtered: number;
  lambda_I_to_H: number;
}

interface SimulationParams {
  Rt: number;
  UCI_threshold: number;
  V_filtered: number;
  lambda_I_to_H: number;
}

export const requestFilteredData = (filters: SimulationFilters) => {
  const { Rt, UCI_threshold, V_filtered, lambda_I_to_H } = filters;
  const params: SimulationParams = {
    Rt,
    UCI_threshold,
    V_filtered,
    lambda_I_to_H,
  };
  return axiosInstance.get("/get-simulation", { params });
};
