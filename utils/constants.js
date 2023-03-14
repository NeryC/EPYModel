import { useMemo } from "react";
import * as d3 from "d3";
import { dateField } from "./index";

export const dimensions = {
  width: 1400,
  height: 400,
  margin: {
    top: 20,
    right: 10,
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
// export const declareLineD3 = (baseDeclareData, yField) => {
//   return (x) =>
//     d3
//       .line()
//       .x(function (d) {
//         return x(d[baseDeclareData.xField]);
//       })
//       .y(function (d) {
//         return baseDeclareData.y(d[yField]);
//       })
//       .curve(baseDeclareData.isSmooth ? d3.curveNatural : d3.curveLinear)
//       .defined((d) => d[yField] != null);
// };

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

// //legacy
// export const drawAreaD3 = (baseDrawData, declare) => {
//   return baseDrawData.svgChart
//     .append("path")
//     .data([baseDrawData.data])
//     .attr("clip-path", "url(#" + baseDrawData.clip + ")")
//     .attr("id", "uncertainty")
//     .style("stroke", "none")
//     .style("fill", lineColors.uncertainty)
//     .style("opacity", 0.1)
//     .attr("d", declare(baseDrawData.x));
// };
// //legacy
// export const drawLineD3 = (baseDrawData, title, yField, declare) => {
//   return baseDrawData.svgChart
//     .append("path")
//     .data([baseDrawData.data])
//     .attr("clip-path", "url(#" + baseDrawData.clip + ")")
//     .attr("id", title)
//     .attr("class", lineClass(yField))
//     .style("stroke", lineColors[yField])
//     .attr("d", declare(baseDrawData.x));
// };

export const dynamicDateFormat = timeFormat([
  [
    d3.timeFormat("%Y"),
    function () {
      return true;
    },
  ],
  [
    d3.timeFormat("%b %Y"),
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
// export const lineColors = {
//   dailyR_sin_subRegistro: "#1900ff",
//   dailyR: "#00ccff",
//   proy: "#1900ff",
//   q75: "#ff0000",
//   q25: "#009719",
//   X10p: "#97008f",
//   X20p: "#e134f8",
//   eq: "#039bb6",
//   X2w: "#c50000",
//   uncertainty: "b5adff",
// };

//formatos de dias para no hacer consultas extra
export const es = {
  dateTime: "%A, %e de %B de %Y, %X",
  date: "%d/%m/%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
  ],
  shortDays: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
  months: [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ],
  shortMonths: [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ],
};
export const en = {
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  shortMonths: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
};
export const pt = {
  dateTime: "%A, %e de %B de %Y. %X",
  date: "%d/%m/%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
  shortDays: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  months: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  shortMonths: [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ],
};

// const straightLine = ["dailyR", "dailyR_sin_subRegistro"];

//legacy
// const lineClass = (yField) => {
//   return `line ${!straightLine.includes(yField) ? "" : "dotted_line"}`;
// };

export function timeFormat(formats) {
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

export const getMaxField = (data, lines) => {
  let maxvalue = { value: 0 };
  for (let x = 0; x < lines.length; x++) {
    const valuetest = d3.max(data, (item) => item[lines[x].name || lines[x]]);
    if (maxvalue.value < valuetest) {
      maxvalue.name = lines[x].name || lines[x];
      maxvalue.value = valuetest;
    }
  }
  return maxvalue.name;
};

// const getInterpolateValue = (data, bisectedDate, date, lines) => {
//   const maxField = getMaxField(data, lines);
//   if (data[bisectedDate] == undefined || data[bisectedDate - 1] == undefined) {
//     return 0;
//   }

//   const dateBefore = data[bisectedDate - 1][dateField],
//     dateAfter = data[bisectedDate][dateField];
//   let intfun;
//   //dailyR == estimated in reported graph estimated could be higer than dotfield if it is selected
//   // console.log("test: ", data[bisectedDate]);
//   // if (data[bisectedDate].mejor === null) {
//   // console.log("paso1");
//   intfun = d3.interpolateNumber(0, data[bisectedDate][maxField]);
//   console.log(intfun((date - dateBefore) / (dateAfter - dateBefore)));
//   // } else {
//   //   // console.log("paso2");
//   //   intfun = d3.interpolateNumber(
//   //     data[bisectedDate - 1].q75,
//   //     data[bisectedDate].peor
//   //   );
//   // }
//   return intfun((date - dateBefore) / (dateAfter - dateBefore));
// };

export const getYDomain = (data, selectedLines, xz, yScale, maxField2) => {
  // get the min and max date in focus
  const xleft = new Date(xz.domain()[0]);
  const xright = new Date(xz.domain()[1]);

  // get the y values of all the actual data points that are in view
  const dataSubset = data.filter(function (d) {
    return d[dateField] >= xleft && d[dateField] <= xright;
  });

  const countSubset = [];
  const maxField = getMaxField(dataSubset, selectedLines);
  //dailyR == estimated in reported graph estimated could be higer than dotfield if it is selected
  dataSubset.map(function (d) {
    countSubset.push(d[maxField]);
  });

  // add the edge values of the line to the array of counts in view, get the max y;
  let ymax_new = d3.max(countSubset);

  if (ymax_new == 0) {
    ymax_new = yScale.domain()[1];
  }
  // reset and redraw the yaxis
  yScale.domain([0, ymax_new]);
  return yScale;
};
