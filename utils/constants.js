import * as d3 from "d3";

export const dimensions = {
  width: 1400,
  height: 400,
  margin: {
    top: 20,
    right: 30,
    bottom: 30,
    left: 40,
  },
};

export const parseTime = d3.timeParse("%Y-%m-%d");

export const sortD3 = (data) => {
  data.sort(function (x, y) {
    return d3.ascending(x.fechaFormateada, y.fechaFormateada);
  });
};

export const parseD3 = (data) => {
  data.forEach(function (d) {
    d.fechaFormateada = parseTime(d.fecha);
  });
};

export const declareLineD3 = (baseDeclareData, yField) => {
  return (x) =>
    d3
      .line()
      .x(function (d) {
        return x(d[baseDeclareData.xField]);
      })
      .y(function (d) {
        return baseDeclareData.y(d[yField]);
      })
      .defined((d) => d[yField] != null);
};

export const drawLineD3 = (baseDrawData, title, yField, declare, x) => {
  return baseDrawData.svgChart
    .append("path")
    .data([baseDrawData.data])
    .attr("clip-path", "url(#" + baseDrawData.clip + ")")
    .attr("id", title)
    .attr("class", "line")
    .style("stroke", lineColors[yField])
    .attr("d", declare(baseDrawData.x));
};

export const dynamicDateFormat = timeFormat([
  [
    d3.timeFormat("%Y"),
    function () {
      return true;
    },
  ],
  [
    d3.timeFormat("%m-%Y"),
    function (d) {
      return d.getMonth();
    },
  ],
  [
    d3.timeFormat("%d-%m-%Y"),
    function (d) {
      return d.getDate() != 1;
    },
  ],
]);

export const lineColors = {
  dailyR_sin_subRegistro: "#1900ff",
  dailyR: "#00ccff",
  proy: "#1900ff",
  q75: "#ff0000",
  q25: "#009719",
  X10p: "#97008f",
  X20p: "#e134f8",
  eq: "#039bb6",
  X2w: "#c50000",
};

function timeFormat(formats) {
  return function (date) {
    var i = formats.length - 1,
      f = formats[i];
    while (!f[1](date)) f = formats[--i];
    return f[0](date);
  };
}
