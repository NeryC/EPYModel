/** Graph.js */
import React, { useContext, useId, useEffect } from "react";
import { Context } from "../../context/globalStore";
import * as d3 from "d3";
import { dimensions } from '../../utils/constants';
import useResize from '../../hooks/useResize';

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
  const svgFocusRef = React.useRef(null);
  const size = useResize(parentRef);
  const { margin } = dimensions;

  const clip = useId();

  useEffect(() => {
    const data = reported.slice();
    if (!size || !data ) {
      return;
    }
    const { width, height } = size;
    // const height2 = +height - margin2.top - margin2.bottom;
    
    const parseTime = d3.timeParse("%Y-%m-%d");

    data.forEach(function(d) {
      d.fechaFormateada = parseTime(d.fecha)
    });

    data.sort(function (x, y) {
      return d3.ascending(x.fechaFormateada, y.fechaFormateada);
    });

    const dataXrange = d3.extent(data, function(d) { return d.fechaFormateada; }),
      dataYrange = [0, d3.max(data, function (d) { return d.dailyR_sin_subRegistro; })];


    // obtiene el svg y lo limpia

    ///
    /// nuevo chart
    ///
    // set the ranges
    const x = d3.scaleTime()
        .domain(dataXrange)
        .range([margin.left, width - margin.right]),
      y = d3.scaleLinear()
        .domain(dataYrange)
        .range([height - margin.bottom, margin.top])

    const xAxis = (g, x1) => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x1).ticks(width / 80).tickSizeOuter(0))

    const yAxis = (g, y1) => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y1).ticks(null, "s"))
      .call(e => e.select(".domain").remove())
      .call(e => e.select(".tick:last-of-type text").clone()
      .attr("x", 3)
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text(data.dailyR_sin_subRegistro))

    const dailyR = (newX) =>d3.line()
      .defined(d => d.dailyR_sin_subRegistro != null)
      .x(function (d) { return newX(d.fechaFormateada); })
      .y(function (d) { return y(d.dailyR_sin_subRegistro); });

    const svgChart = d3.select(svgChartRef.current)
      .attr("viewBox", [0, 0, width, height]);
    svgChart.selectAll("*").remove();

    const zoom = d3.zoom()
      .scaleExtent([1, 32])
      .extent([[margin.left, 0], [width - margin.right, height]])
      .translateExtent([[margin.left, -Infinity], [width - margin.right, Infinity]])
      .on("zoom", zoomed);


    svgChart.append("clipPath")
      .attr("id", clip)
    .append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom);
    console.log(clip)
    const path = svgChart.append("path")
      .data([data])
      .attr("clip-path", "url(#"+clip+")")
      .attr("class", "line")
      .style("stroke", "green")
      .attr("d", dailyR(x));

    const gx = svgChart.append("g")
      .call(xAxis, x);

    svgChart.append("g")
        .call(yAxis, y);

    svgChart.call(zoom)
      .transition()
        .duration(750)
        .call(zoom.scaleTo, 4, [x(Date.UTC(2001, 8, 1)), 0]);

    function zoomed(event) {
      const xz = event.transform.rescaleX(x);
      path.attr("d", dailyR(xz));
      gx.call(xAxis, xz);
    }


    ///
    /// nuevo chart
    ///

    
  }, [parentRef, reported, size]);


  // console.log(reported)
  return (
    !!size ?
      <>
        <svg 
          ref={svgChartRef} 
          width="100%"
          height={size.height}
        />
      </>
    : 
      <></>
  );
};

export default Graph;
