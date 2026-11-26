import { ActionButtonsSectionProps } from "../types";
import { CSS_CLASSES } from "../constants";
import { ErrorMessage } from "./ErrorMessage";
import { LoadingButton } from "./LoadingButton";
import { SecondaryButton } from "./SecondaryButton";
import { useTranslation } from "next-i18next";

/**
 * ActionButtonsSection Component
 *
 * Section containing action buttons (simulate and reset)
 */
export const ActionButtonsSection = ({
  isLoading,
  hasChanges,
  hasInvalidFields,
  error,
  onSimulate,
  onReset,
}: ActionButtonsSectionProps) => {
  const { t } = useTranslation("common");

  return (
    <div className={CSS_CLASSES.ACTIONS_CONTAINER}>
      <ErrorMessage error={error} />
      <div className={CSS_CLASSES.ACTIONS_ROW}>
        <LoadingButton
          isLoading={isLoading}
          onClick={onSimulate}
          disabled={isLoading || !hasChanges || hasInvalidFields}
          disabledReason={
            hasInvalidFields
              ? t("simulate-disabled-invalid")
              : t("simulate-disabled-no-changes")
          }
        >
          {t("simulate")}
        </LoadingButton>
        <SecondaryButton onClick={onReset} disabled={isLoading}>
          {t("reset")}
        </SecondaryButton>
      </div>
    </div>
  );
};
