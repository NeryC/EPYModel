import React, { useRef, useState } from "react";
import { default_filters } from "./constants.js";
import { requestFilteredData } from "./ultis.js";
import { useDispatch } from "react-redux";
import { setSimulation } from "../../../store/reducers/graphInfoSlice.js";
import { useTranslation } from "next-i18next";

function SimulationFilter() {
  const dispatch = useDispatch();
  const { t } = useTranslation("common");
  const [RtList, setRtList] = useState(default_filters.Rt);
  const UCIRef = useRef(default_filters.UCI_threshold);
  const vFilteredRef = useRef(default_filters.V_filtered);
  const lambdaItoHRef = useRef(default_filters.lambda_I_to_H);

  const handleRTChange = (index, action) => {
    const newListadoRT = [...RtList];
    let newValue;
    const matrix = {
      decrement: -0.1,
      increment: +0.1,
    };
    const aux = parseFloat(newListadoRT[index] + matrix[action]).toFixed(1);
    newValue =
      aux >= 0 && aux <= 2.0 ? newListadoRT[index] + matrix[action] : -1;
    if (newValue >= 0) {
      newListadoRT[index] = parseFloat(parseFloat(newValue).toFixed(1));
      setRtList(newListadoRT);
    }
  };

  const handleUCIChange = (e) => {
    UCIRef.current = parseInt(e.target.value);
  };

  const handleVFilteredChange = (e) => {
    vFilteredRef.current = parseInt(e.target.value);
  };

  const handleLambdaItoHChange = (e) => {
    lambdaItoHRef.current = parseFloat(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formValues = {
      Rt: JSON.stringify(RtList),
      UCI_threshold: UCIRef.current,
      V_filtered: vFilteredRef.current,
      lambda_I_to_H: lambdaItoHRef.current,
    };
    requestFilteredData(formValues)
      .then((response) => {
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
      })
      .catch((error) => {
        console.error(error);
      });

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
              <div
                key={index}
                className="flex h-14 md:h-10 rounded-lg relative bg-transparent mx-auto"
              >
                <button
                  data-action="decrement"
                  className="disabled:hover:bg-gray-200 disabled:bg-gray-200 px-2 ssm:px-5 md:px-1 bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full rounded-l cursor-pointer"
                  disabled={RtList[index] == 0}
                  onClick={() => handleRTChange(index, "decrement")}
                >
                  <span className="m-auto text-2xl font-thin">−</span>
                </button>
                <input
                  type="number"
                  className="simulatorNumber md:w-6 text-center bg-gray-300 font-semibold text-md text-gray-700"
                  name="custom-input-number"
                  min="0"
                  max="2"
                  step="0.1"
                  readOnly={true}
                  value={RtList[index]}
                />
                <button
                  data-action="increment"
                  className="disabled:hover:bg-gray-200 disabled:bg-gray-200 px-2 ssm:px-5 md:px-1 bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full rounded-r"
                  disabled={RtList[index] == 2}
                  onClick={() => handleRTChange(index, "increment")}
                >
                  <span className="m-auto text-2xl font-thin">+</span>
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-4 md:gap-16">
          <div className="flex flex-col md:flex-row items-center w-auto mx-auto">
            <label
              htmlFor="uci_input"
              className="md:text-sm dark:text-white font-bold"
            >
              {t("uci")}
            </label>
            <input
              type="number"
              id="uci_input"
              min="0"
              max="5000"
              value={UCIRef.current}
              onChange={handleUCIChange}
              className="flex h-10 w-full justify-center rounded-xl border p-3 md:text-sm outline-none border-gray-200 mt-2 md:mt-0 md:ml-3"
            />
          </div>
          <div className="flex flex-col md:flex-row items-center w-auto mx-auto">
            <label
              htmlFor="filtered"
              className="md:text-sm dark:text-white font-bold"
            >
              v filtered:
            </label>
            <input
              type="number"
              id="filtered"
              min="0"
              max="5000"
              value={vFilteredRef.current}
              onChange={handleVFilteredChange}
              className="flex h-10 justify-center rounded-xl border p-3 md:text-sm outline-none border-gray-200 mt-2 md:mt-0 md:ml-3"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <label
            htmlFor="lambda"
            className="md:text-sm dark:text-white font-bold"
          >
            lambda_I_to_H:
          </label>
          <div className="h-8 w-full flex items-center mt-2 md:mt-0 md:ml-3">
            <input
              id="lambda"
              type="range"
              min="0"
              max="1"
              step="0.1"
              className="w-full h-4 appearance-none overflow-hidden rounded-lg bg-gray-400 styledRange"
              defaultValue={lambdaItoHRef.current}
              onChange={handleLambdaItoHChange}
            />
          </div>
        </div>
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
