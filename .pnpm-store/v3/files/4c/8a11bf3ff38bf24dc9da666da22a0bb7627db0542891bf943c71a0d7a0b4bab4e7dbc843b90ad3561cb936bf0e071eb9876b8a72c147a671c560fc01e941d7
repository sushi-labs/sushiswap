import { ExpressionQualifier } from "../../qualifiers/expression/ExpressionQualifier.js";
/**
 * @summary SDK
 * @memberOf SDK
 */
declare class QualifierValue {
    values: any[];
    delimiter: string;
    /**
     *
     * @param {QualifierValue | QualifierValue[] | any[] | string | number}qualifierValue
     */
    constructor(qualifierValue?: QualifierValue | QualifierValue[] | any[] | string | number | ExpressionQualifier);
    /**
     * @description Joins the provided values with the provided delimiter
     */
    toString(): string;
    /**
     * @description Checks if the provided argument has a value
     * @param {any} v
     * @private
     * @return {boolean}
     */
    private hasValue;
    /**
     * @desc Adds a value for the this qualifier instance
     * @param {any} value
     * @return {this}
     */
    addValue(value: any): this;
    /**
     * @description Sets the delimiter for this instance
     * @param delimiter
     */
    setDelimiter(delimiter: string): this;
}
export { QualifierValue };
