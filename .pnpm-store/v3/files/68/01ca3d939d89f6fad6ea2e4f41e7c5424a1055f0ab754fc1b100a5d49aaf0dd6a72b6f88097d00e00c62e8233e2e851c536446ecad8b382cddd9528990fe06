import { QualifierValue } from "../internal/qualifier/QualifierValue.js";
import { FocusOnValue } from "./focusOn.js";
/**
 * @summary qualifier
 * @namespace AutoFocus
 * @memberOf Qualifiers
 * @see Visit {@link Qualifiers.Gravity|Gravity} for an example
 */
/**
 * @memberOf Qualifiers.AutoFocus
 * @extends {SDK.QualifierValue}
 * @see Visit {@link Qualifiers.Gravity|Gravity} for an example
 */
declare class AutoFocus extends QualifierValue {
    readonly focusOn: FocusOnValue;
    private _weight;
    private shouldAvoid;
    /**
     * @summary qualifier
     * @description Specifies the object to focus on automatically
     * Accepts an AutoFocusObject (which is just a wrapper for a FocusOn object, but with extra method: avoid, weight)
     * @param {Qualifiers.FocusOn} obj The object to focus on.
     * @param {number} weight
     */
    static focusOn(obj: FocusOnValue, weight?: number): AutoFocus;
    constructor(focusOn: FocusOnValue, weight?: number | string);
    private shouldAddWeight;
    /**
     * @summary qualifier
     * @desc Get the name of the of the object
     */
    private getName;
    /**
     * @summary qualifier
     * @desc Get the weight for the object
     */
    private getWeight;
    /**
     * @summary qualifier
     * @desc Return the string representation of this QualifierValue
     */
    toString(): string;
    /**
     * @summary qualifier
     * @description Sets the importance level of the object within the automatic gravity algorithm
     * @param {numebr} w The focus weight for the object
     * @return {this}
     */
    weight(w: number | string): this;
    /**
     * @summary qualifier
     * @description Attempts to avoid the detected object in the image
     * @return {this}
     */
    avoid(): this;
}
export { AutoFocus };
