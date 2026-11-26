import { InputFieldsSectionProps } from "../types";
import { CSS_CLASSES } from "../constants";
import UCIInput from "../UCIInput/index";
import VFilteredInput from "../VFilteredInput/index";
import LambdaItoHInput from "../LambdaItoHInput/index";

/**
 * InputFieldsSection Component
 *
 * Section containing all form input fields
 */
export const InputFieldsSection = ({
  uci,
  vFiltered,
  lambdaItoH,
}: InputFieldsSectionProps) => (
  <>
    <div className={CSS_CLASSES.INPUTS_ROW}>
      <UCIInput field={uci} />
      <VFilteredInput field={vFiltered} />
    </div>
    <LambdaItoHInput field={lambdaItoH} />
  </>
);
