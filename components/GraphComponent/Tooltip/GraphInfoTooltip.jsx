import { useRef, useEffect, useCallback } from "react";
import { dateField } from "../../../utils";
import { useTranslation } from "next-i18next";
import * as d3 from "d3";

const GraphInfoTooltip = ({
  xScale,
  yScale,
  width,
  height,
  data,
  showedElements,
}) => {
  const ref = useRef(null);
  const cuadroRef = useRef(null);
  const contentDotsRef = useRef(null);
  const contentRef = useRef(null);
  const cuadro = d3.select(cuadroRef.current);
  const content = d3.select(contentRef.current);
  const contentDots = d3.select(contentDotsRef.current);
  const { t } = useTranslation("common");
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
        .text(d3.timeFormat(t("dateSeparator"))(xScale.invert(x)));
    },
    [t, xScale, width, height]
  );

  const drawBackground = useCallback(() => {
    // reset background size to defaults
    const contentBackground = d3
      .select(ref.current)
      .select(".contentBackground");
    contentBackground.attr("width", 125).attr("height", 40);

    // calculate new background size
    const tooltipContentElement = d3
      .select(ref.current)
      .select(".tooltipContent")
      .node();
    if (!tooltipContentElement) return;

    const contentSize = tooltipContentElement.getBoundingClientRect();
    contentBackground
      .attr("width", contentSize.width + 8)
      .attr("height", contentSize.height + 4);
  }, []);

  const placeDots = useCallback(
    (actualData, color, i, baseXPos, style) => {
      const label = showedElements[i].name;

      contentDots
        .append("circle")
        .attr("r", 5)
        .attr("fill", style !== "dot" ? color : "#000000")
        .attr("cx", (_d) => baseXPos)
        .attr("cy", (_d) => yScale(actualData[label]));
    },
    [contentDots, showedElements, yScale]
  );

  const followPoints = useCallback(
    (e) => {
      const x = xScale.invert(d3.pointer(e, this)[0]);
      const bisectDate = d3.bisector((d) => d[dateField]).left;
      let baseXPos = 0;

      const index = bisectDate(data, x, 1),
        d0 = data[index - 1],
        d1 = data[index],
        actualData = x - d0[dateField] > d1?.fechaFormateada - x ? d1 : d0;

      let elementsCounter = 0;
      content.selectAll("*").remove();
      contentDots.selectAll("*").remove();

      showedElements.forEach(({ label, color, name, style }, i) => {
        if (actualData[name] === null) return;
        const insideContent = content
          .append("g")
          .attr("transform", `translate(6,${22 * elementsCounter++ + 5})`);
        insideContent.append("circle").attr("r", 6).attr("fill", color);
        insideContent
          .append("text")
          .attr("class", "performanceItemName")
          .attr("fill", "white")
          .attr("font-family", "Nunito, sans-serif")
          .attr("transform", `translate(10,6)`)
          .text(`${t(label)}`);
        insideContent
          .append("text")
          .attr("class", "performanceItemMarketValue")
          .attr("fill", "white")
          .attr("font-family", "Nunito, sans-serif")
          .text(Math.round(actualData[name]));

        baseXPos = xScale(actualData[dateField]);
        placeDots(actualData, color, i, baseXPos, style);
      });

      const maxNameWidth = d3.max(
        d3.selectAll(".performanceItemName").nodes(),
        (node) => node.getBoundingClientRect().width
      );

      d3.selectAll(".performanceItemMarketValue").attr(
        "transform",
        `translate(${maxNameWidth + 30},6)`
      );
      drawLine(baseXPos);
      drawContent(baseXPos, e.layerY);
      drawBackground();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      xScale,
      data,
      content,
      contentDots,
      showedElements,
      drawLine,
      drawContent,
      drawBackground,
      placeDots,
    ]
  );

  useEffect(() => {
    const fixedPosition = false;
    cuadro
      .on("mouseout.tooltip", () => {
        !fixedPosition && d3.select(ref.current).attr("opacity", 0);
      })
      .on("mouseover.tooltip", () => {
        !fixedPosition && d3.select(ref.current).attr("opacity", 1);
      })
      .on("mousemove.tooltip", (e) => {
        !fixedPosition && followPoints(e);
      })
      .on("click.tooltip", (e) => {
        fixedPosition = !fixedPosition;
        !fixedPosition && followPoints(e);
      });
  }, [cuadro, followPoints]);

  if (!data.length) return null;

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

export default GraphInfoTooltip;
