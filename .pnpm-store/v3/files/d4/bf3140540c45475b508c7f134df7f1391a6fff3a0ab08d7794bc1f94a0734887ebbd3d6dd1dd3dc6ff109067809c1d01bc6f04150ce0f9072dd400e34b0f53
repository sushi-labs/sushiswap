import { LeveledEffectAction } from "../EffectActions/LeveledEffectAction.js";
/**
 * @description Removes small motion shifts from the video. with a maximum extent of movement in the horizontal and vertical direction of 32 pixels
 * @extends LeveledEffectAction
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
class DeshakeEffectAction extends LeveledEffectAction {
    constructor() {
        super(...arguments);
        this._actionModel = { actionType: 'deshake' };
    }
    /**
     * The maximum number of pixels in the horizontal and vertical direction that will be addressed. (Possible values: 16, 32, 48, 64. Server default: 16)
     * @param value Possible values: 16, 32, 48, 64.  Server default: 16.
     */
    shakeStrength(value) {
        this._actionModel.pixels = value;
        const qualifierEffect = this.createEffectQualifier(this.effectType, value);
        this.addQualifier(qualifierEffect);
        return this;
    }
    static fromJson(actionModel) {
        const { actionType, pixels } = actionModel;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        const result = new this(actionType, pixels);
        return result;
    }
}
export { DeshakeEffectAction };
