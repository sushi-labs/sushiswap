import { QualifierValue } from './QualifierValue.js';
import { QualifierModel } from '../models/QualifierModel.js';
/**
 * @summary SDK
 * @memberOf SDK
 */
class Qualifier extends QualifierModel {
    constructor(key, qualifierValue) {
        super();
        this.delimiter = '_'; // {key}{delimiter}{qualifierValue}
        this.key = key;
        if (qualifierValue instanceof QualifierValue) {
            this.qualifierValue = qualifierValue;
        }
        else {
            this.qualifierValue = new QualifierValue();
            this.qualifierValue.addValue(qualifierValue);
        }
    }
    toString() {
        const { key, delimiter, qualifierValue } = this;
        return `${key}${delimiter}${qualifierValue.toString()}`;
    }
    addValue(value) {
        this.qualifierValue.addValue(value);
        return this;
    }
}
export { Qualifier };
