import { ErrorMessageProps } from '../types';
import { CSS_CLASSES } from '../constants';

/**
 * ErrorMessage Component
 * 
 * Displays error messages with consistent styling
 */
export const ErrorMessage = ({ error }: ErrorMessageProps) => {
  if (!error) return null;
  
  return (
    <div className={CSS_CLASSES.ERROR_MESSAGE} role="alert" aria-live="polite">
      {error}
    </div>
  );
};
