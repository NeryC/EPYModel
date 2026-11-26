import { NumericField } from "../components/NumericField";
import { NUMERIC_CONSTRAINTS } from "../constants";
import { NumericInputHook } from "../types";

const UCIInput = ({ field }: { field: NumericInputHook }) => (
  <NumericField
    id="uci_input"
    labelKey="uci-setting"
    descriptionKey="uci-setting-description"
    field={field}
    constraints={NUMERIC_CONSTRAINTS.UCI}
  />
);

export default UCIInput;
