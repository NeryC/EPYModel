import { ReactNode } from "react";

interface TooltipProps {
  text: string;
  children?: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  showDefaultIcon?: boolean;
  iconSize?: string;
}

function Tooltip({
  text,
  children,
  position = "top",
  className = "",
  showDefaultIcon = true,
  iconSize = "h-4 w-4",
}: TooltipProps) {
  const getPositionClasses = () => {
    switch (position) {
      case "bottom":
        return "top-full left-1/2 transform -translate-x-1/2 mt-2";
      case "left":
        return "right-full top-1/2 transform -translate-y-1/2 mr-2";
      case "right":
        return "left-full top-1/2 transform -translate-y-1/2 ml-2";
      case "top":
      default:
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
    }
  };

  const DefaultIcon = () => (
    <div className="relative inline-block">
      <div className="group">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`${iconSize} text-gray-500 cursor-help`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div
          className={`absolute ${getPositionClasses()} px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 max-w-[300px] w-max break-words whitespace-normal pointer-events-none`}
        >
          {text}
        </div>
      </div>
    </div>
  );

  return (
    <div className={className}>
      {children || (showDefaultIcon && <DefaultIcon />)}
    </div>
  );
}

export default Tooltip;
