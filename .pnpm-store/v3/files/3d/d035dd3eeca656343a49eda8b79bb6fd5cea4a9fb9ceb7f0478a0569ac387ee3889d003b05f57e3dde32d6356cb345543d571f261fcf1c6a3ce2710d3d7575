import BitRateAction from "./transcode/BitRateAction.js";
import AudioCodecAction from "./transcode/AudioCodecAction.js";
import AudioFrequencyAction from "./transcode/AudioFrequencyAction.js";
import FPSAction from "./transcode/FPSAction.js";
import FPSRangeAction from "./transcode/FPSRangeAction.js";
import KeyframeIntervalsAction from "./transcode/KeyframeIntervalsAction.js";
import StreamingProfileAction from "./transcode/StreamingProfile.js";
import ToAnimatedAction from "./transcode/ToAnimatedAction.js";
import { VideoCodecAction } from "./transcode/VideoCodecAction.js";
/**
 * @description Defines how to transcode a video to another format
 *
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/video_manipulation_and_delivery#transcoding_video_to_other_formats|Transcoding video to other formats}
 * @memberOf Actions
 * @namespace Transcode
 * @example
 * // See examples under each method
 */
/**
 * @summary action
 * @memberOf Actions.Transcode
 * @description Sets the audio sample frequency.
 *
 * <b>Learn more</b>: {@link https://cloudinary.com/documentation/audio_transformations#audio_frequency_control|Audio frequency control}
 * @param {AudioFrequencyType|string|number} freq The audio frequency.
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen/instance/Cloudinary";
 * import {FREQ11025} from '@cloudinary/url-gen/qualifiers/audioFrequency'
 * import {audioFrequency} from '@cloudinary/url-gen/actions/transcode'
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const video = yourCldInstance.video('dog');
 *
 * video.transcode(audioFrequency(FREQ11025()))
 * @return {Actions.Transcode.AudioFrequencyAction}
 *
 */
function audioFrequency(freq) {
    return new AudioFrequencyAction(freq);
}
/**
 * @summary action
 * @memberOf Actions.Transcode
 * @description Sets the audio codec or removes the audio channel.
 * @param {AudioCodecType | string} codec The audio codec or "none".
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen/instance/Cloudinary";
 * import {aac} from '@cloudinary/url-gen/qualifiers/audioCodec'
 * import {audioCodec} from '@cloudinary/url-gen/actions/transcode'
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const video = yourCldInstance.video('dog');
 *
 * video.transcode( audioCodec( aac() ) );
 * @return {Actions.Transcode.AudioCodecAction}
 */
function audioCodec(codec) {
    return new AudioCodecAction(codec);
}
/**
 * @summary action
 * @memberOf Actions.Transcode
 * @description Controls the video bitrate.
 * Supported codecs: h264, h265 (MPEG-4); vp8, vp9 (WebM).
 *
 * <b>Learn more:</b>
 * {@link https://cloudinary.com/documentation/video_manipulation_and_delivery#bitrate_control|Bitrate control}
 *
 * @param {string|number}  bitRate The number of bits used to represent the video data per second. By default the video
 *                             uses a variable bitrate (VBR), with this value indicating the maximum bitrate.
 *                             The value can be an integer e.g. 120000, or a string supporting "k" and "m"
 *                             (kilobits and megabits respectively) e.g. 250k or 2m.
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen/instance/Cloudinary";
 * import {bitRate} from '@cloudinary/url-gen/actions/transcode'
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const video = yourCldInstance.video('dog');
 *
 * video.transcode( bitRate(500).constant() );
 * @return {Actions.Transcode.BitRateAction}
 */
function bitRate(bitRate) {
    return new BitRateAction(bitRate);
}
/**
 * @summary action
 * @memberOf Actions.Transcode
 * @param {number} from frame rate
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen/instance/Cloudinary";
 * import {fps} from '@cloudinary/url-gen/actions/transcode'
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const video = yourCldInstance.video('dog');
 *
 * video.transcode( fps(15) );
 * @return {Actions.Transcode.FPSAction}
 */
