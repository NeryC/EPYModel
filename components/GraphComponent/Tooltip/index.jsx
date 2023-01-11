const Tooltip = ({ text, children, top = true }) => {
  return (
    <div className="relative flex flex-col items-center group">
      {children}
      <div
        className={`absolute ${
          top ? "bottom-2.5" : "top-8"
        } flex flex-col items-center hidden mb-6 group-hover:flex w-max`}
      >
        <span className="relative z-10 flex flex-col gap-2 p-2 text-xs leading-4 text-white whitespace-no-wrap bg-gray-600 shadow-lg rounded-md">
          {text}
        </span>
        <div
          className={`w-3 h-3 absolute rotate-45 ${
            top ? "-bottom-1.5" : "-top-1.5"
          } bg-gray-600`}
        />
      </div>
    </div>
  );
};

export default Tooltip;
