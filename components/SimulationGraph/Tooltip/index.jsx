import { useRef, useEffect, useCallback } from "react";
import { useTranslation } from "next-i18next";
import * as d3 from "d3";

const SimulationTooltip = ({ xScale, yScale, width, height, data }) => {
  const ref = useRef(null);
  const cuadroRef = useRef(null);
  const contentRef = useRef(null);
  const contentDotsRef = useRef(null);
  const { t } = useTranslation("common");
  const dateField = "day";
  const valueField = "value";

  const drawLine = useCallback(
    (x) => {
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
    (x, y) => {
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
        .text(`${t("day")} ${parseInt(xScale.invert(x))}`);
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
    (actualData, color, baseXPos) => {
      const contentDots = d3.select(contentDotsRef.current);
      contentDots
        .append("circle")
        .attr("r", 5)
        .attr("fill", color)
        .attr("cx", (_d) => baseXPos)
        .attr("cy", (_d) => yScale(actualData[valueField]));
    },
    [contentDotsRef, yScale, valueField]
  );

  const followPoints = useCallback(
    (e) => {
      const x = xScale.invert(d3.pointer(e, this)[0]);
      const bisectDate = d3.bisector((d) => d[dateField]).left;
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
        .text(Math.round(actualData[valueField]).toLocaleString());

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
    const fixedPosition = false;
    const cuadro = d3.select(cuadroRef.current);
    cuadro
      .on("mouseout.tooltip", () => {
        !fixedPosition && d3.select(ref.current).attr("opacity", 0);
      })
      .on("mouseover.tooltip", () => {
        !fixedPosition && d3.select(ref.current).attr("opacity", 1);
      })
      .on("mousemove.tooltip", (e) => {
        !fixedPosition && d3.select(ref.current).attr("opacity", 1);
        !fixedPosition && followPoints(e);
      })
      .on("click.tooltip", (e) => {
        if (fixedPosition) {
          d3.select(ref.current).attr("opacity", 0);
        } else {
          !fixedPosition && followPoints(e);
          d3.select(ref.current).attr("opacity", 1);
        }
        fixedPosition = !fixedPosition;
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
