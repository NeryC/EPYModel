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

// Create wrapper with modern pattern (Next.js 16 compatible)
export const wrapper = createWrapper<AppStore>(makeStore, { 
  debug: process.env.NODE_ENV === "development",
});
