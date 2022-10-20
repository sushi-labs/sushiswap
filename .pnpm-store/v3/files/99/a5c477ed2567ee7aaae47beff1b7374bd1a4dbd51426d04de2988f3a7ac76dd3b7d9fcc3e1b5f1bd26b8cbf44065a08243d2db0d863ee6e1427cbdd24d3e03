import { Action } from "../../../internal/Action.js";
import { Qualifier } from "../../../internal/qualifier/Qualifier.js";
import { ExpressionQualifier } from "../../../qualifiers/expression/ExpressionQualifier.js";
import { ISimpleEffectActionModel } from "../../../internal/models/IEffectActionModel.js";
import { IActionModel } from "../../../internal/models/IActionModel.js";
/**
 * @description A class that defines a simple effect of the type e_{effectName}
 * @extends SDK.Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
declare class SimpleEffectAction extends Action {
    protected _actionModel: ISimpleEffectActionModel;
    constructor(effectType?: string, level?: number | string);
    protected createEffectQualifier(effectType: string, level?: number | string | ExpressionQualifier): Qualifier;
    static fromJson(actionModel: IActionModel): SimpleEffectAction;
}
export { SimpleEffectAction };
