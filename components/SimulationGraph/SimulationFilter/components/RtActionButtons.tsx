import { useTranslation } from 'next-i18next';
import { RtActionButtonsProps } from '../types';
import { CSS_CLASSES, RT_CONSTRAINTS } from '../constants';

/**
 * RtActionButtons Component
 *
 * Action buttons for adding and removing RT values
 */
export function RtActionButtons({
  rtListLength,
  onAdd,
  onRemove
}: RtActionButtonsProps) {
  const { t } = useTranslation('common');
  return (
    <div className={CSS_CLASSES.RT_BUTTON_CONTAINER}>
      {rtListLength > 1 && (
        <button
          type="button"
          onClick={onRemove}
          className={CSS_CLASSES.BUTTON.RT_REMOVE}
          aria-label={t('remove-rt-value')}
        >
          ×
        </button>
      )}
      {rtListLength < RT_CONSTRAINTS.MAX_COUNT && (
        <button
          type="button"
          onClick={onAdd}
          className={CSS_CLASSES.BUTTON.RT_ADD}
          aria-label={t('add-rt-value')}
        >
          +
        </button>
      )}
    </div>
  );
}
