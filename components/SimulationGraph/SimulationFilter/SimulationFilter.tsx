import React, { useCallback } from "react";
import { default_filters } from "./constants.ts";
import { useDispatch } from "react-redux";
import { setSimulation } from "../../../store/reducers/graphInfoSlice.ts";
import { useTranslation } from "next-i18next";
import { requestFilteredData } from "./utils.ts";
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

  // Event handlers
  const handleSimulation = useCallback(async (event) => {
    event.preventDefault();
    
    startLoading();
    
    const formValues = {
      Rt: JSON.stringify(rtList),
      UCI_threshold: uci,
      V_filtered: vFiltered,
      lambda_I_to_H: lambdaItoH,
    };
    
    try {
      const chartData = await requestFilteredData(formValues);
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
    } catch (error) {
      console.error('Simulation error:', error);
      setSimulationError(error.message || t('simulation-error'));
    } finally {
      stopLoading();
    }
  }, [rtList, uci, vFiltered, lambdaItoH, dispatch, startLoading, stopLoading, setSimulationError, t]);

  const handleReset = useCallback(() => {
    resetRtList();
    resetUci();
    resetVFiltered();
    resetLambdaItoH();
    clearError();
  }, [resetRtList, resetUci, resetVFiltered, resetLambdaItoH, clearError]);


  return (
    <div className={CSS_CLASSES.CONTAINER}>
      <div className={CSS_CLASSES.CARD}>
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
          error={error}
          onSimulate={handleSimulation}
          onReset={handleReset}
        />
      </div>
    </div>
  );
}

export default SimulationFilter;
