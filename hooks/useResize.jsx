import { useState, useEffect } from "react";
import useResizeObserver from "@react-hook/resize-observer";

export default function useResize(targetRef) {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  });

  useEffect(() => {
    const element = targetRef && targetRef.current;
    if (element) {
      setSize(element.getBoundingClientRect());
    }
  }, [targetRef]);

  useResizeObserver(targetRef, (entry) => {
    setSize(entry.contentRect);
  });

  return size;
}
