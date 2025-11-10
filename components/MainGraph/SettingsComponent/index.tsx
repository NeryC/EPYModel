import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import MultiRangeSlider from "./MultiRangeSlider";
import { useSelector, useDispatch } from "react-redux";
import {
  selectSettings,
  selectIsSmooth,
  selectUncertainty,
  selectDotsOption,
  setChecks,
  resetChecks,
  setRange,
} from "../../../store/reducers/graphInfoSlice";
import { useTranslation } from "next-i18next";
import Tooltip from "../../utils/Tooltip";
import ToggleButton from "./ToggleButton";

interface SettingsComponentProps {
  type: "reported" | "hospitalized" | "ICU" | "deceases";
  data: any[];
}

const SettingsComponent = ({ type, data }: SettingsComponentProps) => {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings(type));
  const isSmooth = useSelector(selectIsSmooth(type));
  const uncertainty = useSelector(selectUncertainty(type));
  const dotsOption = useSelector(selectDotsOption(type));
  const [dropdown, setDropdown] = useState(false);
  const timeoutControllerRef = useRef<NodeJS.Timeout | null>(null);

  // Local state for slider values (for immediate visual feedback)
  const [localRange, setLocalRange] = useState({
    start: settings.range.start,
    finish: settings.range.finish,
  });

  // Ref to track if we're updating Redux (to avoid sync loop)
  const isUpdatingReduxRef = useRef(false);

  // Sync local state with Redux when Redux changes externally
  // (but only if we're not currently updating Redux ourselves)
  useEffect(() => {
    if (!isUpdatingReduxRef.current) {
      setLocalRange({
        start: settings.range.start,
        finish: settings.range.finish,
      });
    }
  }, [settings.range.start, settings.range.finish]);

  // Memoize translations to avoid re-computing on every render
  const translations = useMemo(
    () => ({
      chartSetting: t("chart-setting"),
      smoothedData: t("smoothed-data"),
      smoothedDataDescription: t("smoothed-data-description"),
      dateRange: t("date-range"),
      dateRangeDescription: t("date-range-description"),
      uncertainty: t("uncertainty"),
      uncertaintyDescription: t("uncertainty-description"),
      showDots: t("show-dots"),
      showDotsDescription: t("show-dots-description"),
      reset: t("reset"),
    }),
    [t]
  );

  const handleChangeChecks = useCallback(
    (checkName: string) => {
      dispatch(
        setChecks({
          type,
          checkName: checkName as "isSmooth" | "uncertainty" | "dotsOption",
        })
      );
    },
    [dispatch, type]
  );

  const resetSettings = useCallback(() => {
    dispatch(
      resetChecks({
        type,
      })
    );
  }, [dispatch, type]);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const latestRangeRef = useRef<{ min: number; max: number } | null>(null);

  // Handler for slider changes - updates local state immediately, Redux with debounce
  const handleChangeRange = useCallback(
    ({ min, max }: { min: number; max: number }) => {
      // Update local state immediately for visual feedback
      setLocalRange({ start: min, finish: max });
      
      // Store latest values
      latestRangeRef.current = { min, max };

      // Clear existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Update Redux with debounce (this updates the graph)
      debounceTimeoutRef.current = setTimeout(() => {
        if (latestRangeRef.current) {
          const { min: finalMin, max: finalMax } = latestRangeRef.current;
          isUpdatingReduxRef.current = true;
          
          dispatch(
            setRange({
              type,
              start: finalMin,
              finish: finalMax,
            })
          );
          
          // Reset flag after a short delay to allow Redux to update
          setTimeout(() => {
            isUpdatingReduxRef.current = false;
          }, 50);
        }
      }, 300); // 300ms delay - adjust as needed
    },
    [dispatch, type]
  );

  const toggleDropdown = useCallback(() => {
    setDropdown((prev) => !prev);
  }, []);

  // Memoize expanded class instead of function call
  const expandedClass = useMemo(
    () => (dropdown ? "block" : "hidden"),
    [dropdown]
  );

  const handleMouseLeave = useCallback(() => {
    timeoutControllerRef.current = setTimeout(() => {
      setDropdown(false);
    }, 1000);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (timeoutControllerRef.current) {
      clearTimeout(timeoutControllerRef.current);
      timeoutControllerRef.current = null;
    }
  }, []);

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutControllerRef.current) {
        clearTimeout(timeoutControllerRef.current);
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

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
        onClick={toggleDropdown}
        className="p-3 shadow-2xl mb-2 rounded-full shadow-gray-900 inline-flex text-sm border text-gray-600 hover:bg-gray-600 hover:text-white bg-white"
      >
        <FontAwesomeIcon icon={faSliders} />
      </div>

      <div
        className={`${expandedClass} shadow border bg-white z-40 rounded flex flex-col p-2 items-center text-sm w-72`}
      >
        <div className="border-b mb-3 pb-1 w-full flex justify-between font-bold text-base">
          {translations.chartSetting}
        </div>

        <ToggleButton
          label={translations.smoothedData}
          tooltipText={translations.smoothedDataDescription}
          name="isSmooth"
          handleChange={handleChangeChecks}
          checkedState={isSmooth}
        />

        <div className="flex flex-col mb-11 w-full">
          <div className="flex items-center gap-1 mb-2">
            <span className="mr-3 flex-none">{translations.dateRange}</span>
            <Tooltip text={translations.dateRangeDescription} />
          </div>
          <MultiRangeSlider
            min={0}
            max={settings.dataLength}
            selectedMin={localRange.start}
            selectedMax={localRange.finish}
            data={data}
            onChange={handleChangeRange}
          />
        </div>

        <ToggleButton
          label={translations.uncertainty}
          tooltipText={translations.uncertaintyDescription}
          name="uncertainty"
          handleChange={handleChangeChecks}
          checkedState={uncertainty}
        />

        <ToggleButton
          label={translations.showDots}
          tooltipText={translations.showDotsDescription}
          name="dotsOption"
          handleChange={handleChangeChecks}
          checkedState={dotsOption}
        />

        <div className="border-b mb-3 w-full" />

        <div className="flex flex-row-reverse w-full mb-2 text-sm">
          <button
            onClick={resetSettings}
            className="bg-transparent hover:bg-indigo-600 text-indigo-600 font-semibold hover:text-white px-2 border border-indigo-600 hover:border-transparent rounded"
          >
            {translations.reset}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsComponent;
