import * as d3 from "d3";
import { dateField } from "../../../utils/constants";

export const getNewLines = (selectedLines, uncertainty, hasDots, dotField) => {
  const newLines = [...selectedLines];
  if (uncertainty) newLines.push("peor");
  if (hasDots) newLines.push(dotField);

  return newLines;
};

export const drawLines = (
  showedElements,
  graphElements,
  svgChart,
  uncertainty,
  type,
  xScale,
  yScale,
  data,
  xAxisGroup,
  yAxisGroup
) => {
  showedElements.forEach((element) => {
    if (element.style === "dot") return;
    const d = graphElements[element.name](xScale, yScale)(data);

    svgChart
      .select(`#${element.name}-${type}`)
      .attr("d", d?.match(/NaN|undefined/) ? "" : d);
  });

  const uncertaintyElement = svgChart.select(`#uncertainty-${type}`);
  if (uncertainty) {
    uncertaintyElement.attr(
      "d",
      graphElements["uncertainty"](xScale, yScale)(data)
    );
  } else {
    uncertaintyElement.attr("d", null);
  }

  xAxisGroup.selectAll("line").attr("stroke", "rgba(128, 128, 128, 0.3)");
  yAxisGroup.selectAll("line").attr("stroke", "rgba(128, 128, 128, 0.3)");
  yAxisGroup.selectAll("path").attr("stroke", "rgba(128, 128, 128, 0.3)");
  xAxisGroup.selectAll("path").attr("stroke", "rgba(128, 128, 128, 0.3)");
  yAxisGroup
    .selectAll("text")
    .attr("font-family", "Nunito, sans-serif")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");
  xAxisGroup
    .selectAll("text")
    .attr("font-family", "Nunito, sans-serif")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");
};

export const getMaxField = (data, lines) => {
  let maxvalue = { value: 0, name: "" };
  for (let x = 0; x < lines.length; x++) {
    const fieldName = lines[x].name || lines[x];
    const valuetest = d3.max(data, (item) => item[fieldName]);
    if (maxvalue.value < valuetest) {
      maxvalue.name = fieldName;
      maxvalue.value = valuetest;
    }
  }
  return maxvalue.name;
};

export const getYDomain = (data, selectedLines, xz, yScale) => {
  const xleft = new Date(xz.domain()[0]);
  const xright = new Date(xz.domain()[1]);

  const dataSubset = data.filter(
    (d) => d[dateField] >= xleft && d[dateField] <= xright
  );

  const maxField = getMaxField(dataSubset, selectedLines);
  const countSubset = dataSubset.map((d) => d[maxField]);

  let ymax_new = d3.max(countSubset);

  if (ymax_new === 0) {
    ymax_new = yScale.domain()[1];
  }

  yScale.domain([0, ymax_new]);
  return yScale;
};

export function timeFormat(formats) {
  return function (date) {
    let i = formats.length - 1,
      f = formats[i];
    while (!f[1](date)) f = formats[--i];
    return f[0](date);
  };
}

export const declareAreaD3 = (xField, y0Field, y1Field) => {
  return (xScale, yScale) =>
    d3
      .area()
      .x((d) => xScale(d[xField]))
      .y0((d) => yScale(d[y0Field]))
      .y1((d) => yScale(d[y1Field]))
      .defined((d) => d[y0Field] != null);
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
