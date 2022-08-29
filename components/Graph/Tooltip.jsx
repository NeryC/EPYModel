import { lineColors } from '../../utils/constants';
import { hiddableLines, dinamicColorStyle } from '../../utils/index';
import { concat } from 'lodash';

export default function Tooltip({ data, tooltipRef, activeLines }) {
  if (Object.keys(data).length === 0) return <></>;

  const showedLines = concat(hiddableLines(false), activeLines);

  const shouldShow = (field) => (data[field] != null ? '' : 'hidden');
  const chooseClass = (fieldName) =>
    fieldName == 'Reportados' ? 'circle mx-auto' : 'border_line w-3.5';
  const chooseLineColor = (fieldName) => dinamicColorStyle('borderColor', fieldName);

  return (
    <div
      className="border-2 w-fit rounded bg-white shadow-lg p-1 text-xsm"
      ref={tooltipRef}
    >
      <div className="font-bold">{data.fecha}</div>
      <table className="table-fixed">
        <tbody className="text-gray-700">
          {showedLines.map((line, index) => {
            return (
              <tr key={index} className={shouldShow(line.name)}>
                <td className="pr-1.5">
                  <div
                    className={chooseClass(line.name)}
                    style={chooseLineColor(line.name)}
                  />
                </td>
                <td className="pr-1.5">{`${line.label}: `}</td>
                <td className="font-bold">{Math.round(data[line.name])}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
