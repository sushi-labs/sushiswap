import { GravityQualifier } from "../GravityQualifier.js";
/**
 * @description The class for the autoGravity builder
 * @memberOf Qualifiers.Gravity
 * @extends {Qualifiers.Gravity.GravityQualifier}
 */
class AutoGravity extends GravityQualifier {
    constructor() {
        // Required due to https://github.com/microsoft/TypeScript/issues/13029
        /* istanbul ignore next */
        super('auto');
    }
    /**
     * @description Autofocuses on objects, allowing their priority within the algorithm to be configured.
     * @param {AutoFocus} AutoFocusObjects
     */
    autoFocus(...AutoFocusObjects) {
        this.addValue(AutoFocusObjects);
        return this;
    }
}
export { AutoGravity };
