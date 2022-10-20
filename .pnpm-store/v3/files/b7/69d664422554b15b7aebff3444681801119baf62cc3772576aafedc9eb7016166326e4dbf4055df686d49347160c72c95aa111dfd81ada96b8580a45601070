'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * @description Controls the volume of an audio or video file.
 * @namespace Volume
 * @memberOf Qualifiers
 * @see Visit {@link Actions.VideoEdit.concatenate|VideoEdit.concatenate} for an example
 */
/**
 * @summary qualifier
 * @description Mutes the volume.
 *
 * You can use this on the base video to deliver a video without sound, or with a video overlay
 * to ensure that only the sound from the base video plays.
 *
 * @memberOf Qualifiers.Volume
 * @return string
 */
function mute() {
    return 'mute';
}
/**
 * @summary qualifier
 * @description Increases or decreases the volume by a percentage of the current volume.
 *
 * @memberOf Qualifiers.Volume
 * @param {string|number} percent The percentage change of volume (Range: -100 to 400).
 * @return string
 */
function byPercent(percent) {
    return "" + percent;
}
/**
 * @summary qualifier
 * @description Increases or decreases the volume by the specified number of decibels.
 *
 * @memberOf Qualifiers.Volume
 * @param {string|number} decibel The offset in dB.
 * @return string
 */
function byDecibels(decibel) {
    return decibel + "db";
}
var Volume = { mute: mute, byPercent: byPercent, byDecibels: byDecibels };

exports.Volume = Volume;
exports.byDecibels = byDecibels;
exports.byPercent = byPercent;
exports.mute = mute;
