import { hiddableLines, dinamicColorStyle } from "../../utils/index";
import { concat } from "lodash";

const SelectedLines = ({selected}) => {

  const grahpsElements = concat(hiddableLines(false), selected)

  const chooseClass = (item) => {
    if (item.type == "dot") {
      return 'circle mx-auto'
    } else {
      return `border-t-4 w-8 ${item.type == "dashed" ? "border-dashed" : ""}`
    }
  }

  const chooseLineColor = (fieldName) => (fieldName != "Reportados" ? dinamicColorStyle("borderColor", fieldName): {});
    
  let renderSelected = () => {
    return grahpsElements.map((item)=>(
      <div key={item.label} className={`flex justify-center items-center gap-2 rounded-full`}>
        <div className="flex flex-auto">
          <div className={chooseClass(item)} style={chooseLineColor(item.name)}/>
        </div>
        <div className="text-xs font-bold">
          {item.label}
        </div>
      </div>
    ))
  }

  return (
    <div className="rounded pt-6">
      <div className="flex flex-wrap justify-center min-w-[100px] gap-5">
        {renderSelected()}
      </div>
    </div>
  );
};

export default SelectedLines;
