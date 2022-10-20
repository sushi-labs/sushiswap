import { Action } from "../../internal/Action.js";
import { Qualifier } from "../../internal/qualifier/Qualifier.js";
import { ACTION_TYPE_TO_STREAMING_PROFILE_MODE_MAP, STREAMING_PROFILE_TO_ACTION_TYPE_MAP } from "../../internal/internalConstants.js";
/**
 * @extends SDK.Action
 * @memberOf Actions.Transcode
 * @description The predefined streaming profiles.
 *
 * <b>Learn more</b>: {@link https://cloudinary.com/documentation/video_manipulation_and_delivery#predefined_streaming_profiles|Predefined streaming profiles}
 * @see Visit {@link Actions.Transcode|Transcode} for an example
 */
class StreamingProfileAction extends Action {
    constructor(profile) {
        super();
        this._actionModel = { actionType: 'streamingProfile' };
        this.addQualifier(new Qualifier('sp', profile));
        this._actionModel.profile = STREAMING_PROFILE_TO_ACTION_TYPE_MAP[profile] || profile;
    }
    static fromJson(actionModel) {
        const { profile } = actionModel;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        const profileType = ACTION_TYPE_TO_STREAMING_PROFILE_MODE_MAP[profile] || profile;
        const result = new this(profileType);
        return result;
    }
}
export default StreamingProfileAction;
