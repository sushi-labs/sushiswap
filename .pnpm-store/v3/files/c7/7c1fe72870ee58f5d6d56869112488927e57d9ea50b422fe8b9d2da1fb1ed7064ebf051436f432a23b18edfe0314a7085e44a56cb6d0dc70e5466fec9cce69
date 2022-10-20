import { Action } from "../../internal/Action.js";
import { IAssistColorBlindEffectModel } from "../../internal/models/IEffectActionModel.js";
import { IActionModel } from "../../internal/models/IActionModel.js";
/**
 * @description Applies stripes to the image to help people with common color-blind conditions to differentiate between colors that are similar for them.
 *              You can replace colors using the xray() method.
 * @extends SDK.Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
declare class AssistColorBlindEffectAction extends Action {
    protected _actionModel: IAssistColorBlindEffectModel;
    constructor();
    /**
     * @description Replaces problematic colors with colors that are easier to differentiate.
     * @return {this}
     */
    xray(): this;
    /**
     * @description Applies stripes of the specified intensity to help people with common color blind conditions to differentiate between colors that are similar for them.
     * @param {number | string} strength The intensity of the stripes. (Range: 1 to 100, Server default: 10)
     * @return {this}
     */
    stripesStrength(strength: number | string): this;
    static fromJson(actionModel: IActionModel): AssistColorBlindEffectAction;
}
export { AssistColorBlindEffectAction };
