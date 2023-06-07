import { useCallback, useEffect, useRef, useState } from "react";

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
  const rangeRef = useRef(null);

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
    const valueIndex = data.findIndex(
      (item) => item.fecha === event.target.value
    );

    if (isMax) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        maxInput: event.target.value,
        maxInputError: true,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        minInput: event.target.value,
        minInputError: true,
      }));
    }

    if (valueIndex > 0) {
      if (
        (isMax && valueIndex < selectedMin) ||
        (!isMax && valueIndex < selectedMax)
      ) {
        setFormData({
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
          minInput: data[selectedMin].fecha,
          maxInput: data[valueIndex].fecha,
          minInputError: false,
          maxInputError: false,
        });
        onChange({ min: selectedMin, max: valueIndex });
      }
    }
  };

  // Establecer la anchura de la gama para disminuir desde el lado izquierdo
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(selectedMin);
      const maxPercent = getPercent(+maxValRef.current.value); // Precedido de "+" convierte el valor de tipo cadena a tipo número

      setFormData((prevFormData) => ({
        ...prevFormData,
        minInput: data[selectedMin].fecha,
        maxInput: data[+maxValRef.current.value].fecha,
      }));

      if (rangeRef.current) {
        rangeRef.current.style.left = `${minPercent}%`;
        rangeRef.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [selectedMin, getPercent, data]);

  // Establecer la anchura de la gama para disminuir desde el lado derecho
  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(selectedMax);

      setFormData((prevFormData) => ({
        ...prevFormData,
        minInput: data[+minValRef.current.value].fecha,
        maxInput: data[selectedMax].fecha,
        maxInputError: false,
        minInputError: false,
      }));

      if (rangeRef.current) {
        rangeRef.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [selectedMax, getPercent, data]);

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
        <div ref={rangeRef} className="slider__range bg-indigo-600" />
        <input
          className={`slider__left-value w-[94px] ${
            formData.minInputError ? "errorDate" : ""
          }`}
          type="date"
          value={formData.minInput}
          min={data[min].fecha}
          max={data[selectedMax].fecha}
          onChange={(e) => handleChangeInputDate(e, false)}
        />
        <input
          className={`slider__right-value w-[94px] ${
            formData.maxInputError ? "errorDate" : ""
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
