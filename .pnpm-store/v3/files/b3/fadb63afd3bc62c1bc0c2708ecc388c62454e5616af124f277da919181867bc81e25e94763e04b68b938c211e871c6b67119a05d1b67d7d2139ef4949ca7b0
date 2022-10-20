import { Action } from "../../internal/Action.js";
import { SystemColors } from "../../qualifiers/color.js";
import { ExpressionQualifier } from "../../qualifiers/expression/ExpressionQualifier.js";
import { IShadowEffectActionModel } from "../../internal/models/IEffectActionModel.js";
import { IActionModel } from "../../internal/models/IActionModel.js";
/**
 * @description Applies a shadow filter to the asset.
 * @memberOf Actions.Effect
 * @extends SDK.Action
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
declare class ShadowEffectAction extends Action {
    protected _actionModel: IShadowEffectActionModel;
    private effectType;
    constructor(effectType: string, strength: number);
    /**
     * @description The strength of the shadow. (Range: 0 to 100, Server default: 40)
     * @param {number} strength
     * @return {this}
     */
    strength(strength: number): this;
    /**
     * @description The X offset the shadow
     * @param {number | SDK.ExpressionQualifier} x
     * @return {this}
     */
    offsetX(x: number | ExpressionQualifier): this;
    /**
     * @description The Y offset the shadow
     * @param {number | SDK.ExpressionQualifier} y
     * @return {this}
     */
    offsetY(y: number | ExpressionQualifier): this;
    /**
     * @description The color of the shadow (Server default: gray)
     * @param color
     * @return {this}
     */
    color(color: SystemColors): this;
    static fromJson(actionModel: IActionModel): ShadowEffectAction;
}
export { ShadowEffectAction };
