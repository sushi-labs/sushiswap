import { Action } from "../../internal/Action.js";
import { QualifierValue } from "../../internal/qualifier/QualifierValue.js";
import { Qualifier } from "../../internal/qualifier/Qualifier.js";
/**
 * @description Defines an new user variable.
 * @memberOf Actions.Variable
 * @extends SDK.Action
 * @see Visit {@link Actions.Variable|Variable} for an example
 */
class VariableAction extends Action {
    constructor(name, value) {
        super();
        this.isFloat = false;
        this.isNumber = false;
        this.value = value;
        this.name = name;
    }
    /**
     * @description Converts the returned value to type float.
     */
    asFloat() {
        this.isFloat = true;
        return this;
    }
    /**
     * @description Converts the returned value to type number.
     */
    asInteger() {
        this.isNumber = true;
        return this;
    }
    prepareQualifiers() {
        let qualifierValue;
        if (this.isFloat) {
            qualifierValue = new QualifierValue([this.value, 'to_f']).setDelimiter('_');
        }
        else if (this.isNumber) {
            qualifierValue = new QualifierValue([this.value, 'to_i']).setDelimiter('_');
        }
        else {
            qualifierValue = new QualifierValue(this.value);
        }
        this.addQualifier(new Qualifier(`$${this.name}`, qualifierValue));
        return this;
    }
}
export default VariableAction;
