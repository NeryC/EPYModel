import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import MultiSelect from "./MultiSelect";
import SelectedLines from "./SelectedLines";
import ScenarioTooltip from "./Tooltip/ScenarioTooltip"
import { graphDescription } from "../../utils";
import { parseD3, sortD3 } from "../../utils/constants";
import Graph from "./Graph";
import { useSelector } from "react-redux";
import { selectScenarios,selectRawData } from "../../store/reducers/graphInfoSlice";

const GraphComponent = ({type}) => {

  const scenarios = useSelector(selectScenarios(type));
  const rawData = useSelector(selectRawData(type))
  const data = JSON.parse(JSON.stringify(rawData))
  sortD3(data);
  parseD3(data);

  let shouldShowDescription = () => {
    const description = graphDescription[type].description;
    if (description) 
      return (
        <div className="text-base px-4 pb-3 whitespace-pre-line">{description}</div>
      )
  }

  return (
    <div className="rounded overflow-hidden shadow-lg bg-white mb-6 p-6 flex flex-col">
      <div className="border-b-2 pb-2 text-2xl mb-4">{graphDescription[type].title}</div>
      {shouldShowDescription()}
      <div className="flex items-center justify-center text-sm">
        <span className="pr-2">Scenario</span>
        <ScenarioTooltip item={scenarios} top={false}>
          <FontAwesomeIcon icon={faInfoCircle} />
        </ScenarioTooltip>
        <MultiSelect type={type}/>
      </div>
      <Graph type={type} data={data} />
      <div className="flex items-center justify-center text-sm">
        <SelectedLines type={type}/>
      </div>
    </div>
  );
};
  
export default GraphComponent;
  