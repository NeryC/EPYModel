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
  /** Si es true el dominio empieza en 0 (evita exagerar variaciones pequeñas). */
  includeZero?: boolean;
}

const siFormat = d3.format("~s");
const plainFormat = d3.format("~g");

/**
 * Formato compacto para ejes: 250 → "250", 1500 → "1.5k", 6000000 → "6M".
 * Por debajo de 1000 no usa prefijos SI para evitar "500m" (mili) en series chicas.
 */
export const formatAxisValue = (value: d3.AxisDomain): string => {
  const v = Number(value);
  return Math.abs(v) >= 1000 ? siFormat(v) : plainFormat(v);
};

export const basicDeclareLineD3 = (
  baseLineData: BaseLineData,
  dataYField: string,
  shouldReduce: boolean = false,
) => {
  const isSmooth =
    baseLineData?.isSmooth !== false ? d3.curveNatural : d3.curveLinear;

  return (xScale: any, yScale: any) =>
    d3
      .line<any>()
      .x((d: any) => xScale(d[baseLineData.xField]))
      .y((d: any) =>
        yScale(shouldReduce ? d[dataYField] / 1000 : d[dataYField]),
      )
      .curve(isSmooth)
      .defined((d: any) => d[dataYField] != null);
};

export const useCreateScale = ({ range, domain, scaleType }: ScaleConfig) => {
  const type = scaleType === "Linear" ? d3.scaleLinear() : d3.scaleTime();

  return useMemo(
    () => (type as any).domain(domain).range(range),
    [domain, range, type],
  );
};

export const useGetDomain = ({
  data,
  field,
  shouldReduce = false,
  includeZero = false,
}: DomainConfig) => {
  return useMemo<[number, number]>(() => {
    const extent = d3.extent(data, (d: any) =>
      shouldReduce ? d[field] / 1000 : d[field],
    );
    const dataMin = typeof extent[0] === "number" ? extent[0] : 0;
    const min = includeZero ? Math.min(0, dataMin) : dataMin;
    const dataMax = typeof extent[1] === "number" ? extent[1] : min + 1;
    // Dominio degenerado (todos los valores iguales) → escala sin rango útil
    const max = dataMax > min ? dataMax : min + 1;
    return [min, max];
  }, [data, field, shouldReduce, includeZero]);
};
