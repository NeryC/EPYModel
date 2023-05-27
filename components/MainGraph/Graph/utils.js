export const getNewLines = (selectedLines, uncertainty, hasDots, dotField) => {
  const newLines = [...selectedLines, uncertainty && "peor"];
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
    if (element.style == "dot") return;
    const d = graphElements[element.name](xScale, yScale)(data);

    svgChart
      .select(`#${element.name}-${type}`)
      .attr("d", d?.match(/NaN|undefined/) ? "" : d);
  });

  uncertainty
    ? svgChart
        .select(`#uncertainty-${type}`)
        .attr("d", graphElements["uncertainty"](xScale, yScale)(data))
    : svgChart.select(`#uncertainty-${type}`).attr("d", null);

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
