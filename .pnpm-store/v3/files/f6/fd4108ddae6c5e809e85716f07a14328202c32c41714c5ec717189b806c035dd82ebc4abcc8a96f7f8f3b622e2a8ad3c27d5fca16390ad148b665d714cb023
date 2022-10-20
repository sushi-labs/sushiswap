import { LeveledEffectAction } from "./EffectActions/LeveledEffectAction.js";
/**
 * @description Applies an ordered dither filter to the image.
 * @extends LeveledEffectAction
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
class DitherEffectAction extends LeveledEffectAction {
    constructor() {
        super(...arguments);
        this._actionModel = { actionType: 'dither' };
    }
    /**
     *
     * @param {Qualifiers.Dither} ditherType - The dither type applied to the image
     * @return {this}
     */
    type(ditherType) {
        this._actionModel.type = ditherType;
        const qualifierEffect = this.createEffectQualifier(this.effectType, ditherType);
        this.addQualifier(qualifierEffect);
        return this;
    }
    static fromJson(actionModel) {
        const { actionType, type } = actionModel;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        const result = new this(actionType);
        type && result.type(type);
        return result;
    }
}
export { DitherEffectAction };
