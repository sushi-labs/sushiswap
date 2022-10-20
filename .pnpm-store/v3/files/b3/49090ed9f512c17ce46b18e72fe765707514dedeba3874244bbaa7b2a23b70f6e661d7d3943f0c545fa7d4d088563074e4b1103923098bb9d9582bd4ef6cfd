import { Action } from "../../internal/Action.js";
import { Qualifier } from "../../internal/qualifier/Qualifier.js";
/**
 * @description Applies a gradient fade effect from one edge of the image.
 * @extends SDK.Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
class GradientFadeEffectAction extends Action {
    constructor() {
        super(...arguments);
        this._actionModel = { actionType: 'gradientFade' };
    }
    /**
     * @description Sets the strength of the fade effect.
     * @param {number} strength The strength of the fade effect. (Range: 0 to 100, Server default: 20)
     */
    strength(strength) {
        this._actionModel.strength = strength;
        this._strength = strength;
        return this;
    }
    /**
     * @description Sets the mode of gradient fade.
     * @param {string | Qualifiers.GradientFade} type The mode of gradient fade.
     */
    type(type) {
        this._actionModel.type = type;
        this._type = type;
        return this;
    }
    /**
     * @description Sets the x dimension of the start point.
     * @param {number | string} x The x dimension of the start point.
     */
    horizontalStartPoint(x) {
        this._actionModel.horizontalStartPoint = x;
        return this.addQualifier(new Qualifier('x', x));
    }
    /**
     * @description Sets the y dimension of the start point.
     * @param {number | string} y The y dimension of the start point.
     */
    verticalStartPoint(y) {
        this._actionModel.verticalStartPoint = y;
        return this.addQualifier(new Qualifier('y', y));
    }
    prepareQualifiers() {
        let str = 'gradient_fade';
        if (this._type) {
            str += `:${this._type}`;
        }
        if (this._strength) {
            str += `:${this._strength}`;
        }
        this.addQualifier(new Qualifier('e', str));
    }
    static fromJson(actionModel) {
        const { actionType, verticalStartPoint, horizontalStartPoint, type, strength } = actionModel;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        const result = new this();
        verticalStartPoint && result.verticalStartPoint(verticalStartPoint);
        horizontalStartPoint && result.horizontalStartPoint(horizontalStartPoint);
        type && result.type(type);
        strength && result.strength(strength);
        return result;
    }
}
export { GradientFadeEffectAction };
