/** Graph.js */
import React, { useContext, useId, useLayoutEffect, useState } from "react";
import { Context } from "../../context/globalStore";
import * as d3 from "d3";
import { dimensions, declareLineD3, drawLineD3, dynamicDateFormat } from '../../utils/constants';
import useResize from '../../hooks/useResize';
import Tooltip from "./tooltip";

import schc from "../../public/exampleData/SCHC.json";
import vcit from "../../public/exampleData/VCIT.json";
import portfolio from "../../public/exampleData/portfolio.json";

const portfolioData = {
  name: "Portfolio",
  color: "#ffffff",
  items: portfolio.map((d) => ({ ...d, date: new Date(d.date) }))
};
const schcData = {
  name: "SCHC",
  color: "#d53e4f",
  items: schc.map((d) => ({ ...d, date: new Date(d.date) }))
};
const vcitData = {
  name: "VCIT",
  color: "#5e4fa2",
  items: vcit.map((d) => ({ ...d, date: new Date(d.date) }))
};

const Graph = ({ type, parentRef }) => {
  const { state } = useContext(Context);
  const { reported } = state;
  const svgChartRef = React.useRef(null);
  const tooltipRef = React.useRef(null);
  const size = useResize(parentRef);
  const { margin } = dimensions;
  const [selectedData, setSelectedData] = useState({});

  const clip = useId();

  useLayoutEffect(() => {
    const data = reported.slice();
    if (!size || !data ) {
      return;
    }
    const { width, height } = size;

    const zoom = d3.zoom()
      .scaleExtent([1, 32])
      .extent([[margin.left, 0], [width - margin.right, height]])
      .translateExtent([[margin.left, -Infinity], [width - margin.right, Infinity]])
      .on("zoom", zoomed);

    const dataXrange = d3.extent(data, function(d) { return d.fechaFormateada; }),
      dataYrange = [0, d3.max(data, function (d) { return d.dailyR; })];

    const x = d3.scaleTime()
        .domain(dataXrange)
        .range([margin.left, width - margin.right]),
      y = d3.scaleLinear()
        .domain(dataYrange)
        .range([height - margin.bottom, margin.top])

    const xAxis = (g, x1) => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x1).ticks(width / 120).tickFormat(dynamicDateFormat))

    const yAxis = (g, y1) => g
      .attr("class", "y axis")
      .attr("transform", `translate(${width - margin.right},0)`)
      .call(d3.axisRight(y1).ticks(null, "s").tickSize(margin.left+margin.right-(width)))
      .call(() => g.select(".domain").remove())
      .call(e => e.select(".tick:last-of-type text").clone()
      .attr("x", 3)
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text(data.dailyR))

    const svgChart = d3.select(svgChartRef.current)
      .attr("viewBox", [0, 0, width, height]);
    svgChart.selectAll("*").remove();
      
    const tooltip = d3.select(tooltipRef.current)

    const tooltipLine = svgChart.append('line');

    svgChart.append("clipPath")
      .attr("id", clip)
    .append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", width - margin.left - margin.right - 8)
      .attr("height", height - margin.top - margin.bottom)

    ///
    /// Lineas
    ///
    const baseDrawData = {svgChart, data, clip, x}
    const baseDeclareData = {xField:'fechaFormateada', y}
    //Proyected
    const proy = declareLineD3(baseDeclareData,'proy');
    const proyLine = drawLineD3(baseDrawData, "Proyected", 'proy', proy);

    //Estimated
    const daily2R = declareLineD3(baseDeclareData,'dailyR');
    const daily2RLine = drawLineD3(baseDrawData, 'Estimated', 'dailyR', daily2R);

    //Simulated
    const dailyR = declareLineD3(baseDeclareData,'dailyR_sin_subRegistro');
    const dailyRLine = drawLineD3(baseDrawData, 'Simulated', 'dailyR_sin_subRegistro', dailyR);

    //Plateau
    const eq = declareLineD3(baseDeclareData,'eq');
    const eqLine = drawLineD3(baseDrawData, 'Plateau', 'eq', eq);

    // Percentil 25
    const q25 = declareLineD3(baseDeclareData,'q25');
    const q25Line = drawLineD3(baseDrawData, 'Percentil25', 'q25', q25);

    //Percentil 75
    const q75 = declareLineD3(baseDeclareData,'q75');
    const q75Line = drawLineD3(baseDrawData, 'Percentil75', 'q75', q75);

    //Last Month
    const X2w = declareLineD3(baseDeclareData,'X2w');
    const X2wLine = drawLineD3(baseDrawData, 'LastMonth', 'X2w', X2w);

    //10% Increase
    const X10p = declareLineD3(baseDeclareData,'X10p');
    const X10pLine = drawLineD3(baseDrawData, '10Increase', 'X10p', X10p);

    //20% Reduction
    const X20p = declareLineD3(baseDeclareData,'X20p');
    const X20pLine = drawLineD3(baseDrawData, '20Reduction', 'X20p', X20p);

    //Reported
    const Reportados = svgChart.selectAll('circle')
    .data(data)
    .join('circle')
      .attr('cx', d => x(d.fechaFormateada))
      .attr('cy', d => y(d.Reportados))
      .attr("clip-path", "url(#" + clip + ")")
      .attr('fill', "#FFFFFF")
      .attr("stroke", "black")
      .attr('opacity', 1)
      .attr('r', 3);
    
    // svgChart.selectAll(".dot")
    // .data(data)
    // .enter()
    // .append("circle")
    //   .attr("cx", function (d) { return x(d.fechaFormateada); } )
    //   .attr("cy", function (d) { return y(d.Reportados); } )
    //   .attr("clip-path", "url(#" + clip + ")")
    //   .filter(function (d) { return d.Reportados > 0 })
    //   .attr("r", 3)
    //   .attr("class", "dot")
    //   .style("fill", "#FFFFFF")
    //   .style("stroke", "black")
    //   .style("stroke-width", 0.5)


    // const reportados =  declareLineD3(baseDeclareData,'Reportados');
    // const reportadosLine = svgChart.append("path")
    //   .data([data])
    //   .attr("clip-path", "url(#"+clip+")")
    //   .attr("id", "Reported")
    //   .attr("class", "line")
    //   .style("stroke", "orange")
    //   .attr("d", reportados(x));

    function zoomed(event) {
      const xz = event.transform.rescaleX(x);
      dailyRLine.attr("d", dailyR(xz));
      daily2RLine.attr("d", daily2R(xz));
      eqLine.attr("d", eq(xz));
      q25Line.attr("d", q25(xz));
      q75Line.attr("d", q75(xz));
      X2wLine.attr("d", X2w(xz));
      X10pLine.attr("d", X10p(xz));
      X20pLine.attr("d", X20p(xz));
      proyLine.attr("d", proy(xz));
      // reportadosLine.attr("d", reportados(xz));
      gx.call(xAxis, xz);
      Reportados
        .attr("cx", function (d) { return xz(d.fechaFormateada); })
        .attr("cy", function (d) { return y(d.Reportados); });
      svgChart.on('mousemove', (e) => drawTooltip(e,xz))
        .on("mouseover", function () {
          tooltip.style('display', 'block')
        })
      setYdomain(xz);
    }
    
    ///
    /// fin lineas
    ///

    const gx = svgChart.append("g")
      .call(xAxis, x);

    const gy = svgChart.append("g")
      .call(yAxis, y);

    svgChart
    // .on('mouseout', removeTooltip)
    .call(zoom)
      .transition()
        .duration(500)
        .call(zoom.scaleTo, 8, [x(Date.UTC(2022, 8, 1)), 0]);

    function removeTooltip() {
      if (tooltip) tooltip.style('display', 'none');
      if (tooltipLine) tooltipLine.attr('stroke', 'none');
    }
    
    function drawTooltip(e,xz) {
      var bisectDate = d3.bisector(function (d) { return d.fechaFormateada; }).right;
      const selectedDate = xz.invert(d3.pointer(e)[0])
      const bisecx = bisectDate(data, selectedDate)
      tooltipLine.attr('stroke', 'black')
        .attr('x1', xz(selectedDate))
        .attr('x2', xz(selectedDate))
        .attr('y1', 0)
        .attr('y2', height);
      const actualData = data[bisecx-1]
      setSelectedData(actualData);
      tooltip
        .style('left', (e.pageX-256) + "px")
        .style('top', (e.pageY-72) + "px")

    }
    
    function setYdomain(xz) {
      // get the min and max date in focus
      const xleft = new Date(xz.domain()[0]);
      const xright = new Date(xz.domain()[1]);
      // a function that finds the nearest point to the right of a point
      const bisectDate = d3.bisector(function (d) { return d.fechaFormateada; }).right;

      // get the y value of the line at the left edge of view port:
      const iL = bisectDate(data, xleft);
      let yleft;
      if (data[iL] !== undefined && data[iL - 1] !== undefined) {

        const left_dateBefore = data[iL - 1].fechaFormateada,
          left_dateAfter = data[iL].fechaFormateada;
        let intfun;
        if (data[iL].mejor === null) {
          // if (!dailyR_sin_subRegistro.active) {
            intfun = d3.interpolateNumber(0, data[iL].dailyR);
          // } else {
              // var intfun = d3.interpolateNumber(0, data[iL].dailyR_sin_subRegistro);                        
          // }
        } else {
          intfun = d3.interpolateNumber(data[iL - 1].q75, data[iL].peor);
        }
        yleft = intfun((xleft - left_dateBefore) / (left_dateAfter - left_dateBefore));
      } else {
        yleft = 0;
      }
      // get the x value of the line at the right edge of view port:
      const iR = bisectDate(data, xright);
      let yright;
      if (data[iR] !== undefined && data[iR - 1] !== undefined) {

        const right_dateBefore = data[iR - 1].fechaFormateada,
          right_dateAfter = data[iR].fechaFormateada;
        let intfun ;
        if (data[iR].mejor === null) {
          // if (!dailyR_sin_subRegistro.active) {
            intfun = d3.interpolateNumber(0, data[iR].dailyR);
          // }else {
              //intfun = d3.interpolateNumber(0, data[iR].dailyR_sin_subRegistro);
          // }
        } else {
          intfun = d3.interpolateNumber(data[iR - 1].q75, data[iR].peor);
        }                
        yright = intfun((xright - right_dateBefore) / (right_dateAfter - right_dateBefore));
      } else {
        yright = 0;
      }

      // get the y values of all the actual data points that are in view
      const dataSubset = data.filter(function (d) { return d.fechaFormateada >= xleft && d.fechaFormateada <= xright; });
      const countSubset = [];
      dataSubset.map(function (d) {
        if (d.q75 === null) {
          // if (!dailyR_sin_subRegistro.active) {
              countSubset.push(d.dailyR);
          // }else {
              // countSubset.push(d.dailyR_sin_subRegistro);
          // }
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
      gy.call(yAxis,y);

    }

    
  }, [clip, margin, reported, size]);

  // position:absolute;background-color:lightgray;padding:5px
  // console.log(reported)
  return (
    !!size ?
      <div className="absolute">
        <svg 
          ref={svgChartRef} 
          width="100%"
          height={size.height}
        />
        {/* <div ref={tooltipRef} /> */}
        <Tooltip data={selectedData} tooltipRef={tooltipRef} />
      </div>
    : 
      <></>
  );
};

export default Graph;
