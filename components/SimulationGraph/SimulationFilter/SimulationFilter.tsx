import { useCallback, useState, useMemo } from "react";
import { default_filters } from "./constants";
import { useDispatch } from "react-redux";
import {
  setSimulation,
  setSimulationLoading,
  setSimulationUciThreshold,
} from "../../../store/reducers/graphInfoSlice";
import { useTranslation } from "next-i18next";
import { requestFilteredData, getSimulationErrorKey } from "./utils";
import { useRtList, useNumericInput, useSimulationState } from "./hooks";
import { NUMERIC_CONSTRAINTS, CSS_CLASSES } from "./constants";
import type { SimulationDefaults } from "../../../types/api";
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
 * - Free-text numeric fields with inline validation (rangos de NUMERIC_CONSTRAINTS)
 * - Loading states and error messages explained to the user (red, límite, servidor…)
 * - Internationalization support
 * - Responsive design
 */
interface SimulationFilterProps {
  /**
   * Valores iniciales (GET /api/v1/simulation-defaults). Si faltan se usan
   * default_filters como respaldo.
   */
  defaults?: SimulationDefaults | null;
}

function SimulationFilter({ defaults = null }: SimulationFilterProps) {
  const dispatch = useDispatch();
  const { t } = useTranslation("common");

  // Valores iniciales estables (los hooks los usan también para "Reiniciar")
  const initial = useMemo(
    () => ({
      Rt: defaults?.Rt ?? default_filters.Rt,
      UCI_threshold: defaults?.UCI_threshold ?? default_filters.UCI_threshold,
      V_filtered: defaults?.V_filtered ?? default_filters.V_filtered,
      lambda_I_to_H: defaults?.lambda_I_to_H ?? default_filters.lambda_I_to_H,
    }),
    [defaults],
  );

  // Custom hooks for state management
  const { rtList, updateRtValue, addRtValue, removeRtValue, resetRtList } =
    useRtList(initial.Rt);

  const uci = useNumericInput(initial.UCI_threshold, NUMERIC_CONSTRAINTS.UCI);
  const vFiltered = useNumericInput(
    initial.V_filtered,
    NUMERIC_CONSTRAINTS.V_FILTERED,
  );
  const lambdaItoH = useNumericInput(
    initial.lambda_I_to_H,
    NUMERIC_CONSTRAINTS.LAMBDA_I_TO_H,
  );

  const {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setSimulationError,
    clearError,
  } = useSimulationState();

  const hasInvalidFields = Boolean(
    uci.error || vFiltered.error || lambdaItoH.error,
  );

  const serialize = (u: number | null, v: number | null, l: number | null) =>
    JSON.stringify({
      Rt: rtList,
      UCI_threshold: u,
      V_filtered: v,
      lambda_I_to_H: l,
    });

  // Track last submitted params to disable button when nothing changed
  const [lastSubmitted, setLastSubmitted] = useState(() =>
    JSON.stringify(initial),
  );

  const current = serialize(uci.value, vFiltered.value, lambdaItoH.value);
  const hasChanges = useMemo(
    () => current !== lastSubmitted,
    [current, lastSubmitted],
  );

  // Event handlers
  const handleSimulation = useCallback(
    async (event) => {
      event.preventDefault();
      if (
        hasInvalidFields ||
        uci.value === null ||
        vFiltered.value === null ||
        lambdaItoH.value === null
      ) {
        return;
      }

      startLoading();
      dispatch(setSimulationLoading(true));

      const formValues = {
        Rt: JSON.stringify(rtList),
        UCI_threshold: uci.value,
        V_filtered: vFiltered.value,
        lambda_I_to_H: lambdaItoH.value,
      };

      try {
        const chartData = await requestFilteredData(formValues);
        setLastSubmitted(current);
        dispatch(setSimulationUciThreshold(uci.value));
        dispatch(
          setSimulation({
            cumulative: chartData.cumulative,
            cumulative_deaths: chartData.cumulative_deaths,
            exposed: chartData.exposed,
            hospitalized: chartData.hospitalized,
            immune: chartData.immune,
            infectious: chartData.infectious,
            susceptible: chartData.susceptible,
            uci: chartData.uci,
          }),
        );
      } catch (err: unknown) {
        console.warn(
          "Simulation error:",
          err instanceof Error ? err.message : err,
        );
        const { key, minutes } = getSimulationErrorKey(err);
        setSimulationError(t(key, { count: minutes, minutes }));
      } finally {
        stopLoading();
        dispatch(setSimulationLoading(false));
      }
    },
    [
      rtList,
      uci.value,
      vFiltered.value,
      lambdaItoH.value,
      hasInvalidFields,
      current,
      dispatch,
      startLoading,
      stopLoading,
      setSimulationError,
      t,
    ],
  );

  const { reset: resetUci } = uci;
  const { reset: resetVFiltered } = vFiltered;
  const { reset: resetLambdaItoH } = lambdaItoH;
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
      {/* noValidate: la validación la hace el formulario (mensajes propios y
          traducidos), no las burbujas nativas del navegador. */}
      <form
        className={CSS_CLASSES.CARD}
        onSubmit={handleSimulation}
        aria-label={t("simulation-title")}
        noValidate
      >
        <HeaderSection
          startDate={defaults?.startDate}
          estimatedRt={defaults?.estimatedRt}
        />

        <RtListSection
          rtList={rtList}
          onRtChange={updateRtValue}
          onAddRt={addRtValue}
          onRemoveRt={removeRtValue}
        />

        <InputFieldsSection
          uci={uci}
          vFiltered={vFiltered}
          lambdaItoH={lambdaItoH}
        />

        <ActionButtonsSection
          isLoading={isLoading}
          hasChanges={hasChanges}
          hasInvalidFields={hasInvalidFields}
          error={error}
          onSimulate={handleSimulation}
          onReset={handleReset}
        />
      </form>
    </div>
  );
}

export default SimulationFilter;
