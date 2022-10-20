import { BlendModeQualifier } from "./blendMode/BlendModeQualifier.js";
/**
 * @description Defines the mode of blending to use when overlaying an image.
 *
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_transformations#overlay_blending_effects|Overlay blending effects}
 * @namespace BlendMode
 * @memberOf Qualifiers
 * @see To be used with an {@link Actions.Overlay|Overlay}
 */
/**
 * @summary qualifier
 * @memberOf Qualifiers.BlendMode
 * @description Add an overlay image blended using the 'multiply' blend mode.
 * @return {Qualifiers.BlendMode.BlendModeQualifier}
 */
function multiply() {
    return new BlendModeQualifier('multiply');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.BlendMode
 * @description Add an overlay image blended using the 'screen' blend mode.
 * @return {Qualifiers.BlendMode.BlendModeQualifier}
 */
function screen() {
    return new BlendModeQualifier('screen');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.BlendMode
 * @description Add an overlay image blended using the 'overlay' blend mode.
 * @return {Qualifiers.BlendMode.BlendModeQualifier}
 */
function overlay() {
    return new BlendModeQualifier('overlay');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.BlendMode
 * @description Add an overlay image blended using the 'mask' blend mode.
 * @return {Qualifiers.BlendMode.BlendModeQualifier}
 */
function mask() {
    return new BlendModeQualifier('mask');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.BlendMode
 * @description Add an overlay image blended using the 'antiRemoval' blend mode.
 * @param {number} lvl 	The level of distortion. (Range: 1 to 100, Server default: 50)
 * @return {Qualifiers.BlendMode.BlendModeQualifier}
 */
function antiRemoval(lvl) {
    return new BlendModeQualifier('anti_removal', lvl);
}
const BlendMode = {
    screen,
    multiply,
    overlay,
    mask,
    antiRemoval
};
export { BlendMode, screen, multiply, overlay, mask, antiRemoval };
