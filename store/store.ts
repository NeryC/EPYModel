import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import graphInfoSlice from "./reducers/graphInfoSlice";

export const makeStore = () =>
  configureStore({
    reducer: graphInfoSlice,
  });

// Define the store type
export type AppStore = ReturnType<typeof makeStore>;

// Define the root state type based on the store
export type RootState = ReturnType<AppStore["getState"]>;

// Define the dispatch type
export type AppDispatch = AppStore["dispatch"];

// Create wrapper with modern pattern (Next.js 16 compatible)
export const wrapper = createWrapper<AppStore>(makeStore, {
  // debug logs cause "setState during render" React 18 warning — keep disabled
  debug: false,
});
