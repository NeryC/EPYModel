import * as d3 from "d3";
import { DataPoint } from "../../../types/api";

type LineGenerator = (
  xScale: d3.ScaleLinear<number, number>,
  yScale: d3.ScaleLinear<number, number>
) => (data: DataPoint[]) => string | null;

export const drawLines = (
  dataLine: LineGenerator,
  svgChart: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  type: string,
  xScale: d3.ScaleLinear<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  data: DataPoint[],
  xAxisGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  yAxisGroup: d3.Selection<SVGGElement, unknown, null, undefined>
): void => {
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
