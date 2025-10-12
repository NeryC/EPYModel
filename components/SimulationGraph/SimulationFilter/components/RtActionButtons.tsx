import { RtActionButtonsProps } from '../types';
import { CSS_CLASSES, ARIA_LABELS } from '../constants';

/**
 * RtActionButtons Component
 * 
 * Action buttons for adding and removing RT values
 */
export const RtActionButtons = ({ 
  rtListLength, 
  onAdd, 
  onRemove 
}: RtActionButtonsProps) => (
  <div className={CSS_CLASSES.RT_BUTTON_CONTAINER}>
    {rtListLength > 1 && (
      <button
        onClick={onRemove}
        className={CSS_CLASSES.BUTTON.RT_REMOVE}
        aria-label={ARIA_LABELS.REMOVE_RT}
      >
        ×
      </button>
    )}
    <button
      onClick={onAdd}
      className={CSS_CLASSES.BUTTON.RT_ADD}
      aria-label={ARIA_LABELS.ADD_RT}
    >
      +
    </button>
  </div>
);
