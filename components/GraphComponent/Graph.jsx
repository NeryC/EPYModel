import * as d3 from "d3";
import useDimensions from "../../hooks/useDimensions";
import { useRef, useId, useEffect, useMemo } from "react";
import SettingsDropDown from "./SettingsDropDown";
import { dimensions, useCreateScale, dynamicDateFormat, basicDeclareLineD3, getYDomain, declareAreaD3, createZoom } from "../../utils/constants";
import { checkLine } from "../../utils";
import Overlay from "./GraphElements/Overlay";
import { useSelector } from "react-redux";
import { selectSelectedLines, selectShowedElements, selectRange, selectIsSmooth, selectUncertainty } from "../../store/reducers/graphInfoSlice";

const Graph = ({type, data}) => {
  const overlayRef = useRef(null);
  const svgChartRef = useRef(null);
  const yAxisRef = useRef(null);
  const xAxisRef = useRef(null);
  const dotsRef = useRef(null);
  const containerRef = useRef(null);

  const selectedLines = useSelector(selectSelectedLines(type));
  const showedElements = useSelector(selectShowedElements(type));
  const isSmooth = useSelector(selectIsSmooth(type))
  const uncertainty = useSelector(selectUncertainty(type))
  const range = useSelector(selectRange(type));
  
  const { margin } = dimensions;
  const { left, top, right, bottom } = margin;
  const clip = useId();
  
  const [{ svgWidth, svgHeight, width, height }] = useDimensions(margin,containerRef);

  const svgChart = d3.select(svgChartRef.current)
  const yAxisGroup = d3.select(yAxisRef.current);
  const xAxisGroup = d3.select(xAxisRef.current);

  const zoom = createZoom(left, right, width, height, zoomed)

  function zoomed(e) {
    const xz = e.transform.rescaleX(xScale);
    const yz = getYDomain(data, selectedLines, xz, yScale)
    xScale.domain(e.transform.rescaleX(xScale).domain());

    xAxisGroup.call(axis.x, xz);
    yAxisGroup.call(axis.y, yz);

    drawLines()

    d3.selectAll("#Reportado")
      .attr("cx", d => xScale(d.fechaFormateada))
      .attr("cy", d => yScale(d.Reportados))
  }

  useEffect(()=>{
    const base = width-right
    if(base< 0 )return
    svgChart.call(zoom.transform, d3.zoomIdentity
      .scale(base/ (xScale(data[range.finish].fechaFormateada) - xScale(data[range.start].fechaFormateada)))
      .translate(-xScale(data[range.start].fechaFormateada), 0));
  },[range, isSmooth, uncertainty, selectedLines])

  //y Right
  //x bottom
  const yScale = useCreateScale({ 
    data, 
    range: [height - margin.bottom, margin.top], 
    field: checkLine(selectedLines,"dailyR") ? "dailyR" : "Reportados", 
    scaleType: "Linear"
  });
  const xScale = useCreateScale({ 
    data, 
    range: [0, width - right], 
    field: "fechaFormateada",  
    scaleType: "Time"
  });

  const axis = useMemo(
    () => {
      return {
        y: (g, y1) => g.call(d3.axisRight(y1).ticks(5)),
        x: (g, x1) => g.call(d3.axisBottom(x1).ticks(5).tickFormat(dynamicDateFormat))
      }
    },
    [xScale, yScale]
  );

  useEffect(()=>{
    yAxisGroup.transition().duration(750).ease(d3.easeLinear).call(axis.y, yScale);
    xAxisGroup.transition().duration(750).ease(d3.easeLinear).call(axis.x, xScale);
    drawLines()

    d3.selectAll("#Reportado").remove()
    d3.select(dotsRef.current)
      .selectAll("dot")
      .data(data)
      .join("circle")
        .attr("cx", d => xScale(d.fechaFormateada))
        .attr("cy", d => yScale(d.Reportados))
        .attr("clip-path", "url(#" + clip + ")")
        .attr('fill', "#FFFFFF")
        .attr("stroke", "black")
        .attr('opacity', 0)
        .attr('r', 2.7)
        .attr('id', 'Reportado');

    d3.selectAll("#Reportado")
      .transition()
      .attr('opacity', 1)
      .delay(function(d,i){return(i*2)})

    d3.selectAll("#Reportado").filter(function(d) { 
      return d.Reportados == null; 
    })
      .remove()
  },[width])

  const proy = basicDeclareLineD3('fechaFormateada', 'proy',isSmooth)
  const dailyR = basicDeclareLineD3('fechaFormateada','dailyR', isSmooth);
  const dailyR_sin_subRegistro = basicDeclareLineD3('fechaFormateada','dailyR_sin_subRegistro', isSmooth);
  const eq = basicDeclareLineD3('fechaFormateada','eq', isSmooth);
  const q25 = basicDeclareLineD3('fechaFormateada','q25', isSmooth);
  const q75 = basicDeclareLineD3('fechaFormateada','q75', isSmooth);
  const X2w = basicDeclareLineD3('fechaFormateada','X2w', isSmooth);
  const X10p = basicDeclareLineD3('fechaFormateada','X10p', isSmooth);
  const X20p = basicDeclareLineD3('fechaFormateada','X20p', isSmooth);
  const uncert = declareAreaD3();

  function drawLines() {
    const dProy = proy(xScale,yScale)(data);
    const dDailyR_sin_subRegistro = dailyR_sin_subRegistro(xScale,yScale)(data);
    const dDailyR = checkLine(selectedLines,"dailyR") && dailyR(xScale,yScale)(data);
    const dEq = checkLine(selectedLines,"eq") && eq(xScale,yScale)(data);
    const dQ25 = checkLine(selectedLines,"q25") && q25(xScale,yScale)(data);
    const dQ75 = checkLine(selectedLines,"q75") && q75(xScale,yScale)(data);
    const dX2w = checkLine(selectedLines,"X2w") && X2w(xScale,yScale)(data);
    const dX10p = checkLine(selectedLines,"X10p") && X10p(xScale,yScale)(data);
    const dX20p = checkLine(selectedLines,"X20p") && X20p(xScale,yScale)(data);

    d3.select("#proy")
      .attr("d", dProy?.match(/NaN|undefined/) ? "" : dProy);
    d3.select("#dailyR_sin_subRegistro")
      .attr("d", dDailyR_sin_subRegistro?.match(/NaN|undefined/) ? "" : dDailyR_sin_subRegistro)
    checkLine(selectedLines,"dailyR") && d3.select("#dailyR")
      .attr("d", dDailyR?.match(/NaN|undefined/) ? "" : dDailyR)
    checkLine(selectedLines,"eq") && d3.select("#eq")
      .attr("d", dEq?.match(/NaN|undefined/) ? "" : dEq)
    checkLine(selectedLines,"q25") && d3.select("#q25")
      .attr("d", dQ25?.match(/NaN|undefined/) ? "" : dQ25)
    checkLine(selectedLines,"q75") && d3.select("#q75")
      .attr("d", dQ75?.match(/NaN|undefined/) ? "" : dQ75)
    checkLine(selectedLines,"X2w") && d3.select("#X2w")
      .attr("d", dX2w?.match(/NaN|undefined/) ? "" : dX2w)
    checkLine(selectedLines,"X10p") && d3.select("#X10p")
      .attr("d", dX10p?.match(/NaN|undefined/) ? "" : dX10p)
    checkLine(selectedLines,"X20p") && d3.select("#X20p")
      .attr("d", dX20p?.match(/NaN|undefined/) ? "" : dX20p)
    uncertainty ? 
      d3.select("#uncertainty").attr("d", uncert(xScale,yScale)(data)) :
      d3.select("#uncertainty").attr("d", null)

    yAxisGroup.select(".domain").remove();
  }

  return (
    <div className="w-full h-[534px] relative" ref={containerRef}>
      <svg width={svgWidth} height={svgHeight} ref={svgChartRef}>
        <g id="elements" transform={`translate(${left},${top})`}>
          <clipPath id={clip}>
            <rect x={0} y={-10} width={width-right} height={height} />
          </clipPath>
          <g id="YAxis" ref={yAxisRef} transform={`translate(${width - right},0)`} />
          <g id="XAxis" ref={xAxisRef} transform={`translate(0,${height - bottom})`} />
          <Overlay ref={overlayRef} width={width} height={height}>
          </Overlay>
          <g id="Lines" clipPath={`url(#${clip})`}>
            {showedElements.map(({ name, style, color }) => {
              if (style !== "dot"){
                return(
                  <path
                    key={name}
                    clipPath={`url(#${clip})`}
                    id={name}
                    stroke={color}
                    strokeWidth={2}
                    fill="none"
                    opacity={1}
                  />
                )
              }
            })}
          </g>
          <g id='uncertaintyContainer'>
            <path
              id='uncertainty'
              clipPath={`url(#${clip})`}
              stroke='none'
              fill="b5adff"
              opacity={0.1}
            />
          </g>
          <g id="Dots" ref={dotsRef}></g>
        </g>
      </svg>
      <SettingsDropDown type={type} data={data} />
    </div> 
  );
};
  
export default Graph;
  