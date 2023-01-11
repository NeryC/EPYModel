import useResize from "./useResize";
import { dimensions } from "../utils/constants";

const useDimensions = (containerRef) => {
  const { margin } = dimensions;
  const { left, top, right, bottom } = margin;

  const { width } = useResize(containerRef);

  const conditionalLeft = width < 380 ? 0 : left || 0;
  const conditionalRight = width < 380 ? 0 : right || 0;
  const conditionalTop = width < 380 ? 0 : top || 0;
  const conditionalBottom = width < 380 ? 0 : bottom || 0;

  const height = 534;
  const innerWidth = width - conditionalLeft - conditionalRight;
  const innerHeight = height - conditionalTop - conditionalBottom;

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
