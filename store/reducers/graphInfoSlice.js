import { createSlice } from '@reduxjs/toolkit';
import { concat } from 'lodash';
import { HYDRATE } from 'next-redux-wrapper';

import {
  filterLines,
  hiddableLines,
  defaultVisibleLines,
  setNewSelectedLines
} from '../../utils/index';

import { dotFields } from '../../utils/descriptions';

const initialElements = (type) => {
  const defaultSelectedLines = defaultVisibleLines(type);
  return {
    scenario: filterLines(type, ['proy', dotFields[type]]),
    options: hiddableLines(type),
    selectedLines: defaultSelectedLines,
    showedElements: concat(hiddableLines(type, false), defaultSelectedLines),
    dotField: dotFields[type]
  };
};

const initialSettings = (amountOfData = 0) => {
  return {
    isSmooth: true,
    uncertainty: false,
    range: {
      start: 612,
      finish: amountOfData
    },
    dataLength: amountOfData
  };
};

const initialState = {
  reported: {
    type: 'reported',
    settings: initialSettings(),
    data: [],
    elements: initialElements('reported'),
    isReady: false
  },
  hospitalized: {
    type: 'hospitalized',
    settings: initialSettings(),
    data: [],
    elements: initialElements('hospitalized'),
    isReady: false
  },
  ICU: {
    type: 'ICU',
    settings: initialSettings(),
    data: [],
    elements: initialElements('ICU'),
    isReady: false
  },
  deceases: {
    type: 'deceases',
    settings: initialSettings(),
    data: [],
    elements: initialElements('deceases'),
    isReady: false
  }
};

export const graphInfoSlice = createSlice({
  name: 'graphInfo',
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
      action.payload.hospitalized.sort(function (a, b) {
        return new Date(a.fecha) - new Date(b.fecha);
      });
      state.hospitalized.data = action.payload.hospitalized;
      state.hospitalized.settings = initialSettings(amountOfData);
      state.hospitalized.isReady = true;
      action.payload.ICU.sort(function (a, b) {
        return new Date(a.fecha) - new Date(b.fecha);
      });
      state.ICU.data = action.payload.ICU;
      state.ICU.settings = initialSettings(amountOfData);
      state.ICU.isReady = true;
      action.payload.deceases.sort(function (a, b) {
        return new Date(a.fecha) - new Date(b.fecha);
      });
      state.deceases.data = action.payload.deceases;
      state.deceases.settings = initialSettings(amountOfData);
      state.deceases.isReady = true;
    },
    setSelectedLine(state, action) {
      const type = action.payload.type;
      const newSelectedLines = setNewSelectedLines(
        state[type].elements.selectedLines,
        action.payload.selectedLine
      );
      state[type].elements.selectedLines = newSelectedLines;
      state[type].elements.showedElements = concat(
        hiddableLines(type, false),
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
        finish: action.payload.finish
      };
    }
  },
  extraReducers(builder) {
    builder.addCase(HYDRATE, (_state, action) => {
      return action.payload;
    });
  }
});

export const selectGraphData = (state) =>
  Object.values(state).map(({ type, isReady }) => {
    return { type, isReady };
  });

export const selectScenarios = (type) => (state) => state[type].elements.scenario;

export const selectRawData = (type) => (state) => state[type].data;

export const selectShowedElements = (type) => (state) =>
  state[type].elements.showedElements;

export const selectDropdownInfo = (type) => (state) => {
  return [state[type].elements.options, state[type].elements.selectedLines];
};

export const selectSettings = (type) => (state) => state[type].settings;

export const selectSelectedLines = (type) => (state) =>
  state[type].elements.selectedLines;

export const selectIsSmooth = (type) => (state) => state[type].settings.isSmooth;

export const selectUncertainty = (type) => (state) => state[type].settings.uncertainty;

export const selectRange = (type) => (state) => state[type].settings.range;

export const selectDotField = (type) => (state) => state[type].elements.dotField;

export const { initGraphData, setSelectedLine, setChecks, resetChecks, setRange } =
  graphInfoSlice.actions;

export default graphInfoSlice.reducer;
