import { Action } from "../../../internal/Action.js";
import { Qualifier } from "../../../internal/qualifier/Qualifier.js";
import { QualifierValue } from "../../../internal/qualifier/QualifierValue.js";
/**
 * @description Fade out at the end of the video, use the length() method to set the time in ms for the fade to occur. (Server default: 2000)
 * @extends Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
class FadeInEffectAction extends Action {
    constructor(duration) {
        super();
        this._actionModel = { actionType: 'fadeIn' };
        this.addQualifier(new Qualifier('e', new QualifierValue(['fade', `${duration}`]).setDelimiter(':')));
        duration && (this._actionModel.length = duration);
    }
    /**
     *
     * @description Sets the duration level for the action
     * @param {string | number} duration - The duration of the effect
     */
    duration(duration) {
        this._actionModel.length = duration;
        return this.addQualifier(new Qualifier('e', new QualifierValue(['fade', `${duration}`]).setDelimiter(':')));
    }
    static fromJson(actionModel) {
        const { length } = actionModel;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        const result = new this(length);
        return result;
    }
}
export { FadeInEffectAction };
