import { LeveledEffectAction } from "../EffectActions/LeveledEffectAction.js";
import { SystemColors } from "../../../qualifiers/color.js";
import { IMakeTransparentEffectModel } from "../../../internal/models/IEffectActionModel.js";
import { IActionModel } from "../../../internal/models/IActionModel.js";
/**
 * @description Makes the background of the image transparent (or solid white for formats that do not support transparency).
 * @extends LeveledEffectAction
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
declare class MakeTransparentEffectAction extends LeveledEffectAction {
    protected _actionModel: IMakeTransparentEffectModel;
    /**
     * @description Sets the tolerance used to accommodate variance in the background color.
     * @param {number | string} value The tolerance used to accommodate variance in the background color. (Range: 0 to 100, Server default: 10)
     */
    tolerance(value: number | string): this;
    /**
     * @description Sets the color to make transparent.
     * @param {string} color The HTML name of the color (red, green, etc.) or RGB hex code.
     * @return {this}
     */
    colorToReplace(color: SystemColors): this;
    static fromJson(actionModel: IActionModel): MakeTransparentEffectAction;
}
export { MakeTransparentEffectAction };
