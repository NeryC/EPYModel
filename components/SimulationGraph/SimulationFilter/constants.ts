import { RtConstraints, NumericConstraintsMap, CssClasses, AriaLabels } from './types';

/**
 * Constants for SimulationFilter component
 */

// RT value constraints
export const RT_CONSTRAINTS: RtConstraints = {
  MIN_VALUE: 0,
  MAX_VALUE: 2.0,
  STEP_SIZE: 0.1,
  DEFAULT_NEW_VALUE: 1.0,
  MIN_COUNT: 1,
} as const;

// UCI and VFiltered constraints
export const NUMERIC_CONSTRAINTS: NumericConstraintsMap = {
  UCI: {
    MIN: 0,
    MAX: 5000,
  },
  V_FILTERED: {
    MIN: 0,
    MAX: 5000,
  },
  LAMBDA_I_TO_H: {
    MIN: 0,
    MAX: 1,
  },
} as const;

// CSS Classes
export const CSS_CLASSES: CssClasses = {
  CONTAINER: "flex justify-end grow text-base",
  CARD: "rounded-lg shadow-lg bg-white p-3 md:p-6 flex flex-col gap-3 border border-gray-theme text-black mb-4 grow md:min-w-[500px] md:max-w-[650px]",
  TITLE: "border-b border-gray-theme pb-1 w-full font-bold",
  SECTION_ROW: "flex flex-col md:flex-row gap-3 md:gap-1 items-center",
  LABEL: "md:text-sm font-bold max-w-[85px] flex items-center pr-2",
  RT_CONTAINER: "flex flex-wrap gap-4 w-full",
  RT_BUTTON_CONTAINER: "flex flex-row gap-2",
  INPUTS_ROW: "flex gap-4",
  ACTIONS_CONTAINER: "flex flex-col gap-2",
  ERROR_MESSAGE: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm",
  ACTIONS_ROW: "flex gap-2",
  
  // Button classes
  BUTTON: {
    PRIMARY: "flex items-center justify-center gap-2 px-4 py-2 text-white font-bold rounded-md transition-all duration-200",
    PRIMARY_LOADING: "bg-indigo-600 cursor-not-allowed opacity-80 animate-pulse",
    PRIMARY_NORMAL: "bg-indigo-500 hover:bg-indigo-600",
    PRIMARY_DISABLED: "bg-indigo-300 cursor-not-allowed",
    SECONDARY: "items-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-md",
    RT_ADD: "text-white bg-indigo-500 hover:bg-indigo-600 font-bold text-xl rounded-md p-2",
    RT_REMOVE: "text-white bg-red-500 hover:bg-red-600 text-xl rounded-md p-2",
  },

  // Spinner classes
  SPINNER: "animate-spin h-5 w-5 text-white flex-shrink-0",
} as const;

// ARIA Labels
export const ARIA_LABELS: AriaLabels = {
  ADD_RT: "Add Rt value",
  REMOVE_RT: "Remove Rt value",
} as const;


// Default filters (keeping original for compatibility)
interface DefaultFilters {
  Rt: number[];
  UCI_threshold: number;
  V_filtered: number;
  lambda_I_to_H: number;
}

export const default_filters: DefaultFilters = {
  Rt: [1.1, 1.2, 1.3, 0.8, 0.7, 0.9],
  UCI_threshold: 100,
  V_filtered: 1000,
  lambda_I_to_H: 0.5,
};