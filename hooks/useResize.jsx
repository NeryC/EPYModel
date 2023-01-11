import { useState, useEffect } from "react";
import useResizeObserver from "@react-hook/resize-observer";

export default function useResize(targetRef) {
  const [size, setSize] = useState();
  useEffect(() => {
    targetRef &&
      targetRef.current &&
      setSize(targetRef.current.getBoundingClientRect());
  }, [targetRef]);

  // Where the magic happens
  useResizeObserver(targetRef, (entry) => setSize(entry.contentRect));
  return (
    size || {
      width: 0,
      height: 0,
      top: 0,
      left: 0,
    }
  );
}
