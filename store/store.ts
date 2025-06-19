import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import graphInfoSlice from "./reducers/graphInfoSlice";

// Define the root state type based on the slice
export type RootState = ReturnType<typeof graphInfoSlice>;

// Define the store type
export type AppStore = ReturnType<typeof makeStore>;

// Define the dispatch type
export type AppDispatch = AppStore["dispatch"];

export const makeStore = () =>
  configureStore({
    reducer: graphInfoSlice,
  });

export const wrapper = createWrapper<AppStore>(makeStore, { debug: true });
