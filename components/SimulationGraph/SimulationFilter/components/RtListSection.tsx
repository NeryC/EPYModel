import { useTranslation } from 'next-i18next';
import { RtListSectionProps } from '../types';
import { CSS_CLASSES } from '../constants';
import RtInput from '../RtInput/index';
import Tooltip from '../../../utils/Tooltip';
import { RtActionButtons } from './RtActionButtons';

/**
 * RtListSection Component
 * 
 * Section for managing RT list values with add/remove functionality
 */
export const RtListSection = ({ 
  rtList, 
  onRtChange, 
  onAddRt, 
  onRemoveRt 
}: RtListSectionProps) => {
  const { t } = useTranslation("common");
  
  return (
    <div className={CSS_CLASSES.SECTION_ROW}>
      <label className={CSS_CLASSES.LABEL}>
        {t("rt-list")}
        <Tooltip text={t("rt-list-description")} />
      </label>
      <div className={CSS_CLASSES.RT_CONTAINER}>
        {rtList.map((rt, index) => (
          <div key={index} className="flex items-center">
            <RtInput
              value={rt}
              index={index}
              handleRTChange={onRtChange}
            />
          </div>
        ))}
        <RtActionButtons
          rtListLength={rtList.length}
          onAdd={onAddRt}
          onRemove={() => onRemoveRt(rtList.length - 1)}
        />
      </div>
    </div>
  );
};
