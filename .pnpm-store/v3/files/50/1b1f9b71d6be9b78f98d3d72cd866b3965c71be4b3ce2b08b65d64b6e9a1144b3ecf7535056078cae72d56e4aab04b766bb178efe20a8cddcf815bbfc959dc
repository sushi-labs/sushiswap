import { createUnsupportedError } from "./utils/unsupportedError.js";
/**
 * @summary SDK
 * @memberOf SDK
 * @description Defines an action that's a string literal, no validations or manipulations are performed
 */
class RawAction {
    constructor(raw) {
        this.raw = raw;
    }
    toString() {
        return this.raw;
    }
    toJson() {
        return { error: createUnsupportedError(`unsupported action ${this.constructor.name}`) };
    }
}
export { RawAction };
