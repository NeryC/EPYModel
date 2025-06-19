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

const SelectedLines = ({ type }) => {
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

  const renderSelected = () =>
    options.map((item) => (
      <ScenarioTooltip item={[item]} key={item.label} type={type}>
        <button
          key={item.label}
          className={`flex items-center gap-2 border rounded-3xl py-1 px-3 w-full lg:w-auto ${isSelected(
            item
          )}`}
          onClick={() => selectOption(item)}
        >
          <div
            className={chooseClass(item)}
            style={chooseLineColor(item.name)}
          />
          <div className="text-sm font-bold">{t(item.label)}</div>
        </button>
      </ScenarioTooltip>
    ));

  return (
    <div className="grid lg:flex grid-cols-4 gap-2 lg:gap-4 text-sm pt-3 lg:pt-1 justify-center">
      {renderSelected()}
      <button
        className="flex items-center gap-2 border border-gray-300 rounded-3xl py-1 px-3 w-full lg:w-auto"
        onClick={handleReset}
      >
        <div className="text-sm font-bold ">{t("reset")}</div>
      </button>
    </div>
  );
};

export default SelectedLines;
