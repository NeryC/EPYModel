import {lineColors} from '../../utils/constants'
export default function Tooltip ({data,tooltipRef}) {
  if(Object.keys(data).length === 0) return <></>

  const shouldShow = (field) => (field == null ? 'hidden' : '');
  const chooseClass = (fieldName) => (fieldName == "Reportados" ? 'circle mx-auto' : 'border_line');
  const chooseLineColor = (fieldName) => (fieldName != "Reportados" ? {borderColor : lineColors[fieldName]} : {});
  const dataExample = [
    {name:'Simulated',field:'dailyR_sin_subRegistro'},
    {name:'Estimated',field:'dailyR'},
    {name:'Proyected',field:'proy'},
    {name:'Reported',field:'Reportados'},
    {name:'Percentil 75',field:'q75'},
    {name:'Percentil 25',field:'q25'},
    {name:'10% Increase',field:'X10p'},
    {name:'20% Reduction',field:'X20p'},
    {name:'Plateau',field:'eq'},
    {name:'Last Month',field:'X2w'},
  ]

  return (
    <div className="border-2 w-fit rounded bg-white shadow-lg p-1 text-xsm" ref={tooltipRef}>  
      <div className="font-bold">{data.fecha}</div>
      <table className="table-fixed">
        <tbody className="text-gray-700">
          {dataExample.map((field, index) => {
            return(
            <tr
              key={index}
              className={shouldShow(data[field.field])}
            >
              <td className='pr-1.5'>
                <div className={chooseClass(field.field)} style={chooseLineColor(field.field)}></div>
              </td>
              <td className='pr-1.5'>
                {`${field.name}: `}
              </td>
              <td className="font-bold">
                {Math.round(data[field.field])}
              </td>
            </tr>
          )})}
        </tbody>
      </table>
    </div>
  );
}

