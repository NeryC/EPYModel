import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ENV_CONFIG } from '../config/environment';
import { 
  ApiResponse, 
  ProjectionData, 
  SimulationData, 
  SimulationQueryParams,
  ProjectionQueryParams,
  ApiClientConfig,
  DataPoint
} from '../types/api';

/**
 * Custom API Error class for better error handling
 */
export class ApiServiceError extends Error {
  public status?: number;
  public code?: string;
  public originalError?: AxiosError;

  constructor(message: string, status?: number, code?: string, originalError?: AxiosError) {
    super(message);
    this.name = 'ApiServiceError';
    this.status = status;
    this.code = code;
    this.originalError = originalError;
  }
}

/**
 * API Service class for handling all backend communications
 * Provides type-safe methods with proper error handling and loading states
 */
export class ApiService {
  private client: AxiosInstance;
  private requestQueue: Map<string, Promise<any>> = new Map();

  constructor(config: ApiClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors for error handling and logging
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error: AxiosError) => {
        const apiError = this.handleApiError(error);
        console.error('API Error:', apiError);
        return Promise.reject(apiError);
      }
    );
  }

  /**
   * Handle and transform Axios errors to ApiServiceError
   */
  private handleApiError(error: AxiosError): ApiServiceError {
    if (error.response) {
      // Server responded with error status
      const responseData = error.response.data as any;
      const message = responseData?.message || responseData?.error || 'Server error';
      return new ApiServiceError(
        message,
        error.response.status,
        responseData?.code,
        error
      );
    } else if (error.request) {
      // Request was made but no response received
      return new ApiServiceError(
        'Network error - no response from server',
        undefined,
        'NETWORK_ERROR',
        error
      );
    } else {
      // Something else happened
      return new ApiServiceError(
        error.message || 'Unknown error occurred',
        undefined,
        'UNKNOWN_ERROR',
        error
      );
    }
  }

  /**
   * Generic GET request with caching and deduplication
   */
  private async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const cacheKey = `${url}?${JSON.stringify(config?.params || {})}`;
    
    // Check if request is already in progress
    if (this.requestQueue.has(cacheKey)) {
      return this.requestQueue.get(cacheKey)!;
    }

    const requestPromise = this.client.get<ApiResponse<T>>(url, config)
      .then((response) => {
        // Remove from queue when completed
        this.requestQueue.delete(cacheKey);
        
        if (response.data.success) {
          return response.data.data as T;
        } else {
          throw new ApiServiceError(
            response.data.message || 'Request failed',
            400,
            'REQUEST_FAILED'
          );
        }
      })
      .catch((error) => {
        // Remove from queue on error
        this.requestQueue.delete(cacheKey);
        throw error;
      });

    // Store request in queue
    this.requestQueue.set(cacheKey, requestPromise);
    
    return requestPromise;
  }

  /**
   * Get projections data in specified format
   */
  async getProjections(params: ProjectionQueryParams = {}): Promise<ProjectionData> {
    try {
      const queryParams = {
        format: params.format || 'json',
      };

      // Use the new API v1 endpoint
      const backendResponse = await this.get<Record<string, DataPoint[]>>('/api/v1/projections', {
        params: queryParams,
      });

      // Map backend keys to frontend expected keys
      const response: ProjectionData = {
        reported: backendResponse.R || [],
        hospitalized: backendResponse.H || [],
        ICU: backendResponse.U || [],
        deceases: backendResponse.F || [],
      };

      return response;
    } catch (error) {
      throw new ApiServiceError(
        `Failed to fetch projections: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        'PROJECTIONS_ERROR',
        error as AxiosError
      );
    }
  }

  /**
   * Get simulation data with custom parameters
   */
  async getSimulation(params: SimulationQueryParams): Promise<SimulationData> {
    try {
      // Use the new API v1 endpoint
      const response = await this.get<SimulationData>('/api/v1/simulations', {
        params,
      });

      return response;
    } catch (error) {
      throw new ApiServiceError(
        `Failed to fetch simulation: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        'SIMULATION_ERROR',
        error as AxiosError
      );
    }
  }

  /**
   * Get first simulation (default parameters)
   * Note: This endpoint returns a file download, not JSON data
   * For JSON data, use getFirstSimulationData()
   */
  async getFirstSimulation(): Promise<SimulationData> {
    try {
      // Use the new API v1 endpoint
      const response = await this.get<SimulationData>('/api/v1/get-first-simulation');
      return response;
    } catch (error) {
      throw new ApiServiceError(
        `Failed to fetch first simulation: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        'FIRST_SIMULATION_ERROR',
        error as AxiosError
      );
    }
  }

  /**
   * Get first simulation data as JSON
   */
  async getFirstSimulationData(): Promise<SimulationData> {
    try {
      // Use the new API v1 endpoint
      const response = await this.get<SimulationData>('/api/v1/get-first-simulation-data');
      
      // Transform data from backend format (day) to frontend format (fecha)
      const transformDataPoint = (item: any): DataPoint => ({
        ...item,
        fecha: item.day !== undefined ? `day-${item.day}` : (item.fecha || `unknown-${Math.random()}`),
      });

      const transformedResponse: SimulationData = {
        cumulative: response.cumulative?.map(transformDataPoint) || [],
        cumulative_deaths: response.cumulative_deaths?.map(transformDataPoint) || [],
        exposed: response.exposed?.map(transformDataPoint) || [],
        hospitalized: response.hospitalized?.map(transformDataPoint) || [],
        immune: response.immune?.map(transformDataPoint) || [],
        infectious: response.infectious?.map(transformDataPoint) || [],
        susceptible: response.susceptible?.map(transformDataPoint) || [],
        uci: response.uci?.map(transformDataPoint) || [],
      };

      return transformedResponse;
    } catch (error) {
      throw new ApiServiceError(
        `Failed to fetch first simulation data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        'FIRST_SIMULATION_DATA_ERROR',
        error as AxiosError
      );
    }
  }

  /**
   * Get first simulation with execution (test endpoint)
   */
  async getFirstSimulationWithExecution(): Promise<SimulationData> {
    try {
      // Use the new API v1 endpoint
      const response = await this.get<SimulationData>('/api/v1/get-first-simulation-2');
      return response;
    } catch (error) {
      throw new ApiServiceError(
        `Failed to execute simulation: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        'SIMULATION_EXECUTION_ERROR',
        error as AxiosError
      );
    }
  }

  /**
   * Download file from server
   */
  async downloadFile(url: string, filename?: string): Promise<void> {
    try {
      const response = await this.client.get(url, {
        responseType: 'blob',
      });

      // Create blob link to download
      const blob = new Blob([response.data]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      throw new ApiServiceError(
        `Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        'DOWNLOAD_ERROR',
        error as AxiosError
      );
    }
  }


  /**
   * Clear request queue (useful for cleanup)
   */
  clearRequestQueue(): void {
    this.requestQueue.clear();
  }

  /**
   * Get current request queue status
   */
  getRequestQueueStatus(): { active: number; pending: string[] } {
    return {
      active: this.requestQueue.size,
      pending: Array.from(this.requestQueue.keys()),
    };
  }
}

// Export singleton instance
export const apiService = new ApiService({
  baseURL: ENV_CONFIG.API_URL,
  timeout: ENV_CONFIG.API_TIMEOUT,
});

// Export types for convenience
export type { ApiResponse, ProjectionData, SimulationData, SimulationQueryParams, ProjectionQueryParams };
