import { AdvVideoCodecType, VideoCodecType } from "./videoCodecType/VideoCodecType.js";
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
    return new VideoCodecType('auto');
}
/**
 * @summary qualifier
 * @description Video codec h264.
 * @memberOf Qualifiers.VideoCodec
 * @returns {Qualifiers.VideoCodec.AdvVideoCodecType}
 */
function h264() {
    return new AdvVideoCodecType('h264');
}
/**
 * @summary qualifier
 * @description h265 video codec.
 * @memberOf Qualifiers.VideoCodec
 * @returns {Qualifiers.VideoCodec.VideoCodecType}
 */
function h265() {
    return new VideoCodecType('h265');
}
/**
 * @summary qualifier
 * @description Video codec proRes (Apple ProRes 422 HQ).
 * @memberOf Qualifiers.VideoCodec
 * @returns {Qualifiers.VideoCodec.VideoCodecType}
 */
function proRes() {
    return new VideoCodecType('prores');
}
/**
 * @summary qualifier
 * @description Video codec theora.
 * @memberOf Qualifiers.VideoCodec
 * @returns {Qualifiers.VideoCodec.VideoCodecType}
 */
function theora() {
    return new VideoCodecType('theora');
}
/**
 * @summary qualifier
 * @description Video codec vp8.
 * @memberOf Qualifiers.VideoCodec
 * @returns {Qualifiers.VideoCodec.VideoCodecType}
 */
function vp8() {
    return new VideoCodecType('vp8');
}
/**
 * @summary qualifier
 * @description Video codec vp9.
 * @memberOf Qualifiers.VideoCodec
 * @returns {Qualifiers.VideoCodec.VideoCodecType}
 */
function vp9() {
    return new VideoCodecType('vp9');
}
export const VIDEO_CODEC_TO_TRANSFORMATION = {
    'auto': auto(),
    'h264': h264(),
    'h265': h265(),
    'prores': proRes(),
    'theora': theora(),
    'vp8': vp8(),
    'vp9': vp9()
};
const VideoCodec = { auto, h264, h265, proRes, theora, vp8, vp9 };
export { VideoCodec, auto, h264, h265, proRes, theora, vp8, vp9 };
