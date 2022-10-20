import { Action } from "../../internal/Action.js";
/**
 * @description  Defines the clipping path to use when trimming pixels.
 * @extends SDK.Action
 * @memberOf Actions.PSDTools
 * @see Visit {@link Actions.PSDTools| PSDTools} for an example
 */
declare class ClipAction extends Action {
    private path;
    private isEvenOdd;
    constructor();
    /**
     * @description The name of the path to clip by
     * @param {string} path
     * @return {this}
     */
    byName(path: string): this;
    /**
     * @description The index of the path to clip by
     * @param {number} path
     * @return {this}
     */
    byIndex(path: number): this;
    /**
     * @description Trims pixels according to a clipping path included in the original image using an evenodd clipping rule.
     * @return {this}
     */
    evenOdd(): this;
    protected prepareQualifiers(): this;
}
export { ClipAction };
