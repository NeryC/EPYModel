import React from "react";
import useResize from "./useResize";

const useDimensions = ({ left, right, top, bottom }, containerRef) => {

  // const ref = React.useRef(null);
  const { width } = useResize(containerRef);

  const height = 534;
  const innerWidth = width - (left || 0) - (right || 0);
  const innerHeight = height - (top || 0) - (bottom || 0);

  return [
    {
      svgWidth: width,
      svgHeight: height,
      width: innerWidth,
      height: innerHeight,
    }
  ];
};

export default useDimensions;