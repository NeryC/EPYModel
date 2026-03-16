import { apiService, ApiServiceError } from "../../../services/api";
import { SimulationQueryParams, SimulationData } from "../../../types/api";

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
export const requestFilteredData = async (filters: SimulationFilters): Promise<SimulationData> => {
  const { Rt, UCI_threshold, V_filtered, lambda_I_to_H } = filters;
  
  // Convert numbers to strings as expected by the API
  const params: SimulationQueryParams = {
    Rt: typeof Rt === 'string' ? Rt : JSON.stringify(Rt),
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
      `Failed to fetch filtered simulation data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      'FILTERED_SIMULATION_ERROR'
    );
  }
};
