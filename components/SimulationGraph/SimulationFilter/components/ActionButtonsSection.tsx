import { ActionButtonsSectionProps } from '../types';
import { CSS_CLASSES } from '../constants';
import { ErrorMessage } from './ErrorMessage';
import { LoadingButton } from './LoadingButton';
import { SecondaryButton } from './SecondaryButton';

/**
 * ActionButtonsSection Component
 * 
 * Section containing action buttons (simulate and reset)
 */
export const ActionButtonsSection = ({
  isLoading,
  hasChanges,
  error,
  onSimulate,
  onReset,
}: ActionButtonsSectionProps) => (
  <div className={CSS_CLASSES.ACTIONS_CONTAINER}>
    <ErrorMessage error={error} />
    <div className={CSS_CLASSES.ACTIONS_ROW}>
      <LoadingButton
        isLoading={isLoading}
        onClick={onSimulate}
        disabled={isLoading || !hasChanges}
      >
        Simulate
      </LoadingButton>
      <SecondaryButton
        onClick={onReset}
        disabled={isLoading}
      >
        Reset
      </SecondaryButton>
    </div>
  </div>
);
