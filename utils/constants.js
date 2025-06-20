import * as d3 from "d3";

export const dateField = "fechaFormateada";

export const SIM_GRAPH = "simulation";
export const MAIN_GRAPH = "main";

export const baseURL = "http://epymodel.uaa.edu.py:3001"; //production
// export const baseURL = "http://localhost:3001"; //local-dev

export const getDownloadPath = {
  reported: "/get-projection-r",
  hospitalized: "/get-projection-h",
  ICU: "/get-projection-u",
  deceases: "/get-projection-f",
};

export const parseTime = d3.timeParse("%Y-%m-%d");
