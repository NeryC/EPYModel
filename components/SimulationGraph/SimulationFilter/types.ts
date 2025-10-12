/**
 * TypeScript types and interfaces for SimulationFilter component
 */

// RT List types
export interface RtListHook {
  rtList: number[];
  updateRtValue: (index: number, action: 'increment' | 'decrement') => void;
  addRtValue: () => void;
  removeRtValue: (index: number) => void;
  resetRtList: () => void;
}

// Numeric input types
export interface NumericConstraints {
  MIN: number;
  MAX: number;
}

export interface NumericInputHook<T> {
  0: T;
  1: (event: React.ChangeEvent<HTMLInputElement>) => void;
  2: () => void;
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
  onRtChange: (index: number, action: 'increment' | 'decrement') => void;
  onAddRt: () => void;
  onRemoveRt: (index: number) => void;
}

export interface RtActionButtonsProps {
  rtListLength: number;
  onAdd: () => void;
  onRemove: () => void;
}

export interface InputFieldsSectionProps {
  uci: number;
  onUciChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  vFiltered: number;
  onVFilteredChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  lambdaItoH: number;
  onLambdaItoHChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ActionButtonsSectionProps {
  isLoading: boolean;
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
}

export interface NumericConstraintsMap {
  UCI: NumericConstraints;
  V_FILTERED: NumericConstraints;
  LAMBDA_I_TO_H: NumericConstraints;
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
