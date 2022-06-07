/** Graph.js */
import React, { useContext, useState, useEffect } from "react";
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
  const svgRef = React.useRef(null);
  const size = useResize(parentRef);
  const { margin } = dimensions;
  const margin2 = {top: 430, right: 20, bottom: 30, left: 40}

  useEffect(() => {
    const data = reported.slice();
    if (!size || !data ) {
      return;
    }
    console.log('paso')
    const { width, height } = size;

    // const color = d3.scale.category10();
    const parseTime = d3.timeParse("%Y-%m-%d");

    data.forEach(function(d) {
      // console.log(d.fecha)
      // console.log(parseTime(d.fecha))
      d.fechaFormateada = parseTime(d.fecha)
    });

    data.sort(function (x, y) {
      return d3.ascending(x.fechaFormateada, y.fechaFormateada);
  });

    const dataXrange = d3.extent(data, function(d) { return d.fechaFormateada; });
    const dataYrange = [0, d3.max(data, function (d) { return d.dailyR_sin_subRegistro; })];

    // set the ranges
    const x = d3.scaleTime()
        .domain(dataXrange)
        .range([margin.left, width - margin.right]),
      y = d3.scaleLinear()
        .domain(dataYrange)
        .range([height - margin.bottom, margin.top])


    // define lines
    // define the 1st line
    const X20p = d3.line()
    .x(function(d) { return x(d.fechaFormateada); })
    .y(function(d) { return y(d.X20p); })
    .defined(d => d.X20p != null)

    // define the 2nd line
    const X10p = d3.line()
    .x(function(d) { return x(d.fechaFormateada); })
    .y(function(d) { return y(d.X10p); })
    .defined(d => d.X10p != null)

    // define the 2nd line
    const X2w = d3.line()
    .x(function(d) { return x(d.fechaFormateada); })
    .y(function(d) { return y(d.X2w); })
    .defined(d => d.X2w != null)

    // define the 2nd line
    const q75 = d3.line()
    .x(function(d) { return x(d.fechaFormateada); })
    .y(function(d) { return y(d.q75); })
    .defined(d => d.q75 != null)

    // define the 2nd line
    const q25 = d3.line()
    .x(function(d) { return x(d.fechaFormateada); })
    .y(function(d) { return y(d.q25); })
    .defined(d => d.q25 != null)

    // define the planteau
    const eq = d3.line() 
    .x(function(d) { return x(d.fechaFormateada); })
    .y(function(d) { return y(d.eq); })
    .defined(d => d.eq != null)

    //proyecciones anteriores
    const dailyR = d3.line()
    .defined(d => d.dailyR_sin_subRegistro != null)
    .x(function (d) { return x(d.fechaFormateada); })
    .y(function (d) { return y(d.dailyR_sin_subRegistro); });

    // linea de abajo
    // const dailyR_sin_subRegistro = d3.line()
    // .defined(d => d.dailyR != null)
    // .x(function (d) { return x(d.fechaFormateada); })
    // .y(function (d) { return y(d.dailyR); });

    // const CapacidadMax = d3.line()
    // .defined(d => d.dailyR != null)
    // .x(function (d) { return x(d.fechaFormateada); })
    // .y(function (d) { return y(d.proy); });

    const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x))

    const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))

    // obtiene el svg y lo limpia
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove();

    //agrega el viewbox y los axis
    const svg = svgEl
      .attr("viewBox", [0, 0, width, height]);
      
    svg.append("g")
      .call(xAxis);

    svg.append("g")
        .call(yAxis);

    // Add the valueline path.
    svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", X20p);

    // Add the valueline2 path.
    svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", X10p);

    // Add the valueline2 path.
    svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "green")
      .attr("d", X2w);

    // Add the valueline2 path.
    svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "purple")
      .attr("d", q75);

    // Add the valueline2 path.
    svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "orange")
      .attr("d", q25);

    // Add the valueline2 path.
    svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "blue")
      .attr("d", eq);

    // Add the valueline2 path.
    svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "gray")
      .attr("d", dailyR);

    svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "black")
      .attr("d", dailyR_sin_subRegistro);
    
  }, [parentRef, reported, size]);


  // console.log(reported)
  return (
    !!size ?
      <svg 
        ref={svgRef} 
        width="100%"
        height={size.height}
      />
    : 
      <></>
  );
};

export default Graph;
