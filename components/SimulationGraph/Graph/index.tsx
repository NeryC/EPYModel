import * as d3 from "d3";
import { useRef, useEffect, useId, useCallback } from "react";
import { useTranslation } from "next-i18next";
import { drawLines } from "./utils";
import { basicDeclareLineD3, useCreateScale, useGetDomain } from "../../utils";
import useDimensions from "../../../hooks/useDimensions";
import SimulationTooltip from "../SimulationTooltip";

const Graph = ({ type, data, uciThreshold }: { type: string; data: any[]; uciThreshold?: number | null }) => {
  const { t } = useTranslation("common");
  const svgChartRef = useRef<SVGSVGElement | null>(null);
  const yAxisRef = useRef<SVGGElement | null>(null);
  const xAxisRef = useRef<SVGGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dayField = "day";
  const valueField = "value";

  const clip = useId();

  const { svgWidth, svgHeight, width, height, left, top, right, bottom } =
    useDimensions(containerRef, 300);

  const svgChart = d3.select<SVGSVGElement, unknown>(svgChartRef.current!);
  const yAxisGroup = d3.select<SVGGElement, unknown>(yAxisRef.current!);
  const xAxisGroup = d3.select<SVGGElement, unknown>(xAxisRef.current!);

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

  const valueReducer = useCallback((v: number) => v / 1000, []);

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
      <svg
        id={type}
        width={svgWidth}
        height={svgHeight}
        ref={svgChartRef}
        role="img"
        aria-labelledby={`${type}-sim-title`}
        aria-describedby={`${type}-sim-desc`}
      >
        <title id={`${type}-sim-title`}>{t(`${type}-simulation`)}</title>
        <desc id={`${type}-sim-desc`}>{t(`${type}-subtitle`)}</desc>
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
          <text
            transform={`translate(${-left + 10}, ${(height - bottom) / 2}) rotate(-90)`}
            textAnchor="middle"
            fontSize={10}
            fill="#9ca3af"
          >
            ×1,000
          </text>
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

          {uciThreshold != null && yScale(uciThreshold / 1000) >= 0 && (
            <line
              x1={0}
              x2={width - right}
              y1={yScale(uciThreshold / 1000)}
              y2={yScale(uciThreshold / 1000)}
              stroke="red"
              strokeWidth={1.5}
              strokeDasharray="6 3"
              opacity={0.8}
            />
          )}

          <SimulationTooltip
            xScale={xScale}
            yScale={yScale}
            valueReducer={valueReducer}
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
