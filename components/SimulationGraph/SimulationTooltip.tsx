import { useRef, useEffect, useCallback } from "react";
import { useTranslation } from "next-i18next";
import * as d3 from "d3";

interface SimulationData {
  day: number;
  value: number | null;
}

interface SimulationTooltipProps {
  xScale: d3.ScaleTime<number, number>;
  yScale: d3.ScaleLinear<number, number>;
  width: number;
  height: number;
  data: SimulationData[];
}

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
  const dateField: keyof SimulationData = "day";
  const valueField: keyof SimulationData = "value";

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
        const nodeWidth = nodes[i]?.getBoundingClientRect()?.width || 0;
        const nodeHeight = nodes[i]?.getBoundingClientRect()?.height || 0;
        const translateX = nodeWidth + x > width ? x - nodeWidth - 12 : x + 20;
        const translateY =
          nodeHeight + y > height ? y - nodeHeight - 12 : y - 20;
        return `translate(${translateX}, ${translateY})`;
      });
      tooltipContent
        .select(".contentDate")
        .text(`${t("day")} ${parseInt(xScale.invert(x).toString())}`);
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
      .node();
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
        .attr("r", 5)
        .attr("fill", color)
        .attr("cx", (_d) => baseXPos)
        .attr("cy", (_d) => yScale(actualData[valueField] as number));
    },
    [contentDotsRef, yScale, valueField]
  );

  const followPoints = useCallback(
    (e: MouseEvent) => {
      const x = xScale.invert(d3.pointer(e)[0]);
      const bisectDate = d3.bisector((d: SimulationData) => d[dateField]).left;
      let baseXPos = 0;

      const index = bisectDate(data, x, 1);
      const d0 = data[index - 1];
      const d1 = data[index];
      const actualData = x - d0[dateField] > d1?.day - x ? d1 : d0;

      const content = d3.select(contentRef.current);
      const contentDots = d3.select(contentDotsRef.current);

      content.selectAll("*").remove();
      contentDots.selectAll("*").remove();

      if (actualData[valueField] === null) return;
      const insideContent = content
        .append("g")
        .attr("transform", `translate(6,5)`);
      insideContent.append("circle").attr("r", 6).attr("fill", "red");
      insideContent
        .append("text")
        .attr("class", "performanceItemMarketValue")
        .attr("fill", "white")
        .attr("font-family", "Nunito, sans-serif")
        .text(Math.round(actualData[valueField] as number).toLocaleString());

      baseXPos = xScale(actualData[dateField]);
      placeDots(actualData, "red", baseXPos);

      d3.selectAll(".performanceItemMarketValue").attr(
        "transform",
        `translate(10,6)`
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
      dateField,
      valueField,
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

  if (!data.length || width <= 0) return null;

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
