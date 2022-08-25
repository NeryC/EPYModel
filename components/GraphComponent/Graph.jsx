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
import { checkLine } from '../../utils';
import GraphInfoTooltip from './Tooltip/GraphInfoTooltip';
import { useSelector } from 'react-redux';
import {
  selectSelectedLines,
  selectShowedElements,
  selectRange,
  selectIsSmooth,
  selectUncertainty
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

  const { margin } = dimensions;
  const { left, top, right, bottom } = margin;
  const clip = useId();

  const [{ svgWidth, svgHeight, width, height }] = useDimensions(
    margin,
    containerRef
  );

  const svgChart = d3.select(svgChartRef.current);
  const yAxisGroup = d3.select(yAxisRef.current);
  const xAxisGroup = d3.select(xAxisRef.current);

  const zoom = createZoom(left, right, width, height, zoomed);

  function zoomed(e) {
    const xz = e.transform.rescaleX(xScale);
    const yz = getYDomain(data, selectedLines, xz, yScale);
    xScale.domain(xz.domain());

    xAxisGroup.call(axis.x, xz);
    yAxisGroup.call(axis.y, yz);
    drawLines();

    d3.selectAll('#Reportado')
      .attr('cx', (d) => xScale(d.fechaFormateada))
      .attr('cy', (d) => yScale(d.Reportados));
  }
  //y Right
  //x bottom
  const yDomain = useGetDomain({
    data,
    field: checkLine(selectedLines, 'dailyR') ? 'dailyR' : 'Reportados',
    scaleType: 'Linear'
  });
  const yScale = useCreateScale({
    range: [height - margin.bottom, margin.top],
    domain: yDomain,
    scaleType: 'Linear'
  });
  const xDomain = useGetDomain({
    data,
    field: 'fechaFormateada',
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
            (xScale(data[range.finish].fechaFormateada) -
              xScale(data[range.start].fechaFormateada))
        )
        .translate(-xScale(data[range.start].fechaFormateada), 0)
    );
  }, [
    data,
    range.finish,
    range.start,
    right,
    svgChart,
    width,
    xScale,
    zoom.transform
  ]);

  useEffect(() => {
    setZoom();
  }, [range, isSmooth, uncertainty, selectedLines, setZoom]);

  const axis = useMemo(() => {
    return {
      y: (g, y1) => g.call(d3.axisRight(y1).ticks(5)),
      x: (g, x1) =>
        g.call(d3.axisBottom(x1).ticks(5).tickFormat(dynamicDateFormat))
    };
  }, []);

  useEffect(() => {
    d3.selectAll('#Reportado').remove();
    d3.select(dotsRef.current)
      .selectAll('dot')
      .data(data)
      .join('circle')
      .attr('cx', (d) => xScale(d.fechaFormateada))
      .attr('cy', (d) => yScale(d.Reportados))
      .attr('clip-path', 'url(#' + clip + ')')
      .attr('fill', '#FFFFFF')
      .attr('stroke', 'black')
      .attr('opacity', 0)
      .attr('r', 2.7)
      .attr('id', 'Reportado');

    d3.selectAll('#Reportado')
      .transition()
      .attr('opacity', 1)
      .delay(function (d, i) {
        return i * 2;
      });

    d3.selectAll('#Reportado')
      .filter(function (d) {
        return d.Reportados == null;
      })
      .remove();
    setZoom();
  }, [clip, data, setZoom, width, xScale, yScale]);

  const proy = basicDeclareLineD3('fechaFormateada', 'proy', isSmooth);
  const dailyR = basicDeclareLineD3('fechaFormateada', 'dailyR', isSmooth);
  const dailyR_sin_subRegistro = basicDeclareLineD3(
    'fechaFormateada',
    'dailyR_sin_subRegistro',
    isSmooth
  );
  const eq = basicDeclareLineD3('fechaFormateada', 'eq', isSmooth);
  const q25 = basicDeclareLineD3('fechaFormateada', 'q25', isSmooth);
  const q75 = basicDeclareLineD3('fechaFormateada', 'q75', isSmooth);
  const X2w = basicDeclareLineD3('fechaFormateada', 'X2w', isSmooth);
  const X10p = basicDeclareLineD3('fechaFormateada', 'X10p', isSmooth);
  const X20p = basicDeclareLineD3('fechaFormateada', 'X20p', isSmooth);
  const uncert = declareAreaD3();

  function drawLines() {
    const dProy = proy(xScale, yScale)(data);
    const dDailyR_sin_subRegistro = dailyR_sin_subRegistro(
      xScale,
      yScale
    )(data);
    const dDailyR =
      checkLine(selectedLines, 'dailyR') && dailyR(xScale, yScale)(data);
    const dEq = checkLine(selectedLines, 'eq') && eq(xScale, yScale)(data);
    const dQ25 = checkLine(selectedLines, 'q25') && q25(xScale, yScale)(data);
    const dQ75 = checkLine(selectedLines, 'q75') && q75(xScale, yScale)(data);
    const dX2w = checkLine(selectedLines, 'X2w') && X2w(xScale, yScale)(data);
    const dX10p =
      checkLine(selectedLines, 'X10p') && X10p(xScale, yScale)(data);
    const dX20p =
      checkLine(selectedLines, 'X20p') && X20p(xScale, yScale)(data);

    d3.select('#proy').attr('d', dProy?.match(/NaN|undefined/) ? '' : dProy);
    d3.select('#dailyR_sin_subRegistro').attr(
      'd',
      dDailyR_sin_subRegistro?.match(/NaN|undefined/)
        ? ''
        : dDailyR_sin_subRegistro
    );
    checkLine(selectedLines, 'dailyR') &&
      d3
        .select('#dailyR')
        .attr('d', dDailyR?.match(/NaN|undefined/) ? '' : dDailyR);
    checkLine(selectedLines, 'eq') &&
      d3.select('#eq').attr('d', dEq?.match(/NaN|undefined/) ? '' : dEq);
    checkLine(selectedLines, 'q25') &&
      d3.select('#q25').attr('d', dQ25?.match(/NaN|undefined/) ? '' : dQ25);
    checkLine(selectedLines, 'q75') &&
      d3.select('#q75').attr('d', dQ75?.match(/NaN|undefined/) ? '' : dQ75);
    checkLine(selectedLines, 'X2w') &&
      d3.select('#X2w').attr('d', dX2w?.match(/NaN|undefined/) ? '' : dX2w);
    checkLine(selectedLines, 'X10p') &&
      d3.select('#X10p').attr('d', dX10p?.match(/NaN|undefined/) ? '' : dX10p);
    checkLine(selectedLines, 'X20p') &&
      d3.select('#X20p').attr('d', dX20p?.match(/NaN|undefined/) ? '' : dX20p);
    uncertainty
      ? d3.select('#uncertainty').attr('d', uncert(xScale, yScale)(data))
      : d3.select('#uncertainty').attr('d', null);

    yAxisGroup.select('.domain').remove();
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
          <g
            id="YAxis"
            ref={yAxisRef}
            transform={`translate(${width - right},0)`}
          />
          <g
            id="XAxis"
            ref={xAxisRef}
            transform={`translate(0,${height - bottom})`}
          />

          <g id="Lines" clipPath={`url(#${clip})`}>
            {showedElements.map(({ name, style, color }) => {
              if (style !== 'dot') {
                return (
                  <path
                    key={name}
                    clipPath={`url(#${clip})`}
                    id={name}
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
              id="uncertainty"
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
