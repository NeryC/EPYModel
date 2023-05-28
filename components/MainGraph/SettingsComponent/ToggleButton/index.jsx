import React from "react";

const ToggleButton = ({ label, name, handleChange, checkedState }) => {
  const handleToggle = () => {
    handleChange(name);
  };

  return (
    <div className="flex justify-between w-full mb-2">
      <span className="mr-3">{label}</span>
      <label
        htmlFor={name}
        className="inline-flex relative items-center cursor-pointer"
      >
        <input
          type="checkbox"
          checked={checkedState}
          name={name}
          id={name}
          className="sr-only peer"
          readOnly
        />
        <div
          className={`w-11 h-6 bg-gray-300 ${
            checkedState
              ? "peer-checked:after:translate-x-full peer-checked:bg-indigo-600"
              : ""
          } peer-focus:outline-none rounded-full peer peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
          onClick={handleToggle}
        />
      </label>
    </div>
  );
};

export default ToggleButton;
