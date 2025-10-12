import { useRef, useEffect, useCallback } from "react";
import { useTranslation } from "next-i18next";
import * as d3 from "d3";

interface SimulationData {
  day: number;
  value: number | null;
}

// Type guards for better type safety
const isDate = (value: unknown): value is Date => value instanceof Date;

// Helper functions for type-safe operations
const toTimestamp = (value: Date | number): number => {
  return isDate(value) ? value.getTime() : value;
};

const toDisplayValue = (value: Date | number): number => {
  return isDate(value) ? Math.floor(value.getTime()) : Math.floor(value);
};

// Constants for better performance and readability
const DATE_FIELD: keyof SimulationData = "day";
const VALUE_FIELD: keyof SimulationData = "value";
const TOOLTIP_COLOR = "red";
const DOT_RADIUS = 5;
const TEXT_OFFSET = { x: 10, y: 6 };

interface SimulationTooltipProps {
  /** D3 time scale for x-axis */
  xScale: d3.ScaleTime<number, number>;
  /** D3 linear scale for y-axis */
  yScale: d3.ScaleLinear<number, number>;
  /** Width of the tooltip area */
  width: number;
  /** Height of the tooltip area */
  height: number;
  /** Simulation data points */
  data: SimulationData[];
}

/**
 * SimulationTooltip Component
 * 
 * Interactive tooltip component for simulation graphs that shows data points
 * on hover and click. Provides visual feedback with lines, dots, and content.
 * 
 * @param props - Component props
 * @returns JSX element representing the tooltip overlay
 */
