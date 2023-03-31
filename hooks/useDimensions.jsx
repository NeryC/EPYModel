import useResize from "./useResize";
import { dimensions } from "../utils/constants";

const useDimensions = (containerRef, height) => {
  const { margin } = dimensions;
  const { left, top, right, bottom } = margin;

  const { width } = useResize(containerRef);

  const conditionalLeft = left || 0;
  const conditionalRight = right || 0;
  const conditionalTop = top || 0;

  const innerWidth = width - conditionalLeft - conditionalRight;
  const innerHeight = height - conditionalTop;

  return [
    {
      svgWidth: width,
      svgHeight: height,
      width: innerWidth,
      height: innerHeight,
      left: conditionalLeft,
      top: conditionalTop,
      right: right,
      bottom: bottom,
    },
  ];
};

export default useDimensions;
