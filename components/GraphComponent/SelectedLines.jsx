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
    if (item.type == "dot") {
      return "circle mx-auto";
    } else {
      return `border-t-4 w-8 ${item.type == "dashed" ? "border-dashed" : ""}`;
    }
  };

  const chooseLineColor = (fieldName) =>
    fieldName != dotField
      ? dinamicColorStyle(type, "borderColor", fieldName)
      : {};

  let renderSelected = () => {
    return showedElements.map((item) => (
      <div
        key={item.label}
        className={`flex justify-center items-center gap-2 rounded-full`}
      >
        <div className="flex flex-auto">
          <div
            className={chooseClass(item)}
            style={chooseLineColor(item.name)}
          />
        </div>
        <div className="text-xs font-bold">{t(item.label)}</div>
      </div>
    ));
  };

  return (
    <div className="rounded">
      <div className="flex flex-wrap justify-center min-w-[100px] gap-5">
        {renderSelected()}
      </div>
    </div>
  );
};

export default SelectedLines;
