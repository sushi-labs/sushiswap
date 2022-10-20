import { VideoSource } from "./source/sourceTypes/VideoSource.js";
/**
 * @description This namespace contains different sources that can be used as a transition between two videos
 * @memberOf Qualifiers
 * @namespace Transition
 * @see Visit {@link Actions.VideoEdit.concatenate|VideoEdit.concatenate} for an example
 */
/**
 * @description Returns an instance of a VideoSource
 * @memberOf Qualifiers.Transition
 * @param {string} publicID The publicID of the video to be used as a transition
 * @return {Qualifiers.Source.VideoSource}
 */
function videoSource(publicID) {
    return new VideoSource(publicID);
}
const Transition = { videoSource };
export { Transition, videoSource };
