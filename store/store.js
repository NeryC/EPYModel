import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import graphInfoSlice from "./reducers/graphInfoSlice";

export const makeStore = () =>
  configureStore({
    reducer: graphInfoSlice,
  });

export const wrapper = createWrapper(makeStore, { debug: true });
