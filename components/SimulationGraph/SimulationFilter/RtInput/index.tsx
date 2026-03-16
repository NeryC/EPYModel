function RtInput({ value, index, handleRTChange }) {
  return (
    <div
      key={index}
      className="flex h-14 md:h-10 rounded-lg relative bg-transparent mx-auto"
    >
      <button
        data-action="decrement"
        className={`disabled:hover:bg-gray-200 disabled:bg-gray-200 px-2 ssm:px-5 md:px-1 bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full rounded-l cursor-pointer ${
          value === 0 ? "cursor-not-allowed" : ""
        }`}
        disabled={value === 0}
        onClick={() => handleRTChange(index, "decrement")}
      >
        <span className="m-auto text-2xl font-thin">−</span>
      </button>
      <input
        type="number"
        className="simulatorNumber md:w-6 text-center bg-gray-300 font-semibold text-md text-gray-700"
        name="custom-input-number"
        min="0"
        max="2"
        step="0.1"
        readOnly={true}
        value={value}
      />
      <button
        data-action="increment"
        className={`disabled:hover:bg-gray-200 disabled:bg-gray-200 px-2 ssm:px-5 md:px-1 bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full rounded-r ${
          value === 2 ? "cursor-not-allowed" : ""
        }`}
        disabled={value === 2}
        onClick={() => handleRTChange(index, "increment")}
      >
        <span className="m-auto text-2xl font-thin">+</span>
      </button>
    </div>
  );
}

export default RtInput;
