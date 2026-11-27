/**
 * TypeScript types and interfaces for SimulationFilter component
 */

// RT List types
export interface RtListHook {
  rtList: number[];
  updateRtValue: (index: number, action: "increment" | "decrement") => void;
  addRtValue: () => void;
  removeRtValue: (index: number) => void;
  resetRtList: () => void;
}

// Numeric input types
export interface NumericConstraints {
  MIN: number;
  MAX: number;
  STEP?: number;
  /** Solo se aceptan números enteros (camas, personas). */
  INTEGER?: boolean;
}

/** Motivo por el que el texto de un campo numérico no es un valor válido. */
export type NumericInputError = "required" | "out-of-range" | "not-integer";

export interface NumericInputHook {
  /** Texto tal como lo escribió el usuario (puede estar vacío o fuera de rango). */
  text: string;
  /** Valor numérico válido, o null si el texto no lo es. */
  value: number | null;
  error: NumericInputError | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  reset: () => void;
}

export interface NumericFieldProps {
  field: NumericInputHook;
  constraints: NumericConstraints;
}

// Simulation state types
export interface SimulationStateHook {
  isLoading: boolean;
  error: string | null;
  startLoading: () => void;
  stopLoading: () => void;
  setSimulationError: (errorMessage: string) => void;
  clearError: () => void;
}

// Component prop types
export interface ErrorMessageProps {
  error: string | null;
}

export interface LoadingButtonProps {
  isLoading: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  /** Texto (ya traducido) que explica por qué el botón está deshabilitado. */
  disabledReason?: string;
  children: React.ReactNode;
  className?: string;
}

export interface SecondaryButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export interface RtListSectionProps {
  rtList: number[];
  onRtChange: (index: number, action: "increment" | "decrement") => void;
  onAddRt: () => void;
  onRemoveRt: (index: number) => void;
}

export interface RtActionButtonsProps {
  rtListLength: number;
  onAdd: () => void;
  onRemove: () => void;
}

export interface InputFieldsSectionProps {
  uci: NumericInputHook;
  vFiltered: NumericInputHook;
  lambdaItoH: NumericInputHook;
}

export interface ActionButtonsSectionProps {
  isLoading: boolean;
  hasChanges: boolean;
  /** Hay algún campo con un valor inválido. */
  hasInvalidFields: boolean;
  error: string | null;
  onSimulate: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onReset: () => void;
}

// Constants types
export interface RtConstraints {
  MIN_VALUE: number;
  MAX_VALUE: number;
  STEP_SIZE: number;
  DEFAULT_NEW_VALUE: number;
  MIN_COUNT: number;
  MAX_COUNT: number;
}

export interface NumericConstraintsMap {
  UCI: NumericConstraints;
  V_FILTERED: NumericConstraints;
  LAMBDA_I_TO_H: Required<Omit<NumericConstraints, "INTEGER">>;
}

export interface CssClasses {
  CONTAINER: string;
  CARD: string;
  TITLE: string;
  SECTION_ROW: string;
  LABEL: string;
  RT_CONTAINER: string;
  RT_BUTTON_CONTAINER: string;
  INPUTS_ROW: string;
  ACTIONS_CONTAINER: string;
  ERROR_MESSAGE: string;
  ACTIONS_ROW: string;
  BUTTON: {
    PRIMARY: string;
    PRIMARY_LOADING: string;
    PRIMARY_NORMAL: string;
    PRIMARY_DISABLED: string;
    SECONDARY: string;
    RT_ADD: string;
    RT_REMOVE: string;
  };
  SPINNER: string;
}

export interface AriaLabels {
  ADD_RT: string;
  REMOVE_RT: string;
}
