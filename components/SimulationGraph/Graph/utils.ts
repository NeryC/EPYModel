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
