import { NumericField } from "../components/NumericField";
import { NUMERIC_CONSTRAINTS } from "../constants";
import { NumericInputHook } from "../types";

const VFilteredInput = ({ field }: { field: NumericInputHook }) => (
  <NumericField
    id="filtered"
    labelKey="v_filtered"
    descriptionKey="v_filtered-description"
    field={field}
    constraints={NUMERIC_CONSTRAINTS.V_FILTERED}
  />
);

export default VFilteredInput;
