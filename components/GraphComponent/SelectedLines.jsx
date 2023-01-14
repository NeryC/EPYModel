import { dinamicColorStyle } from "../../utils/index";
import { useSelector } from "react-redux";
import {
  selectShowedElements,
  selectDotField,
} from "../../store/reducers/graphInfoSlice";
import { useTranslation } from "next-i18next";

const SelectedLines = ({ type }) => {
  const { t } = useTranslation("common");
  const showedElements = useSelector(selectShowedElements(type));
  const dotField = useSelector(selectDotField(type));

  const chooseClass = (item) => {
    if (item.style == "dot") {
      return "circle mx-auto";
    } else {
      // return `border-t-4 w-8 ${item.style == "dashed" ? "border-dashed" : ""}`;
      return `h-1.5 w-6 rounded-xl`;
    }
  };
  // en caso de usar border
  // ? dinamicColorStyle(type, "borderColor", fieldName)
  const chooseLineColor = (fieldName) =>
    fieldName != dotField
      ? dinamicColorStyle(type, "backgroundColor", fieldName)
      : {};

  let renderSelected = () => {
    return showedElements.map((item) => (
      <div
        key={item.label}
        className={`flex justify-center items-center gap-2`}
      >
        <div className="flex flex-auto">
          <div
            className={chooseClass(item)}
            style={chooseLineColor(item.name)}
          />
        </div>
        <div className="text-sm font-bold">{t(item.label)}</div>
      </div>
    ));
  };

  return <div className="flex text-sm gap-5 py-2">{renderSelected()}</div>;
};

export default SelectedLines;
