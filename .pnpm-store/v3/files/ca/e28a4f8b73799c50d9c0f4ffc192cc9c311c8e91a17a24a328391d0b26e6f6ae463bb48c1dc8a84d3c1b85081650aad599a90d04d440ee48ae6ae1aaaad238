import { Action } from "../../internal/Action.js";
import { Qualifier } from "../../internal/qualifier/Qualifier.js";
/**
 * @extends SDK.Action
 * @memberOf Actions.Transcode
 * @description Controls the audio codec or removes the audio channel.
 *
 * <b>Learn more</b>: {@link https://cloudinary.com/documentation/audio_transformations#audio_frequency_control|Audio codec settings}
 * @see Visit {@link Actions.Transcode|Transcode} for an example
 */
class AudioCodecAction extends Action {
    constructor(codec) {
        super();
        this._actionModel = { actionType: 'audioCodec' };
        this.addQualifier(new Qualifier('ac', codec));
        this._actionModel.audioCodec = codec;
    }
    static fromJson(actionModel) {
        const { audioCodec } = actionModel;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        const result = new this(audioCodec);
        return result;
    }
}
export default AudioCodecAction;
