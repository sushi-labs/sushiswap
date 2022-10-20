import { base64Encode } from "../../internal/utils/base64Encode.js";
import { Action } from "../../internal/Action.js";
import { QualifierValue } from "../../internal/qualifier/QualifierValue.js";
import { Qualifier } from "../../internal/qualifier/Qualifier.js";
/**
 * @memberOf Actions.CustomFunction
 * @see Visit {@link Actions.CustomFunction|Custom functions} for an example
 */
class CustomFunctionAction extends Action {
    /**
     *
     * @param {string} fn The custom function to use, can be a URL or a publicID
     */
    constructor(fn) {
        super();
        this.fn = fn;
    }
    encodeCustomFunctionString(fn) {
        const encodedSource = base64Encode(fn);
        return encodedSource;
    }
    /**
     * Use a WASM as a custom function,
     * Used with the builders of `remote` and `wasm` from {@link Actions.CustomFunction|Custom functions}
     */
    asWasm() {
        this.mode = 'wasm';
        return this;
    }
    /**
     * Use a remote URL as a custom function
     * Used with the builders of `remote` and `wasm` from {@link Actions.CustomFunction|Custom functions}
     */
    asRemote() {
        this.mode = 'remote';
        return this;
    }
    prepareQualifiers() {
        this.encodedFn = this.fn;
        if (this.mode === 'remote') {
            this.encodedFn = this.encodeCustomFunctionString(this.fn);
        }
        return this.addQualifier(new Qualifier('fn', new QualifierValue([this.pre, this.mode, this.encodedFn])));
    }
    toString() {
        return super.toString()
            .replace(/\//g, ':');
    }
}
export default CustomFunctionAction;
