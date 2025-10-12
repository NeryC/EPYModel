import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService, ApiServiceError } from '../services/api';
import { 
  ProjectionData, 
  SimulationData, 
  SimulationQueryParams,
  ProjectionQueryParams 
} from '../types/api';

// Generic hook state interface
interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiServiceError | null;
  success: boolean;
}

// Hook options
interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiServiceError) => void;
}

/**
 * Generic hook for API calls with loading states and error handling
 */
function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {}
): UseApiState<T> & { refetch: () => Promise<void>; reset: () => void } {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const { immediate = false, onSuccess, onError } = options;
  const isMountedRef = useRef(true);

  const execute = useCallback(async () => {
    if (!isMountedRef.current) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await apiCall();
      
      if (!isMountedRef.current) return;

      setState({
        data,
        loading: false,
        error: null,
        success: true,
      });

      onSuccess?.(data);
    } catch (error) {
      if (!isMountedRef.current) return;

      const apiError = error instanceof ApiServiceError ? error : new ApiServiceError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );

      setState({
        data: null,
        loading: false,
        error: apiError,
        success: false,
      });

      onError?.(apiError);
    }
  }, [apiCall, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [immediate, execute]);

  return {
    ...state,
    refetch: execute,
    reset,
  };
}

/**
 * Hook for fetching projections data
 */
export function useProjections(
  params: ProjectionQueryParams = {},
  options: UseApiOptions = {}
) {
  const apiCall = useCallback(
    () => apiService.getProjections(params),
    [params]
  );

  return useApi<ProjectionData>(apiCall, options);
}

/**
 * Hook for fetching simulation data
 */
export function useSimulation(
  params: SimulationQueryParams,
  options: UseApiOptions = {}
) {
  const apiCall = useCallback(
    () => apiService.getSimulation(params),
    [params]
  );

  return useApi<SimulationData>(apiCall, options);
}

/**
 * Hook for fetching first simulation (default parameters)
 */
export function useFirstSimulation(options: UseApiOptions = {}) {
  const apiCall = useCallback(
    () => apiService.getFirstSimulation(),
    []
  );

  return useApi<SimulationData>(apiCall, options);
}

/**
 * Hook for executing and fetching simulation
 */
export function useSimulationExecution(options: UseApiOptions = {}) {
  const apiCall = useCallback(
    () => apiService.getFirstSimulationWithExecution(),
    []
  );

  return useApi<SimulationData>(apiCall, options);
}

/**
 * Hook for downloading files
 */
export function useDownload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiServiceError | null>(null);

  const download = useCallback(async (url: string, filename?: string) => {
    setLoading(true);
    setError(null);

    try {
      await apiService.downloadFile(url, filename);
    } catch (err) {
      const apiError = err instanceof ApiServiceError ? err : new ApiServiceError(
        err instanceof Error ? err.message : 'Download failed'
      );
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  return { download, loading, error };
}

// Export the generic hook for custom use cases
export { useApi };