const SimulationTooltip = ({
  xScale,
  yScale,
  width,
  height,
  data,
}: SimulationTooltipProps) => {
  const ref = useRef<SVGGElement>(null);
  const cuadroRef = useRef<SVGRectElement>(null);
  const contentRef = useRef<SVGGElement>(null);
  const contentDotsRef = useRef<SVGGElement>(null);
  const fixedPositionRef = useRef<boolean>(false);
  const { t } = useTranslation("common");

  const drawLine = useCallback(
    (x: number) => {
      d3.select(ref.current)
        .select(".tooltipLine")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", 0)
        .attr("y2", height - 30);
    },
    [ref, height]
  );

  const drawContent = useCallback(
    (x: number, y: number) => {
      const tooltipContent = d3.select(ref.current).select(".tooltipContent");
      tooltipContent.attr("transform", (_cur, i, nodes) => {
        const node = nodes[i] as Element;
        const rect = node?.getBoundingClientRect();
        const nodeWidth = rect?.width || 0;
        const nodeHeight = rect?.height || 0;
        const translateX = nodeWidth + x > width ? x - nodeWidth - 12 : x + 20;
        const translateY =
          nodeHeight + y > height ? y - nodeHeight - 12 : y - 20;
        return `translate(${translateX}, ${translateY})`;
      });
      tooltipContent
        .select(".contentDate")
        .text(`${t("day")} ${toDisplayValue(xScale.invert(x))}`);
    },
    [xScale, width, height, t]
  );

  const drawBackground = useCallback(() => {
    const contentBackground = d3
      .select(ref.current)
      .select(".contentBackground");
    contentBackground.attr("width", 0).attr("height", 0);

    const tooltipContentElement = d3
      .select(ref.current)
      .select(".tooltipContent")
      .node() as Element;
    if (!tooltipContentElement) return;

    const contentSize = tooltipContentElement.getBoundingClientRect();
    contentBackground
      .attr("width", contentSize.width + 10)
      .attr("height", contentSize.height + 6);
  }, []);

  const placeDots = useCallback(
    (actualData: SimulationData, color: string, baseXPos: number) => {
      const contentDots = d3.select(contentDotsRef.current);
      contentDots
        .append("circle")
        .attr("r", DOT_RADIUS)
        .attr("fill", color)
        .attr("cx", (_d) => baseXPos)
        .attr("cy", (_d) => yScale(actualData[VALUE_FIELD] as number));
    },
    [contentDotsRef, yScale]
  );

  const followPoints = useCallback(
    (e: MouseEvent) => {
      // Early return if no data available
      if (!data || data.length === 0) return;
      
      const xInverted = xScale.invert(d3.pointer(e)[0]);
      const x = toTimestamp(xInverted);
      const bisectDate = d3.bisector((d: SimulationData) => d[DATE_FIELD]).left;
      let baseXPos = 0;

      const index = bisectDate(data, x, 1);
      
      // Validate index bounds
      if (index <= 0 || index >= data.length) return;
      
      const d0 = data[index - 1];
      const d1 = data[index];
      
      // Validate that we have valid data points
      if (!d0 || !d1) return;
      
      const actualData = x - d0[DATE_FIELD] > (d1.day ?? 0) - x ? d1 : d0;

      const content = d3.select(contentRef.current);
      const contentDots = d3.select(contentDotsRef.current);

      content.selectAll("*").remove();
      contentDots.selectAll("*").remove();

      // Validate actualData exists and has a valid value
      if (!actualData || actualData[VALUE_FIELD] === null) return;
      const insideContent = content
        .append("g")
        .attr("transform", "translate(6,5)");
      insideContent.append("circle").attr("r", 6).attr("fill", TOOLTIP_COLOR);
      insideContent
        .append("text")
        .attr("class", "performanceItemMarketValue")
        .attr("fill", "white")
        .attr("font-family", "Nunito, sans-serif")
        .text(Math.round(actualData[VALUE_FIELD] as number).toLocaleString());

      baseXPos = xScale(actualData[DATE_FIELD]);
      placeDots(actualData, TOOLTIP_COLOR, baseXPos);

      d3.selectAll(".performanceItemMarketValue").attr(
        "transform",
        `translate(${TEXT_OFFSET.x},${TEXT_OFFSET.y})`
      );
      drawLine(baseXPos);
      drawContent(baseXPos, e.layerY);
      drawBackground();
    },
    [
      xScale,
      data,
      contentRef,
      contentDotsRef,
      drawLine,
      drawContent,
      drawBackground,
      placeDots,
    ]
  );

  useEffect(() => {
    const cuadro = d3.select(cuadroRef.current);
    cuadro
      .on("mouseout.tooltip", () => {
        !fixedPositionRef.current && d3.select(ref.current).attr("opacity", 0);
      })
      .on("mouseover.tooltip", () => {
        !fixedPositionRef.current && d3.select(ref.current).attr("opacity", 1);
      })
      .on("mousemove.tooltip", (e: MouseEvent) => {
        !fixedPositionRef.current && d3.select(ref.current).attr("opacity", 1);
        !fixedPositionRef.current && followPoints(e);
      })
      .on("click.tooltip", (e: MouseEvent) => {
        if (fixedPositionRef.current) {
          d3.select(ref.current).attr("opacity", 0);
        } else {
          !fixedPositionRef.current && followPoints(e);
          d3.select(ref.current).attr("opacity", 1);
        }
        fixedPositionRef.current = !fixedPositionRef.current;
      });
  }, [cuadroRef, ref, followPoints]);

  if (!data.length || width <= 0 || height <= 0) return null;

  return (
    <>
      <g ref={ref} opacity={0}>
        <line className="tooltipLine" stroke="#64748b" strokeDasharray="4 1" />
        <g className="tooltipContent">
          <rect
            className="contentBackground"
            rx={4}
            ry={4}
            opacity={0.9}
            fill="#111725"
          />
          <text
            className="contentDate"
            transform="translate(4,20)"
            fontFamily="Nunito, sans-serif"
            fontWeight={"bold"}
            fill="white"
          />
          <g ref={contentRef} transform="translate(4,32)" />
        </g>
        <g ref={contentDotsRef} />
      </g>
      <rect
        id="cuadro"
        ref={cuadroRef}
        width={width}
        height={height}
        opacity={0}
      />
    </>
  );
};

export default SimulationTooltip;
