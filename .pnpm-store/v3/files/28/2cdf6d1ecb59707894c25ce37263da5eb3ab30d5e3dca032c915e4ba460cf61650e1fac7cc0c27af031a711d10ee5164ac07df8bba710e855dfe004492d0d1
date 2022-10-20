import { SimpleEffectAction } from "./SimpleEffectAction.js";
import { ExpressionQualifier } from "../../../qualifiers/expression/ExpressionQualifier.js";
import { IColorizeModel, IEffectActionWithLevelModel } from "../../../internal/models/IEffectActionModel.js";
/**
 * @description A base class for effects with a level, the extending class needs to implement a method that calls setLevel()
 * @extends {Actions.Effect.SimpleEffectAction}
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
declare class LeveledEffectAction extends SimpleEffectAction {
    protected LEVEL_NAME: string;
    protected _actionModel: IEffectActionWithLevelModel | IColorizeModel;
    protected effectType: string;
    constructor(effectType?: string, level?: number | string);
    /**
     *
     * @description Sets the effect level for the action
     * @param {string | number} level - The strength of the effect
     * @protected
     */
    protected setLevel(level: string | number | ExpressionQualifier): this;
}
export { LeveledEffectAction };
