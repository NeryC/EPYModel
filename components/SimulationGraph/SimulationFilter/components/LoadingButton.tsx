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
  
  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`${CSS_CLASSES.BUTTON.PRIMARY} ${
        isLoading
          ? CSS_CLASSES.BUTTON.PRIMARY_LOADING
          : isDisabled
            ? CSS_CLASSES.BUTTON.PRIMARY_DISABLED
            : CSS_CLASSES.BUTTON.PRIMARY_NORMAL
      } ${className || ''}`}
      onClick={onClick}
      disabled={isDisabled}
      title={isDisabled && !isLoading ? 'No hay cambios para simular' : undefined}
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
