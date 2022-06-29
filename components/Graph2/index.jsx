import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import TemporaryGraph from "../Graph/index"
import MultiSelect from "./MultiSelect";
import SelectedLines from "./SelectedLines";
import { hiddableLines,defaultVisibleLines, filterLines } from "../../utils/index";
import ScenarioTooltip from "./ScenarioTooltip"
import { useState, useRef } from "react";

const Graph2 = ({title, description}) => {
  const temporaryRef = useRef(null);

  let options = hiddableLines();
  let scenarioTooltipLines = filterLines(["proy", "Reportados"]);
  let [selected, setSelected] = useState(defaultVisibleLines());
  let shouldShowDescription = () => {
    if (description) 
      return (
        <div className="text-base px-4 pb-3 whitespace-pre-line">{description}</div>
      )
  }

  return (
    <div className="rounded overflow-hidden shadow-lg bg-white mb-6 p-6 flex flex-col">
      <div className="border-b-2 pb-2 text-2xl mb-4">{title}</div>
      {shouldShowDescription()}
      <div className="flex items-center justify-center text-sm">
        <span className="pr-2">Scenario</span>
        <ScenarioTooltip item={scenarioTooltipLines} top={false}>
          <FontAwesomeIcon icon={faInfoCircle} />
        </ScenarioTooltip>
        <MultiSelect options={options} selected={selected} handleSelected={setSelected}/>
      </div>
      <div className="w-full h-[534px]" ref={temporaryRef}>
        <TemporaryGraph parentRef={temporaryRef} selected={selected}/>
      </div>
      <div className="flex items-center justify-center text-sm">
        <SelectedLines selected={selected}/>
      </div>
    </div>
  );
};
  
export default Graph2;
  