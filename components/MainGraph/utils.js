import * as d3 from "d3";
import { dateField } from "../../utils/constants";

const parseTime = d3.timeParse("%Y-%m-%d");

export const parseD3 = (data) => {
  data.forEach((d) => {
    d[dateField] = parseTime(d.fecha);
  });
};
