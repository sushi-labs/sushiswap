import { VideoSource } from "./source/sourceTypes/VideoSource.js";
import { ImageSource } from "./source/sourceTypes/ImageSource.js";
import { SubtitlesSource } from "./source/sourceTypes/SubtitlesSource.js";
import { FetchSource } from "./source/sourceTypes/FetchSource.js";
import { TextSource } from "./source/sourceTypes/TextSource.js";
/**
 * @description This namespace contains different sources that can be used in overlays and underlays
 * @memberOf Qualifiers
 * @namespace Source
 * @see {@link Actions.Overlay| The overlay action}
 * @see {@link Actions.Underlay| The underlay action}
 */
/**
 * @summary qualifier
 * @description Returns an instance of an ImageSource
 * @memberOf Qualifiers.Source
 * @param {string} publicID The publicID of the image to be used as a layer
 * @return {Qualifiers.Source.ImageSource}
 */
function image(publicID) {
    return new ImageSource(publicID);
}
/**
 * @summary qualifier
 * @description Returns an instance of a TextSource
 * @memberOf Qualifiers.Source
 * @param {string} text The text to display.
 * @param {TextStyle | string} textStyle The textStyle to use with the text in the layer
 * @return {Qualifiers.Source.TextSource}
 */
function text(text, textStyle) {
    return new TextSource(text, textStyle);
}
/**
 * @summary qualifier
 * @description Returns an instance of a VideoSource
 * @memberOf Qualifiers.Source
 * @param {string} publicID The publicID of the video to be used as a layer
 * @return {Qualifiers.Source.VideoSource}
 */
function video(publicID) {
    return new VideoSource(publicID);
}
/**
 * @summary qualifier
 * @description Returns an instance of an VideoSource
 * @memberOf Qualifiers.Source
 * @param {string} fileName The publicID of the video to be used as a layer
 * @return {Qualifiers.Source.VideoSource}
 */
function subtitles(fileName) {
    return new SubtitlesSource(fileName);
}
/**
 * @summary qualifier
 * @description Returns an instance of a FetchSource
 * @memberOf Qualifiers.Source
 * @param {string} remoteURL The URL of the remote asset to fetch as a layer
 * @return {Qualifiers.Source.FetchSource}
 */
function fetch(remoteURL) {
    return new FetchSource(remoteURL);
}
const Source = { image, text, video, subtitles, fetch };
export { Source, image, text, video, subtitles, fetch };
