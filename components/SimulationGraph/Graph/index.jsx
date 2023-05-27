import * as d3 from "d3";
import useDimensions from "../../../hooks/useDimensions";
import { useRef, useId, useEffect, useMemo, useCallback } from "react";
import {
  useCreateScale,
  basicDeclareLineD3,
  getYDomainSimulation,
  createZoom,
  useGetDomain,
  SIM_GRAPH,
} from "../../../utils/constants";
import SimulationTooltip from "../Tooltip/index.jsx";
import { useSelector } from "react-redux";
import { selectRange } from "../../../store/reducers/graphInfoSlice";
import { drawLines } from "./utils";

const Graph = ({ type, data, dimensions }) => {
  const svgChartRef = useRef(null);
  const yAxisRef = useRef(null);
  const xAxisRef = useRef(null);
  const containerRef = useRef(null);
  const dayField = "day";
  const valueField = "value";

  const range = useSelector(selectRange(SIM_GRAPH, type));

  const clip = useId();

  const { svgWidth, svgHeight, width, height, left, top, right, bottom } =
    useDimensions(containerRef, 300);

  const svgChart = d3.select(svgChartRef.current);
  const yAxisGroup = d3.select(yAxisRef.current);
  const xAxisGroup = d3.select(xAxisRef.current);

  const zoom = createZoom(left, right, width, height, zoomed);

  function zoomed(e) {
    const xz = e.transform.rescaleX(xScale);
    const yz = getYDomainSimulation(data, xz, yScale);
    xScale.domain(xz.domain());

    xAxisGroup.call(axis.x, xz);
    yAxisGroup.call(axis.y, yz);
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
  }

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

  const setZoom = useCallback(() => {
    const base = width - right;
    if (base < 0) return;
    svgChart.call(
      zoom.transform,
      d3.zoomIdentity
        .scale(
          base /
            (xScale(data[range.finish][dayField]) -
              xScale(data[range.start][dayField]))
        )
        .translate(-xScale(data[range.start][dayField]), 0)
    );
  }, [
    data,
    range.finish,
    range.start,
    right,
    svgChart,
    width,
    xScale,
    zoom.transform,
  ]);

  const axis = useMemo(() => {
    return {
      y: (g, y1) =>
        g.call(
          d3
            .axisLeft(y1)
            .ticks(5)
            .tickSize(-(width - right))
          // .tickPadding(8)
        ),
      x: (g, x1) =>
        g.call(
          d3
            .axisBottom(x1)
            .ticks(5)
            .tickSize(-(height - bottom))
          // .tickPadding(10)
        ),
    };
  }, [bottom, height, right, width]);

  const baseLineData = {
    xField: dayField,
  };

  const dataLine = basicDeclareLineD3(baseLineData, valueField, true);

  useEffect(() => {
    setZoom();
  }, [range, setZoom, width, xScale, yScale]);

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
              id={`${type}`}
              stroke={"blue"}
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
