import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import TemporaryGraph from "../Graph/index"
import MultiSelect from "./MultiSelect";
import SelectedLines from "./SelectedLines";
import ScenarioTooltip from "./ScenarioTooltip"
import { useRef } from "react";
import SettingsDropDown from "./SettingsDropDown";

const Graph2 = ({title, description, graphInfo}) => {
  const temporaryRef = useRef(null);
  const { data, settings, elements, type } = graphInfo;
  const { scenario, options, selectedLines } = elements;

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
        <ScenarioTooltip item={scenario} top={false}>
          <FontAwesomeIcon icon={faInfoCircle} />
        </ScenarioTooltip>
        <MultiSelect options={options} selected={selectedLines} type={type}/>
      </div>
      <div className="w-full h-[534px] relative" ref={temporaryRef}>
        {data && <TemporaryGraph parentRef={temporaryRef} rawData={graphInfo}/>}
        {data && <SettingsDropDown settings={settings} />}
      </div>
      <div className="flex items-center justify-center text-sm">
        <SelectedLines selected={selectedLines}/>
      </div>
    </div>
  );
};
  
export default Graph2;
  