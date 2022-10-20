import { EffectActionWithLevel } from "./EffectActions/EffectActionWithLevel.js";
import { SystemColors } from "../../qualifiers/color.js";
import { IActionModel } from "../../internal/models/IActionModel.js";
/**
 * @description Applies a colorizing filter to the asset, use the methods in the class to adjust the filter
 * @extends EffectActionWithLevel
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
declare class ColorizeEffectAction extends EffectActionWithLevel {
    /**
     * @description The color to use for colorization. Specify HTML name or RGB hex code. (Server default: gray)
     * @param {string} color HTML name(red, green, etc.) or RGB hex code. (Server default: gray)
     * @return {this}
     */
    color(color: SystemColors): this;
    static fromJson(actionModel: IActionModel): ColorizeEffectAction;
}
export { ColorizeEffectAction };
