import * as d3 from "d3";
import useDimensions from "../../hooks/useDimensions";
import { useRef, useId, useEffect, useMemo, useCallback } from "react";
import SettingsDropDown from "./SettingsDropDown";
import {
  useCreateScale,
  basicDeclareLineD3,
  getYDomain,
  declareAreaD3,
  createZoom,
  useGetDomain,
  timeFormat,
} from "../../utils/constants";
import { checkLine, dateField } from "../../utils";
import GraphInfoTooltip from "./Tooltip/GraphInfoTooltip";
import { useSelector } from "react-redux";
import {
  selectSelectedLines,
  selectShowedElements,
  selectRange,
  selectIsSmooth,
  selectUncertainty,
  selectDotField,
} from "../../store/reducers/graphInfoSlice";
import useD3Locale from "../../hooks/useD3Locale";

const Graph = ({ type, data }) => {
  const svgChartRef = useRef(null);
  const yAxisRef = useRef(null);
  const xAxisRef = useRef(null);
  const containerRef = useRef(null);

  const selectedLines = useSelector(selectSelectedLines(type));
  const showedElements = useSelector(selectShowedElements(type));
  const isSmooth = useSelector(selectIsSmooth(type));
  const uncertainty = useSelector(selectUncertainty(type));
  const range = useSelector(selectRange(type));
  const dotField = useSelector(selectDotField(type));

  let graphElements = {};

  const clip = useId();

  const [{ svgWidth, svgHeight, width, height, left, top, right, bottom }] =
    useDimensions(containerRef);

  const svgChart = d3.select(svgChartRef.current);
  const yAxisGroup = d3.select(yAxisRef.current);
  const xAxisGroup = d3.select(xAxisRef.current);

  const zoom = createZoom(left, right, width, height, zoomed);

  function zoomed(e) {
    const xz = e.transform.rescaleX(xScale);
    const yz = getYDomain(data, type, selectedLines, xz, yScale);
    xScale.domain(xz.domain());

    xAxisGroup.call(axis.x, xz);
    yAxisGroup.call(axis.y, yz);
    drawLines();
  }
  //y Right
  //x bottom
  //dailyR == estimated in reported graph estimated could be higer than dotfield if it is selected
  const yDomain = useGetDomain({
    data,
    field: checkLine(selectedLines, "dailyR") ? "dailyR" : dotField,
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

  useEffect(() => {
    setZoom();
  }, [range, isSmooth, uncertainty, selectedLines, setZoom]);

  const axis = useMemo(() => {
    return {
      y: (g, y1) =>
        g.call(
          d3
            .axisLeft(y1)
            .ticks(5)
            .tickSize(-(width - right))
            .tickPadding(8)
        ),
      x: (g, x1) =>
        g.call(
          d3
            .axisBottom(x1)
            .ticks(5)
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
    setZoom();
    // I only need this render in the first time or when el graph is resized
  }, [setZoom, width]);

  const baseLineData = {
    xField: dateField,
    isSmooth: isSmooth,
  };

  showedElements.forEach((element) => {
    if (element.style == "dot") return;

    graphElements[element.name] = basicDeclareLineD3(
      baseLineData,
      element.name
    );
  });

  graphElements["uncertainty"] = declareAreaD3(dateField, "peor", "mejor");

  function drawLines() {
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

    // yAxisGroup.select(".domain").remove();
    // xAxisGroup.select(".domain").remove();
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
  }

  return (
    <div className="w-full h-[534px] relative" ref={containerRef}>
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
      <SettingsDropDown type={type} data={data} />
    </div>
  );
};

export default Graph;
