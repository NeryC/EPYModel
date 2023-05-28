import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import { useState, useCallback } from "react";
import MultiRangeSlider from "./MultiRangeSlider";
import ToggleButton from "./ToggleButton";
import { useSelector, useDispatch } from "react-redux";
import {
  selectSettings,
  setChecks,
  resetChecks,
  setRange,
} from "../../../store/reducers/graphInfoSlice";
import { useTranslation } from "next-i18next";

const SettingsComponent = ({ type, data }) => {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings(type));
  const [dropdown, setDropdown] = useState(false);
  let timeoutController = null;

  const handleChangeChecks = (checkName) => {
    dispatch(
      setChecks({
        type,
        checkName,
      })
    );
  };

  const resetSettings = () => {
    dispatch(
      resetChecks({
        type,
      })
    );
  };

  const handleChangeRange = (min, max) => {
    if (settings.range.start !== min || settings.range.finish !== max) {
      dispatch(
        setRange({
          type,
          start: min,
          finish: max,
        })
      );
    }
  };

  const isExpanded = () => {
    return dropdown ? "block" : "hidden";
  };

  const handleMouseLeave = () => {
    timeoutController = setTimeout(() => {
      setDropdown(false);
    }, 1000);
  };

  const handleMouseEnter = () => {
    clearTimeout(timeoutController);
  };

  if (!settings) {
    return null;
  }

  return (
    <div
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className="flex flex-col items-end top-6 right-7 md:top-10 md:right-14 absolute"
    >
      <div
        onClick={() => setDropdown(!dropdown)}
        className="p-3 shadow-2xl mb-2 rounded-full shadow-gray-900 inline-flex text-sm border text-gray-600 hover:bg-gray-600 hover:text-white bg-white"
      >
        <FontAwesomeIcon icon={faSliders} />
      </div>

      <div
        className={`${isExpanded()} shadow border bg-white z-40 rounded flex flex-col p-2 items-center text-sm`}
      >
        <div className="border-b mb-3 pb-1 w-full flex justify-between font-bold text-base">
          {t("chart-setting")}
        </div>

        <ToggleButton
          label={t("smoothed-data")}
          name="isSmooth"
          handleChange={() => handleChangeChecks("isSmooth")}
          checkedState={settings.isSmooth}
        />

        <div className="flex justify-between mb-8">
          <span className="mr-3 flex-none">{t("date-range")}</span>
          <MultiRangeSlider
            min={0}
            max={settings.dataLength}
            selectedMin={settings.range.start}
            selectedMax={settings.range.finish}
            data={data}
            onChange={({ min, max }) => handleChangeRange(min, max)}
          />
        </div>

        <ToggleButton
          label={t("uncertainty")}
          name="uncertainty"
          handleChange={() => handleChangeChecks("uncertainty")}
          checkedState={settings.uncertainty}
        />

        <ToggleButton
          label={t("show-dots")}
          name="dotsOption"
          handleChange={() => handleChangeChecks("dotsOption")}
          checkedState={settings.dotsOption}
        />

        <div className="border-b mb-3 w-full" />

        <div className="flex flex-row-reverse w-full mb-2 text-sm">
          <button
            onClick={resetSettings}
            className="bg-transparent hover:bg-indigo-600 text-indigo-600 font-semibold hover:text-white px-2 border border-indigo-600 hover:border-transparent rounded"
          >
            {t("reset")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsComponent;
