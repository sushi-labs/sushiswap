import { QualifierValue } from "../internal/qualifier/QualifierValue.js";
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
class AutoFocus extends QualifierValue {
    constructor(focusOn, weight) {
        super();
        this._weight = weight;
        this.focusOn = focusOn;
        this.shouldAvoid = false;
    }
    /**
     * @summary qualifier
     * @description Specifies the object to focus on automatically
     * Accepts an AutoFocusObject (which is just a wrapper for a FocusOn object, but with extra method: avoid, weight)
     * @param {Qualifiers.FocusOn} obj The object to focus on.
     * @param {number} weight
     */
    static focusOn(obj, weight) {
        return new AutoFocus(obj, weight);
    }
    shouldAddWeight() {
        return typeof this._weight === 'number' || typeof this._weight === 'string' || this.shouldAvoid;
    }
    /**
     * @summary qualifier
     * @desc Get the name of the of the object
     */
    getName() {
        return this.focusOn.name;
    }
    /**
     * @summary qualifier
     * @desc Get the weight for the object
     */
    getWeight() {
        if (this.shouldAvoid) {
            return 'avoid';
        }
        else {
            return this._weight;
        }
    }
    /**
     * @summary qualifier
     * @desc Return the string representation of this QualifierValue
     */
    toString() {
        // Future proofing, in case we'd like to support some custom string in the future, or if data is coming from a DB
        if (this.shouldAddWeight()) {
            return `${this.getName()}_${this.getWeight()}`;
        }
        else {
            return `${this.getName()}`;
        }
    }
    /**
     * @summary qualifier
     * @description Sets the importance level of the object within the automatic gravity algorithm
     * @param {numebr} w The focus weight for the object
     * @return {this}
     */
    weight(w) {
        this._weight = w;
        return this;
    }
    /**
     * @summary qualifier
     * @description Attempts to avoid the detected object in the image
     * @return {this}
     */
    avoid() {
        this.shouldAvoid = true;
        return this;
    }
}
export { AutoFocus };
