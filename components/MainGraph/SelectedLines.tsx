import { dinamicColorStyle } from "../../utils/index";
import { useSelector, useDispatch } from "react-redux";
import ScenarioTooltip from "./Tooltips/ScenarioTooltip";
import {
  selectDotField,
  selectDropdownInfo,
  setSelectedLine,
  resetSelectedLines,
} from "../../store/reducers/graphInfoSlice";
import { useTranslation } from "next-i18next";

interface SelectedLinesProps {
  type: "reported" | "hospitalized" | "ICU" | "deceases";
}

const SelectedLines = ({ type }: SelectedLinesProps) => {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const [options, selected] = useSelector(selectDropdownInfo(type));
  const dotField = useSelector(selectDotField(type));

  const isSelected = (item) =>
    selected.some((element) => element.label === item.label)
      ? "border-2 border-blue-600 bg-light-background"
      : "border-gray-theme";

  const chooseClass = (item) =>
    item.style === "dot" ? "circle mx-auto" : "h-1.5 w-6 rounded-xl";

  const chooseLineColor = (fieldName) =>
    fieldName !== dotField
      ? dinamicColorStyle(type, "backgroundColor", fieldName)
      : {};

  const selectOption = (selectedLine) => {
    dispatch(setSelectedLine({ type, selectedLine }));
  };

  const handleReset = () => {
    dispatch(resetSelectedLines({ type }));
  };

  const isItemSelected = (item) =>
    selected.some((element) => element.label === item.label);

  const renderSelected = () =>
    options.map((item) => {
      const active = isItemSelected(item);
      return (
        <ScenarioTooltip item={[item]} key={item.label} type={type} top={false}>
          <button
            key={item.label}
            className={`flex items-center gap-1.5 border rounded-3xl min-h-[40px] py-1 px-2.5 ${isSelected(item)}`}
            onClick={() => selectOption(item)}
            aria-pressed={active}
          >
            <div
              className={chooseClass(item)}
              style={chooseLineColor(item.name)}
            />
            <div className="text-xs md:text-sm font-bold whitespace-nowrap">{t(item.label)}</div>
            {active && (
              <span className="sr-only">(activo)</span>
            )}
          </button>
        </ScenarioTooltip>
      );
    });

  return (
    <div className="flex flex-wrap gap-1.5 md:gap-2 text-sm pt-2 md:pt-1">
      {renderSelected()}
      <button
        type="button"
        className="flex items-center gap-1.5 border border-gray-300 rounded-3xl min-h-[40px] py-1 px-2.5"
        onClick={handleReset}
        aria-label={t("reset-lines-selection")}
      >
        <div className="text-xs md:text-sm font-bold whitespace-nowrap">{t("reset")}</div>
      </button>
    </div>
  );
};

export default SelectedLines;
