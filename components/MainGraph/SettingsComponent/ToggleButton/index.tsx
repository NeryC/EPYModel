import { useCallback, useMemo, memo, MouseEvent, ChangeEvent } from "react";
import Tooltip from "../../../utils/Tooltip";

interface ToggleButtonProps {
  label: string;
  name: string;
  handleChange: (name: string) => void;
  checkedState: boolean;
  tooltipText: string;
}

const ToggleButton = memo(function ToggleButton({
  label,
  name,
  handleChange,
  checkedState,
  tooltipText,
}: ToggleButtonProps) {
  const handleToggle = useCallback((e?: MouseEvent | ChangeEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    handleChange(name);
  }, [handleChange, name]);

  const toggleClasses = useMemo(() => {
    const baseClasses =
      "w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all";
    const checkedClasses = checkedState
      ? "peer-checked:after:translate-x-full peer-checked:bg-indigo-600"
      : "";
    return `${baseClasses} ${checkedClasses}`;
  }, [checkedState]);

  return (
    <div className="flex justify-between w-full mb-2">
      <div className="flex items-center gap-1">
        <span className="mr-1">{label}</span>
        <Tooltip text={tooltipText} />
      </div>
      <label
        htmlFor={name}
        className="inline-flex relative items-center cursor-pointer"
        aria-label={label}
      >
        <input
          type="checkbox"
          checked={checkedState}
          name={name}
          id={name}
          className="sr-only peer"
          onChange={(e) => handleToggle(e)}
          aria-checked={checkedState}
          role="switch"
        />
        <div
          className={toggleClasses}
          onClick={(e) => handleToggle(e)}
          role="presentation"
        />
      </label>
    </div>
  );
});

export default ToggleButton;
