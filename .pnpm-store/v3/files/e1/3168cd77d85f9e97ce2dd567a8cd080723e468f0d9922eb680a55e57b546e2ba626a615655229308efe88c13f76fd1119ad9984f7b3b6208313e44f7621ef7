import { Action } from "../../internal/Action.js";
/**
 * @memberOf Actions.CustomFunction
 * @see Visit {@link Actions.CustomFunction|Custom functions} for an example
 */
declare class CustomFunctionAction extends Action {
    private mode;
    protected pre?: 'pre';
    readonly fn: string;
    private encodedFn;
    /**
     *
     * @param {string} fn The custom function to use, can be a URL or a publicID
     */
    constructor(fn: string);
    private encodeCustomFunctionString;
    /**
     * Use a WASM as a custom function,
     * Used with the builders of `remote` and `wasm` from {@link Actions.CustomFunction|Custom functions}
     */
    asWasm(): this;
    /**
     * Use a remote URL as a custom function
     * Used with the builders of `remote` and `wasm` from {@link Actions.CustomFunction|Custom functions}
     */
    asRemote(): this;
    protected prepareQualifiers(): this;
    toString(): string;
}
export default CustomFunctionAction;
