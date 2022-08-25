/** Graph.js */
import React, { useId, useEffect, useState } from 'react';
import * as d3 from 'd3';
import {
  dimensions,
  declareLineD3,
  drawLineD3,
  dynamicDateFormat,
  declareAreaD3,
  drawAreaD3
} from '../../utils/constants';
import { checkLine } from '../../utils/index';
import useResize from '../../hooks/useResize';
import Tooltip from './tooltip';

const Graph = ({ parentRef, rawData }) => {
  const svgChartRef = React.useRef(null);
  const tooltipRef = React.useRef(null);
  const size = useResize(parentRef);
  const { margin } = dimensions;
  const [selectedData, setSelectedData] = useState({});
  const { data, settings, elements } = rawData;
  const { selectedLines } = elements;

  const clip = useId();

  useEffect(() => {
    if (!size || !data || !settings) {
      return;
    }
    const { width, height } = size;
    const { isSmooth, uncertainty, range } = settings;
    const { start, finish } = range;

    const zoom = d3
      .zoom()
      .scaleExtent([1, 32])
      .extent([
        [margin.left, 0],
        [width - margin.right, height]
      ])
      .translateExtent([
        [margin.left, -Infinity],
        [width - margin.right, Infinity]
      ])
      .on('zoom', zoomed);

    const dataXrange = d3.extent(data, function (d) {
        return d.fechaFormateada;
      }),
      dataYrange = [
        0,
        d3.max(data, function (d) {
          return checkLine(selectedLines, 'dailyR') ? d.dailyR : d.Reportados;
        })
      ];

    const x = d3
        .scaleTime()
        .domain(dataXrange)
        .range([margin.left, width - margin.right]),
      y = d3
        .scaleLinear()
        .domain(dataYrange)
        .range([height - margin.bottom, margin.top]);

    const xAxis = (g, x1) =>
      g.attr('transform', `translate(0,${height - margin.bottom})`).call(
        d3
          .axisBottom(x1)
          .ticks(width / 120)
          .tickFormat(dynamicDateFormat)
      );

    const yAxis = (g, y1) =>
      g
        .attr('class', 'y axis')
        .attr('transform', `translate(${width - margin.right},0)`)
        .call(
          d3
            .axisRight(y1)
            .ticks(null, 's')
            .tickSize(margin.left + margin.right - width)
        )
        .call(() => g.select('.domain').remove())
        .call((e) =>
          e
            .select('.tick:last-of-type text')
            .clone()
            .attr('x', 3)
            .attr('text-anchor', 'start')
            .attr('font-weight', 'bold')
            .text(data.dailyR)
        );

    const svgChart = d3
      .select(svgChartRef.current)
      .attr('viewBox', [0, 0, width, height]);
    svgChart.selectAll('*').remove();

    svgChart
      .append('clipPath')
      .attr('id', clip)
      .append('rect')
      .attr('x', margin.left)
      .attr('y', margin.top)
      .attr('width', width - margin.left - margin.right - 8)
      .attr('height', height - margin.top - margin.bottom);

    ///
    /// Lineas
    ///
    const baseDeclareData = { xField: 'fechaFormateada', y, isSmooth };
    const baseDrawData = { svgChart, data, clip, x };
    //Proyected
    const proy = declareLineD3(baseDeclareData, 'proy');
    const proyLine = drawLineD3(baseDrawData, 'Proyected', 'proy', proy);

    //Estimated
    const daily2R = declareLineD3(baseDeclareData, 'dailyR');
    const daily2RLine =
      checkLine(selectedLines, 'dailyR') &&
      drawLineD3(baseDrawData, 'Estimated', 'dailyR', daily2R);

    //Simulated
    const dailyR = declareLineD3(baseDeclareData, 'dailyR_sin_subRegistro');
    const dailyRLine = drawLineD3(
      baseDrawData,
      'Simulated',
      'dailyR_sin_subRegistro',
      dailyR
    );

    //Plateau
    const eq = declareLineD3(baseDeclareData, 'eq');
    const eqLine =
      checkLine(selectedLines, 'eq') &&
      drawLineD3(baseDrawData, 'Plateau', 'eq', eq);

    // Percentil 25
    const q25 = declareLineD3(baseDeclareData, 'q25');
    const q25Line =
      checkLine(selectedLines, 'q25') &&
      drawLineD3(baseDrawData, 'Percentil25', 'q25', q25);

    //Percentil 75
    const q75 = declareLineD3(baseDeclareData, 'q75');
    const q75Line =
      checkLine(selectedLines, 'q75') &&
      drawLineD3(baseDrawData, 'Percentil75', 'q75', q75);

    //Last Month
    const X2w = declareLineD3(baseDeclareData, 'X2w');
    const X2wLine =
      checkLine(selectedLines, 'X2w') &&
      drawLineD3(baseDrawData, 'LastMonth', 'X2w', X2w);

    //10% Increase
    const X10p = declareLineD3(baseDeclareData, 'X10p');
    const X10pLine =
      checkLine(selectedLines, 'X10p') &&
      drawLineD3(baseDrawData, '10Increase', 'X10p', X10p);

    //20% Reduction
    const X20p = declareLineD3(baseDeclareData, 'X20p');
    const X20pLine =
      checkLine(selectedLines, 'X20p') &&
      drawLineD3(baseDrawData, '20Reduction', 'X20p', X20p);

    //20% Reduction
    const uncertaintyGraph = declareAreaD3(baseDeclareData);
    const uncertaintyArea =
      uncertainty && drawAreaD3(baseDrawData, uncertaintyGraph);

    //Reported
    const Reportados = svgChart
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', (d) => x(d.fechaFormateada))
      .attr('cy', (d) => y(d.Reportados))
      .attr('clip-path', 'url(#' + clip + ')')
      .attr('fill', '#FFFFFF')
      .attr('stroke', 'black')
      .attr('opacity', 1)
      .attr('r', 3);

    function zoomed(event) {
      const xz = event.transform.rescaleX(x);
      dailyRLine.attr('d', dailyR(xz));
      checkLine(selectedLines, 'dailyR') && daily2RLine.attr('d', daily2R(xz));
      checkLine(selectedLines, 'eq') && eqLine.attr('d', eq(xz));
      checkLine(selectedLines, 'q25') && q25Line.attr('d', q25(xz));
      checkLine(selectedLines, 'q75') && q75Line.attr('d', q75(xz));
      checkLine(selectedLines, 'X2w') && X2wLine.attr('d', X2w(xz));
      checkLine(selectedLines, 'X10p') && X10pLine.attr('d', X10p(xz));
      checkLine(selectedLines, 'X20p') && X20pLine.attr('d', X20p(xz));
      uncertainty && uncertaintyArea.attr('d', uncertaintyGraph(xz));
      proyLine.attr('d', proy(xz));
      gx.call(xAxis, xz);
      Reportados.attr('cx', function (d) {
        return xz(d.fechaFormateada);
      }).attr('cy', function (d) {
        return y(d.Reportados);
      });
      svgChart
        .on('mousemove', (e) => drawTooltip(e, xz))
        .on('mouseover', function () {
          const tooltip = d3.select(tooltipRef.current);
          tooltip.style('display', 'block');
        });
      setYdomain(xz);
    }

    ///
    /// fin lineas
    ///

    const gx = svgChart.append('g').call(xAxis, x);

    const gy = svgChart.append('g').call(yAxis, y);

    svgChart
      .on('mouseout', removeTooltip)
      .call(zoom)
      .transition()
      .duration(500)
      .call(zoom.scaleTo, 8, [x(Date.UTC(2022, 8, 1)), 0]);

    function removeTooltip() {
      const tooltip = d3.select(tooltipRef.current);
      if (tooltip) tooltip.style('display', 'none');
    }

    function drawTooltip(e, xz) {
      var bisectDate = d3.bisector(function (d) {
        return d.fechaFormateada;
      }).right;

      const x0 = xz.invert(d3.pointer(e, this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        actualData =
          x0 - d0.fechaFormateada > d1?.fechaFormateada - x0 ? d1 : d0;

      setSelectedData(actualData);

      const tooltip = d3.select(tooltipRef.current);
      const xLeft = xz(actualData.fechaFormateada);
      tooltip
        .style('position', 'absolute')
        .style('left', `${xLeft + 150 > width ? xLeft - 160 : xLeft + 20}px`)
        .style('top', e.pageY - 220 + 'px');
    }

    function setYdomain(xz) {
      // get the min and max date in focus
      const xleft = new Date(xz.domain()[0]);
      const xright = new Date(xz.domain()[1]);
      // a function that finds the nearest point to the right of a point
      const bisectDate = d3.bisector(function (d) {
        return d.fechaFormateada;
      }).right;

      // get the y value of the line at the left edge of view port:
      const iL = bisectDate(data, xleft);
      let yleft;
      if (data[iL] !== undefined && data[iL - 1] !== undefined) {
        const left_dateBefore = data[iL - 1].fechaFormateada,
          left_dateAfter = data[iL].fechaFormateada;
        let intfun;
        if (data[iL].mejor === null) {
          intfun = d3.interpolateNumber(
            0,
            checkLine(selectedLines, 'dailyR')
              ? data[iL].dailyR
              : data[iL].Reportados
          );
        } else {
          intfun = d3.interpolateNumber(data[iL - 1].q75, data[iL].peor);
        }
        yleft = intfun(
          (xleft - left_dateBefore) / (left_dateAfter - left_dateBefore)
        );
      } else {
        yleft = 0;
      }
      // get the x value of the line at the right edge of view port:
      const iR = bisectDate(data, xright);
      let yright;
      if (data[iR] !== undefined && data[iR - 1] !== undefined) {
        const right_dateBefore = data[iR - 1].fechaFormateada,
          right_dateAfter = data[iR].fechaFormateada;
        let intfun;
        if (data[iR].mejor === null) {
          intfun = d3.interpolateNumber(
            0,
            checkLine(selectedLines, 'dailyR')
              ? data[iR].dailyR
              : data[iR].Reportados
          );
        } else {
          intfun = d3.interpolateNumber(data[iR - 1].q75, data[iR].peor);
        }
        yright = intfun(
          (xright - right_dateBefore) / (right_dateAfter - right_dateBefore)
        );
      } else {
        yright = 0;
      }

      // get the y values of all the actual data points that are in view
      const dataSubset = data.filter(function (d) {
        return d.fechaFormateada >= xleft && d.fechaFormateada <= xright;
      });
      const countSubset = [];
      dataSubset.map(function (d) {
        if (d.q75 === null) {
          countSubset.push(
            checkLine(selectedLines, 'dailyR') ? d.dailyR : d.Reportados
          );
        } else {
          countSubset.push(d.peor);
        }
      });

      // add the edge values of the line to the array of counts in view, get the max y;
      countSubset.push(yleft);
      countSubset.push(yright);
      let ymax_new = d3.max(countSubset);

      if (ymax_new == 0) {
        ymax_new = dataYrange[1];
      }
      // reset and redraw the yaxis
      y.domain([0, ymax_new * 1.05]);
      gy.call(yAxis, y);
    }

    //zoom with slider
    svgChart.call(
      zoom.transform,
      d3.zoomIdentity
        .scale(
          width /
            (x(data[finish].fechaFormateada) - x(data[start].fechaFormateada))
        )
        .translate(-x(data[start].fechaFormateada), 0)
    );
  }, [clip, margin, data, size, selectedLines, settings]);

  return !!size ? (
    <div className="absolute">
      <svg ref={svgChartRef} width="100%" height={size.height} />
      <Tooltip
        data={selectedData}
        tooltipRef={tooltipRef}
        activeLines={selectedLines}
      />
    </div>
  ) : (
    <></>
  );
};

export default Graph;
