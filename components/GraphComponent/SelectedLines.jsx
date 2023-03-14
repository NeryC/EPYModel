import { dinamicColorStyle } from "../../utils/index";
import { useSelector, useDispatch } from "react-redux";
import ScenarioTooltip from "./Tooltip/ScenarioTooltip";
import {
  selectDotField,
  selectDropdownInfo,
  setSelectedLine,
} from "../../store/reducers/graphInfoSlice";
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
  // ? dinamicColorStyle(type, "borderColor", fieldName)
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
          className={`flex justify-center items-center gap-2 border rounded-3xl py-1 px-3 ${isSelected(
            item
          )}`}
          onClick={() => selectOption(item)}
        >
          <div className="flex flex-auto">
            <div
              className={chooseClass(item)}
              style={chooseLineColor(item.name)}
            />
          </div>
          <div className="text-sm font-bold">{t(item.label)}</div>
        </button>
      </ScenarioTooltip>
    ));
  };

  return (
    <div className="flex text-sm gap-5 py-2 justify-center">
      {renderSelected()}
    </div>
  );
};

export default SelectedLines;
