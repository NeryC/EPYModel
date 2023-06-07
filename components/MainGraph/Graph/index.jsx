import * as d3 from "d3";
import { useRef, useId, useEffect, useMemo, useCallback } from "react";
import SettingsComponent from "../SettingsComponent";
import { MAIN_GRAPH } from "../../../utils/constants";
import { dateField } from "../../../utils/constants.js";
import GraphInfoTooltip from "../Tooltips/GraphInfoTooltip";
import { useSelector } from "react-redux";
import {
  selectSelectedLines,
  selectShowedElements,
  selectRange,
  selectIsSmooth,
  selectUncertainty,
  selectDotsOption,
  selectDotField,
} from "../../../store/reducers/graphInfoSlice";
import {
  getNewLines,
  drawLines,
  timeFormat,
  declareAreaD3,
  getYDomain,
  getMaxField,
  createZoom,
} from "./utils";
import { basicDeclareLineD3, useCreateScale, useGetDomain } from "../../utils";

const Graph = ({ type, data, dimensions }) => {
  const svgChartRef = useRef(null);
  const yAxisRef = useRef(null);
  const xAxisRef = useRef(null);
  const dotsRef = useRef(null);
  const timeoutControllerRef = useRef(null);

  const selectedLines = useSelector(selectSelectedLines(type));
  const showedElements = useSelector(selectShowedElements(type));
  const isSmooth = useSelector(selectIsSmooth(type));
  const uncertainty = useSelector(selectUncertainty(type));
  const hasDots = useSelector(selectDotsOption(type));
  const range = useSelector(selectRange(MAIN_GRAPH, type));
  const dotField = useSelector(selectDotField(type));

  const graphElements = useMemo(() => {
    const elements = {};

    showedElements.forEach((element) => {
      if (element.style !== "dot") {
        elements[element.name] = basicDeclareLineD3(
          {
            xField: dateField,
            isSmooth: isSmooth,
          },
          element.name
        );
      }
    });

    elements["uncertainty"] = declareAreaD3(dateField, "peor", "mejor");

    return elements;
  }, [showedElements, isSmooth]);

  const clip = useId();

  const { svgWidth, svgHeight, width, height, left, top, right, bottom } =
    dimensions;

  const svgChart = d3.select(svgChartRef.current);
  const yAxisGroup = d3.select(yAxisRef.current);
  const xAxisGroup = d3.select(xAxisRef.current);
  const dotsGroup = d3.select(dotsRef.current);

  const zoom = createZoom(left, right, width, height, zoomed);

  function zoomed(e) {
    const newLines = getNewLines(selectedLines, uncertainty, dotField);
    const xz = e.transform.rescaleX(xScale);
    const yz = getYDomain(data, newLines, xz, yScale);
    xScale.domain(xz.domain());

    xAxisGroup.call(axis.x, xz);
    yAxisGroup.call(axis.y, yz);
    drawLines(
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
    );
  }

  const newLines = useMemo(
    () => getNewLines(selectedLines, uncertainty, dotField),
    [selectedLines, uncertainty, dotField]
  );

  const maxField = getMaxField(data, newLines);
  //y Right
  //x bottom
  const yDomain = useGetDomain({
    data,
    field: maxField,
  });
  const yScale = useCreateScale({
    range: [height - bottom, 0],
    domain: yDomain,
    scaleType: "Linear",
    size: height,
  });

  const xDomain = useGetDomain({
    data,
    field: dateField,
  });
  const xScale = useCreateScale({
    range: [0, width - right],
    domain: xDomain,
    scaleType: "Time",
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
            (xScale(data[range.finish][dateField]) -
              xScale(data[range.start][dateField]))
        )
        .translate(-xScale(data[range.start][dateField]), 0)
    );
  }, [data, range.finish, range.start, right, svgChart, width, xScale, zoom]);

  const axis = useMemo(() => {
    return {
      y: (g, y1) =>
        g.call(
          d3
            .axisLeft(y1)
            .ticks(5)
            .tickSize(-(width - right))
        ),
      x: (g, x1) =>
        g.call(
          d3
            .axisBottom(x1)
            .ticks(4)
            .tickSize(-(height - bottom))
            .tickFormat(
              timeFormat([
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
              ])
            )
            .tickPadding(10)
        ),
    };
  }, [bottom, height, right, width]);

  useEffect(() => {
    svgChart
      .selectAll(`#${dotField}-${type}`)
      .attr("cx", (d) => xScale(d[dateField]))
      .attr("cy", (d) => yScale(d[dotField]));
  }, [data, dotField, svgChart, type, xScale, yScale]);

  useEffect(() => {
    setZoom();
  }, [data, range, right, setZoom, width, xScale]);

  useEffect(() => {
    dotsGroup.selectAll(`#${dotField}-${type}`).remove();
    if (hasDots) {
      dotsGroup
        .selectAll("dot")
        .data(data)
        .join("circle")
        .attr("cx", (d) => xScale(d[dateField]))
        .attr("cy", (d) => yScale(d[dotField]))
        .attr("clip-path", `url(#${clip})`)
        .attr("fill", "#FFFFFF")
        .attr("stroke", "black")
        .attr("opacity", 0)
        .attr("r", 2.7)
        .attr("id", `${dotField}-${type}`);

      clearTimeout(timeoutControllerRef.current);
      timeoutControllerRef.current = setTimeout(() => {
        dotsGroup
          .selectAll(`#${dotField}-${type}`)
          .transition()
          .attr("opacity", 0.8);
      }, 1000);

      dotsGroup
        .selectAll(`#${dotField}-${type}`)
        .filter((d) => d[dotField] == null)
        .remove();
    }
  }, [data, dotField, dotsGroup, hasDots, type, xScale, yScale, clip]);

  return (
    <div className="w-full relative px-1 md:px-3">
      <svg id={type} width={svgWidth} height={svgHeight} ref={svgChartRef}>
        <g id="elements" transform={`translate(${left},${top})`}>
          <clipPath id={clip}>
            <rect
              x={0}
              y={0}
              width={width - right}
              height={height - (bottom - 5)}
            />
          </clipPath>
          <g id="YAxis" ref={yAxisRef} />
          <g
            id="XAxis"
            ref={xAxisRef}
            transform={`translate(0,${height - bottom})`}
          />
          <g id="Dots" ref={dotsRef}></g>
          <g id="Lines" clipPath={`url(#${clip})`}>
            {showedElements.map(({ name, style, color }) => {
              if (style !== "dot") {
                return (
                  <path
                    key={name}
                    clipPath={`url(#${clip})`}
                    id={`${name}-${type}`}
                    stroke={color}
                    strokeWidth={2}
                    fill="none"
                    opacity={1}
                  />
                );
              }
              return null;
            })}
          </g>
          <g id="uncertaintyContainer">
            <path
              id={`uncertainty-${type}`}
              clipPath={`url(#${clip})`}
              stroke="none"
              fill="b5adff"
              opacity={0.1}
            />
          </g>

          <GraphInfoTooltip
            xScale={xScale}
            yScale={yScale}
            width={width}
            height={height}
            data={data}
            showedElements={showedElements}
          />
        </g>
      </svg>
      <SettingsComponent type={type} data={data} />
    </div>
  );
};

export default Graph;
