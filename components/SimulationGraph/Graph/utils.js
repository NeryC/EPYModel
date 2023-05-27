import * as d3 from "d3";

export const drawLines = (
  dataLine,
  svgChart,
  type,
  xScale,
  yScale,
  data,
  xAxisGroup,
  yAxisGroup
) => {
  const d = dataLine(xScale, yScale)(data);

  svgChart.select(`#${type}`).attr("d", d?.match(/NaN|undefined/) ? "" : d);

  // opacity en 0 si lo quiero quitar
  // xAxisGroup.selectAll("line").attr("stroke", "rgba(128, 128, 128, 0)");
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

export const getYDomain = (data, xz, yScale) => {
  const [xleft, xright] = xz.domain();

  const dataSubset = data.filter((d) => d.day >= xleft && d.day <= xright);
  const countSubset = dataSubset.map((d) => d.value / 1000);

  const [ymin_new, ymax_new] = d3.extent(countSubset);

  yScale.domain([ymin_new, ymax_new]);
  return yScale;
};