function fps(from) {
    return new FPSAction(from);
}
/**
 * @summary action
 * @memberOf Actions.Transcode
 * @description Controls the range of acceptable FPS (Frames Per Second) to ensure that video (even when optimized) is
 * delivered with an expected FPS level (helps with sync to audio).
 * @param {number} from frame rate
 * @param {number} to frame rate
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen/instance/Cloudinary";
 * import {fpsRange} from '@cloudinary/url-gen/actions/transcode'
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const video = yourCldInstance.video('dog');
 *
 * video.transcode( fpsRange( 20, 25 ) );
 * @return {Actions.Transcode.FPSRangeAction}
 */
function fpsRange(from, to) {
    return new FPSRangeAction(from, to);
}
/**
 * @summary action
 * @memberOf Actions.Transcode
 * @description Sets the keyframe interval of the delivered video.
 * @param {number | string} interval The keyframe interval in seconds.
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen/instance/Cloudinary";
 * import {keyframeInterval} from '@cloudinary/url-gen/actions/transcode'
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const video = yourCldInstance.video('dog');
 *
 * video.transcode( keyframeInterval( 0.5 ) );
 * @return {Actions.Transcode.KeyframeIntervalsAction}
 */
function keyframeInterval(interval) {
    return new KeyframeIntervalsAction(interval);
}
/**
 * @summary action
 * @memberOf Actions.Transcode
 * @description Sets the streaming profile to apply to an HLS or MPEG-DASH adaptive bitrate streaming video.
 * The value can be one of the pre-defined streaming profiles or a custom-defined one.
 * You can use the streaming profiles methods of StreamingProfilesTrait to get a list of the available streaming
 * profiles or to create new custom profiles.
 * @param {string} profile The streaming profile.
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen/instance/Cloudinary";
 * import {fullHd} from "@cloudinary/url-gen/qualifiers/streamingProfile";
 * import {streamingProfile} from '@cloudinary/url-gen/actions/transcode'
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const video = yourCldInstance.video('dog');
 *
 * video.transcode( streamingProfile( fullHd() ) );
 * @return {Actions.Transcode.StreamingProfileAction}
 */
function streamingProfile(profile) {
    return new StreamingProfileAction(profile);
}
/**
 * @summary action
 * @memberOf Actions.Transcode
 * @description Converts a video to animated image.
 * @param {string | AnimatedFormatType} animatedFormat The streaming profile.
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen/instance/Cloudinary";
 * import {gif} from '@cloudinary/url-gen/qualifiers/animatedFormat'
 * import {toAnimated} from '@cloudinary/url-gen/actions/transcode'
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const video = yourCldInstance.video('dog');
 *
 * video.transcode( toAnimated( gif() ) );
 * @return {Actions.Transcode.ToAnimatedAction}
 */
function toAnimated(animatedFormat = '') {
    return new ToAnimatedAction(animatedFormat);
}
/**
 * @summary action
 * @memberOf Actions.Transcode
 * @description Controls the video codec.
 * @param {Qualifiers.VideoCodec.VideoCodecType | Qualifiers.VideoCodec.AdvVideoCodecType} videoCodecType CodecType
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {vp9} from '@cloudinary/url-gen/qualifiers/videoCodec'
 * import {videoCodec} from '@cloudinary/url-gen/actions/transcode'
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const video = yourCldInstance.video('dog');
 *
 * video.transcode( videoCodec( vp9() ) );
 * @return {Actions.Transcode.VideoCodecAction}
 */
function videoCodec(videoCodecType) {
    return new VideoCodecAction(videoCodecType);
}
const Transcode = { bitRate, audioCodec, audioFrequency, fps, fpsRange, keyframeInterval, streamingProfile, toAnimated, videoCodec };
export { Transcode, bitRate, audioCodec, audioFrequency, fps, fpsRange, keyframeInterval, streamingProfile, toAnimated, videoCodec };
