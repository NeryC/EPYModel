import { useMemo } from "react";
import * as d3 from "d3";
import { checkLine } from "./index";

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

export const basicDeclareLineD3 = (dataXField, dataYField, isSmooth) => {
  return (xScale, yScale) =>
    d3
      .line()
      .x((d) => xScale(d[dataXField]))
      .y((d) => yScale(d[dataYField]))
      .curve(isSmooth ? d3.curveNatural : d3.curveLinear)
      .defined((d) => d[dataYField] != null);
};

export const declareAreaD3 = () => {
  return (xScale, yScale) =>
    d3
      .area()
      .x(function (d) {
        return xScale(d.fechaFormateada);
      })
      .y0(function (d) {
        return yScale(d.peor);
      })
      .y1(function (d) {
        return yScale(d.mejor);
      })
      .defined((d) => d.peor != null);
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

export const useCreateScale = ({ data, range, field, scaleType }) => {
  const getExtent = useMemo(() => {
    const rawDomain = d3.extent(data, function (d) {
      return d[field];
    });
    return scaleType == "Linear"
      ? [rawDomain[0], rawDomain[1] + 100]
      : rawDomain;
  }, [data, field, scaleType]);
  const type = scaleType == "Linear" ? d3.scaleLinear() : d3.scaleTime();
  return useMemo(
    () => type.domain(getExtent).range(range),
    [getExtent, range, type]
  );
};

const getInterpolateValue = (data, selectedLines, bisectedDate, date) => {
  if (data[bisectedDate] == undefined || data[bisectedDate - 1] == undefined) {
    return 0;
  }

  const dateBefore = data[bisectedDate - 1].fechaFormateada,
    dateAfter = data[bisectedDate].fechaFormateada;
  let intfun;
  if (data[bisectedDate].mejor === null) {
    intfun = d3.interpolateNumber(
      0,
      checkLine(selectedLines, "dailyR")
        ? data[bisectedDate].dailyR
        : data[bisectedDate].Reportados
    );
  } else {
    intfun = d3.interpolateNumber(
      data[bisectedDate - 1].q75,
      data[bisectedDate].peor
    );
  }
  return intfun((date - dateBefore) / (dateAfter - dateBefore));
};

export const getYDomain = (data, selectedLines, xz, yScale) => {
  // get the min and max date in focus
  const xleft = new Date(xz.domain()[0]);
  const xright = new Date(xz.domain()[1]);
  // a function that finds the nearest point to the right of a point
  const bisectDate = d3.bisector(function (d) {
    return d.fechaFormateada;
  }).right;

  // get the y value of the line at the left edge of view port:
  const iL = bisectDate(data, xleft);
  let yleft = getInterpolateValue(data, selectedLines, iL, xleft);

  // get the x value of the line at the right edge of view port:
  const iR = bisectDate(data, xright);
  let yright = getInterpolateValue(data, selectedLines, iR, xright);

  // get the y values of all the actual data points that are in view
  const dataSubset = data.filter(function (d) {
    return d.fechaFormateada >= xleft && d.fechaFormateada <= xright;
  });

  const countSubset = [];
  dataSubset.map(function (d) {
    if (d.q75 === null) {
      countSubset.push(
        checkLine(selectedLines, "dailyR") ? d.dailyR : d.Reportados
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
    ymax_new = dataYrange[1];
  }
  // reset and redraw the yaxis
  yScale.domain([0, ymax_new * 1.05]);
  return yScale;
};
