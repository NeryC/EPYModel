import React, { useState } from "react";
import { default_filters } from "./constants.js";
import { requestFilteredData } from "./ultis.js";
import { useDispatch } from "react-redux";
import { setSimulation } from "../../../store/reducers/graphInfoSlice.js";
import { useTranslation } from "next-i18next";
import LambdaItoHInput from "./LambdaItoHInput";
import RtInput from "./RtInput";
import UCIInput from "./UCIInput";
import VFilteredInput from "./VFilteredInput";

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

  return (
    <div className="flex justify-end grow text-base">
      <div className="rounded-lg shadow-lg bg-white p-3 md:p-6 flex flex-col gap-3 border border-gray-theme text-black mb-4 grow md:min-w-[500px] md:max-w-[650px]">
        <span className="border-b border-gray-theme pb-1 w-full font-bold">
          {t("chart-setting")}
        </span>
        <div className="flex flex-col md:flex-row gap-3 md:gap-1 items-center">
          <label className="md:text-sm font-bold">{t("rt-list")}</label>
          <div className="grid grid-cols-2 gap-4 md:flex justify-between w-full">
            {RtList.map((rt, index) => (
              <RtInput
                key={index}
                value={rt}
                index={index}
                handleRTChange={handleRTChange}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-4 md:gap-16">
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
        <button
          className="items-center px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-md"
          onClick={handleSubmit}
        >
          {t(`simulate`)}
        </button>
      </div>
    </div>
  );
}

export default SimulationFilter;
