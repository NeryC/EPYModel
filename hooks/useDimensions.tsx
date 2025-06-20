import { RefObject, useMemo } from "react";
import useResize from "./useResize";

interface Dimensions {
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

// Memoize the dimensions object to prevent unnecessary re-renders
const DIMENSIONS: Dimensions = {
  margin: {
    top: 20,
    right: 20,
    bottom: 30,
    left: 45,
  },
} as const;

export interface UseDimensionsReturn {
  svgWidth: number;
  svgHeight: number;
  width: number;
  height: number;
  left: number;
  top: number;
  right: number;
  bottom: number;
}

const useDimensions = (
  containerRef: RefObject<HTMLElement>,
  height: number
): UseDimensionsReturn => {
  const { width } = useResize(containerRef);
  const { margin } = DIMENSIONS;

  // Memoize the calculations to prevent unnecessary re-computations
  return useMemo(() => {
    const { left = 0, right = 0, top = 0, bottom } = margin;

    const innerWidth = width - left - right;
    const innerHeight = height - top;

    return {
      svgWidth: width,
      svgHeight: height,
      width: innerWidth,
      height: innerHeight,
      left,
      top,
      right,
      bottom,
    };
  }, [width, height, margin]);
};

export default useDimensions;
