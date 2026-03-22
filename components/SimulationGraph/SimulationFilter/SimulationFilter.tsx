import { useCallback, useState, useMemo } from "react";
import { default_filters } from "./constants";
import { useDispatch } from "react-redux";
import { setSimulation, setSimulationLoading, setSimulationUciThreshold } from "../../../store/reducers/graphInfoSlice";
import { useTranslation } from "next-i18next";
import { requestFilteredData } from "./utils";
import { useRtList, useNumericInput, useSimulationState } from "./hooks";
import { NUMERIC_CONSTRAINTS, CSS_CLASSES } from "./constants";
import {
  HeaderSection,
  RtListSection,
  InputFieldsSection,
  ActionButtonsSection,
} from "./components";

/**
 * SimulationFilter Component
 * 
 * A comprehensive form component for configuring and running epidemiological simulations.
 * Provides controls for RT values, UCI thresholds, vaccination rates, and hospitalization ratios.
 * 
 * Features:
 * - Dynamic RT list management (add/remove/modify values)
 * - Input validation with constraints
 * - Loading states and error handling
 * - Internationalization support
 * - Responsive design
 */
function SimulationFilter() {
  const dispatch = useDispatch();
  const { t } = useTranslation("common");

  // Custom hooks for state management
  const {
    rtList,
    updateRtValue,
    addRtValue,
    removeRtValue,
    resetRtList,
  } = useRtList();

  const [uci, handleUciChange, resetUci] = useNumericInput(
    default_filters.UCI_threshold,
    NUMERIC_CONSTRAINTS.UCI
  );

  const [vFiltered, handleVFilteredChange, resetVFiltered] = useNumericInput(
    default_filters.V_filtered,
    NUMERIC_CONSTRAINTS.V_FILTERED
  );

  const [lambdaItoH, handleLambdaItoHChange, resetLambdaItoH] = useNumericInput(
    default_filters.lambda_I_to_H,
    NUMERIC_CONSTRAINTS.LAMBDA_I_TO_H
  );

  const {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setSimulationError,
    clearError,
  } = useSimulationState();

  // Track last submitted params to disable button when nothing changed
  const [lastSubmitted, setLastSubmitted] = useState(() => JSON.stringify({
    Rt: default_filters.Rt,
    UCI_threshold: default_filters.UCI_threshold,
    V_filtered: default_filters.V_filtered,
    lambda_I_to_H: default_filters.lambda_I_to_H,
  }));

  const hasChanges = useMemo(() => {
    const current = JSON.stringify({ Rt: rtList, UCI_threshold: uci, V_filtered: vFiltered, lambda_I_to_H: lambdaItoH });
    return current !== lastSubmitted;
  }, [rtList, uci, vFiltered, lambdaItoH, lastSubmitted]);

  // Event handlers
  const handleSimulation = useCallback(async (event) => {
    event.preventDefault();

    startLoading();
    dispatch(setSimulationLoading(true));

    const formValues = {
      Rt: JSON.stringify(rtList),
      UCI_threshold: uci,
      V_filtered: vFiltered,
      lambda_I_to_H: lambdaItoH,
    };

    try {
      const chartData = await requestFilteredData(formValues);
      setLastSubmitted(JSON.stringify({ Rt: rtList, UCI_threshold: uci, V_filtered: vFiltered, lambda_I_to_H: lambdaItoH }));
      dispatch(setSimulationUciThreshold(uci));
      dispatch(setSimulation({
        cumulative: chartData.cumulative,
        cumulative_deaths: chartData.cumulative_deaths,
        exposed: chartData.exposed,
        hospitalized: chartData.hospitalized,
        immune: chartData.immune,
        infectious: chartData.infectious,
        susceptible: chartData.susceptible,
        uci: chartData.uci,
      }));
    } catch (err: unknown) {
      console.warn('Simulation error:', err instanceof Error ? err.message : err);
      const message = err instanceof Error ? err.message : String(err);
      setSimulationError(message || t('simulation-error'));
    } finally {
      stopLoading();
      dispatch(setSimulationLoading(false));
    }
  }, [rtList, uci, vFiltered, lambdaItoH, dispatch, startLoading, stopLoading, setSimulationError, setLastSubmitted, t]);

  const handleReset = useCallback(() => {
    resetRtList();
    resetUci();
    resetVFiltered();
    resetLambdaItoH();
    clearError();
    // Usar cadena vacía para que hasChanges sea true tras el reset,
    // habilitando el botón de simular con los valores por defecto
    setLastSubmitted("");
  }, [resetRtList, resetUci, resetVFiltered, resetLambdaItoH, clearError]);


  return (
    <div className={CSS_CLASSES.CONTAINER}>
      <form className={CSS_CLASSES.CARD} onSubmit={handleSimulation} aria-label={t("simulation-title")}>
        <HeaderSection />
        
        <RtListSection
          rtList={rtList}
          onRtChange={updateRtValue}
          onAddRt={addRtValue}
          onRemoveRt={removeRtValue}
        />
        
        <InputFieldsSection
          uci={uci}
          onUciChange={handleUciChange}
          vFiltered={vFiltered}
          onVFilteredChange={handleVFilteredChange}
          lambdaItoH={lambdaItoH}
          onLambdaItoHChange={handleLambdaItoHChange}
        />
        
        <ActionButtonsSection
          isLoading={isLoading}
          hasChanges={hasChanges}
          error={error}
          onSimulate={handleSimulation}
          onReset={handleReset}
        />
      </form>
    </div>
  );
}

export default SimulationFilter;
