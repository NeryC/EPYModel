import * as d3 from "d3";
import { dateField } from "../../utils/constants";

const parseTime = d3.timeParse("%Y-%m-%d");

export const parseD3 = (data: any[]): void => {
  data.forEach((d: any) => {
    d[dateField] = parseTime(d.fecha);
  });
};
