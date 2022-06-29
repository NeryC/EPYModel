import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import ScenarioTooltip from "./ScenarioTooltip"
import { dinamicColorStyle } from "../../utils/index";

const MultiSelect = ({options, selected, handleSelected}) => {

  let [dropdown, setDropdown] = useState(false);

  let isSelected = (item) =>{
    return selected.some((element)=>element.label===item.label) ? 
      `border-l-2` : ''
    
  }

  let isExpanded = () =>{
    return dropdown ? 'absolute' : 'hidden'
  }

  let renderSelected = () => {
    return selected.map((item)=>(
      <ScenarioTooltip item={[item]} key={item.label}>
        <div className={`flex justify-center items-center py-1 px-2 rounded-full text-white`} style={dinamicColorStyle("backgroundColor", item.name)}>
          <div className="text-xs font-bold cursor-default">
            {item.label}
          </div>
          <div className="flex flex-auto" onClick={()=>selectOption(item)}>
            <FontAwesomeIcon
              className="cursor-pointer hover:text-teal-400 rounded-md w-3 h-3 ml-1"
              icon={faXmark}
            />
          </div>
        </div>
      </ScenarioTooltip>
    ))
  }

  let selectOption = (item) => {
    if(selected.some((element)=>element.label===item.label)){
      handleSelected([...selected.filter(e => e.label !== item.label)])
    } else {
      selected.push(item);
      handleSelected([...selected])
    }
  }
  
  let renderOptions = () => {
    return options.map((item)=>(
      <div key={item.label} className="cursor-pointer w-full border-gray-100 border-b hover:bg-teal-100" onClick={()=>selectOption(item)}>
        <div className={`flex w-full items-center p-2 pl-2 relative ${isSelected(item)}`} style={dinamicColorStyle("borderColor", item.name)}>
          <div className="w-full items-center flex">
            <div className="mx-2 leading-6  ">{item.label}</div>
          </div>
        </div>
      </div>
    ))
  }


  return (
    <div className="px-4">
      <div className="flex flex-col items-center relative">
        
        <div className="my-2 flex border border-gray-200 bg-white rounded">
          <div className="flex flex-wrap gap-2 ml-1 py-1 min-w-[100px]">
            {renderSelected()}
          </div>
          <div className="text-gray-300 w-8 py-1 flex items-center">
            <button className="cursor-pointer w-6 h-6 text-gray-600 outline-none focus:outline-none" onClick={()=>setDropdown(!dropdown)}>
              <FontAwesomeIcon
                className="cursor-pointer hover:text-teal-400"
                icon={dropdown ? faChevronUp : faChevronDown}
              />
            </button>
          </div>
        </div>
        

        <div className={`${isExpanded()} shadow top-full bg-white z-40 w-full lef-0 rounded overflow-y-auto`}>
          <div className="flex flex-col w-full">
            {renderOptions()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
