import { useTranslation } from 'next-i18next';
import { CSS_CLASSES } from '../constants';

/**
 * HeaderSection Component
 * 
 * Section containing the form header/title
 */
export const HeaderSection = () => {
  const { t } = useTranslation("common");
  
  return (
    <span className={CSS_CLASSES.TITLE}>
      {t("chart-setting")}
    </span>
  );
};
