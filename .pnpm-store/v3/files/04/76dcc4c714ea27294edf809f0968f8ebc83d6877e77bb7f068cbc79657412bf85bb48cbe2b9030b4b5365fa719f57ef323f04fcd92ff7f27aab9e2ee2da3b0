import { Action } from "../../../internal/Action.js";
import { QualifierValue } from "../../../internal/qualifier/QualifierValue.js";
import { Qualifier } from "../../../internal/qualifier/Qualifier.js";
import { ACTION_TYPE_TO_EFFECT_MODE_MAP, EFFECT_MODE_TO_ACTION_TYPE_MAP } from "../../../internal/internalConstants.js";
/**
 * @description A class that defines a simple effect of the type e_{effectName}
 * @extends SDK.Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
class SimpleEffectAction extends Action {
    constructor(effectType, level) {
        super();
        this._actionModel = {};
        this._actionModel.actionType = EFFECT_MODE_TO_ACTION_TYPE_MAP[effectType] || effectType;
        const qualifierEffect = this.createEffectQualifier(effectType, level);
        this.addQualifier(qualifierEffect);
    }
    createEffectQualifier(effectType, level) {
        let qualifierValue;
        if (level) {
            qualifierValue = new QualifierValue([effectType, `${level}`]).setDelimiter(':');
        }
        else {
            qualifierValue = new QualifierValue(effectType);
        }
        return new Qualifier('e', qualifierValue);
    }
    static fromJson(actionModel) {
        const { actionType, level, strength } = actionModel;
        const effectType = ACTION_TYPE_TO_EFFECT_MODE_MAP[actionType] || actionType;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        // @ts-ignore
        const result = new this(effectType, level ? level : strength);
        return result;
    }
}
export { SimpleEffectAction };
