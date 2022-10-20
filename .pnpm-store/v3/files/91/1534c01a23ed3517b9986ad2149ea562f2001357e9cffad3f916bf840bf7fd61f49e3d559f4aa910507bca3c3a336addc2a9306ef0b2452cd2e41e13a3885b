import { createUnsupportedError } from "../utils/unsupportedError.js";
/**
 * Returns the action's model
 */
export function qualifierToJson() {
    return this._qualifierModel || { error: createUnsupportedError(`unsupported qualifier ${this.constructor.name}`) };
}
