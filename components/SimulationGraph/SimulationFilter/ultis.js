import { axiosInstance } from "../../../utils";

export const requestFilteredData = (filters) => {
  const { Rt, UCI_threshold, V_filtered, lambda_I_to_H } = filters;
  const params = {
    Rt,
    UCI_threshold,
    V_filtered,
    lambda_I_to_H,
  };
  return axiosInstance.get("/get-simulation", { params });
};
