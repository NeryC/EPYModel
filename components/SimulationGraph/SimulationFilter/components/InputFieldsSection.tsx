import { InputFieldsSectionProps } from '../types';
import { CSS_CLASSES } from '../constants';
import UCIInput from '../UCIInput/index';
import VFilteredInput from '../VFilteredInput/index';
import LambdaItoHInput from '../LambdaItoHInput/index';

/**
 * InputFieldsSection Component
 * 
 * Section containing all form input fields
 */
export const InputFieldsSection = ({
  uci,
  onUciChange,
  vFiltered,
  onVFilteredChange,
  lambdaItoH,
  onLambdaItoHChange,
}: InputFieldsSectionProps) => (
  <>
    <div className={CSS_CLASSES.INPUTS_ROW}>
      <UCIInput UCI={uci} handleUCIChange={onUciChange} />
      <VFilteredInput
        vFiltered={vFiltered}
        handleVFilteredChange={onVFilteredChange}
      />
    </div>
    <LambdaItoHInput
      lambdaItoH={lambdaItoH}
      handleLambdaItoHChange={onLambdaItoHChange}
    />
  </>
);
