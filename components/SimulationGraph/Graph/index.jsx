import * as d3 from "d3";
import { useRef, useEffect, useId } from "react";
import { drawLines } from "./utils";
import { basicDeclareLineD3, useCreateScale, useGetDomain } from "../../utils";
import useDimensions from "../../../hooks/useDimensions";
import SimulationTooltip from "../Tooltip/index.jsx";

const Graph = ({ type, data }) => {
  const svgChartRef = useRef(null);
  const yAxisRef = useRef(null);
  const xAxisRef = useRef(null);
  const containerRef = useRef(null);
  const dayField = "day";
  const valueField = "value";

  const clip = useId();

  const { svgWidth, svgHeight, width, height, left, top, right, bottom } =
    useDimensions(containerRef, 300);

  const svgChart = d3.select(svgChartRef.current);
  const yAxisGroup = d3.select(yAxisRef.current);
  const xAxisGroup = d3.select(xAxisRef.current);

  //y Right
  //x bottom
  const yDomain = useGetDomain({
    data,
    field: valueField,
    shouldReduce: true,
  });
  const yScale = useCreateScale({
    range: [height - bottom, 0],
    domain: yDomain,
    scaleType: "Linear",
    size: height,
  });
  const xDomain = useGetDomain({
    data,
    field: dayField,
  });
  const xScale = useCreateScale({
    range: [0, width - right],
    domain: xDomain,
    scaleType: "Linear",
    size: width,
  });

  const baseLineData = {
    xField: dayField,
  };

  const dataLine = basicDeclareLineD3(baseLineData, valueField, true);

  useEffect(() => {
    xAxisGroup.call(
      d3
        .axisBottom(xScale)
        // .ticks(5)
        .tickSize(-(height - bottom))
    );
    yAxisGroup.call(
      d3
        .axisLeft(yScale)
        .ticks(5)
        .tickSize(-(width - right))
    );
    drawLines(
      dataLine,
      svgChart,
      type,
      xScale,
      yScale,
      data,
      xAxisGroup,
      yAxisGroup
    );
  }, [
    bottom,
    data,
    dataLine,
    height,
    right,
    svgChart,
    type,
    width,
    xAxisGroup,
    xScale,
    yAxisGroup,
    yScale,
  ]);

  return (
    <div className="w-full relative" ref={containerRef}>
      <svg id={type} width={svgWidth} height={svgHeight} ref={svgChartRef}>
        <g id="elements" transform={`translate(${left},${top})`}>
          {width > 0 && (
            <clipPath id={clip}>
              <rect
                x={0}
                y={0}
                width={width - right}
                height={height - (bottom - 5)}
              />
            </clipPath>
          )}
          <g id="YAxis" ref={yAxisRef} />
          <g
            id="XAxis"
            ref={xAxisRef}
            transform={`translate(0,${height - bottom})`}
          />

          <g id="Lines" clipPath={`url(#${clip})`}>
            <path
              clipPath={`url(#${clip})`}
              id={type}
              stroke="blue"
              strokeWidth={2}
              fill="none"
              opacity={1}
            />
          </g>

          <SimulationTooltip
            xScale={xScale}
            yScale={yScale}
            width={width}
            height={height}
            data={data}
          />
        </g>
      </svg>
    </div>
  );
};

export default Graph;
