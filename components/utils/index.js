import { useMemo } from "react";
import * as d3 from "d3";

export const basicDeclareLineD3 = (
  baseLineData,
  dataYField,
  shouldReduce = false
) => {
  const isSmooth =
    baseLineData?.isSmooth !== false ? d3.curveNatural : d3.curveLinear;

  return (xScale, yScale) =>
    d3
      .line()
      .x((d) => xScale(d[baseLineData.xField]))
      .y((d) => yScale(shouldReduce ? d[dataYField] / 1000 : d[dataYField]))
      .curve(isSmooth)
      .defined((d) => d[dataYField] != null);
};

export const useCreateScale = ({ range, domain, scaleType }) => {
  const type = scaleType === "Linear" ? d3.scaleLinear() : d3.scaleTime();

  return useMemo(() => type.domain(domain).range(range), [domain, range, type]);
};

export const useGetDomain = ({ data, field, shouldReduce = false }) => {
  return useMemo(() => {
    return d3.extent(data, (d) => (shouldReduce ? d[field] / 1000 : d[field]));
  }, [data, field, shouldReduce]);
};
