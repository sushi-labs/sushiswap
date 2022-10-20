'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var qualifiers_flag_FlagQualifier = require('./flag/FlagQualifier.cjs');
require('../tslib.es6-f1398b83.cjs');
require('../internal/qualifier/QualifierValue.cjs');
require('../internal/qualifier/Qualifier.cjs');
require('../internal/models/QualifierModel.cjs');
require('../internal/models/qualifierToJson.cjs');
require('../internal/utils/unsupportedError.cjs');

/**
 * @description Defines flags that you can use to alter the default transformation behavior.
 * @namespace Flag
 * @memberOf Qualifiers
 */
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Used when delivering a video file as an image format that supports animation, such as animated WebP.
 * Plays all frames rather than just delivering the first one as a static image.
 * Use this flag in addition to the flag or parameter controlling the delivery format,
 * for example f_auto or fl_awebp.

 * Note: When delivering a video in GIF format, it is delivered as an animated GIF by default and this flag is not
 * necessary. To deliver a single frame of a video in GIF format, use the page parameter.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function animated() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('animated');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description When converting animated images to WebP format, generate an animated WebP from all the frames in the
 * original
 * animated file instead of only from the first still frame.
 *
 * Note that animated WebPs are not supported in all browsers and versions.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function animatedWebP() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('awebp');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description When used together with automatic quality (q_auto):
 * allow switching to PNG8 encoding if the quality algorithm decides that it's more efficient.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function anyFormat() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('any_format');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description When converting animated images to PNG format, generates an animated PNG from all the frames in the
 * original
 * animated file instead of only from the first still frame.
 *
 * Note that animated PNGs are not supported in all browsers and versions.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function animatedPng() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('apng');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Trims pixels according to a clipping path included in the original image
 * (e.g., manually created using PhotoShop).
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function clip() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('clip');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Trims pixels according to a clipping path included in the original image (e.g., manually created
 * using PhotoShop)
 * using an evenodd clipping rule.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function clipEvenOdd() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('clip_evenodd');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Instructs Cloudinary to clear all image meta-data (IPTC, Exif and XMP) while applying an incoming
 * transformation.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function forceStrip() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('force_strip');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Allows custom flag
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function custom(value) {
    return new qualifiers_flag_FlagQualifier.FlagQualifier(value);
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Adds ICC color space metadata to the image, even when the original image doesn't contain any ICC data.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function forceIcc() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('force_icc');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Delivers the image as an attachment.
 * @param {string} filename The attachment's filename
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function attachment(filename) {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('attachment', filename);
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Returns metadata of the input asset and of the transformed output asset in JSON instead of the
 * transformed image.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function getInfo() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('getinfo');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Deliver an HLS adaptive bitrate streaming file as HLS v3 instead of the default version (HLS v4).
 * Delivering in this format requires a private CDN configuration.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function hlsv3() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('hlsv3');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Sets the cache-control to immutable for the asset.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function immutableCache() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('immutable_cache');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description * Allows specifying only either width or height so the value of the second axis remains as is, and is not
 * recalculated to maintain the aspect ratio of the original image.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function ignoreInitialAspectRatio() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('ignore_aspect_ratio');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Keeps the copyright related fields when stripping meta-data.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function keepAttribution() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('keep_attribution');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * Keep the Display Aspect Ratio metadata of the uploaded video (if it’s different from the current video
 * dimensions).
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function keepDar() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('keep_dar');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Keeps all meta-data.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function keepIptc() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('keep_iptc');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Applies all chained transformations, until a transformation component that includes this flag, on the last added
 * overlay or underlay instead of applying on the containing image.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function layerApply() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('layer_apply');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Automatically use lossy compression when delivering animated GIF files.
 *
 * This flag can also be used as a conditional flag for delivering PNG files: it tells Cloudinary to deliver the
 * image in PNG format (as requested) unless there is no transparency channel - in which case deliver in JPEG
 * format.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function lossy() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('lossy');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Convert the audio channel to mono
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function mono() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('mono');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Used internally by Position within an Overlay, this flag will tile the overlay across your image.
 *
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/transformation_reference#fl_no_overflow|Overflow in overlays}
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function noOverflow() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('no_overflow');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Don't stream a video that is currently being generated on the fly. Wait until the video is fully generated.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function noStream() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('no_stream');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Generate PNG images in the png24 format.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function png24() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('png24');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Generate PNG images in the png32 format.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function png32() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('png32');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Generate PNG images in the PNG8 format.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function png8() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('png8');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description When used with automatic fetch_format (f_auto): ensures that images with a transparency channel will be
 * delivered in PNG format.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function preserveTransparency() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('preserve_transparency');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Generates a JPG image using the progressive (interlaced) JPG format.
 *
 * This format allows the browser to quickly show a low-quality rendering of the image until the full-quality
 * image is loaded.
 *
 * @param {string} mode? The mode to determine a specific progressive outcome as follows:
 * * semi - A smart optimization of the decoding time, compression level and progressive rendering
 *          (less iterations). This is the default mode when using q_auto.
 * * steep - Delivers a preview very quickly, and in a single later phase improves the image to
 *           the required resolution.
 * * none  - Use this to deliver a non-progressive image. This is the default mode when setting
 *           a specific value for quality.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function progressive(mode) {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('progressive', mode);
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Modifies percentage-based width & height parameters of overlays and underlays (e.g., 1.0) to be relative to the overlaid region
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function regionRelative() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('region_relative');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Reduces the image to one flat pixelated layer (as opposed to the default vector based graphic) in
 * order to enable
 * PDF resizing and overlay manipulations.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function rasterize() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('rasterize');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Modifies percentage-based width & height parameters of overlays and underlays (e.g., 1.0) to be relative to the containing image instead of the added layer.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function relative() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('relative');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Instructs Cloudinary to run a sanitizer on the image (relevant only for the SVG format).
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function sanitize() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('sanitize');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Splices the video stipulated as an overlay on to the end of the container video instead of adding it as an
 * overlay.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function splice() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('splice');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Instructs Cloudinary to clear all ICC color profile data included with the image.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function stripProfile() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('strip_profile');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description If the requested video transformation has already been generated, this flag works identically to
 * Flag::attachment.
 *
 *  However, if the video transformation is being requested for the first time, this flag causes the video download
 * to begin immediately, streaming it as a fragmented video file.
 *
 * In contrast, if the regular fl_attachment flag is used when a user requests a new video transformation,
 * the download will begin only after the complete transformed video has been generated.
 *
 * Most standard video players successfully play fragmented video files without issue.
 *
 * @param {string} filename The attachment's filename
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function streamingAttachment(filename) {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('streaming_attachment', filename);
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Generates TIFF images using LZW compression and in the TIFF8 format.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function tiff8Lzw() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('tiff8_lzw');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Used internally by Position within an Overlay, this flag will tile the overlay across your image.
 *
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_transformations#tiling_overlays|Tiling overlay}
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function tiled() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('tiled');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Truncate (trim) a video file based on the start time defined in the metadata (relevant only where the metadata
 * includes a directive to play only a section of the video).
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function truncateTS() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('truncate_ts');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Create a waveform image (in the format specified by the file extension) from the audio or video file.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function waveform() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('waveform');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description A qualifier that ensures that an alpha channel is not applied to a TIFF image if it is a mask channel.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
function ignoreMaskChannels() {
    return new qualifiers_flag_FlagQualifier.FlagQualifier('ignore_mask_channels');
}
var Flag = {
    animated: animated, anyFormat: anyFormat, animatedPng: animatedPng, animatedWebP: animatedWebP,
    clipEvenOdd: clipEvenOdd, lossy: lossy, preserveTransparency: preserveTransparency, png8: png8, png24: png24, png32: png32, progressive: progressive, rasterize: rasterize,
    sanitize: sanitize, stripProfile: stripProfile, tiff8Lzw: tiff8Lzw, attachment: attachment, forceIcc: forceIcc, forceStrip: forceStrip, getInfo: getInfo, immutableCache: immutableCache,
    keepAttribution: keepAttribution, keepIptc: keepIptc, custom: custom, streamingAttachment: streamingAttachment, hlsv3: hlsv3, keepDar: keepDar, noStream: noStream, mono: mono,
    layerApply: layerApply, relative: relative, regionRelative: regionRelative, splice: splice, truncateTS: truncateTS, waveform: waveform, ignoreInitialAspectRatio: ignoreInitialAspectRatio, clip: clip,
    tiled: tiled, noOverflow: noOverflow, ignoreMaskChannels: ignoreMaskChannels
};

exports.Flag = Flag;
exports.animated = animated;
exports.animatedPng = animatedPng;
exports.animatedWebP = animatedWebP;
exports.anyFormat = anyFormat;
exports.attachment = attachment;
exports.clip = clip;
exports.clipEvenOdd = clipEvenOdd;
exports.custom = custom;
exports.forceIcc = forceIcc;
exports.forceStrip = forceStrip;
exports.getInfo = getInfo;
exports.hlsv3 = hlsv3;
exports.ignoreInitialAspectRatio = ignoreInitialAspectRatio;
exports.ignoreMaskChannels = ignoreMaskChannels;
exports.immutableCache = immutableCache;
exports.keepAttribution = keepAttribution;
exports.keepDar = keepDar;
exports.keepIptc = keepIptc;
exports.layerApply = layerApply;
exports.lossy = lossy;
exports.mono = mono;
exports.noOverflow = noOverflow;
exports.noStream = noStream;
exports.png24 = png24;
exports.png32 = png32;
exports.png8 = png8;
exports.preserveTransparency = preserveTransparency;
exports.progressive = progressive;
exports.rasterize = rasterize;
exports.regionRelative = regionRelative;
exports.relative = relative;
exports.sanitize = sanitize;
exports.splice = splice;
exports.streamingAttachment = streamingAttachment;
exports.stripProfile = stripProfile;
exports.tiff8Lzw = tiff8Lzw;
exports.tiled = tiled;
exports.truncateTS = truncateTS;
exports.waveform = waveform;
