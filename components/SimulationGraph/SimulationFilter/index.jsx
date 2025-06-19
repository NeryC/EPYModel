import React, { useState } from "react";
import { default_filters } from "./constants.js";
import { requestFilteredData } from "./ultis.js";
import { useDispatch } from "react-redux";
import { setSimulation } from "../../../store/reducers/graphInfoSlice";
import { useTranslation } from "next-i18next";
import LambdaItoHInput from "./LambdaItoHInput";
import RtInput from "./RtInput";
import UCIInput from "./UCIInput";
import VFilteredInput from "./VFilteredInput";
import Tooltip from "../../utils/Tooltip.tsx";

function SimulationFilter() {
  const dispatch = useDispatch();
  const { t } = useTranslation("common");

  // State variables
  const [RtList, setRtList] = useState(default_filters.Rt);
  const [UCI, setUCI] = useState(default_filters.UCI_threshold);
  const [vFiltered, setVFiltered] = useState(default_filters.V_filtered);
  const [lambdaItoH, setLambdaItoH] = useState(default_filters.lambda_I_to_H);

  // Event handlers
  const handleRTChange = (index, action) => {
    const newListadoRT = [...RtList];
    const matrix = {
      decrement: -0.1,
      increment: 0.1,
    };
    const newValue = parseFloat(
      (newListadoRT[index] + matrix[action]).toFixed(1)
    );
    if (newValue >= 0 && newValue <= 2.0) {
      newListadoRT[index] = newValue;
      setRtList(newListadoRT);
    }
  };

  const handleAddRt = () => {
    setRtList([...RtList, 1.0]); // Default new Rt value
  };

  const handleRemoveRt = (index) => {
    if (RtList.length > 1) {
      // Keep at least one Rt value
      const newListadoRT = RtList.filter((_, i) => i !== index);
      setRtList(newListadoRT);
    }
  };

  const handleUCIChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) value = 0;
    if (value >= 0 && value <= 5000) {
      setUCI(Number(value).toString());
    }
  };

  const handleVFilteredChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) value = 0;
    if (value >= 0 && value <= 5000) {
      setVFiltered(Number(value).toString());
    }
  };

  const handleLambdaItoHChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 1) {
      setLambdaItoH(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formValues = {
      Rt: JSON.stringify(RtList),
      UCI_threshold: UCI,
      V_filtered: vFiltered,
      lambda_I_to_H: lambdaItoH,
    };
    try {
      const response = await requestFilteredData(formValues);
      const chartData = JSON.parse(response.data);
      dispatch(
        setSimulation({
          cumulative: chartData.cumulative,
          cumulative_deaths: chartData.cumulative_deaths,
          exposed: chartData.exposed,
          hospitalized: chartData.hospitalized,
          immune: chartData.immune,
          infectious: chartData.infectious,
          susceptible: chartData.susceptible,
          uci: chartData.uci,
        })
      );
    } catch (error) {
      console.error(error);
    }

    // Aquí puedes agregar la lógica para enviar los datos del SimulationFilter
  };

  const handleReset = () => {
    setRtList(default_filters.Rt);
    setUCI(default_filters.UCI_threshold);
    setVFiltered(default_filters.V_filtered);
    setLambdaItoH(default_filters.lambda_I_to_H);
  };

  return (
    <div className="flex justify-end grow text-base">
      <div className="rounded-lg shadow-lg bg-white p-3 md:p-6 flex flex-col gap-3 border border-gray-theme text-black mb-4 grow md:min-w-[500px] md:max-w-[650px]">
        <span className="border-b border-gray-theme pb-1 w-full font-bold">
          {t("chart-setting")}
        </span>
        <div className="flex flex-col md:flex-row gap-3 md:gap-1 items-center">
          <label className="md:text-sm font-bold max-w-[85px] flex items-center pr-2">
            {t("rt-list")}
            <Tooltip text={t("rt-list-description")} />
          </label>
          <div className="flex flex-wrap gap-4 w-full">
            {RtList.map((rt, index) => (
              <div key={index} className="flex items-center">
                <RtInput
                  value={rt}
                  index={index}
                  handleRTChange={handleRTChange}
                />
              </div>
            ))}
            <div className="flex flex-row gap-2">
              {RtList.length > 1 && (
                <button
                  onClick={() => handleRemoveRt(RtList.length - 1)}
                  className="text-white bg-red-500 hover:bg-red-600 text-xl rounded-md p-2"
                  aria-label="Remove Rt value"
                >
                  ×
                </button>
              )}
              <button
                onClick={handleAddRt}
                className="text-white bg-indigo-500 hover:bg-indigo-600 font-bold text-xl rounded-md p-2"
                aria-label="Add Rt value"
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <UCIInput UCI={UCI} handleUCIChange={handleUCIChange} />
          <VFilteredInput
            vFiltered={vFiltered}
            handleVFilteredChange={handleVFilteredChange}
          />
        </div>
        <LambdaItoHInput
          lambdaItoH={lambdaItoH}
          handleLambdaItoHChange={handleLambdaItoHChange}
        />
        <div className="flex gap-2">
          <button
            className="items-center px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-md"
            onClick={handleSubmit}
          >
            {t(`simulate`)}
          </button>
          <button
            className="items-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-md"
            onClick={handleReset}
          >
            {t(`reset`)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SimulationFilter;
