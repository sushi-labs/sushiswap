'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var actions_adjust_FillLightAction = require('./adjust/FillLightAction.cjs');
var actions_adjust_RecolorAction = require('./adjust/RecolorAction.cjs');
var actions_adjust_OpacityAdjustAction = require('./adjust/OpacityAdjustAction.cjs');
var actions_adjust_By3dLutAction = require('./adjust/By3dLutAction.cjs');
var actions_adjust_ImproveAction = require('./adjust/ImproveAction.cjs');
var actions_adjust_ReplaceColorAction = require('./adjust/ReplaceColorAction.cjs');
var actions_effect_EffectActions_EffectActionWithLevel = require('./effect/EffectActions/EffectActionWithLevel.cjs');
var actions_effect_EffectActions_EffectActionWithStrength = require('./effect/EffectActions/EffectActionWithStrength.cjs');
var actions_effect_EffectActions_EffectActionWithBlend = require('./effect/EffectActions/EffectActionWithBlend.cjs');
var actions_adjust_simple_ViesusCorrectAdjustAction = require('./adjust/simple/ViesusCorrectAdjustAction.cjs');
var actions_effect_EffectActions_SimpleEffectAction = require('./effect/EffectActions/SimpleEffectAction.cjs');
require('../tslib.es6-f1398b83.cjs');
require('../internal/Action.cjs');
require('../qualifiers/flag/FlagQualifier.cjs');
require('../internal/qualifier/QualifierValue.cjs');
require('../internal/qualifier/Qualifier.cjs');
require('../internal/models/QualifierModel.cjs');
require('../internal/models/qualifierToJson.cjs');
require('../internal/utils/unsupportedError.cjs');
require('../internal/utils/dataStructureUtils.cjs');
require('../internal/models/ActionModel.cjs');
require('../internal/models/actionToJson.cjs');
require('./effect/EffectActions/LeveledEffectAction.cjs');
require('../internal/internalConstants.cjs');
require('../internal/utils/objectFlip.cjs');

/**
 * @summary action
 * @memberOf Actions.Adjust
 * @description Blends an image with one or more tint colors at a specified intensity. </br>
 *              You can optionally equalize colors before tinting and specify gradient blend positioning per color.</br>
 *              <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_transformations#tint_effects|Deliver selected layers of a PSD image}
 * @param {string} value The full tint effect value, provided as a string.
 * @return {Actions.Effect.SimpleEffectAction}
 */
function tint(value) {
    if (value === void 0) { value = ''; }
    return new actions_effect_EffectActions_SimpleEffectAction.SimpleEffectAction('tint', value);
}
/**
 * @summary action
 * @memberOf Actions.Adjust
 * @description Adjusts the image or video brightness.
 * @param {number} level The level of brightness. (Range: -99 to 100, Server default: 80)
 * @return {Actions.Effect.EffectActionWithLevel}
 */
function brightness(level) {
    return new actions_effect_EffectActions_EffectActionWithLevel.EffectActionWithLevel('brightness', level);
}
/**
 * @summary action
 * @memberOf Actions.Adjust
 * @description
 * Enhances an image to its best visual quality with the Viesus Automatic Image Enhancement add-on.</br>
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/viesus_automatic_image_enhancement_addon|Viesus Automatic Image Enhancement.}
 * @return {Actions.Adjust.ViesusCorrectAdjustAction}
 */
function viesusCorrect() {
    return new actions_adjust_simple_ViesusCorrectAdjustAction.ViesusCorrectAdjustAction();
}
/**
 * @summary action
 * @memberOf Actions.Adjust
 * @description Adjusts the image's red channel.
 * @param {number} level The level of red. (Range: -100 to 100, Server default: 0)
 * @return {Actions.Effect.EffectActionWithLevel}
 */
function red(level) {
    return new actions_effect_EffectActions_EffectActionWithLevel.EffectActionWithLevel('red', level);
}
/**
 * @summary action
 * @description Applies a sharpening filter to the image.
 * @memberOf Actions.Adjust
 * @param {number} strength The strength of the filter. (Range: 1 to 2000, Server default: 100)
 * @return {Actions.Effect.EffectActionWithStrength}
 */
function sharpen(strength) {
    return new actions_effect_EffectActions_EffectActionWithStrength.EffectActionWithStrength('sharpen', strength);
}
/**
 * @summary action
 * @memberOf Actions.Adjust
 * @description Adjusts the color saturation.
 * @param {number} level The level of color saturation (Range: -100 to 100, Server default: 80).
 * @return {Actions.Effect.EffectActionWithLevel}
 */
function saturation(level) {
    return new actions_effect_EffectActions_EffectActionWithLevel.EffectActionWithLevel('saturation', level);
}
/**
 * @summary action
 * @memberOf Actions.Adjust
 * @description Adjusts the image or video contrast.
 * @param {number} level The level of contrast. (Range: -100 to 100, Server default: 0)
 * @return {Actions.Effect.EffectActionWithLevel}
 */
