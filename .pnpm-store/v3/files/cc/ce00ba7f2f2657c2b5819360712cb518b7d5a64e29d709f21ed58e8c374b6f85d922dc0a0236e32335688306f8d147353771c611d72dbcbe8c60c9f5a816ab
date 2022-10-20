import { Action } from "../../internal/Action.js";
import { AdvVideoCodecType, VideoCodecType } from "../../qualifiers/videoCodecType/VideoCodecType.js";
import { IVideoCodecActionModel } from "../../internal/models/ITranscodeActionModel.js";
import { IActionModel } from "../../internal/models/IActionModel.js";
/**
 * @extends SDK.Action
 * @memberOf Actions.Transcode
 * @description Converts a video to an animated webp or gif.
 * @see Visit {@link Actions.Transcode|Transcode} for an example
 */
declare class VideoCodecAction extends Action {
    protected _actionModel: IVideoCodecActionModel;
    constructor(videoCodecTypeQualifier: VideoCodecType | AdvVideoCodecType);
    static fromJson(actionModel: IActionModel): VideoCodecAction;
}
export { VideoCodecAction };
