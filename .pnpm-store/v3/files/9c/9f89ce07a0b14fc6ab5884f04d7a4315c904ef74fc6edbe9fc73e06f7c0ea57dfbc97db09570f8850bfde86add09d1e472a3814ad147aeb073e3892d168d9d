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
declare function mute(): string;
/**
 * @summary qualifier
 * @description Increases or decreases the volume by a percentage of the current volume.
 *
 * @memberOf Qualifiers.Volume
 * @param {string|number} percent The percentage change of volume (Range: -100 to 400).
 * @return string
 */
declare function byPercent(percent: string | number): string;
/**
 * @summary qualifier
 * @description Increases or decreases the volume by the specified number of decibels.
 *
 * @memberOf Qualifiers.Volume
 * @param {string|number} decibel The offset in dB.
 * @return string
 */
declare function byDecibels(decibel: string | number): string;
declare const Volume: {
    mute: typeof mute;
    byPercent: typeof byPercent;
    byDecibels: typeof byDecibels;
};
export { Volume, mute, byPercent, byDecibels };
