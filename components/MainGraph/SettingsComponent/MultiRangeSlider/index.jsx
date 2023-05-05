import React, { useCallback, useEffect, useRef, useState } from "react";

const MultiRangeSlider = ({
  min,
  max,
  selectedMin,
  selectedMax,
  data,
  onChange,
}) => {
  const minValRef = useRef(null);
  const maxValRef = useRef(null);
  const range = useRef(null);
  const [formData, setFormData] = useState({
    minInput: data[selectedMin].fecha,
    minInputError: false,
    maxInput: data[selectedMax].fecha,
    maxInputError: false,
  });

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  const handleChangeInputDate = (event, isMax) => {
    let valueIndex;
    valueIndex = data.findIndex((item) => {
      return item.fecha == event.target.value;
    });
    if (isMax) {
      setFormData({
        ...formData,
        maxInput: event.target.value,
        maxInputError: true,
      });
    } else {
      setFormData({
        ...formData,
        minInput: event.target.value,
        minInputError: true,
      });
    }
    if (valueIndex > 0) {
      if (
        (isMax && valueIndex < selectedMin) ||
        (!isMax && valueIndex < selectedMax)
      ) {
        setFormData({
          ...formData,
          minInput: data[valueIndex].fecha,
          maxInput: data[selectedMax].fecha,
          minInputError: false,
          maxInputError: false,
        });
        onChange({ min: valueIndex, max: selectedMax });
      } else if (
        (isMax && valueIndex > selectedMin) ||
        (!isMax && valueIndex > selectedMax)
      ) {
        setFormData({
          ...formData,
          minInput: data[selectedMin].fecha,
          maxInput: data[valueIndex].fecha,
          minInputError: false,
          maxInputError: false,
        });
        onChange({ min: selectedMin, max: valueIndex });
      }
    }
  };

  // Set width of the range to decrease from the left side
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(selectedMin);
      const maxPercent = getPercent(+maxValRef.current.value); // Preceding with '+' converts the value from type string to type number

      setFormData({
        ...formData,
        minInput: data[selectedMin].fecha,
        maxInput: data[+maxValRef.current.value].fecha,
      });

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMin, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(selectedMax);

      setFormData({
        ...formData,
        minInput: data[+minValRef.current.value].fecha,
        maxInput: data[selectedMax].fecha,
        maxInputError: false,
        minInputError: false,
      });

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          onChange({ min: value, max: selectedMax });
          event.target.value = value.toString();
        }}
        className={`thumb thumb--zindex-3 ${
          selectedMin > max - 100 ? "thumb--zindex-5" : ""
        }`}
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
        <input
          className={`slider__left-value w-[94px] ${
            formData.minInputError && "errorDate"
          }`}
          type="date"
          value={formData.minInput}
          min={data[min].fecha}
          max={data[selectedMax].fecha}
          onChange={(e) => handleChangeInputDate(e, false)}
        />
        <input
          className={`slider__right-value w-[94px] ${
            formData.maxInputError && "errorDate"
          }`}
          type="date"
          value={formData.maxInput}
          min={data[selectedMin].fecha}
          max={data[max].fecha}
          onChange={(e) => handleChangeInputDate(e, true)}
        />
      </div>
    </div>
  );
};

export default MultiRangeSlider;
