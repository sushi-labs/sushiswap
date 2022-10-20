import { QualifierValue } from "../../internal/qualifier/QualifierValue.js";
import { Qualifier } from "../../internal/qualifier/Qualifier.js";
/**
 * @memberOf Qualifiers.Flag
 * @extends {SDK.Qualifier}
 * @description the FlagQualifier class
 */
class FlagQualifier extends Qualifier {
    constructor(flagType, flagValue) {
        let qualifierValue;
        if (flagValue) {
            qualifierValue = new QualifierValue([flagType, `${flagValue}`]).setDelimiter(':');
        }
        else {
            qualifierValue = flagType;
        }
        super('fl', qualifierValue);
        this.flagValue = flagValue;
    }
    toString() {
        return super.toString().replace(/\./, '%2E');
    }
    getFlagValue() {
        return this.flagValue;
    }
}
export { FlagQualifier };
