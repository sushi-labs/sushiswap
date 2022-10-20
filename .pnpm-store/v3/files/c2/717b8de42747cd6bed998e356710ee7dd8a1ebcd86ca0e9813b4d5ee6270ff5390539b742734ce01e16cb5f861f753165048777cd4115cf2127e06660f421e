'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var internal_utils_prepareColor = require('../internal/utils/prepareColor.cjs');
var qualifiers_background_shared_auto_BackgroundAutoBorderQualifier = require('./background/shared/auto/BackgroundAutoBorderQualifier.cjs');
var qualifiers_background_shared_gradient_BackgroundBorderGradientQualifier = require('./background/shared/gradient/BackgroundBorderGradientQualifier.cjs');
var qualifiers_background_shared_auto_BackgroundAutoPredominantQualifier = require('./background/shared/auto/BackgroundAutoPredominantQualifier.cjs');
var qualifiers_background_shared_gradient_BackgroundPredominantGradientQualifier = require('./background/shared/gradient/BackgroundPredominantGradientQualifier.cjs');
var qualifiers_background_shared_BlurredBackgroundAction = require('./background/shared/BlurredBackgroundAction.cjs');
var qualifiers_background_shared_base_BackgroundQualifier = require('./background/shared/base/BackgroundQualifier.cjs');
require('../tslib.es6-f1398b83.cjs');
require('./background/shared/base/BaseCommonBackground.cjs');
require('../internal/qualifier/Qualifier.cjs');
require('../internal/qualifier/QualifierValue.cjs');
require('../internal/models/QualifierModel.cjs');
require('../internal/models/qualifierToJson.cjs');
require('../internal/utils/unsupportedError.cjs');
require('./background/shared/base/BaseGradientBackground.cjs');

/**
 * @description Defines the background color to use instead of transparent background areas or when resizing with padding.
 *
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_transformations#setting_background_color|Setting background for images} | {@link https://cloudinary.com/documentation/video_manipulation_and_delivery#background_color|Setting background for videos}
 *
 * @namespace Background
 * @memberOf Qualifiers
 */
/**
 * @summary qualifier
 * @description Selects the predominant color while taking only the image border pixels into account.
 * @memberOf Qualifiers.Background
 * @return {BackgroundAutoBorderQualifier}
 */
function border() {
    return new qualifiers_background_shared_auto_BackgroundAutoBorderQualifier.BackgroundAutoBorderQualifier();
}
/**
 * @summary qualifier
 * @description Automatically determines the color to use for padding, if needed when resizing an asset.
 *
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_transformations#content_aware_padding|Content-aware padding}
 * @memberOf Qualifiers.Background
 * @return {Qualifiers.Background.BackgroundQualifier}
 */
function auto() {
    return new qualifiers_background_shared_base_BackgroundQualifier.BackgroundQualifier('auto');
}
/**
 * @summary qualifier
 * @description Applies a padding gradient fade effect using the predominant colors in the border of the image.
 * @memberOf Qualifiers.Background
 * @return {BackgroundBorderGradientQualifier}
 */
function borderGradient() {
    return new qualifiers_background_shared_gradient_BackgroundBorderGradientQualifier.BackgroundBorderGradientQualifier();
}
/**
 * @summary qualifier
 * @description Applies a padding gradient fade effect using the predominant colors in the image.
 * @memberOf Qualifiers.Background
 * @return {BackgroundPredominantGradientQualifier}
 */
function predominantGradient() {
    return new qualifiers_background_shared_gradient_BackgroundPredominantGradientQualifier.BackgroundPredominantGradientQualifier();
}
/**
 * @summary qualifier
 * @description Selects the predominant color while taking all pixels in the image into account
 * @memberOf Qualifiers.Background
 * @return {BackgroundAutoPredominantQualifier}
 */
function predominant() {
    return new qualifiers_background_shared_auto_BackgroundAutoPredominantQualifier.BackgroundAutoPredominantQualifier();
}
/**
 * @summary qualifier
 * @description Selects the predominant color while taking all pixels in the image into account.
 * @memberOf Qualifiers.Background
 * @return {Qualifiers.Background.BackgroundQualifier}
 */
function color(colorStr) {
    return new qualifiers_background_shared_base_BackgroundQualifier.BackgroundQualifier(internal_utils_prepareColor.prepareColor(colorStr));
}
/**
 * @summary qualifier
 * @description Selects the predominant color while taking all pixels in the image into account.
 * @memberOf Qualifiers.Background
 * @return {BlurredBackgroundAction}
 */
function blurred() {
    return new qualifiers_background_shared_BlurredBackgroundAction();
}
var Background = {
    auto: auto,
    border: border,
    borderGradient: borderGradient,
    predominantGradient: predominantGradient,
    predominant: predominant,
    color: color,
    blurred: blurred
};

exports.Background = Background;
exports.auto = auto;
exports.blurred = blurred;
exports.border = border;
exports.borderGradient = borderGradient;
exports.color = color;
exports.predominant = predominant;
exports.predominantGradient = predominantGradient;
