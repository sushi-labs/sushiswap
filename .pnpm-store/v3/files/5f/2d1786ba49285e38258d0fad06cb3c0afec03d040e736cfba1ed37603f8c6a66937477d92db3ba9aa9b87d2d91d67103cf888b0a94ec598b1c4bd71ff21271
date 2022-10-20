/**
 * @summary SDK
 * @memberOf SDK
 */
class QualifierValue {
    /**
     *
     * @param {QualifierValue | QualifierValue[] | any[] | string | number}qualifierValue
     */
    constructor(qualifierValue) {
        this.values = [];
        this.delimiter = ':'; // {value}{delimiter}{value}...
        if (this.hasValue(qualifierValue)) {
            this.addValue(qualifierValue);
        }
    }
    /**
     * @description Joins the provided values with the provided delimiter
     */
    toString() {
        return this.values.join(this.delimiter);
    }
    /**
     * @description Checks if the provided argument has a value
     * @param {any} v
     * @private
     * @return {boolean}
     */
    hasValue(v) {
        return typeof v !== 'undefined' && v !== null && v !== '';
    }
    /**
     * @desc Adds a value for the this qualifier instance
     * @param {any} value
     * @return {this}
     */
    addValue(value) {
        // Append value or array of values
        if (Array.isArray(value)) {
            this.values = this.values.concat(value);
        }
        else {
            this.values.push(value);
        }
        // Remove falsy values
        this.values = this.values.filter((v) => this.hasValue(v));
        return this;
    }
    /**
     * @description Sets the delimiter for this instance
     * @param delimiter
     */
    setDelimiter(delimiter) {
        this.delimiter = delimiter;
        return this;
    }
}
export { QualifierValue };
