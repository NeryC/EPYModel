import React, { useCallback, useEffect, useRef } from "react";

const MultiRangeSlider = ({ min, max, selectedMin, selectedMax, data, onChange }) => {
  
  const minValRef = useRef(null);
  const maxValRef = useRef(null);
  const range = useRef(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    
    if (maxValRef.current) {
      const minPercent = getPercent(selectedMin);
      const maxPercent = getPercent(+maxValRef.current.value); // Preceding with '+' converts the value from type string to type number

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [selectedMin, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(selectedMax);
      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [selectedMax, getPercent]);

  return (
    <div className="container">
      <input
        type="range"
        min={min}
        max={max}
        value={selectedMin}
        ref={minValRef}
        onChange={(event) => {
          const value = Math.min(+event.target.value, selectedMax - 1);
          onChange({ min: value, max: selectedMax })
          event.target.value = value.toString();
        }}
        className={`thumb thumb--zindex-3 ${selectedMin > max - 100 ? 'thumb--zindex-5': ''}`}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={selectedMax}
        ref={maxValRef}
        onChange={(event) => {
          const value = Math.max(+event.target.value, selectedMin + 1);
          onChange({ min: selectedMin, max: value });
          event.target.value = value.toString();
        }}
        className="thumb thumb--zindex-4"
      />

      <div className="slider">
        <div className="slider__track bg-gray-300" />
        <div ref={range} className="slider__range bg-indigo-600" />
        <div className="slider__left-value">{data[selectedMin].fecha}</div>
        <div className="slider__right-value">{data[selectedMax].fecha}</div>
      </div>
    </div>
  );
};

export default MultiRangeSlider;
