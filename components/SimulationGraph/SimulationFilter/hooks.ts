import { useState, useCallback } from 'react';
import { default_filters } from './constants';
import { RT_CONSTRAINTS } from './constants';
import { RtListHook, NumericConstraints, NumericInputHook, SimulationStateHook } from './types';

/**
 * Custom hook for managing RT list state and operations
 */
export const useRtList = (initialValue: number[] = default_filters.Rt): RtListHook => {
  const [rtList, setRtList] = useState(initialValue);

  const updateRtValue = useCallback((index: number, action: 'increment' | 'decrement') => {
    const stepMatrix = {
      decrement: -RT_CONSTRAINTS.STEP_SIZE,
      increment: RT_CONSTRAINTS.STEP_SIZE,
    };

    setRtList(currentList => {
      const newList = [...currentList];
      const currentValue = newList[index];
      const newValue = parseFloat(
        (currentValue + stepMatrix[action]).toFixed(1)
      );

      // Validate new value is within constraints
      if (newValue >= RT_CONSTRAINTS.MIN_VALUE && newValue <= RT_CONSTRAINTS.MAX_VALUE) {
        newList[index] = newValue;
        return newList;
      }
      return currentList; // Return unchanged if validation fails
    });
  }, []);

  const addRtValue = useCallback(() => {
    setRtList(current => {
      if (current.length >= RT_CONSTRAINTS.MAX_COUNT) return current;
      return [...current, RT_CONSTRAINTS.DEFAULT_NEW_VALUE];
    });
  }, []);

  const removeRtValue = useCallback((index: number) => {
    setRtList(current => {
      // Keep at least one RT value
      if (current.length > RT_CONSTRAINTS.MIN_COUNT) {
        return current.filter((_, i) => i !== index);
      }
      return current;
    });
  }, []);

  const resetRtList = useCallback(() => {
    setRtList(default_filters.Rt);
  }, []);

  return {
    rtList,
    updateRtValue,
    addRtValue,
    removeRtValue,
    resetRtList,
  };
};

/**
 * Custom hook for managing numeric input validation
 */
export const useNumericInput = <T extends number>(
  initialValue: T, 
  constraints: NumericConstraints
): NumericInputHook<T> => {
  const [value, setValue] = useState<T>(initialValue);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseFloat(event.target.value);
    
    if (!isNaN(inputValue) && 
        inputValue >= constraints.MIN && 
        inputValue <= constraints.MAX) {
      setValue(inputValue as T);
    }
  }, [constraints]);

  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  return [value, handleChange, reset] as NumericInputHook<T>;
};

/**
 * Custom hook for managing simulation state
 */
export const useSimulationState = (): SimulationStateHook => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const startLoading = useCallback(() => {
    setError(null);
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const setSimulationError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setSimulationError,
    clearError,
  };
};
