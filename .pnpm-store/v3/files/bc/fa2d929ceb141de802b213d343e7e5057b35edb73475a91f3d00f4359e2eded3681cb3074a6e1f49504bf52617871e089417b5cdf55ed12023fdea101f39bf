import { Action } from "../../internal/Action.js";
/**
 * @description Adjusts the fill light and blends the result with the original image.
 * @memberOf Actions.Adjust
 * @extends SDK.Action
 */
declare class FillLightAction extends Action {
    private lvl;
    private biasLvl;
    constructor();
    /**
     * @description Sets the level of adjustment
     * @param {number} lvl How much to blend the adjusted fill light, where 0 means only use the original and 100 means only use the adjusted fill light result. (Range: 0 to 100, Server default: 100)
     */
    blend(blend: number): this;
    /**
     * @description Sets the level of the bias
     * @param {number} biasLvl The bias to apply to the fill light effect (Range: -100 to 100, Server default: 0).
     */
    bias(biasLvl: number): this;
    protected prepareQualifiers(): this;
}
export { FillLightAction };
