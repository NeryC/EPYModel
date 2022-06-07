import React, { createContext, useReducer } from "react";
import { sortD3, parseD3 } from '../utils/constants';

const initialState = {
  reported: [],
  hopitalized: [],
  ICU: [],
  deceases: []
};

export const Context = createContext(initialState);


const Reducer = (state, { type, payload }) => {
  switch (type) {
    case "SET_GRAPH_INFO":
      parseD3(payload.reported);
      sortD3(payload.reported);
      return {
        ...state,
        reported: payload.reported,
        hopitalized: payload.hopitalized,
        ICU: payload.ICU,
        deceases: payload.deceases,
      };
    default:
      return state;
  }
};

const GlobalStore = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  return (
    <Context.Provider value={{ dispatch, state }}>{children}</Context.Provider>
  );
};

export const State = () => useContext(Context);
export default GlobalStore;
