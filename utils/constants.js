import { useMemo } from "react";
import * as d3 from "d3";
import { checkLine, dateField } from "./index";
import { dotFields } from "./descriptions";

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

export const parseD3 = (data) => {
  data.forEach(function (d) {
    d[dateField] = parseTime(d.fecha);
  });
};

export const createZoom = (left, right, width, height, zoomed) => {
  return d3
    .zoom()
    .scaleExtent([1, 10])
    .extent([
      [left, 0],
      [width - right, height],
    ])
    .translateExtent([
      [left, -Infinity],
      [width - right, Infinity],
    ])
    .on("zoom", zoomed);
};

//legacy
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
      .curve(baseDeclareData.isSmooth ? d3.curveNatural : d3.curveLinear)
      .defined((d) => d[yField] != null);
};

export const basicDeclareLineD3 = (baseLineData, dataYField) => {
  return (xScale, yScale) =>
    d3
      .line()
      .x((d) => xScale(d[baseLineData.xField]))
      .y((d) => yScale(d[dataYField]))
      .curve(baseLineData.isSmooth ? d3.curveNatural : d3.curveLinear)
      .defined((d) => d[dataYField] != null);
};

export const declareAreaD3 = (xField, y0Field, y1Field) => {
  return (xScale, yScale) =>
    d3
      .area()
      .x(function (d) {
        return xScale(d[xField]);
      })
      .y0(function (d) {
        return yScale(d[y0Field]);
      })
      .y1(function (d) {
        return yScale(d[y1Field]);
      })
      .defined((d) => d[y0Field] != null);
};

//legacy
export const drawAreaD3 = (baseDrawData, declare) => {
  return baseDrawData.svgChart
    .append("path")
    .data([baseDrawData.data])
    .attr("clip-path", "url(#" + baseDrawData.clip + ")")
    .attr("id", "uncertainty")
    .style("stroke", "none")
    .style("fill", lineColors.uncertainty)
    .style("opacity", 0.1)
    .attr("d", declare(baseDrawData.x));
};
//legacy
export const drawLineD3 = (baseDrawData, title, yField, declare) => {
  return baseDrawData.svgChart
    .append("path")
    .data([baseDrawData.data])
    .attr("clip-path", "url(#" + baseDrawData.clip + ")")
    .attr("id", title)
    .attr("class", lineClass(yField))
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

//legacy
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
  uncertainty: "b5adff",
};

const straightLine = ["dailyR", "dailyR_sin_subRegistro"];

//legacy
const lineClass = (yField) => {
  return `line ${!straightLine.includes(yField) ? "" : "dotted_line"}`;
};

function timeFormat(formats) {
  return function (date) {
    let i = formats.length - 1,
      f = formats[i];
    while (!f[1](date)) f = formats[--i];
    return f[0](date);
  };
}

export const useCreateScale = ({ range, domain, scaleType }) => {
  const type = scaleType == "Linear" ? d3.scaleLinear() : d3.scaleTime();
  return useMemo(() => type.domain(domain).range(range), [domain, range, type]);
};

export const useGetDomain = ({ data, field }) => {
  return useMemo(() => {
    return d3.extent(data, function (d) {
      return d[field];
    });
  }, [data, field]);
};

const getInterpolateValue = (data, type, selectedLines, bisectedDate, date) => {
  if (data[bisectedDate] == undefined || data[bisectedDate - 1] == undefined) {
    return 0;
  }

  const dateBefore = data[bisectedDate - 1][dateField],
    dateAfter = data[bisectedDate][dateField];
  let intfun;
  //dailyR == estimated in reported graph estimated could be higer than dotfield if it is selected
  if (data[bisectedDate].mejor === null) {
    intfun = d3.interpolateNumber(
      0,
      checkLine(selectedLines, "dailyR")
        ? data[bisectedDate].dailyR
        : data[bisectedDate][dotFields[type]]
    );
  } else {
    intfun = d3.interpolateNumber(
      data[bisectedDate - 1].q75,
      data[bisectedDate].peor
    );
  }
  return intfun((date - dateBefore) / (dateAfter - dateBefore));
};

export const getYDomain = (data, type, selectedLines, xz, yScale) => {
  // get the min and max date in focus
  const xleft = new Date(xz.domain()[0]);
  const xright = new Date(xz.domain()[1]);
  // a function that finds the nearest point to the right of a point
  const bisectDate = d3.bisector(function (d) {
    return d[dateField];
  }).right;

  // get the y value of the line at the left edge of view port:
  const iL = bisectDate(data, xleft);
  let yleft = getInterpolateValue(data, type, selectedLines, iL, xleft);

  // get the x value of the line at the right edge of view port:
  const iR = bisectDate(data, xright);
  let yright = getInterpolateValue(data, type, selectedLines, iR, xright);

  // get the y values of all the actual data points that are in view
  const dataSubset = data.filter(function (d) {
    return d[dateField] >= xleft && d[dateField] <= xright;
  });

  const countSubset = [];
  //dailyR == estimated in reported graph estimated could be higer than dotfield if it is selected
  dataSubset.map(function (d) {
    if (d.q75 === null) {
      countSubset.push(
        checkLine(selectedLines, "dailyR") ? d.dailyR : d[dotFields[type]]
      );
    } else {
      countSubset.push(d.peor);
    }
  });

  // add the edge values of the line to the array of counts in view, get the max y;
  countSubset.push(yleft);
  countSubset.push(yright);
  let ymax_new = d3.max(countSubset);

  if (ymax_new == 0) {
    ymax_new = yScale.domain()[1];
  }
  // reset and redraw the yaxis
  yScale.domain([0, ymax_new]);
  return yScale;
};
