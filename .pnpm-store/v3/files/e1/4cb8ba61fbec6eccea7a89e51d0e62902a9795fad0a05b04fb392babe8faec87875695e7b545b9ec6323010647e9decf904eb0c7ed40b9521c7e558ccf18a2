import { Action } from "../../internal/Action.js";
import { IGradientFadeEffecModel } from "../../internal/models/IEffectActionModel.js";
import { IActionModel } from "../../internal/models/IActionModel.js";
/**
 * @description Applies a gradient fade effect from one edge of the image.
 * @extends SDK.Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
declare class GradientFadeEffectAction extends Action {
    private _strength;
    private _type;
    protected _actionModel: IGradientFadeEffecModel;
    /**
     * @description Sets the strength of the fade effect.
     * @param {number} strength The strength of the fade effect. (Range: 0 to 100, Server default: 20)
     */
    strength(strength: number): this;
    /**
     * @description Sets the mode of gradient fade.
     * @param {string | Qualifiers.GradientFade} type The mode of gradient fade.
     */
    type(type: string): this;
    /**
     * @description Sets the x dimension of the start point.
     * @param {number | string} x The x dimension of the start point.
     */
    horizontalStartPoint(x: number | string): this;
    /**
     * @description Sets the y dimension of the start point.
     * @param {number | string} y The y dimension of the start point.
     */
    verticalStartPoint(y: number | string): this;
    protected prepareQualifiers(): void;
    static fromJson(actionModel: IActionModel): GradientFadeEffectAction;
}
export { GradientFadeEffectAction };
