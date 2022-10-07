import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import MultiSelect from './MultiSelect';
import SelectedLines from './SelectedLines';
import ScenarioTooltip from './Tooltip/ScenarioTooltip';
import { graphDescriptions } from '../../utils/descriptions';
import { parseD3 } from '../../utils/constants';
import Graph from './Graph';
import { useSelector } from 'react-redux';
import { selectScenarios, selectRawData } from '../../store/reducers/graphInfoSlice';
import { useTranslation } from 'next-i18next';

const GraphComponent = ({ type }) => {
  const { t } = useTranslation('common');
  const scenarios = useSelector(selectScenarios(type));
  const rawData = useSelector(selectRawData(type));
  const data = JSON.parse(JSON.stringify(rawData));
  parseD3(data);

  let shouldShowSubtitle = () => {
    const subtitle = graphDescriptions[type]?.subtitle;
    if (subtitle)
      return (
        <div className="text-base px-4 pb-3 whitespace-pre-line">
          {t(`${type}-subtitle`)}
        </div>
      );
  };

  return (
    <div className="rounded overflow-hidden shadow-lg bg-white mb-6 p-6 flex flex-col">
      <div className="border-b-2 pb-2 text-2xl mb-4">{t(`${type}-title`)}</div>
      {shouldShowSubtitle()}
      <div className="flex items-center justify-center text-sm">
        <span className="pr-2">{t('scenario')}</span>
        <ScenarioTooltip item={scenarios} top={false} type={type}>
          <FontAwesomeIcon icon={faInfoCircle} />
        </ScenarioTooltip>
        <MultiSelect type={type} />
      </div>
      <Graph type={type} data={data} />
      <div className="flex items-center justify-center text-sm">
        <SelectedLines type={type} />
      </div>
    </div>
  );
};

export default GraphComponent;
