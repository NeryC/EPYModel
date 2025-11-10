import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { concat } from "lodash";
import { HYDRATE } from "next-redux-wrapper";
import {
  filterLines,
  hiddableLines,
  defaultVisibleLines,
  setNewSelectedLines,
} from "../../utils/index";

interface LineItem {
  label: string;
  name: string;
  color?: string;
  hiddable?: boolean;
  default?: boolean;
  style?: "line" | "dashed" | "dot";
  description?: string;
}
import { dotFields } from "../../utils/descriptions";

// Type definitions
export interface DataPoint {
  fecha: string;
  [key: string]: any;
}

interface Range {
  start: number;
  finish: number;
}

interface Settings {
  isSmooth: boolean;
  uncertainty: boolean;
  dotsOption: boolean;
  range: Range;
  dataLength: number;
}

interface SimulationSettings {
  range: Range;
}

interface Elements {
  scenario: LineItem[];
  options: LineItem[];
  selectedLines: LineItem[];
  showedElements: LineItem[];
  dotField: string;
}

interface MainGraphData {
  type: string;
  settings: Settings;
  data: DataPoint[];
  elements: Elements;
  isReady: boolean;
}

interface SimulationGraphData {
  type: string;
  data: DataPoint[];
  settings: SimulationSettings;
  isReady?: boolean;
}

interface MainState {
  lastUpdateDate: string | null;
  reported: MainGraphData;
  hospitalized: MainGraphData;
  ICU: MainGraphData;
  deceases: MainGraphData;
}

interface SimulationState {
  cumulative: SimulationGraphData;
  cumulative_deaths: SimulationGraphData;
  exposed: SimulationGraphData;
  hospitalized: SimulationGraphData;
  immune: SimulationGraphData;
  infectious: SimulationGraphData;
  susceptible: SimulationGraphData;
  uci: SimulationGraphData;
}

interface GraphInfoState {
  main: MainState;
  simulation: SimulationState;
}

// Action payload types
interface InitMainPayload {
  reported: DataPoint[];
  hospitalized: DataPoint[];
  ICU: DataPoint[];
  deceases: DataPoint[];
}

interface SetSimulationPayload {
  cumulative: DataPoint[];
  cumulative_deaths: DataPoint[];
  exposed: DataPoint[];
  hospitalized: DataPoint[];
  immune: DataPoint[];
  infectious: DataPoint[];
  susceptible: DataPoint[];
  uci: DataPoint[];
}

type MainGraphType = "reported" | "hospitalized" | "ICU" | "deceases";

interface SetSelectedLinePayload {
  type: MainGraphType;
  selectedLine: LineItem;
}

interface SetChecksPayload {
  type: MainGraphType;
  checkName: keyof Settings;
}

interface ResetChecksPayload {
  type: MainGraphType;
}

interface ResetSelectedLinesPayload {
  type: MainGraphType;
}

interface SetRangePayload {
  type: MainGraphType;
  start: number;
  finish: number;
}

// Constants
const MAIN_GRAPH_TYPES: MainGraphType[] = [
  "reported",
  "hospitalized",
  "ICU",
  "deceases",
];
const SIMULATION_GRAPH_TYPES = [
  "cumulative",
  "cumulative_deaths",
  "exposed",
  "hospitalized",
  "immune",
  "infectious",
  "susceptible",
  "uci",
] as const;

// Helper functions
const sortDataByFecha = (a: DataPoint, b: DataPoint): number =>
  new Date(a.fecha).getTime() - new Date(b.fecha).getTime();

const createInitialElements = (type: string): Elements => {
  const defaultSelectedLines = defaultVisibleLines(type);
  return {
    scenario: filterLines(type, ["proy", dotFields[type]]),
    options: hiddableLines(type),
    selectedLines: defaultSelectedLines,
    showedElements: concat(hiddableLines(type, false), defaultSelectedLines),
    dotField: dotFields[type],
  };
};

const createInitialSettings = (amountOfData: number = 0): Settings => ({
  isSmooth: true,
  uncertainty: false,
  dotsOption: false,
  range: {
    start: 820,
    finish: amountOfData,
  },
  dataLength: amountOfData,
});

const createInitialSettingsSimulation = (
  amountOfData: number = 0
): SimulationSettings => ({
  range: {
    start: 0,
    finish: amountOfData,
  },
});

const createInitialMainGraphData = (type: string): MainGraphData => ({
  type,
  settings: createInitialSettings(),
  data: [],
  elements: createInitialElements(type),
  isReady: false,
});

const createInitialSimulationGraphData = (
  type: string
): SimulationGraphData => ({
  type,
  data: [],
  settings: createInitialSettingsSimulation(),
});

