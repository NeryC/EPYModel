// legacy
const Tooltip = ({ text, children, top = true }) => {
  return (
    <div className="relative flex flex-col items-center group">
      {children}
      <div
        className={`absolute ${
          top ? "bottom-2.5" : "top-8"
        } flex flex-col items-center mb-6 w-max opacity-0 transition-opacity group-hover:opacity-100 delay-500 duration-150 pointer-events-none`}
      >
        <span className="relative z-10 flex flex-col gap-2 p-2 text-xs leading-4 text-white whitespace-no-wrap bg-dark-blue shadow-lg rounded-md">
          {text}
        </span>
        <div
          className={`w-3 h-3 absolute rotate-45 ${
            top ? "-bottom-1.5" : "-top-1.5"
          } bg-dark-blue`}
        />
      </div>
    </div>
  );
};

export default Tooltip;
