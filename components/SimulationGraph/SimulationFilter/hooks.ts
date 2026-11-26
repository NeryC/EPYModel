import { useState, useCallback, useMemo } from "react";
import { default_filters } from "./constants";
import { RT_CONSTRAINTS } from "./constants";
import {
  RtListHook,
  NumericConstraints,
  NumericInputHook,
  SimulationStateHook,
} from "./types";
import { parseNumericInput } from "./utils";

/**
 * Custom hook for managing RT list state and operations
 */
export const useRtList = (
  initialValue: number[] = default_filters.Rt,
): RtListHook => {
  const [rtList, setRtList] = useState(initialValue);

  const updateRtValue = useCallback(
    (index: number, action: "increment" | "decrement") => {
      const stepMatrix = {
        decrement: -RT_CONSTRAINTS.STEP_SIZE,
        increment: RT_CONSTRAINTS.STEP_SIZE,
      };

      setRtList((currentList) => {
        const newList = [...currentList];
        const currentValue = newList[index];
        const newValue = parseFloat(
          (currentValue + stepMatrix[action]).toFixed(1),
        );

        // Validate new value is within constraints
        if (
          newValue >= RT_CONSTRAINTS.MIN_VALUE &&
          newValue <= RT_CONSTRAINTS.MAX_VALUE
        ) {
          newList[index] = newValue;
          return newList;
        }
        return currentList; // Return unchanged if validation fails
      });
    },
    [],
  );

  const addRtValue = useCallback(() => {
    setRtList((current) => {
      if (current.length >= RT_CONSTRAINTS.MAX_COUNT) return current;
      return [...current, RT_CONSTRAINTS.DEFAULT_NEW_VALUE];
    });
  }, []);

  const removeRtValue = useCallback((index: number) => {
    setRtList((current) => {
      // Keep at least one RT value
      if (current.length > RT_CONSTRAINTS.MIN_COUNT) {
        return current.filter((_, i) => i !== index);
      }
      return current;
    });
  }, []);

  const resetRtList = useCallback(() => {
    setRtList(initialValue);
  }, [initialValue]);

  return {
    rtList,
    updateRtValue,
    addRtValue,
    removeRtValue,
    resetRtList,
  };
};

/**
 * Estado de un campo numérico.
 *
 * Guarda el TEXTO que escribe el usuario (no solo el número), así el campo se
 * puede vaciar y reescribir con normalidad. Antes se descartaba cualquier
 * texto inválido: borrar "100" dejaba "1" y escribir "80" producía "180";
 * escribir "6000" (fuera de rango) dejaba "600" sin avisar.
 */
export const useNumericInput = (
  initialValue: number,
  constraints: NumericConstraints,
): NumericInputHook => {
  const [text, setText] = useState<string>(String(initialValue));

  const { value, error } = useMemo(
    () => parseNumericInput(text, constraints),
    [text, constraints],
  );

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  }, []);

  const reset = useCallback(() => {
    setText(String(initialValue));
  }, [initialValue]);

  return { text, value, error, onChange, reset };
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
