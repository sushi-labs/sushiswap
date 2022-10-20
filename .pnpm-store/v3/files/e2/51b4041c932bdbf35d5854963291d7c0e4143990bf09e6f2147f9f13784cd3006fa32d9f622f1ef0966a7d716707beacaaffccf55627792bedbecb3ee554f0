'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var qualifiers_videoCodecType_VideoCodecType = require('./videoCodecType/VideoCodecType.cjs');
require('../tslib.es6-f1398b83.cjs');
require('../internal/qualifier/Qualifier.cjs');
require('../internal/qualifier/QualifierValue.cjs');
require('../internal/models/QualifierModel.cjs');
require('../internal/models/qualifierToJson.cjs');
require('../internal/utils/unsupportedError.cjs');

/**
 * @description Determines the video codec to use.
 * @memberOf Qualifiers
 * @namespace VideoCodec
 * @see Visit {@link Actions.Transcode|Transcode} for an example
 */
/**
 * @summary qualifier
 * @description Auto video codec.
 * @memberOf Qualifiers.VideoCodec
 * @returns {Qualifiers.VideoCodec.VideoCodecType}
 */
function auto() {
    return new qualifiers_videoCodecType_VideoCodecType.VideoCodecType('auto');
}
/**
 * @summary qualifier
 * @description Video codec h264.
 * @memberOf Qualifiers.VideoCodec
 * @returns {Qualifiers.VideoCodec.AdvVideoCodecType}
 */
function h264() {
    return new qualifiers_videoCodecType_VideoCodecType.AdvVideoCodecType('h264');
}
/**
 * @summary qualifier
 * @description h265 video codec.
 * @memberOf Qualifiers.VideoCodec
 * @returns {Qualifiers.VideoCodec.VideoCodecType}
 */
function h265() {
    return new qualifiers_videoCodecType_VideoCodecType.VideoCodecType('h265');
}
/**
 * @summary qualifier
 * @description Video codec proRes (Apple ProRes 422 HQ).
 * @memberOf Qualifiers.VideoCodec
 * @returns {Qualifiers.VideoCodec.VideoCodecType}
 */
function proRes() {
    return new qualifiers_videoCodecType_VideoCodecType.VideoCodecType('prores');
}
/**
 * @summary qualifier
 * @description Video codec theora.
 * @memberOf Qualifiers.VideoCodec
 * @returns {Qualifiers.VideoCodec.VideoCodecType}
 */
function theora() {
    return new qualifiers_videoCodecType_VideoCodecType.VideoCodecType('theora');
}
/**
 * @summary qualifier
 * @description Video codec vp8.
 * @memberOf Qualifiers.VideoCodec
 * @returns {Qualifiers.VideoCodec.VideoCodecType}
 */
function vp8() {
    return new qualifiers_videoCodecType_VideoCodecType.VideoCodecType('vp8');
}
/**
 * @summary qualifier
 * @description Video codec vp9.
 * @memberOf Qualifiers.VideoCodec
 * @returns {Qualifiers.VideoCodec.VideoCodecType}
 */
function vp9() {
    return new qualifiers_videoCodecType_VideoCodecType.VideoCodecType('vp9');
}
var VIDEO_CODEC_TO_TRANSFORMATION = {
    'auto': auto(),
    'h264': h264(),
    'h265': h265(),
    'prores': proRes(),
    'theora': theora(),
    'vp8': vp8(),
    'vp9': vp9()
};
var VideoCodec = { auto: auto, h264: h264, h265: h265, proRes: proRes, theora: theora, vp8: vp8, vp9: vp9 };

exports.VIDEO_CODEC_TO_TRANSFORMATION = VIDEO_CODEC_TO_TRANSFORMATION;
exports.VideoCodec = VideoCodec;
exports.auto = auto;
exports.h264 = h264;
exports.h265 = h265;
exports.proRes = proRes;
exports.theora = theora;
exports.vp8 = vp8;
exports.vp9 = vp9;
