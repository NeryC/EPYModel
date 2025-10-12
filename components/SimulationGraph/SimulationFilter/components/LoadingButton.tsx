import { useTranslation } from 'next-i18next';
import { LoadingButtonProps } from '../types';
import { CSS_CLASSES } from '../constants';
import { LoadingSpinner } from './LoadingSpinner';

/**
 * LoadingButton Component
 * 
 * Button component that shows loading state with spinner
 */
export const LoadingButton = ({ 
  isLoading, 
  onClick, 
  disabled, 
  children, 
  className 
}: LoadingButtonProps) => {
  const { t } = useTranslation("common");
  
  return (
    <button
      className={`${CSS_CLASSES.BUTTON.PRIMARY} ${
        isLoading 
          ? CSS_CLASSES.BUTTON.PRIMARY_LOADING 
          : CSS_CLASSES.BUTTON.PRIMARY_NORMAL
      } ${className || ''}`}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <LoadingSpinner />
          {t('simulating')}
        </>
      ) : (
        children
      )}
    </button>
  );
};
