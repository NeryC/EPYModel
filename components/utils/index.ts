import { useMemo } from "react";
import * as d3 from "d3";

interface BaseLineData {
  xField: string;
  isSmooth?: boolean;
}

interface ScaleConfig {
  range: [number, number];
  domain: [number, number];
  scaleType: string;
  size?: number;
}

interface DomainConfig {
  data: any[];
  field: string;
  shouldReduce?: boolean;
}

export const basicDeclareLineD3 = (
  baseLineData: BaseLineData,
  dataYField: string,
  shouldReduce: boolean = false
) => {
  const isSmooth =
    baseLineData?.isSmooth !== false ? d3.curveNatural : d3.curveLinear;

  return (xScale: any, yScale: any) =>
    d3
      .line<any>()
      .x((d: any) => xScale(d[baseLineData.xField]))
      .y((d: any) => yScale(shouldReduce ? d[dataYField] / 1000 : d[dataYField]))
      .curve(isSmooth)
      .defined((d: any) => d[dataYField] != null);
};

export const useCreateScale = ({ range, domain, scaleType }: ScaleConfig) => {
  const type = scaleType === "Linear" ? d3.scaleLinear() : d3.scaleTime();

  return useMemo(() => (type as any).domain(domain).range(range), [domain, range, type]);
};

export const useGetDomain = ({ data, field, shouldReduce = false }: DomainConfig) => {
  return useMemo<[number, number]>(() => {
    const extent = d3.extent(
      data,
      (d: any) => (shouldReduce ? d[field] / 1000 : d[field])
    );
    const min = typeof extent[0] === "number" ? extent[0] : 0;
    const max = typeof extent[1] === "number" ? extent[1] : min + 1;
    return [min, max];
  }, [data, field, shouldReduce]);
};
