'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
var qualifiers_videoCodecType_VideoCodecType = require('../../qualifiers/videoCodecType/VideoCodecType.cjs');
var qualifiers_videoCodec = require('../../qualifiers/videoCodec.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/qualifier/QualifierValue.cjs');
require('../../internal/qualifier/Qualifier.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');

/**
 * @extends SDK.Action
 * @memberOf Actions.Transcode
 * @description Converts a video to an animated webp or gif.
 * @see Visit {@link Actions.Transcode|Transcode} for an example
 */
var VideoCodecAction = /** @class */ (function (_super) {
    tslib_es6.__extends(VideoCodecAction, _super);
    function VideoCodecAction(videoCodecTypeQualifier) {
        var _this = _super.call(this) || this;
        _this._actionModel = { actionType: 'videoCodec' };
        _this._actionModel.videoCodec = { videoCodecName: videoCodecTypeQualifier.getType() };
        if (videoCodecTypeQualifier instanceof qualifiers_videoCodecType_VideoCodecType.AdvVideoCodecType) {
            if (videoCodecTypeQualifier.getProfile()) {
                _this._actionModel.videoCodec = tslib_es6.__assign({ profile: videoCodecTypeQualifier.getProfile() }, _this._actionModel.videoCodec);
            }
            if (videoCodecTypeQualifier.getLevel()) {
                _this._actionModel.videoCodec = tslib_es6.__assign({ level: videoCodecTypeQualifier.getLevel() }, _this._actionModel.videoCodec);
            }
        }
        _this.addQualifier(videoCodecTypeQualifier);
        return _this;
    }
    VideoCodecAction.fromJson = function (actionModel) {
        var videoCodec = actionModel.videoCodec;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        var result = new this(qualifiers_videoCodec.VIDEO_CODEC_TO_TRANSFORMATION[videoCodec.videoCodecName]);
        //@ts-ignore
        videoCodec.profile && new this(qualifiers_videoCodec.VIDEO_CODEC_TO_TRANSFORMATION[videoCodec.videoCodecName].profile(videoCodec.profile));
        //@ts-ignore
        videoCodec.level && new this(qualifiers_videoCodec.VIDEO_CODEC_TO_TRANSFORMATION[videoCodec.videoCodecName].level(videoCodec.level));
        return result;
    };
    return VideoCodecAction;
}(internal_Action.Action));

exports.VideoCodecAction = VideoCodecAction;