// Initial state
const initialState: GraphInfoState = {
  main: {
    lastUpdateDate: null,
    reported: createInitialMainGraphData("reported"),
    hospitalized: createInitialMainGraphData("hospitalized"),
    ICU: createInitialMainGraphData("ICU"),
    deceases: createInitialMainGraphData("deceases"),
  },
  simulation: {
    cumulative: createInitialSimulationGraphData("cumulative"),
    cumulative_deaths: createInitialSimulationGraphData("cumulative_deaths"),
    exposed: createInitialSimulationGraphData("exposed"),
    hospitalized: createInitialSimulationGraphData("hospitalized"),
    immune: createInitialSimulationGraphData("immune"),
    infectious: createInitialSimulationGraphData("infectious"),
    susceptible: createInitialSimulationGraphData("susceptible"),
    uci: createInitialSimulationGraphData("uci"),
  },
};

export const graphInfoSlice = createSlice({
  name: "graphInfo",
  initialState,
  reducers: {
    initMain(state, action: PayloadAction<InitMainPayload>) {
      const { main } = state;
      const { reported, hospitalized, ICU, deceases } = action.payload;

      // Process all data arrays with consistent sorting
      const processData = (data: DataPoint[], type: MainGraphType) => {
        const sortedData = [...data].sort(sortDataByFecha);
        const amount = sortedData.length - 1;

        main[type].data = sortedData;
        main[type].settings = createInitialSettings(amount);
        main[type].isReady = true;

        return sortedData;
      };

      // Process all graph types and collect all data for date calculation
      const reportedData = processData(reported, "reported");
      const hospitalizedData = processData(hospitalized, "hospitalized");
      const ICUData = processData(ICU, "ICU");
      const deceasesData = processData(deceases, "deceases");

      // Calculate last update date from the latest date across all data sources
      const allData = [
        ...reportedData,
        ...hospitalizedData,
        ...ICUData,
        ...deceasesData,
      ];

      if (allData.length > 0) {
        // Find the latest date across all data sources
        const latestDate = allData.reduce((latest, current) => {
          const currentDate = new Date(current.fecha);
          const latestDate = new Date(latest.fecha);
          return currentDate > latestDate ? current : latest;
        });

        main.lastUpdateDate = latestDate.fecha;
      }
    },

    setSimulation(state, action: PayloadAction<SetSimulationPayload>) {
      const { simulation } = state;
      const amount = action.payload.cumulative.length - 1;

      // Process all simulation data
      SIMULATION_GRAPH_TYPES.forEach((type) => {
        if (action.payload[type]) {
          simulation[type].data = action.payload[type];
          simulation[type].isReady = true;
          simulation[type].settings = createInitialSettingsSimulation(amount);
        }
      });
    },

    setSelectedLine(state, action: PayloadAction<SetSelectedLinePayload>) {
      const { main } = state;
      const { type, selectedLine } = action.payload;

      const newSelectedLines = setNewSelectedLines(
        main[type].elements.selectedLines,
        selectedLine
      );

      main[type].elements.selectedLines = newSelectedLines;
      main[type].elements.showedElements = concat(
        hiddableLines(type, false),
        newSelectedLines
      );
    },

    setChecks(state, action: PayloadAction<SetChecksPayload>) {
      const { main } = state;
      const { type, checkName } = action.payload;

      const currentValue = main[type].settings[checkName];
      if (typeof currentValue === "boolean") {
        (main[type].settings as any)[checkName] = !currentValue;
      }
    },

    resetChecks(state, action: PayloadAction<ResetChecksPayload>) {
      const { main } = state;
      const { type } = action.payload;
      const amountOfData = main[type].settings.dataLength;
      main[type].settings = createInitialSettings(amountOfData);
    },

    resetSelectedLines(
      state,
      action: PayloadAction<ResetSelectedLinesPayload>
    ) {
      const { main } = state;
      const { type } = action.payload;

      const defaultSelectedLines = defaultVisibleLines(type);
      main[type].elements.selectedLines = defaultSelectedLines;
      main[type].elements.showedElements = concat(
        hiddableLines(type, false),
        defaultSelectedLines
      );
    },

    setRange(state, action: PayloadAction<SetRangePayload>) {
      const { type, start, finish } = action.payload;
      state.main[type].settings.range = { start, finish };
    },
  },
  extraReducers(builder) {
    builder.addCase(HYDRATE, (state, action: any) => {
      return { ...state, ...action.payload };
    });
  },
});

