'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var qualifiers_blendMode_BlendModeQualifier = require('./blendMode/BlendModeQualifier.cjs');
require('../tslib.es6-f1398b83.cjs');
require('../internal/Action.cjs');
require('./flag/FlagQualifier.cjs');
require('../internal/qualifier/QualifierValue.cjs');
require('../internal/qualifier/Qualifier.cjs');
require('../internal/models/QualifierModel.cjs');
require('../internal/models/qualifierToJson.cjs');
require('../internal/utils/unsupportedError.cjs');
require('../internal/utils/dataStructureUtils.cjs');
require('../internal/models/ActionModel.cjs');
require('../internal/models/actionToJson.cjs');

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
    return new qualifiers_blendMode_BlendModeQualifier.BlendModeQualifier('multiply');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.BlendMode
 * @description Add an overlay image blended using the 'screen' blend mode.
 * @return {Qualifiers.BlendMode.BlendModeQualifier}
 */
function screen() {
    return new qualifiers_blendMode_BlendModeQualifier.BlendModeQualifier('screen');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.BlendMode
 * @description Add an overlay image blended using the 'overlay' blend mode.
 * @return {Qualifiers.BlendMode.BlendModeQualifier}
 */
function overlay() {
    return new qualifiers_blendMode_BlendModeQualifier.BlendModeQualifier('overlay');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.BlendMode
 * @description Add an overlay image blended using the 'mask' blend mode.
 * @return {Qualifiers.BlendMode.BlendModeQualifier}
 */
function mask() {
    return new qualifiers_blendMode_BlendModeQualifier.BlendModeQualifier('mask');
}
/**
 * @summary qualifier
 * @memberOf Qualifiers.BlendMode
 * @description Add an overlay image blended using the 'antiRemoval' blend mode.
 * @param {number} lvl 	The level of distortion. (Range: 1 to 100, Server default: 50)
 * @return {Qualifiers.BlendMode.BlendModeQualifier}
 */
function antiRemoval(lvl) {
    return new qualifiers_blendMode_BlendModeQualifier.BlendModeQualifier('anti_removal', lvl);
}
var BlendMode = {
    screen: screen,
    multiply: multiply,
    overlay: overlay,
    mask: mask,
    antiRemoval: antiRemoval
};

exports.BlendMode = BlendMode;
exports.antiRemoval = antiRemoval;
exports.mask = mask;
exports.multiply = multiply;
exports.overlay = overlay;
exports.screen = screen;
