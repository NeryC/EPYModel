import { ReactNode } from 'react';
import { dinamicColorStyle } from '../../../utils/index';
import { useTranslation } from 'next-i18next';

interface ScenarioItem {
  label: string;
  description: string;
  name: string;
}

interface ScenarioTooltipProps {
  item: ScenarioItem[];
  children: ReactNode;
  top: boolean;
  type: string;
}

const ScenarioTooltip = ({
  item,
  children,
  top = true,
  type
}: ScenarioTooltipProps) => {
  const { t } = useTranslation('common');

  const tooltipClassName = `absolute ${
    top ? 'bottom-11' : 'top-10'
  } flex flex-col items-center  w-12 opacity-0 transition-opacity group-hover:opacity-100 delay-500 duration-150 pointer-events-none`;

  const tooltipContentClassName = `relative z-10 flex flex-col gap-2 w-52 p-2 text-xs leading-4 text-white whitespace-no-wrap bg-dark-blue shadow-lg rounded-md`;

  const arrowClassName = `w-3 h-3 absolute rotate-45 ${
    top ? '-bottom-1.5' : '-top-2'
  } bg-dark-blue`;

  return (
    <div className="relative flex items-center group">
      {children}
      <div className={tooltipClassName}>
        <span className={tooltipContentClassName}>
          {item.map((i) => (
            <div key={i.label}>
              <span
                className="font-bold px-1"
                style={dinamicColorStyle(type, 'backgroundColor', i.name)}
              >
                {t(i.label)}
              </span>
              : {t(`${i.label}-description`)}
            </div>
          ))}
        </span>
        <div className={arrowClassName} />
      </div>
    </div>
  );
};

export default ScenarioTooltip;
