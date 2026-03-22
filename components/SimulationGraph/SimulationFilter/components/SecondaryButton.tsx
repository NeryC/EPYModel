import { SecondaryButtonProps } from '../types';
import { CSS_CLASSES } from '../constants';

/**
 * SecondaryButton Component
 * 
 * Secondary action button with consistent styling
 */
export const SecondaryButton = ({ 
  onClick, 
  disabled, 
  children, 
  className 
}: SecondaryButtonProps) => (
  <button
    type="button"
    className={`${CSS_CLASSES.BUTTON.SECONDARY} ${className || ''}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);
