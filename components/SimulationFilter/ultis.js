import { axiosInstance } from "../../utils";
export const requestFilteredData = (filters) => {
  return axiosInstance.get("/get-simulation", {
    params: {
      Rt: filters.Rt,
      UCI_threshold: filters.UCI_threshold,
      V_filtered: filters.V_filtered,
      lambda_I_to_H: filters.lambda_I_to_H,
    },
  });
};
