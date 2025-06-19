import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { concat } from "lodash";
import { HYDRATE } from "next-redux-wrapper";
import {
  filterLines,
  hiddableLines,
  defaultVisibleLines,
  setNewSelectedLines,
} from "../../utils/index";
import { dotFields } from "../../utils/descriptions";

// Type definitions
interface DataPoint {
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
  scenario: string[];
  options: string[];
  selectedLines: string[];
  showedElements: string[];
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

interface SetSelectedLinePayload {
  type: "reported" | "hospitalized" | "ICU" | "deceases";
  selectedLine: string;
}

interface SetChecksPayload {
  type: "reported" | "hospitalized" | "ICU" | "deceases";
  checkName: keyof Settings;
}

interface ResetChecksPayload {
  type: "reported" | "hospitalized" | "ICU" | "deceases";
}

interface ResetSelectedLinesPayload {
  type: "reported" | "hospitalized" | "ICU" | "deceases";
}

interface SetRangePayload {
  type: "reported" | "hospitalized" | "ICU" | "deceases";
  start: number;
  finish: number;
}

const initialElements = (type: string): Elements => {
  const defaultSelectedLines = defaultVisibleLines(type);
  return {
    scenario: filterLines(type, ["proy", dotFields[type]]),
    options: hiddableLines(type),
    selectedLines: defaultSelectedLines,
    showedElements: concat(hiddableLines(type, false), defaultSelectedLines),
    dotField: dotFields[type],
  };
};

const initialSettings = (amountOfData: number = 0): Settings => {
  return {
    isSmooth: true,
    uncertainty: false,
    dotsOption: false,
    range: {
      start: 820,
      finish: amountOfData,
    },
    dataLength: amountOfData,
  };
};

const initialSettingsSimulation = (
  amountOfData: number = 0
): SimulationSettings => {
  return {
    range: {
      start: 0,
      finish: amountOfData,
    },
  };
};

const initialState: GraphInfoState = {
  main: {
    lastUpdateDate: null,
    reported: {
      type: "reported",
      settings: initialSettings(),
      data: [],
      elements: initialElements("reported"),
      isReady: false,
    },
    hospitalized: {
      type: "hospitalized",
      settings: initialSettings(),
      data: [],
      elements: initialElements("hospitalized"),
      isReady: false,
    },
    ICU: {
      type: "ICU",
      settings: initialSettings(),
      data: [],
      elements: initialElements("ICU"),
      isReady: false,
    },
    deceases: {
      type: "deceases",
      settings: initialSettings(),
      data: [],
      elements: initialElements("deceases"),
      isReady: false,
    },
  },
  simulation: {
    cumulative: {
      type: "cumulative",
      data: [],
      settings: initialSettingsSimulation(),
    },
    cumulative_deaths: {
      type: "cumulative_deaths",
      data: [],
      settings: initialSettingsSimulation(),
    },
    exposed: {
      type: "exposed",
      data: [],
      settings: initialSettingsSimulation(),
    },
    hospitalized: {
      type: "hospitalized",
      data: [],
      settings: initialSettingsSimulation(),
    },
    immune: {
      type: "immune",
      data: [],
      settings: initialSettingsSimulation(),
    },
    infectious: {
      type: "infectious",
      data: [],
      settings: initialSettingsSimulation(),
    },
    susceptible: {
      type: "susceptible",
      data: [],
      settings: initialSettingsSimulation(),
    },
    uci: {
      type: "uci",
      data: [],
      settings: initialSettingsSimulation(),
    },
  },
};

export const graphInfoSlice = createSlice({
  name: "graphInfo",
  initialState,
  reducers: {
    initMain(state, action: PayloadAction<InitMainPayload>) {
      const { main } = state;

      const sortDataByFecha = (a: DataPoint, b: DataPoint) =>
        new Date(a.fecha).getTime() - new Date(b.fecha).getTime();

      action.payload.reported.sort(sortDataByFecha);
      const amountReported = action.payload.reported.length - 1;
      main.reported.data = action.payload.reported;
      main.reported.settings = initialSettings(amountReported);
      main.reported.isReady = true;

      action.payload.hospitalized.sort(sortDataByFecha);
      const amountHospitalized = action.payload.hospitalized.length - 1;
      main.hospitalized.data = action.payload.hospitalized;
      main.hospitalized.settings = initialSettings(amountHospitalized);
      main.hospitalized.isReady = true;

      action.payload.ICU.sort(sortDataByFecha);
      const amountICU = action.payload.ICU.length - 1;
      main.ICU.data = action.payload.ICU;
      main.ICU.settings = initialSettings(amountICU);
      main.ICU.isReady = true;

      action.payload.deceases.sort(sortDataByFecha);
      const amountDeceases = action.payload.deceases.length - 1;
      main.deceases.data = action.payload.deceases;
      main.deceases.settings = initialSettings(amountDeceases);
      main.deceases.isReady = true;

      // Calcular la última fecha usando solo reported (todos los datos tienen las mismas fechas)
      const lastDate = new Date(
        action.payload.reported[action.payload.reported.length - 1].fecha
      );
      main.lastUpdateDate = lastDate.toISOString();
    },
    setSimulation(state, action: PayloadAction<SetSimulationPayload>) {
      const { simulation } = state;
      const amount = action.payload.cumulative.length - 1;

      simulation.cumulative.data = action.payload.cumulative;
      simulation.cumulative.isReady = true;
      simulation.cumulative.settings = initialSettingsSimulation(amount);

      simulation.cumulative_deaths.data = action.payload.cumulative_deaths;
      simulation.cumulative_deaths.isReady = true;
      simulation.cumulative_deaths.settings = initialSettingsSimulation(amount);

      simulation.exposed.data = action.payload.exposed;
      simulation.exposed.isReady = true;
      simulation.exposed.settings = initialSettingsSimulation(amount);

      simulation.hospitalized.data = action.payload.hospitalized;
      simulation.hospitalized.isReady = true;
      simulation.hospitalized.settings = initialSettingsSimulation(amount);

      simulation.immune.data = action.payload.immune;
      simulation.immune.isReady = true;
      simulation.immune.settings = initialSettingsSimulation(amount);

      simulation.infectious.data = action.payload.infectious;
      simulation.infectious.isReady = true;
      simulation.infectious.settings = initialSettingsSimulation(amount);

      simulation.susceptible.data = action.payload.susceptible;
      simulation.susceptible.isReady = true;
      simulation.susceptible.settings = initialSettingsSimulation(amount);

      simulation.uci.data = action.payload.uci;
      simulation.uci.isReady = true;
      simulation.uci.settings = initialSettingsSimulation(amount);
    },
    setSelectedLine(state, action: PayloadAction<SetSelectedLinePayload>) {
      const { main } = state;
      const type = action.payload.type;
      const newSelectedLines = setNewSelectedLines(
        main[type].elements.selectedLines,
        action.payload.selectedLine
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
      main[type].settings = initialSettings(amountOfData);
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

// Selector types
export const selectGraphData =
  (graphsType: "main" | "simulation") => (state: { [key: string]: any }) =>
    Object.values(state[graphsType]).map(
      ({ type, isReady }: { type: string; isReady?: boolean }) => ({
        type,
        isReady,
      })
    );

export const selectScenarios =
  (type: "reported" | "hospitalized" | "ICU" | "deceases") =>
  ({ main }: GraphInfoState) =>
    main[type].elements.scenario;

export const selectRawData =
  (type: "reported" | "hospitalized" | "ICU" | "deceases") =>
  ({ main }: GraphInfoState) =>
    main[type].data;

export const selectRawDataSimulation =
  (type: keyof SimulationState) =>
  ({ simulation }: GraphInfoState) =>
    simulation[type].data;

export const selectShowedElements =
  (type: "reported" | "hospitalized" | "ICU" | "deceases") =>
  ({ main }: GraphInfoState) =>
    main[type].elements.showedElements;

export const selectDropdownInfo =
  (type: "reported" | "hospitalized" | "ICU" | "deceases") =>
  ({ main }: GraphInfoState) =>
    [main[type].elements.options, main[type].elements.selectedLines];

export const selectSettings =
  (type: "reported" | "hospitalized" | "ICU" | "deceases") =>
  ({ main }: GraphInfoState) =>
    main[type].settings;

export const selectSelectedLines =
  (type: "reported" | "hospitalized" | "ICU" | "deceases") =>
  ({ main }: GraphInfoState) =>
    main[type].elements.selectedLines;

export const selectIsSmooth =
  (type: "reported" | "hospitalized" | "ICU" | "deceases") =>
  ({ main }: GraphInfoState) =>
    main[type].settings.isSmooth;

export const selectUncertainty =
  (type: "reported" | "hospitalized" | "ICU" | "deceases") =>
  ({ main }: GraphInfoState) =>
    main[type].settings.uncertainty;

export const selectDotsOption =
  (type: "reported" | "hospitalized" | "ICU" | "deceases") =>
  ({ main }: GraphInfoState) =>
    main[type].settings.dotsOption;

export const selectRange =
  (graphsType: "main" | "simulation", type: string) =>
  (state: GraphInfoState) => {
    if (graphsType === "main") {
      return state.main[
        type as "reported" | "hospitalized" | "ICU" | "deceases"
      ].settings.range;
    } else {
      return state.simulation[type as keyof SimulationState].settings.range;
    }
  };

export const selectDotField =
  (type: "reported" | "hospitalized" | "ICU" | "deceases") =>
  ({ main }: GraphInfoState) =>
    main[type].elements.dotField;

export const selectLastUpdateDate = ({ main }: GraphInfoState) =>
  main.lastUpdateDate;

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