// Optimized selectors with memoization
export const selectGraphData = createSelector(
  [
    (state: { [key: string]: any }) => state.main,
    (state: { [key: string]: any }) => state.simulation,
  ],
  (main, simulation) => {
    // Add null checks to prevent errors when state is not initialized
    if (!main || !simulation) {
      return {
        main: MAIN_GRAPH_TYPES.map((type) => ({ type, isReady: false })),
        simulation: SIMULATION_GRAPH_TYPES.map((type) => ({
          type,
          isReady: false,
        })),
      };
    }

    const mainGraphs = MAIN_GRAPH_TYPES.map((type) => ({
      type,
      isReady: main[type]?.isReady ?? false,
    }));

    const simulationGraphs = SIMULATION_GRAPH_TYPES.map((type) => ({
      type,
      isReady: simulation[type]?.isReady ?? false,
    }));

    return { main: mainGraphs, simulation: simulationGraphs };
  }
);

// Specific selector for simulation graphs (for backward compatibility)
export const selectSimulationGraphData = createSelector(
  [(state: GraphInfoState) => state.simulation],
  (simulation) => {
    if (!simulation) {
      return SIMULATION_GRAPH_TYPES.map((type) => ({ type, isReady: false }));
    }

    return SIMULATION_GRAPH_TYPES.map((type) => ({
      type,
      isReady: simulation[type]?.isReady ?? false,
    }));
  }
);

// Specific selector for main graphs
export const selectMainGraphData = createSelector(
  [(state: GraphInfoState) => state.main],
  (main) => {
    if (!main) {
      return MAIN_GRAPH_TYPES.map((type) => ({ type, isReady: false }));
    }

    return MAIN_GRAPH_TYPES.map((type) => ({
      type,
      isReady: main[type]?.isReady ?? false,
    }));
  }
);

export const selectScenarios = (type: MainGraphType) =>
  createSelector(
    [(state: GraphInfoState) => state.main?.[type]],
    (graphData) => graphData?.elements?.scenario ?? []
  );

export const selectRawData = (type: MainGraphType) =>
  createSelector(
    [(state: GraphInfoState) => state.main?.[type]],
    (graphData) => graphData?.data ?? []
  );

export const selectRawDataSimulation = (type: keyof SimulationState) =>
  createSelector(
    [(state: GraphInfoState) => state.simulation?.[type]],
    (graphData) => graphData?.data ?? []
  );

export const selectShowedElements = (type: MainGraphType) =>
  createSelector(
    [(state: GraphInfoState) => state.main?.[type]],
    (graphData) => graphData?.elements?.showedElements ?? []
  );

export const selectDropdownInfo = (type: MainGraphType) =>
  createSelector(
    [(state: GraphInfoState) => state.main?.[type]],
    (graphData) => [
      graphData?.elements?.options ?? [],
      graphData?.elements?.selectedLines ?? [],
    ]
  );

export const selectSettings = (type: MainGraphType) =>
  createSelector(
    [(state: GraphInfoState) => state.main?.[type]],
    (graphData) => graphData?.settings ?? createInitialSettings()
  );

export const selectSelectedLines = (type: MainGraphType) =>
  createSelector(
    [(state: GraphInfoState) => state.main?.[type]],
    (graphData) => graphData?.elements?.selectedLines ?? []
  );

export const selectIsSmooth = (type: MainGraphType) =>
  createSelector(
    [(state: GraphInfoState) => state.main?.[type]],
    (graphData) => graphData?.settings?.isSmooth ?? true
  );

export const selectUncertainty = (type: MainGraphType) =>
  createSelector(
    [(state: GraphInfoState) => state.main?.[type]],
    (graphData) => graphData?.settings?.uncertainty ?? false
  );

export const selectDotsOption = (type: MainGraphType) =>
  createSelector(
    [(state: GraphInfoState) => state.main?.[type]],
    (graphData) => graphData?.settings?.dotsOption ?? false
  );

export const selectRange = (graphsType: "main" | "simulation", type: string) =>
  createSelector(
    [
      (state: GraphInfoState) =>
        graphsType === "main" ? state.main : state.simulation,
    ],
    (graphState) => {
      if (!graphState) {
        return graphsType === "main"
          ? createInitialSettings().range
          : createInitialSettingsSimulation().range;
      }

      if (graphsType === "main") {
        return (
          graphState[type as MainGraphType]?.settings?.range ??
          createInitialSettings().range
        );
      } else {
        return (
          graphState[type as keyof SimulationState]?.settings?.range ??
          createInitialSettingsSimulation().range
        );
      }
    }
  );

export const selectDotField = (type: MainGraphType) =>
  createSelector(
    [(state: GraphInfoState) => state.main?.[type]],
    (graphData) => graphData?.elements?.dotField ?? ""
  );

export const selectLastUpdateDate = createSelector(
  [(state: GraphInfoState) => state.main],
  (main) => main?.lastUpdateDate ?? null
);

// Export actions
export const {
  initMain,
  setSimulation,
  setSelectedLine,
  setChecks,
  resetChecks,
  resetSelectedLines,
  setRange,
} = graphInfoSlice.actions;

export default graphInfoSlice.reducer;
