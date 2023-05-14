import { useMemo } from "react";
import * as d3 from "d3";

export const dimensions = {
  width: 1400,
  height: 400,
  margin: {
    top: 20,
    right: 10,
    bottom: 30,
    left: 45,
  },
};

export const dateField = "fechaFormateada";

export const SIM_GRAPH = "simulation";
export const MAIN_GRAPH = "main";

// export const baseURL = "http://epymodel.uaa.edu.py:3001"; //production
export const baseURL = "http://localhost:3001"; //local-dev

export const getDownloadPath = {
  reported: "/get-projection-r",
  hospitalized: "/get-projection-h",
  ICU: "/get-projection-u",
  deceases: "/get-projection-f",
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

export const basicDeclareLineD3 = (
  baseLineData,
  dataYField,
  shouldReduce = false
) => {
  const isSmooth =
    !baseLineData.hasOwnProperty("isSmooth") || baseLineData.isSmooth
      ? d3.curveNatural
      : d3.curveLinear;
  return (xScale, yScale) =>
    d3
      .line()
      .x((d) => xScale(d[baseLineData.xField]))
      .y((d) => yScale(shouldReduce ? d[dataYField] / 1000 : d[dataYField]))
      .curve(isSmooth)
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

export const useGetDomain = ({ data, field, shouldReduce = false }) => {
  return useMemo(() => {
    return d3.extent(data, function (d) {
      return shouldReduce ? d[field] / 1000 : d[field];
    });
  }, [data, field, shouldReduce]);
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

export const getYDomain = (data, selectedLines, xz, yScale) => {
  // get the min and max date in focus
  const xleft = new Date(xz.domain()[0]);
  const xright = new Date(xz.domain()[1]);

  // get the y values of all the actual data points that are in view
  const dataSubset = data.filter(function (d) {
    return d[dateField] >= xleft && d[dateField] <= xright;
  });

  const maxField = getMaxField(dataSubset, selectedLines);
  const countSubset = dataSubset.map((d) => d[maxField]);

  // add the edge values of the line to the array of counts in view, get the max y;
  let ymax_new = d3.max(countSubset);

  if (ymax_new == 0) {
    ymax_new = yScale.domain()[1];
  }
  // reset and redraw the yaxis
  yScale.domain([0, ymax_new]);
  return yScale;
};

export const getYDomainSimulation = (data, xz, yScale) => {
  // get the min and max date in focus
  const xleft = xz.domain()[0];
  const xright = xz.domain()[1];

  // get the y values of all the actual data points that are in view
  const dataSubset = data.filter(function (d) {
    return d.day >= xleft && d.day <= xright;
  });

  const countSubset = dataSubset.map((d) => d.value / 1000);

  // add the edge values of the line to the array of counts in view, get the max y;
  let ymax_new = d3.max(countSubset);
  let ymin_new = d3.min(countSubset);

  // reset and redraw the yaxis
  yScale.domain([ymin_new, ymax_new]);
  return yScale;
};
