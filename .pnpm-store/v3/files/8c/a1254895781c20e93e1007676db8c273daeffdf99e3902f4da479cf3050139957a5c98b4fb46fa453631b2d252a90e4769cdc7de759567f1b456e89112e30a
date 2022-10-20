/**
 * @description Defines flags that you can use to alter the default transformation behavior.
 * @namespace Flag
 * @memberOf Qualifiers
 */
import { FlagQualifier } from "./flag/FlagQualifier.js";
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
declare function animated(): FlagQualifier;
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
declare function animatedWebP(): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description When used together with automatic quality (q_auto):
 * allow switching to PNG8 encoding if the quality algorithm decides that it's more efficient.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function anyFormat(): FlagQualifier;
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
declare function animatedPng(): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Trims pixels according to a clipping path included in the original image
 * (e.g., manually created using PhotoShop).
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function clip(): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Trims pixels according to a clipping path included in the original image (e.g., manually created
 * using PhotoShop)
 * using an evenodd clipping rule.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function clipEvenOdd(): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Instructs Cloudinary to clear all image meta-data (IPTC, Exif and XMP) while applying an incoming
 * transformation.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function forceStrip(): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Allows custom flag
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function custom(value: string): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Adds ICC color space metadata to the image, even when the original image doesn't contain any ICC data.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function forceIcc(): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Delivers the image as an attachment.
 * @param {string} filename The attachment's filename
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function attachment(filename?: string): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Returns metadata of the input asset and of the transformed output asset in JSON instead of the
 * transformed image.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function getInfo(): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Deliver an HLS adaptive bitrate streaming file as HLS v3 instead of the default version (HLS v4).
 * Delivering in this format requires a private CDN configuration.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function hlsv3(): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Sets the cache-control to immutable for the asset.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function immutableCache(): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description * Allows specifying only either width or height so the value of the second axis remains as is, and is not
 * recalculated to maintain the aspect ratio of the original image.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function ignoreInitialAspectRatio(): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Keeps the copyright related fields when stripping meta-data.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function keepAttribution(): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * Keep the Display Aspect Ratio metadata of the uploaded video (if it’s different from the current video
 * dimensions).
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function keepDar(): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Keeps all meta-data.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function keepIptc(): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Applies all chained transformations, until a transformation component that includes this flag, on the last added
 * overlay or underlay instead of applying on the containing image.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function layerApply(): FlagQualifier;
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
declare function lossy(): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Convert the audio channel to mono
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function mono(): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Used internally by Position within an Overlay, this flag will tile the overlay across your image.
 *
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/transformation_reference#fl_no_overflow|Overflow in overlays}
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function noOverflow(): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Don't stream a video that is currently being generated on the fly. Wait until the video is fully generated.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function noStream(): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Generate PNG images in the png24 format.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function png24(): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Generate PNG images in the png32 format.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function png32(): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Generate PNG images in the PNG8 format.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function png8(): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description When used with automatic fetch_format (f_auto): ensures that images with a transparency channel will be
 * delivered in PNG format.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function preserveTransparency(): FlagQualifier;
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
declare function progressive(mode?: FlagQualifier | string): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Modifies percentage-based width & height parameters of overlays and underlays (e.g., 1.0) to be relative to the overlaid region
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function regionRelative(): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Reduces the image to one flat pixelated layer (as opposed to the default vector based graphic) in
 * order to enable
 * PDF resizing and overlay manipulations.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function rasterize(): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Modifies percentage-based width & height parameters of overlays and underlays (e.g., 1.0) to be relative to the containing image instead of the added layer.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function relative(): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Instructs Cloudinary to run a sanitizer on the image (relevant only for the SVG format).
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function sanitize(): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Splices the video stipulated as an overlay on to the end of the container video instead of adding it as an
 * overlay.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function splice(): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Instructs Cloudinary to clear all ICC color profile data included with the image.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function stripProfile(): FlagQualifier;
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
declare function streamingAttachment(filename: string): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Generates TIFF images using LZW compression and in the TIFF8 format.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function tiff8Lzw(): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Used internally by Position within an Overlay, this flag will tile the overlay across your image.
 *
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_transformations#tiling_overlays|Tiling overlay}
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function tiled(): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Truncate (trim) a video file based on the start time defined in the metadata (relevant only where the metadata
 * includes a directive to play only a section of the video).
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function truncateTS(): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description Create a waveform image (in the format specified by the file extension) from the audio or video file.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function waveform(): FlagQualifier;
/**
 * @summary qualifier
 * @memberOf Qualifiers.Flag
 * @description A qualifier that ensures that an alpha channel is not applied to a TIFF image if it is a mask channel.
 * @return {Qualifiers.Flag.FlagQualifier}
 */
declare function ignoreMaskChannels(): FlagQualifier;
declare const Flag: {
    animated: typeof animated;
    anyFormat: typeof anyFormat;
    animatedPng: typeof animatedPng;
    animatedWebP: typeof animatedWebP;
    clipEvenOdd: typeof clipEvenOdd;
    lossy: typeof lossy;
    preserveTransparency: typeof preserveTransparency;
    png8: typeof png8;
    png24: typeof png24;
    png32: typeof png32;
    progressive: typeof progressive;
    rasterize: typeof rasterize;
    sanitize: typeof sanitize;
    stripProfile: typeof stripProfile;
    tiff8Lzw: typeof tiff8Lzw;
    attachment: typeof attachment;
    forceIcc: typeof forceIcc;
    forceStrip: typeof forceStrip;
    getInfo: typeof getInfo;
    immutableCache: typeof immutableCache;
    keepAttribution: typeof keepAttribution;
    keepIptc: typeof keepIptc;
    custom: typeof custom;
    streamingAttachment: typeof streamingAttachment;
    hlsv3: typeof hlsv3;
    keepDar: typeof keepDar;
    noStream: typeof noStream;
    mono: typeof mono;
    layerApply: typeof layerApply;
    relative: typeof relative;
    regionRelative: typeof regionRelative;
    splice: typeof splice;
    truncateTS: typeof truncateTS;
    waveform: typeof waveform;
    ignoreInitialAspectRatio: typeof ignoreInitialAspectRatio;
    clip: typeof clip;
    tiled: typeof tiled;
    noOverflow: typeof noOverflow;
    ignoreMaskChannels: typeof ignoreMaskChannels;
};
export { Flag, animated, anyFormat, animatedPng, animatedWebP, clipEvenOdd, lossy, preserveTransparency, png8, png24, png32, progressive, rasterize, sanitize, stripProfile, tiff8Lzw, attachment, forceIcc, forceStrip, getInfo, immutableCache, keepAttribution, keepIptc, custom, streamingAttachment, hlsv3, keepDar, noStream, mono, layerApply, relative, regionRelative, splice, truncateTS, waveform, ignoreInitialAspectRatio, clip, tiled, noOverflow, ignoreMaskChannels };
