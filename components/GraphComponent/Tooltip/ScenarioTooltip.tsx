import { ReactNode } from 'react';
import { dinamicColorStyle } from '../../../utils/index';

const ScenarioTooltip = ({
  item,
  children,
  top = true
}: {
  item: Array<{
    label: string;
    description: string;
    name: string;
  }>;
  children: ReactNode;
  top: boolean;
}) => {
  return (
    <div className="relative flex flex-col items-center group">
      {children}
      <div
        className={`absolute ${
          top ? 'bottom-2.5' : 'top-8'
        } flex flex-col items-center hidden mb-6 group-hover:flex w-12`}
      >
        <span className="relative z-10 flex flex-col gap-2 w-52 p-2 text-xs leading-4 text-white whitespace-no-wrap bg-gray-600 shadow-lg rounded-md">
          {item.map((i) => (
            <div key={i.label}>
              <span
                className="font-bold px-1"
                style={dinamicColorStyle('backgroundColor', i.name)}
              >
                {i.label}
              </span>
              : {i.description}
            </div>
          ))}
        </span>
        <div
          className={`w-3 h-3 absolute rotate-45 ${
            top ? '-bottom-1.5' : '-top-1.5'
          } bg-gray-600`}
        />
      </div>
    </div>
  );
};

export default ScenarioTooltip;