function contrast(level) {
    return new actions_effect_EffectActions_EffectActionWithLevel.EffectActionWithLevel('contrast', level);
}
/**
 * @summary action
 * @memberOf Actions.Adjust
 * @description
 * Adjusts the gamma level
 * @param {number} level The level of gamma (Range: -50 to 150, Server default: 0).
 * @return {Actions.Effect.EffectActionWithLevel}
 */
function gamma(level) {
    return new actions_effect_EffectActions_EffectActionWithLevel.EffectActionWithLevel('gamma', level);
}
/**
 * @summary action
 * @memberOf Actions.Adjust
 * @description Adjusts the image's blue channel.
 * @param {number} level - The level of blue. (Range: -100 to 100, Server default: 0)
 * @return {Actions.Effect.EffectActionWithLevel}
 */
function blue(level) {
    return new actions_effect_EffectActions_EffectActionWithLevel.EffectActionWithLevel('blue', level);
}
/**
 * @summary action
 * @memberOf Actions.Adjust
 * @description
 * Adjusts image brightness modulation in HSB to prevent artifacts in some images.
 * @param {number} level The level of modulation. (Range: -99 to 100, Server default: 80)
 * @return {Actions.Effect.EffectActionWithLevel}
 */
function brightnessHSB(level) {
    return new actions_effect_EffectActions_EffectActionWithLevel.EffectActionWithLevel('brightness_hsb', level);
}
/**
 * @summary action
 * @memberOf Actions.Adjust
 * @description  Causes all semi-transparent pixels in an image to be either fully transparent or fully opaque.
 *
 * Each pixel with an opacity lower than the specified threshold value is set to an opacity of 0%. Each pixel with
 * an opacity greater than the specified threshold is set to an opacity of 100%. For example, setting
 * opacity_threshold:0 makes all pixels non-transparent, while opacity_threshold:100 makes all semi-transparent
 * pixels fully transparent. Note: This effect can be a useful solution when PhotoShop PSD files are delivered in a
 * format supporting partial transparency, such as PNG, and the results without this effect are not as expected.
 *
 * @param {number} level The level of the threshold. (Range: 1 to 100, Server default: 50)
 * @return {Actions.Effect.EffectActionWithLevel}
 */
function opacityThreshold(level) {
    return new actions_effect_EffectActions_EffectActionWithLevel.EffectActionWithLevel('opacity_threshold', level);
}
/**
 * @summary action
 * @memberOf Actions.Adjust
 * @description
 * Adjusts the color balance and blends the result with the original image.
 * @param {number} blend How much to blend the adjusted color result, where 0 means only use the original and 100 means only use the adjusted color result. </br>
 *                                  (Range: 0 to 100, Server default: 100)
 * @return {Actions.Effect.EffectActionWithBlendPercentage}
 */
function autoColor(blend) {
    return new actions_effect_EffectActions_EffectActionWithBlend.EffectActionWithBlend('auto_color', blend);
}
/**
 * @summary action
 * @memberOf Actions.Adjust
 * @description
 * Adjusts the brightness and blends the result with the original image.
 * @param {number} blend How much to blend the adjusted brightness, where 0 means only use the original
 *                 and 100 means only use the adjusted brightness result.
 *                 (Range: 0 to 100, Server default: 100)
 * @return {Actions.Effect.EffectActionWithBlendPercentage}
 */
function autoBrightness(blend) {
    return new actions_effect_EffectActions_EffectActionWithBlend.EffectActionWithBlend('auto_brightness', blend);
}
/**
 * @summary action
 * @memberOf Actions.Adjust
 * @description
 * Adjusts the image's hue.
 * @param {number} level The level of hue. (Range: -100 to 100, Server default: 80)
 * @return {Actions.Effect.EffectActionWithLevel}
 */
function hue(level) {
    return new actions_effect_EffectActions_EffectActionWithLevel.EffectActionWithLevel('hue', level);
}
/**
 * @summary action
 * @memberOf Actions.Adjust
 * @description Adjusts the image's green channel.
 * @param {number} level The level of green. (Range: -100 to 100, Server default: 0)
 * @return {Actions.Effect.EffectActionWithLevel}
 */
function green(level) {
    return new actions_effect_EffectActions_EffectActionWithLevel.EffectActionWithLevel('green', level);
}
/**
 * @summary action
 * @description Applies an unsharp mask filter to the image.
 * @memberOf Actions.Adjust
 * @param {number} strength The strength of the filter. (Range: 1 to 2000, Server default: 100)
 * @return {Actions.Effect.EffectActionWithStrength}
 */
function unsharpMask(strength) {
    return new actions_effect_EffectActions_EffectActionWithStrength.EffectActionWithStrength('unsharp_mask', strength);
}
/**
 * @summary action
 * @description Applies a vibrance filter on the image.
 * @memberOf Actions.Adjust
 * @param {number} strength The strength of the vibrance. (Range: -100 to 100, Server default: 20)
 * @return {Actions.Effect.EffectActionWithStrength}
 */
