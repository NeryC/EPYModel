import { createSlice } from "@reduxjs/toolkit";
import { concat } from "lodash";
import { HYDRATE } from "next-redux-wrapper";
import {
  filterLines,
  hiddableLines,
  defaultVisibleLines,
  setNewSelectedLines,
} from "../../utils/index";
import { dotFields } from "../../utils/descriptions";

const initialElements = (type) => {
  const defaultSelectedLines = defaultVisibleLines(type);
  return {
    scenario: filterLines(type, ["proy", dotFields[type]]),
    options: hiddableLines(type),
    selectedLines: defaultSelectedLines,
    showedElements: concat(hiddableLines(type, false), defaultSelectedLines),
    dotField: dotFields[type],
  };
};

const initialSettings = (amountOfData = 0) => {
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

const initialSettingsSimulation = (amountOfData = 0) => {
  return {
    range: {
      start: 0,
      finish: amountOfData,
    },
  };
};

const initialState = {
  main: {
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
    immune: { type: "immune", data: [], settings: initialSettingsSimulation() },
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
    uci: { type: "uci", data: [], settings: initialSettingsSimulation() },
  },
};

export const graphInfoSlice = createSlice({
  name: "graphInfo",
  initialState,
  reducers: {
    initMain(state, action) {
      const { main } = state;

      const sortDataByFecha = (a, b) => new Date(a.fecha) - new Date(b.fecha);

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
    },
    setSimulation(state, action) {
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
    setSelectedLine(state, action) {
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
    setChecks(state, action) {
      const { main } = state;
      const { type, checkName } = action.payload;
      main[type].settings[checkName] = !main[type].settings[checkName];
    },
    resetChecks(state, action) {
      const { main } = state;
      const { type } = action.payload;
      const amountOfData = main[type].settings.dataLength;
      main[type].settings = initialSettings(amountOfData);
    },
    setRange(state, action) {
      const { type, start, finish } = action.payload;
      state.main[type].settings.range = { start, finish };
    },
  },
  extraReducers(builder) {
    builder.addCase(HYDRATE, (state, action) => {
      return { ...state, ...action.payload };
    });
  },
});

export const selectGraphData = (graphsType) => (state) =>
  Object.values(state[graphsType]).map(({ type, isReady }) => ({
    type,
    isReady,
  }));

export const selectScenarios =
  (type) =>
  ({ main }) =>
    main[type].elements.scenario;

export const selectRawData =
  (type) =>
  ({ main }) =>
    main[type].data;

export const selectRawDataSimulation =
  (type) =>
  ({ simulation }) =>
    simulation[type].data;

export const selectShowedElements =
  (type) =>
  ({ main }) =>
    main[type].elements.showedElements;

export const selectDropdownInfo =
  (type) =>
  ({ main }) =>
    [main[type].elements.options, main[type].elements.selectedLines];

export const selectSettings =
  (type) =>
  ({ main }) =>
    main[type].settings;

export const selectSelectedLines =
  (type) =>
  ({ main }) =>
    main[type].elements.selectedLines;

export const selectIsSmooth =
  (type) =>
  ({ main }) =>
    main[type].settings.isSmooth;

export const selectUncertainty =
  (type) =>
  ({ main }) =>
    main[type].settings.uncertainty;

export const selectDotsOption =
  (type) =>
  ({ main }) =>
    main[type].settings.dotsOption;

export const selectRange = (graphsType, type) => (state) =>
  state[graphsType][type].settings.range;

export const selectDotField =
  (type) =>
  ({ main }) =>
    main[type].elements.dotField;

export const {
  initMain,
  setSimulation,
  setSelectedLine,
  setChecks,
  resetChecks,
  setRange,
} = graphInfoSlice.actions;

export default graphInfoSlice.reducer;
