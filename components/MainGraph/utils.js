import { dateField, parseTime } from "../../utils/constants";

export const parseD3 = (data) => {
  data.forEach((d) => {
    d[dateField] = parseTime(d.fecha);
  });
};
