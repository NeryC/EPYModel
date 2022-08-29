import * as d3 from 'd3';
import useDimensions from '../../hooks/useDimensions';
import { useRef, useId, useEffect, useMemo, useCallback } from 'react';
import SettingsDropDown from './SettingsDropDown';
import {
  dimensions,
  useCreateScale,
  dynamicDateFormat,
  basicDeclareLineD3,
  getYDomain,
  declareAreaD3,
  createZoom,
  useGetDomain
} from '../../utils/constants';
import { checkLine, dateField } from '../../utils';
import GraphInfoTooltip from './Tooltip/GraphInfoTooltip';
import { useSelector } from 'react-redux';
import {
  selectSelectedLines,
  selectShowedElements,
  selectRange,
  selectIsSmooth,
  selectUncertainty,
  selectDotField
} from '../../store/reducers/graphInfoSlice';

const Graph = ({ type, data }) => {
  const svgChartRef = useRef(null);
  const yAxisRef = useRef(null);
  const xAxisRef = useRef(null);
  const dotsRef = useRef(null);
  const containerRef = useRef(null);

  const selectedLines = useSelector(selectSelectedLines(type));
  const showedElements = useSelector(selectShowedElements(type));
  const isSmooth = useSelector(selectIsSmooth(type));
  const uncertainty = useSelector(selectUncertainty(type));
  const range = useSelector(selectRange(type));
  const dotField = useSelector(selectDotField(type));

  let graphElements = {};

  const { margin } = dimensions;
  const { left, top, right, bottom } = margin;
  const clip = useId();

  const [{ svgWidth, svgHeight, width, height }] = useDimensions(margin, containerRef);

  const svgChart = d3.select(svgChartRef.current);
  const yAxisGroup = d3.select(yAxisRef.current);
  const xAxisGroup = d3.select(xAxisRef.current);
  const dotsGroup = d3.select(dotsRef.current);

  const zoom = createZoom(left, right, width, height, zoomed);

  function zoomed(e) {
    const xz = e.transform.rescaleX(xScale);
    const yz = getYDomain(data, type, selectedLines, xz, yScale);
    xScale.domain(xz.domain());

    xAxisGroup.call(axis.x, xz);
    yAxisGroup.call(axis.y, yz);
    drawLines();

    svgChart
      .selectAll(`#${dotField}-${type}`)
      .attr('cx', (d) => xScale(d[dateField]))
      .attr('cy', (d) => yScale(d[dotField]));
  }
  //y Right
  //x bottom
  //dailyR == estimated in reported graph estimated could be higer than dotfield if it is selected
  const yDomain = useGetDomain({
    data,
    field: checkLine(selectedLines, 'dailyR') ? 'dailyR' : dotField,
    scaleType: 'Linear'
  });
  const yScale = useCreateScale({
    range: [height - margin.bottom, margin.top],
    domain: yDomain,
    scaleType: 'Linear'
  });
  const xDomain = useGetDomain({
    data,
    field: dateField,
    scaleType: 'Time'
  });
  const xScale = useCreateScale({
    range: [0, width - right],
    domain: xDomain,
    scaleType: 'Time'
  });

  const setZoom = useCallback(() => {
    const base = width - right;
    if (base < 0) return;
    svgChart.call(
      zoom.transform,
      d3.zoomIdentity
        .scale(
          base /
            (xScale(data[range.finish][dateField]) - xScale(data[range.start][dateField]))
        )
        .translate(-xScale(data[range.start][dateField]), 0)
    );
  }, [data, range.finish, range.start, right, svgChart, width, xScale, zoom.transform]);

  useEffect(() => {
    setZoom();
  }, [range, isSmooth, uncertainty, selectedLines, setZoom]);

  const axis = useMemo(() => {
    return {
      y: (g, y1) => g.call(d3.axisRight(y1).ticks(5)),
      x: (g, x1) => g.call(d3.axisBottom(x1).ticks(5).tickFormat(dynamicDateFormat))
    };
  }, []);

  useEffect(() => {
    dotsGroup.selectAll(`#${dotField}-${type}`).remove();
    dotsGroup
      .selectAll('dot')
      .data(data)
      .join('circle')
      .attr('cx', (d) => xScale(d[dateField]))
      .attr('cy', (d) => yScale(d[dotField]))
      .attr('clip-path', 'url(#' + clip + ')')
      .attr('fill', '#FFFFFF')
      .attr('stroke', 'black')
      .attr('opacity', 0)
      .attr('r', 2.7)
      .attr('id', `${dotField}-${type}`);

    dotsGroup
      .selectAll(`#${dotField}-${type}`)
      .transition()
      .attr('opacity', 1)
      .delay(function (_d, i) {
        return i * 2;
      });

    dotsGroup
      .selectAll(`#${dotField}-${type}`)
      .filter(function (d) {
        return d[dotField] == null;
      })
      .remove();
    setZoom();
    // I only need this render in the first time or when el graph is resized
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  const baseLineData = {
    xField: dateField,
    isSmooth: isSmooth
  };

  showedElements.forEach((element) => {
    if (element.style == 'dot') return;

    graphElements[element.name] = basicDeclareLineD3(baseLineData, element.name);
  });

  graphElements['uncertainty'] = declareAreaD3(dateField, 'peor', 'mejor');

  function drawLines() {
    showedElements.forEach((element) => {
      if (element.style == 'dot') return;
      const d = graphElements[element.name](xScale, yScale)(data);

      svgChart
        .select(`#${element.name}-${type}`)
        .attr('d', d?.match(/NaN|undefined/) ? '' : d);
    });

    uncertainty
      ? svgChart
          .select(`#uncertainty-${type}`)
          .attr('d', graphElements['uncertainty'](xScale, yScale)(data))
      : svgChart.select(`#uncertainty-${type}`).attr('d', null);

    yAxisGroup.select('.domain').remove();
  }

  return (
    <div className="w-full h-[534px] relative" ref={containerRef}>
      <svg id={type} width={svgWidth} height={svgHeight} ref={svgChartRef}>
        <g id="elements" transform={`translate(${left},${top})`}>
          <clipPath id={clip}>
            <rect x={0} y={0} width={width - right} height={height - (bottom - 5)} />
          </clipPath>
          <g id="YAxis" ref={yAxisRef} transform={`translate(${width - right},0)`} />
          <g id="XAxis" ref={xAxisRef} transform={`translate(0,${height - bottom})`} />

          <g id="Lines" clipPath={`url(#${clip})`}>
            {showedElements.map(({ name, style, color }) => {
              if (style !== 'dot') {
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
          <g id="Dots" ref={dotsRef}></g>

          <GraphInfoTooltip
            xScale={xScale}
            yScale={yScale}
            width={width}
            height={height}
            data={data}
            showedElements={showedElements}
            margin={margin}
          />
        </g>
      </svg>
      <SettingsDropDown type={type} data={data} />
    </div>
  );
};

export default Graph;
