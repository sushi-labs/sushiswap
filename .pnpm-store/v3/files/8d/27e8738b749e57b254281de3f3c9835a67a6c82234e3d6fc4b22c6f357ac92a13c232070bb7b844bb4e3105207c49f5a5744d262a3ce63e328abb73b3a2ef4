import { Action } from "../../internal/Action.js";
import { ICartoonifyEffectModel } from "../../internal/models/IEffectActionModel.js";
import { IActionModel } from "../../internal/models/IActionModel.js";
/**
 * @description Applies a cartoon effect to an image.
 * @extends SDK.Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
declare class CartoonifyEffect extends Action {
    protected _actionModel: ICartoonifyEffectModel;
    private colorReduction;
    private cartoonifyStrength;
    private effectName;
    constructor(effectName: string, strength: number);
    /**
     * @description Sets the thickness of the lines.
     * @param {number} lineStrength The thickness of the lines. (Range: 0 to 100, Server default: 50)
     * @return {this}
     */
    lineStrength(lineStrength: number): this;
    /**
     * @description Achieves a black and white cartoon effect.
     * @return {this}
     */
    blackwhite(): this;
    /**
     * @description
     * Sets the decrease in the number of colors and corresponding saturation boost of the remaining colors. <br/>
     * Higher reduction values result in a less realistic look.
     * @param {number } level The decrease in the number of colors and corresponding saturation boost of the remaining colors. (Range: 0 to 100, Server default: automatically adjusts according to the line_strength value). Set to 'bw' for a black and white cartoon effect.
     * @return {this}
     */
    colorReductionLevel(level: number): this;
    protected prepareQualifiers(): void;
    static fromJson(actionModel: IActionModel): CartoonifyEffect;
}
export { CartoonifyEffect };
