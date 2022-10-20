import { Action } from "../../internal/Action.js";
import { Qualifier } from "../../internal/qualifier/Qualifier.js";
import { toFloatAsString } from "../../internal/utils/toFloatAsString.js";
/**
 * @extends SDK.Action
 * @memberOf Actions.Transcode
 * @description Controls the keyframe interval of the delivered video.
 * @see Visit {@link Actions.Transcode|Transcode} for an example
 */
class KeyframeIntervalsAction extends Action {
    constructor(interval) {
        super();
        this._actionModel = { actionType: 'keyframeInterval' };
        this._actionModel.interval = interval;
        this.addQualifier(new Qualifier('ki', toFloatAsString(interval)));
    }
    static fromJson(actionModel) {
        const { interval } = actionModel;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        const result = new this(interval);
        return result;
    }
}
export default KeyframeIntervalsAction;
