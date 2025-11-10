import * as d3 from "d3";
import { dateField } from "../../../utils/constants";

interface LineItem {
  label: string;
  name: string;
  color?: string;
  hiddable?: boolean;
  default?: boolean;
  style?: "line" | "dashed" | "dot";
  description?: string;
}

interface DataPoint {
  fecha: string;
  [key: string]: any;
}

interface MaxValue {
  value: number;
  name: string;
}

interface GraphElements {
  [key: string]: (xScale: d3.ScaleTime<number, number>, yScale: d3.ScaleLinear<number, number>) => (data: DataPoint[]) => string;
}

/**
 * Get new lines array including selected lines, dot field, and uncertainty if enabled
 */
export const getNewLines = (
  selectedLines: LineItem[],
  uncertainty: boolean,
  dotField: string
): string[] => {
  const newLines = [...selectedLines.map(line => line.name), dotField];
  if (uncertainty) newLines.push("peor");
  return newLines;
};

/**
 * Draw lines on the SVG chart based on showed elements
 */
export const drawLines = (
  showedElements: LineItem[],
  graphElements: GraphElements,
  svgChart: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  uncertainty: boolean,
  type: string,
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  data: DataPoint[],
  xAxisGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  yAxisGroup: d3.Selection<SVGGElement, unknown, null, undefined>
): void => {
  showedElements.forEach((element) => {
    if (element.style === "dot") return;
    const lineGenerator = graphElements[element.name];
    if (!lineGenerator) return;
    
    const d = lineGenerator(xScale, yScale)(data);

    svgChart
      .select(`#${element.name}-${type}`)
      .attr("d", d?.match(/NaN|undefined/) ? "" : d || "");
  });

  const uncertaintyElement = svgChart.select(`#uncertainty-${type}`);
  if (uncertainty && graphElements["uncertainty"]) {
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

/**
 * Get the field with the maximum value from data
 */
export const getMaxField = (data: DataPoint[], lines: (LineItem | string)[]): string => {
  let maxvalue: MaxValue = { value: 0, name: "" };
  for (let x = 0; x < lines.length; x++) {
    const fieldName: string = typeof lines[x] === "string" ? (lines[x] as string) : (lines[x] as LineItem).name;
    if (!fieldName) continue;
    
    const valuetest = d3.max(data, (item) => item[fieldName] as number);
    if (valuetest && maxvalue.value < valuetest) {
      maxvalue.name = fieldName;
      maxvalue.value = valuetest;
    }
  }
  return maxvalue.name;
};

/**
 * Get Y domain based on data subset within the X domain range
 */
export const getYDomain = (
  data: DataPoint[],
  selectedLines: (LineItem | string)[],
  xz: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>
): d3.ScaleLinear<number, number> => {
  const xleft = new Date(xz.domain()[0]);
  const xright = new Date(xz.domain()[1]);

  const dataSubset = data.filter(
    (d) => d[dateField] >= xleft && d[dateField] <= xright
  );

  const maxField = getMaxField(dataSubset, selectedLines);
  const countSubset = dataSubset.map((d) => d[maxField]).filter((val): val is number => val != null);

  let ymax_new = d3.max(countSubset) || 0;

  if (ymax_new === 0) {
    ymax_new = yScale.domain()[1];
  }

  yScale.domain([0, ymax_new]);
  return yScale;
};

/**
 * Time formatter that uses different formats based on date range
 */
export function timeFormat(
  formats: Array<[(date: Date) => string, (date: Date) => boolean]>
): (date: Date) => string {
  return function (date: Date): string {
    let i = formats.length - 1;
    let f = formats[i];
    while (!f[1](date) && i > 0) {
      f = formats[--i];
    }
    return f[0](date);
  };
}

/**
 * Declare D3 area generator
 */
export const declareAreaD3 = (
  xField: string,
  y0Field: string,
  y1Field: string
): ((xScale: d3.ScaleTime<number, number>, yScale: d3.ScaleLinear<number, number>) => d3.Area<DataPoint>) => {
  return (xScale: d3.ScaleTime<number, number>, yScale: d3.ScaleLinear<number, number>) =>
    d3
      .area<DataPoint>()
      .x((d) => xScale(d[xField]))
      .y0((d) => yScale(d[y0Field]))
      .y1((d) => yScale(d[y1Field]))
      .defined((d) => d[y0Field] != null);
};

/**
 * Create D3 zoom behavior
 */
export const createZoom = (
  left: number,
  right: number,
  width: number,
  height: number,
  zoomed: (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => void
): d3.ZoomBehavior<SVGSVGElement, unknown> => {
  return d3
    .zoom<SVGSVGElement, unknown>()
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

