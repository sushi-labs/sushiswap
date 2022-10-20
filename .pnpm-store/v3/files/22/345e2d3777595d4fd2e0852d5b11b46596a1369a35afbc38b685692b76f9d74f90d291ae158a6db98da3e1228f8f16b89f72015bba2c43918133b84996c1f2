import { LeveledEffectAction } from "../EffectActions/LeveledEffectAction.js";
import { ExpressionQualifier } from "../../../qualifiers/expression/ExpressionQualifier.js";
import { IDeshakeEffectModel } from "../../../internal/models/IEffectActionModel.js";
import { IActionModel } from "../../../internal/models/IActionModel.js";
declare type pixels = 16 | 32 | 48 | 64;
/**
 * @description Removes small motion shifts from the video. with a maximum extent of movement in the horizontal and vertical direction of 32 pixels
 * @extends LeveledEffectAction
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
declare class DeshakeEffectAction extends LeveledEffectAction {
    protected _actionModel: IDeshakeEffectModel;
    /**
     * The maximum number of pixels in the horizontal and vertical direction that will be addressed. (Possible values: 16, 32, 48, 64. Server default: 16)
     * @param value Possible values: 16, 32, 48, 64.  Server default: 16.
     */
    shakeStrength(value: pixels | string | ExpressionQualifier): this;
    static fromJson(actionModel: IActionModel): DeshakeEffectAction;
}
export { DeshakeEffectAction };
