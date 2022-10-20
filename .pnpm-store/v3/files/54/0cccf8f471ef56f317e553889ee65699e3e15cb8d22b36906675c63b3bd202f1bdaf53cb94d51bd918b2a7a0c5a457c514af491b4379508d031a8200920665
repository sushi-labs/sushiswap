import { LeveledEffectAction } from "./EffectActions/LeveledEffectAction.js";
import { IDitherModel } from "../../internal/models/IEffectActionModel.js";
import { IActionModel } from "../../internal/models/IActionModel.js";
/**
 * @description Applies an ordered dither filter to the image.
 * @extends LeveledEffectAction
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
declare class DitherEffectAction extends LeveledEffectAction {
    protected _actionModel: IDitherModel;
    /**
     *
     * @param {Qualifiers.Dither} ditherType - The dither type applied to the image
     * @return {this}
     */
    type(ditherType: number): this;
    static fromJson(actionModel: IActionModel): DitherEffectAction;
}
export { DitherEffectAction };
