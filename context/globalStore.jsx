import React, { createContext, useReducer } from "react";
import { sortD3, parseD3 } from '../utils/constants';
import { filterLines, hiddableLines, defaultVisibleLines } from '../utils/index';
import { concat } from "lodash";
import { Provider } from 'react-redux'

const initialState = {
  reported: [],
  hopitalized: [],
  ICU: [],
  deceases: []
};

const initialSettings = (lastDate)=> {
  return{
    isSmooth: true,
    uncertainty: false,
    range: { 
      start: 0,
      finish: lastDate
    }
  }
};

const initialElements = ()=> {
  const defaultSelectedLines = defaultVisibleLines();
  return{
    scenario: filterLines(["proy", "Reportados"]),
    options: hiddableLines(),
    selectedLines: defaultSelectedLines,
    showedElements: concat(hiddableLines(false), defaultSelectedLines)
  }
};

export const Context = createContext(initialState);


const Reducer = (state, { type, payload }) => {
  switch (type) {
    case "SET_GRAPH_INFO":
      const settings = initialSettings(payload.reported.length-1)
      parseD3(payload.reported);
      sortD3(payload.reported);
      return {
        ...state,
        reported: {
          type: 'reported',
          settings: settings,
          data: payload.reported,
          elements: initialElements()     
        },
        hopitalized: {
          type: 'hopitalized',
          settings: settings,
          data: payload.hopitalized
        },
        ICU: {
          type: 'ICU',
          settings: settings,
          data: payload.ICU
        },
        deceases: {
          type: 'deceases',
          settings: settings,
          data: payload.deceases
        },
      };
    case "SET_SELECTED_LINE":
      return {
        ...state,
        [payload.graphType]: {
          ...state[payload.graphType],
          elements:{
            ...state[payload.graphType].elements,
            selectedLines: payload.item,
            showedElements: concat(hiddableLines(false), payload.item)
          }
        }  
      };
    case "RESET_REPORTED_SETTINGS":
      return {
        ...state,
        reported: {
          ...state.reported,
          settings: initialSettings(state.reported.data.length-1),
        }
      };
    case "SET_REPORTED_CHECKS":
      return {
        ...state,
        reported: {
          ...state.reported,
          settings: {
            ...state.reported.settings,
            ...payload,
            range: {
              ...state.reported.settings.range
            }
          },
        }
      };
    case "SET_REPORTED_RANGE":
      return {
        ...state,
        reported: {
          ...state.reported,
          settings: {
            ...state.reported.settings,
            range: {
              ...payload
            }
          },
        }
      };
    default:
      return state;
  }
};

const GlobalStore = ({ children }) => {
  // const [state, dispatch] = useReducer(Reducer, initialState);
  return (
    <Provider store={store}>
      {children}
    </Provider>
    // <Context.Provider value={{ dispatch, state }}>{children}</Context.Provider>
  );
};

export const State = () => useContext(Context);
export default GlobalStore;
