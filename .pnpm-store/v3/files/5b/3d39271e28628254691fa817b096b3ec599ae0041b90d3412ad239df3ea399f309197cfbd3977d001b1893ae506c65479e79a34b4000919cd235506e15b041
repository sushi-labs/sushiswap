import { Action } from "../../internal/Action.js";
import { AdvVideoCodecType } from "../../qualifiers/videoCodecType/VideoCodecType.js";
import { VIDEO_CODEC_TO_TRANSFORMATION } from "../../qualifiers/videoCodec.js";
/**
 * @extends SDK.Action
 * @memberOf Actions.Transcode
 * @description Converts a video to an animated webp or gif.
 * @see Visit {@link Actions.Transcode|Transcode} for an example
 */
class VideoCodecAction extends Action {
    constructor(videoCodecTypeQualifier) {
        super();
        this._actionModel = { actionType: 'videoCodec' };
        this._actionModel.videoCodec = { videoCodecName: videoCodecTypeQualifier.getType() };
        if (videoCodecTypeQualifier instanceof AdvVideoCodecType) {
            if (videoCodecTypeQualifier.getProfile()) {
                this._actionModel.videoCodec = Object.assign({ profile: videoCodecTypeQualifier.getProfile() }, this._actionModel.videoCodec);
            }
            if (videoCodecTypeQualifier.getLevel()) {
                this._actionModel.videoCodec = Object.assign({ level: videoCodecTypeQualifier.getLevel() }, this._actionModel.videoCodec);
            }
        }
        this.addQualifier(videoCodecTypeQualifier);
    }
    static fromJson(actionModel) {
        const { videoCodec } = actionModel;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        const result = new this(VIDEO_CODEC_TO_TRANSFORMATION[videoCodec.videoCodecName]);
        //@ts-ignore
        videoCodec.profile && new this(VIDEO_CODEC_TO_TRANSFORMATION[videoCodec.videoCodecName].profile(videoCodec.profile));
        //@ts-ignore
        videoCodec.level && new this(VIDEO_CODEC_TO_TRANSFORMATION[videoCodec.videoCodecName].level(videoCodec.level));
        return result;
    }
}
export { VideoCodecAction };
