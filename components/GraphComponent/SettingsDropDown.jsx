import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders, faCameraAlt } from "@fortawesome/free-solid-svg-icons";
import { useState, useContext } from "react";
import { Context } from "../../context/globalStore";
import MultiRangeSlider from "./MultiRangeSlider";
import Tooltip from "./Tooltip";
import ToogleButton from "./ToogleButton";


const SettingsDropDown = ({settings}) => {

  let [dropdown, setDropdown] = useState(true);
  const { state, dispatch } = useContext(Context);

  const handleChangeChecks = (checkName) => {
    dispatch({
      type: "SET_REPORTED_CHECKS",
      payload: {
        [checkName]: !settings[checkName],
      },
    });
  };

  const resetSettings = () => {
    dispatch({
      type: "RESET_REPORTED_SETTINGS",
    });
  };

  const handleChangeRange = (min, max) => {
    if(settings.range.start !== min || settings.range.finish !== max)
      dispatch({
        type: "SET_REPORTED_RANGE",
        payload: {
          start: min,
          finish: max
        },
      });
  };

  let isExpanded = () =>{
    return dropdown ? 'block' : 'hidden'
  }

  let openSettings = () => {
    setDropdown(!dropdown);
  }
  
  if(settings) return (
    <div className="flex flex-col items-end top-10 right-10 absolute">

      <div onClick={()=>openSettings()} className="p-3 shadow-2xl mb-2 rounded-full shadow-gray-900 inline-flex text-sm border text-gray-600 
        hover:bg-gray-600 hover:text-white bg-white">
        <FontAwesomeIcon icon={faSliders} />
      </div>
        
        
      <div className={`${isExpanded()} shadow  border bg-white z-40 rounded flex flex-col p-2 items-center text-sm`}>
          
        <div className="border-b mb-3 w-full flex justify-between font-bold text-base">
          Chart Settings
          <Tooltip text={"Download Graph"}>
            <button>
              <FontAwesomeIcon icon={faCameraAlt} />
            </button>
          </Tooltip>
        </div>

        <ToogleButton label="Smoothed data" name="smoothed" handleChange={handleChangeChecks} checkedState={settings.smoothed}/>

        <div className="flex justify-between mb-5">
          <span className="text-gray-900 mr-3 flex-none">Date range</span>
          <MultiRangeSlider
            min={0}
            max={state.reported.data.length-1}
            selectedMin={settings.range.start}
            selectedMax={settings.range.finish}
            data={state.reported.data}
            onChange={({ min, max }) => handleChangeRange(min,max)}
          />
        </div>

        <ToogleButton label="Uncertainty" name="uncertainty" handleChange={handleChangeChecks} checkedState={settings.uncertainty}/>

        <div className="border-b mb-3 w-full"/>

        <div className="flex justify-between w-full mb-2 text-sm">
          <button className="bg-transparent hover:bg-indigo-600 text-indigo-600 font-semibold hover:text-white px-2 border border-indigo-600 hover:border-transparent rounded">
            Apply to all
          </button>
          <button onClick={()=>resetSettings()} className="bg-transparent hover:bg-indigo-600 text-indigo-600 font-semibold hover:text-white px-2 border border-indigo-600 hover:border-transparent rounded">
            Reset
          </button>
        </div>
          
      </div>
    </div>
  );
};

export default SettingsDropDown;
