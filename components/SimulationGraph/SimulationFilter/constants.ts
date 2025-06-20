interface DefaultFilters {
  Rt: number[];
  UCI_threshold: number;
  V_filtered: number;
  lambda_I_to_H: number;
}

export const default_filters: DefaultFilters = {
  Rt: [1.1, 1.2, 1.3, 0.8, 0.7, 0.9],
  UCI_threshold: 100,
  V_filtered: 1000,
  lambda_I_to_H: 0.5,
};
