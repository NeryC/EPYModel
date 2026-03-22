function RtInput({ value, index, handleRTChange }) {
  const month = index + 1;
  return (
    <div
      className="flex h-14 md:h-11 rounded-lg relative bg-transparent mx-auto"
      role="group"
      aria-label={`Rt mes ${month}`}
    >
      <button
        type="button"
        data-action="decrement"
        aria-label={`Disminuir Rt mes ${month}`}
        className={`disabled:hover:bg-gray-200 disabled:bg-gray-200 px-2 sm:px-5 md:px-3 md:min-w-[44px] bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full rounded-l cursor-pointer ${
          value === 0 ? "cursor-not-allowed" : ""
        }`}
        disabled={value === 0}
        onClick={() => handleRTChange(index, "decrement")}
      >
        <span className="m-auto text-2xl font-thin" aria-hidden="true">−</span>
      </button>
      <input
        type="number"
        id={`rt-month-${month}`}
        aria-label={`Valor Rt mes ${month}`}
        className="simulatorNumber md:w-8 text-center bg-gray-300 font-semibold text-md text-gray-700"
        name={`rt-month-${month}`}
        min="0"
        max="2"
        step="0.1"
        readOnly={true}
        value={value}
      />
      <button
        type="button"
        data-action="increment"
        aria-label={`Aumentar Rt mes ${month}`}
        className={`disabled:hover:bg-gray-200 disabled:bg-gray-200 px-2 sm:px-5 md:px-3 md:min-w-[44px] bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full rounded-r ${
          value === 2 ? "cursor-not-allowed" : ""
        }`}
        disabled={value === 2}
        onClick={() => handleRTChange(index, "increment")}
      >
        <span className="m-auto text-2xl font-thin" aria-hidden="true">+</span>
      </button>
    </div>
  );
}

export default RtInput;
