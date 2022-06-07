import {useState,useEffect} from 'react';
import debounce from "lodash/debounce";

export default function useResize(ref) {
  const [state, setState] = useState();
  useEffect(() => {
      const getSize = debounce(() => {
      if (!ref || !ref.current) {
          return;
      }
      const width = ref.current.clientWidth;
      const height = ref.current.clientHeight >= 534  ? 534: ref.current.clientHeight;
      setState({
          width,
          height,
      });
      }, 1000);

      window.addEventListener("resize", getSize);
      getSize();
      return () => window.removeEventListener("resize", getSize);
  }, [ref]);

  return state;
}