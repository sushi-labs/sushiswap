import { Action } from "../../internal/Action.js";
import { IAudioCodecActionModel } from "../../internal/models/ITranscodeActionModel.js";
import { IActionModel } from "../../internal/models/IActionModel.js";
/**
 * @extends SDK.Action
 * @memberOf Actions.Transcode
 * @description Controls the audio codec or removes the audio channel.
 *
 * <b>Learn more</b>: {@link https://cloudinary.com/documentation/audio_transformations#audio_frequency_control|Audio codec settings}
 * @see Visit {@link Actions.Transcode|Transcode} for an example
 */
declare class AudioCodecAction extends Action {
    protected _actionModel: IAudioCodecActionModel;
    constructor(codec: string);
    static fromJson(actionModel: IActionModel): AudioCodecAction;
}
export default AudioCodecAction;
