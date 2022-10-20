import { VideoSource } from "./source/sourceTypes/VideoSource.js";
import { ImageSource } from "./source/sourceTypes/ImageSource.js";
import { FetchSource } from "./source/sourceTypes/FetchSource.js";
/**
 * @description This namespace contains different sources that can be used when concatenating to a video
 * @memberOf Qualifiers
 * @namespace Concatenate
 * @see Visit {@link Actions.VideoEdit.concatenate|VideoEdit.concatenate} for an example
 */
/**
 * @summary qualifier
 * @description Returns an instance of an ImageSource
 * @memberOf Qualifiers.Concatenate
 * @param {string} publicID The publicID of the image to be used to concatenate
 * @return {Source.ImageSource}
 */
function imageSource(publicID) {
    return new ImageSource(publicID);
}
/**
 * @summary qualifier
 * @description Returns an instance of a VideoSource
 * @memberOf Qualifiers.Concatenate
 * @param {string} publicID The publicID of the video to be used to concatenate
 * @return {Source.VideoSource}
 */
function videoSource(publicID) {
    return new VideoSource(publicID);
}
/**
 * @summary qualifier
 * @description Returns an instance of a FetchSource
 * @memberOf Qualifiers.Concatenate
 * @param {string} remoteURL The URL of the remote asset to fetch as and to be used to concatenate
 * @return {Source.FetchSource}
 */
function fetchSource(remoteURL) {
    return new FetchSource(remoteURL);
}
const Concatenate = { imageSource, videoSource, fetchSource };
export { Concatenate, imageSource, videoSource, fetchSource };