function vibrance(strength) {
    return new actions_effect_EffectActions_EffectActionWithStrength.EffectActionWithStrength('vibrance', strength);
}
/**
 * @summary action
 * @memberOf Actions.Adjust
 * @description
 * Adjusts the contrast and blends the result with the original image.
 * @param {number} blend How much to blend the adjusted contrast, where 0 means only use the original
 *                 and 100 means only use the adjusted contrast result.
 *                (Range: 0 to 100, Server default: 100)
 * @return {Actions.Effect.EffectActionWithBlendPercentage}
 */
function autoContrast(blend) {
    return new actions_effect_EffectActions_EffectActionWithBlend.EffectActionWithBlend('auto_contrast', blend);
}
/**
 * @summary action
 * @description Adjusts the opacity of the image and makes it semi-transparent.
 * @memberOf Actions.Adjust
 * @param {number} level
 * @return {Actions.Adjust.OpacityAdjustAction}
 */
function opacity(level) {
    return new actions_adjust_OpacityAdjustAction.OpacityAdjustAction(level);
}
/**
 * @summary action
 * @memberOf Actions.Adjust
 * @description Adjusts the image colors, contrast and brightness.
 * @return {Actions.Adjust.ImproveAction}
 */
function improve() {
    return new actions_adjust_ImproveAction.ImproveAction();
}
/**
 * @summary action
 * @memberOf Actions.Adjust
 * @description
 * Maps an input color and those similar to the input color to corresponding shades of a specified output color, taking luminosity and chroma into account, in order to recolor an object in a natural way.</br>
 * More highly saturated input colors usually give the best results. It is recommended to avoid input colors approaching white, black, or gray.
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_transformations#replace_color_effect|Replace colors example}
 * @param {string} toColor
 * @return {Actions.Adjust.ReplaceColorAction}
 */
function replaceColor(toColor) {
    return new actions_adjust_ReplaceColorAction.ReplaceColorAction(toColor);
}
/**
 * @summary action
 * @memberOf Actions.Adjust
 * @description Converts the colors of every pixel in an image based on the supplied color matrix, in which the value of each color channel is calculated based on the values from all other channels (e.g. a 3x3 matrix for RGB, a 4x4 matrix for RGBA or CMYK, etc).</br>
 * For every pixel in the image, take each color channel and adjust its value by the specified values of the matrix to get a new value.
 * @param {number[][]} matrix
 * @return {Actions.Adjust.RecolorAction}
 */
function recolor(matrix) {
    return new actions_adjust_RecolorAction.RecolorAction(matrix);
}
/**
 * @summary action
 * @description Adjusts the fill light and blends the result with the original image.
 * @memberOf Actions.Adjust
 * @return {Actions.Adjust.FillLightAction}
 */
function fillLight() {
    return new actions_adjust_FillLightAction.FillLightAction();
}
/**
 * @summary action
 * @description
 * Applies a look-up table (LUT) file to the image.</br>
 * The 3dl file should be pre-uploaded as a raw file
 *
 * @param {string} publicId The public ID of the LUT file.
 * @memberOf Actions.Adjust
 * @return {Actions.Adjust.By3dLutAction}
 */
function by3dLut(publicId) {
    return new actions_adjust_By3dLutAction.By3dLutAction(publicId);
}
var Adjust = { brightness: brightness, viesusCorrect: viesusCorrect, opacity: opacity, red: red, sharpen: sharpen, improve: improve, saturation: saturation,
    contrast: contrast, gamma: gamma, green: green, blue: blue, brightnessHSB: brightnessHSB, hue: hue, autoBrightness: autoBrightness, autoColor: autoColor,
    autoContrast: autoContrast, vibrance: vibrance, unsharpMask: unsharpMask, opacityThreshold: opacityThreshold, replaceColor: replaceColor, recolor: recolor, fillLight: fillLight, by3dLut: by3dLut, tint: tint };

exports.Adjust = Adjust;
exports.autoBrightness = autoBrightness;
exports.autoColor = autoColor;
exports.autoContrast = autoContrast;
exports.blue = blue;
exports.brightness = brightness;
exports.brightnessHSB = brightnessHSB;
exports.by3dLut = by3dLut;
exports.contrast = contrast;
exports.fillLight = fillLight;
exports.gamma = gamma;
exports.green = green;
exports.hue = hue;
exports.improve = improve;
exports.opacity = opacity;
exports.opacityThreshold = opacityThreshold;
exports.recolor = recolor;
exports.red = red;
exports.replaceColor = replaceColor;
exports.saturation = saturation;
exports.sharpen = sharpen;
exports.tint = tint;
exports.unsharpMask = unsharpMask;
exports.vibrance = vibrance;
exports.viesusCorrect = viesusCorrect;
