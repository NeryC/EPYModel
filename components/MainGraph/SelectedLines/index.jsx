import { dinamicColorStyle } from "../../../utils/index";
import { useSelector, useDispatch } from "react-redux";
import ScenarioTooltip from "../Tooltips/ScenarioTooltip";
import {
  selectDotField,
  selectDropdownInfo,
  setSelectedLine,
} from "../../../store/reducers/graphInfoSlice";
import { useTranslation } from "next-i18next";

const SelectedLines = ({ type }) => {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const [options, selected] = useSelector(selectDropdownInfo(type));
  const dotField = useSelector(selectDotField(type));

  let isSelected = (item) => {
    return selected.some((element) => element.label === item.label)
      ? `border-2 border-blue-600 bg-light-background`
      : "border-gray-theme";
  };

  const chooseClass = (item) => {
    if (item.style == "dot") {
      return "circle mx-auto";
    } else {
      return `h-1.5 w-6 rounded-xl`;
    }
  };
  // en caso de usar border
  const chooseLineColor = (fieldName) =>
    fieldName != dotField
      ? dinamicColorStyle(type, "backgroundColor", fieldName)
      : {};

  let selectOption = (selectedLine) => {
    dispatch(setSelectedLine({ type, selectedLine }));
  };

  let renderSelected = () => {
    return options.map((item) => (
      <ScenarioTooltip item={[item]} key={item.label} type={type}>
        <button
          key={item.label}
          className={`flex items-center gap-2 border rounded-3xl py-1 px-3 w-full md:w-auto ${isSelected(
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
  };

  return (
    <div className="grid md:flex grid-cols-2 gap-2 md:gap-4 text-sm pt-3 md:pt-1 justify-center">
      {renderSelected()}
    </div>
  );
};

export default SelectedLines;
