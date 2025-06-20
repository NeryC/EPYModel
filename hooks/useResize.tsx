import { useState, useEffect, RefObject, useCallback } from "react";
import useResizeObserver from "@react-hook/resize-observer";

interface Size {
  width: number;
  height: number;
  top: number;
  left: number;
}

const initialSize: Size = {
  width: 0,
  height: 0,
  top: 0,
  left: 0,
};

export default function useResize(targetRef: RefObject<HTMLElement>): Size {
  const [size, setSize] = useState<Size>(initialSize);

  // Optimize the resize observer callback with useCallback
  const handleResize = useCallback((entry: ResizeObserverEntry) => {
    setSize(entry.contentRect);
  }, []);

  // Set initial size when ref is available
  useEffect(() => {
    const element = targetRef?.current;
    if (element) {
      const rect = element.getBoundingClientRect();
      setSize(rect);
    }
  }, [targetRef]);

  // Use the optimized resize observer
  useResizeObserver(targetRef, handleResize);

  return size;
}
