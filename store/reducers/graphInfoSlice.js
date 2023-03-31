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
    range: {
      start: 612,
      finish: amountOfData,
    },
    dataLength: amountOfData,
  };
};
const initialSettingsSingleLine = (amountOfData = 0) => {
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
      settings: initialSettingsSingleLine(),
    },
    cumulative_deaths: {
      type: "cumulative_deaths",
      data: [],
      settings: initialSettingsSingleLine(),
    },
    exposed: {
      type: "exposed",
      data: [],
      settings: initialSettingsSingleLine(),
    },
    hospitalized: {
      type: "hospitalized",
      data: [],
      settings: initialSettingsSingleLine(),
    },
    immune: { type: "immune", data: [], settings: initialSettingsSingleLine() },
    infectious: {
      type: "infectious",
      data: [],
      settings: initialSettingsSingleLine(),
    },
    susceptible: {
      type: "susceptible",
      data: [],
      settings: initialSettingsSingleLine(),
    },
    uci: { type: "uci", data: [], settings: initialSettingsSingleLine() },
  },
};

export const graphInfoSlice = createSlice({
  name: "graphInfo",
  initialState,
  reducers: {
    initMain(state, action) {
      const main = state.main;
      action.payload.reported.sort(function (a, b) {
        return new Date(a.fecha) - new Date(b.fecha);
      });
      const amountReported = action.payload.reported.length - 1;
      main.reported.data = action.payload.reported;
      main.reported.settings = initialSettings(amountReported);
      main.reported.isReady = true;
      action.payload.hospitalized.sort(function (a, b) {
        return new Date(a.fecha) - new Date(b.fecha);
      });
      const amountHospitalized = action.payload.hospitalized.length - 1;
      main.hospitalized.data = action.payload.hospitalized;
      main.hospitalized.settings = initialSettings(amountHospitalized);
      main.hospitalized.isReady = true;
      action.payload.ICU.sort(function (a, b) {
        return new Date(a.fecha) - new Date(b.fecha);
      });
      const amountICU = action.payload.ICU.length - 1;
      main.ICU.data = action.payload.ICU;
      main.ICU.settings = initialSettings(amountICU);
      main.ICU.isReady = true;
      action.payload.deceases.sort(function (a, b) {
        return new Date(a.fecha) - new Date(b.fecha);
      });
      const amountDeceases = action.payload.deceases.length - 1;
      main.deceases.data = action.payload.deceases;
      main.deceases.settings = initialSettings(amountDeceases);
      main.deceases.isReady = true;
    },
    initSimulation(state, action) {
      const simulation = state.simulation;
      const amount = action.payload.cumulative.length - 1;
      simulation.cumulative.data = action.payload.cumulative;
      simulation.cumulative.isReady = true;
      simulation.cumulative.settings = initialSettingsSingleLine(amount);

      simulation.cumulative_deaths.data = action.payload.cumulative_deaths;
      simulation.cumulative_deaths.isReady = true;
      simulation.cumulative_deaths.settings = initialSettingsSingleLine(amount);

      simulation.exposed.data = action.payload.exposed;
      simulation.exposed.isReady = true;
      simulation.exposed.settings = initialSettingsSingleLine(amount);

      simulation.hospitalized.data = action.payload.hospitalized;
      simulation.hospitalized.isReady = true;
      simulation.hospitalized.settings = initialSettingsSingleLine(amount);

      simulation.immune.data = action.payload.immune;
      simulation.immune.isReady = true;
      simulation.immune.settings = initialSettingsSingleLine(amount);

      simulation.infectious.data = action.payload.infectious;
      simulation.infectious.isReady = true;
      simulation.infectious.settings = initialSettingsSingleLine(amount);

      simulation.susceptible.data = action.payload.susceptible;
      simulation.susceptible.isReady = true;
      simulation.susceptible.settings = initialSettingsSingleLine(amount);

      simulation.uci.data = action.payload.uci;
      simulation.uci.isReady = true;
      simulation.uci.settings = initialSettingsSingleLine(amount);
    },
    setSelectedLine(state, action) {
      const main = state.main;
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
      const main = state.main;
      main[action.payload.type].settings[action.payload.checkName] =
        !main[action.payload.type].settings[action.payload.checkName];
    },
    resetChecks(state, action) {
      const main = state.main;
      const amountOfData = main[action.payload.type].settings.dataLength;
      main[action.payload.type].settings = initialSettings(amountOfData);
    },
    setRange(state, action) {
      state.main[action.payload.type].settings.range = {
        start: action.payload.start,
        finish: action.payload.finish,
      };
    },
  },
  extraReducers(builder) {
    builder.addCase(HYDRATE, (_state, action) => {
      return action.payload;
    });
  },
});

export const selectGraphData = ({ main }) =>
  Object.values(main).map(({ type, isReady }) => {
    return { type, isReady };
  });

export const selectSingleLineGraphData = ({ simulation }) =>
  Object.values(simulation).map(({ type, isReady }) => {
    return { type, isReady };
  });

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
  ({ main }) => {
    return [main[type].elements.options, main[type].elements.selectedLines];
  };

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

export const selectRange =
  (type) =>
  ({ main }) =>
    main[type].settings.range;

export const selectRangeSingleLine =
  (type) =>
  ({ simulation }) =>
    simulation[type].settings.range;

export const selectDotField =
  (type) =>
  ({ main }) =>
    main[type].elements.dotField;

export const {
  initMain,
  initSimulation,
  setSelectedLine,
  setChecks,
  resetChecks,
  setRange,
} = graphInfoSlice.actions;

export default graphInfoSlice.reducer;
