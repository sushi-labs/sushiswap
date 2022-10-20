import { SimpleEffectAction } from "./SimpleEffectAction.js";
import { EFFECT_MODE_TO_ACTION_TYPE_MAP } from "../../../internal/internalConstants.js";
/**
 * @description A base class for effects with a level, the extending class needs to implement a method that calls setLevel()
 * @extends {Actions.Effect.SimpleEffectAction}
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
class LeveledEffectAction extends SimpleEffectAction {
    constructor(effectType, level) {
        super(effectType, level);
        this.LEVEL_NAME = 'level';
        this._actionModel = {};
        this.effectType = effectType;
        this._actionModel.actionType = EFFECT_MODE_TO_ACTION_TYPE_MAP[effectType] || effectType;
        if (level) {
            this.setLevel(level);
        }
    }
    /**
     *
     * @description Sets the effect level for the action
     * @param {string | number} level - The strength of the effect
     * @protected
     */
    setLevel(level) {
        this._actionModel[this.LEVEL_NAME] = level;
        const qualifierEffect = this.createEffectQualifier(this.effectType, level);
        this.addQualifier(qualifierEffect);
        return this;
    }
}
export { LeveledEffectAction };
