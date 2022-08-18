import { createSlice } from "@reduxjs/toolkit";
import { concat } from "lodash";
import { HYDRATE } from "next-redux-wrapper";

import {
  filterLines,
  hiddableLines,
  defaultVisibleLines,
  setNewSelectedLines,
} from "../../utils/index";

const initialElements = () => {
  const defaultSelectedLines = defaultVisibleLines();
  return {
    scenario: filterLines(["proy", "Reportados"]),
    options: hiddableLines(),
    selectedLines: defaultSelectedLines,
    showedElements: concat(hiddableLines(false), defaultSelectedLines),
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

const initialState = {
  reported: {
    type: "reported",
    settings: initialSettings(),
    data: [],
    elements: initialElements(),
    isReady: false,
  },
  hopitalized: {
    type: "hopitalized",
    settings: initialSettings(),
    data: [],
    elements: initialElements(),
    isReady: false,
  },
  ICU: {
    type: "ICU",
    settings: initialSettings(),
    data: [],
    elements: initialElements(),
    isReady: false,
  },
  deceases: {
    type: "deceases",
    settings: initialSettings(),
    data: [],
    elements: initialElements(),
    isReady: false,
  },
};

export const graphInfoSlice = createSlice({
  name: "graphInfo",
  initialState,
  reducers: {
    initGraphData(state, action) {
      action.payload.reported.sort(function (a, b) {
        return new Date(a.fecha) - new Date(b.fecha);
      });
      const amountOfData = action.payload.reported.length - 1;
      state.reported.data = action.payload.reported;
      state.reported.settings = initialSettings(amountOfData);
      state.reported.isReady = true;
      state.hopitalized.data = action.payload.hopitalized;
      state.hopitalized.settings = initialSettings(amountOfData);
      state.hopitalized.isReady = true;
      state.ICU.data = action.payload.ICU;
      state.ICU.settings = initialSettings(amountOfData);
      state.ICU.isReady = true;
      state.deceases.data = action.payload.deceases;
      state.deceases.settings = initialSettings(amountOfData);
      state.deceases.isReady = true;
    },
    setSelectedLine(state, action) {
      const newSelectedLines = setNewSelectedLines(
        state[action.payload.type].elements.selectedLines,
        action.payload.selectedLine
      );
      state[action.payload.type].elements.selectedLines = newSelectedLines;
      state[action.payload.type].elements.showedElements = concat(
        hiddableLines(false),
        newSelectedLines
      );
    },
    setChecks(state, action) {
      state[action.payload.type].settings[action.payload.checkName] =
        !state[action.payload.type].settings[action.payload.checkName];
    },
    resetChecks(state, action) {
      const amountOfData = state[action.payload.type].settings.dataLength;
      state[action.payload.type].settings = initialSettings(amountOfData);
    },
    setRange(state, action) {
      state[action.payload.type].settings.range = {
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

export const selectGraphData = (state) =>
  Object.values(state).map(({ type, isReady }) => {
    return { type, isReady };
  });

export const selectScenarios = (type) => (state) =>
  state[type].elements.scenario;

export const selectRawData = (type) => (state) => state[type].data;

export const selectShowedElements = (type) => (state) =>
  state[type].elements.showedElements;

export const selectDropdownInfo = (type) => (state) => {
  return [state[type].elements.options, state[type].elements.selectedLines];
};

export const selectSettings = (type) => (state) => state[type].settings;

export const selectSelectedLines = (type) => (state) =>
  state[type].elements.selectedLines;

export const selectIsSmooth = (type) => (state) =>
  state[type].settings.isSmooth;

export const selectUncertainty = (type) => (state) =>
  state[type].settings.uncertainty;

export const selectRange = (type) => (state) => state[type].settings.range;

export const {
  initGraphData,
  setSelectedLine,
  setChecks,
  resetChecks,
  setRange,
} = graphInfoSlice.actions;

export default graphInfoSlice.reducer;
