'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var qualifiers_background_shared_BlurredBackgroundAction = require('../../qualifiers/background/shared/BlurredBackgroundAction.cjs');
var qualifiers_background_shared_auto_BackgroundAutoBorderQualifier = require('../../qualifiers/background/shared/auto/BackgroundAutoBorderQualifier.cjs');
var qualifiers_background_shared_gradient_BackgroundBorderGradientQualifier = require('../../qualifiers/background/shared/gradient/BackgroundBorderGradientQualifier.cjs');
var qualifiers_background_shared_gradient_BackgroundPredominantGradientQualifier = require('../../qualifiers/background/shared/gradient/BackgroundPredominantGradientQualifier.cjs');
var qualifiers_background_shared_auto_BackgroundAutoPredominantQualifier = require('../../qualifiers/background/shared/auto/BackgroundAutoPredominantQualifier.cjs');
require('../../qualifiers/background/shared/base/BackgroundQualifier.cjs');
require('../qualifier/Qualifier.cjs');
require('../qualifier/QualifierValue.cjs');
require('./QualifierModel.cjs');
require('./qualifierToJson.cjs');
require('../utils/unsupportedError.cjs');
require('../../qualifiers/background/shared/base/BaseCommonBackground.cjs');
require('../utils/prepareColor.cjs');
require('../../qualifiers/background/shared/base/BaseGradientBackground.cjs');

/**
 * Get the value of given background
 * @param background
 */
function getBackgroundValue(background) {
    return ("" + background).replace('b_', '');
}
/**
 * Create an IAutoBackgroundModel from given background
 */
function createAutoBackgroundModel() {
    return { backgroundType: 'auto' };
}
/**
 * Create an IBlurredBackgroundModel from given background
 * @param background
 */
function createBlurredBackgroundModel(background) {
    var _a = background, intensityLevel = _a.intensityLevel, brightnessLevel = _a.brightnessLevel;
    var result = {
        backgroundType: 'blurred'
    };
    if (intensityLevel || intensityLevel === 0) {
        result.intensity = intensityLevel;
    }
    if (brightnessLevel || brightnessLevel === 0) {
        result.brightness = brightnessLevel;
    }
    return result;
}
/**
 * Create an IContrastPaletteBackgroundModel from given background
 * @param background
 */
function createContrastPaletteBackgroundModel(background) {
    var contrast = background._contrast;
    var palette = background._palette;
    var result = {
        backgroundType: ''
    };
    if (contrast) {
        result.contrast = true;
    }
    if (palette) {
        result.palette = palette;
    }
    return result;
}
/**
 * Create an IBorderBackgroundModel from given background
 * @param background
 */
function createBorderBackgroundModel(background) {
    return tslib_es6.__assign(tslib_es6.__assign({}, createContrastPaletteBackgroundModel(background)), { backgroundType: 'border' });
}
/**
 * Create an IBaseGradientBackgroundModel from given background
 * @param background
 */
function createBaseGradientBackgroundModel(background) {
    var gradientColors = background._gradientColors;
    var gradientDirection = "" + background._gradientDirection;
    var result = createContrastPaletteBackgroundModel(background);
    if (gradientColors) {
        result.gradientColors = gradientColors;
    }
    if (gradientDirection) {
        result.gradientDirection = gradientDirection;
    }
    return result;
}
/**
 * Create an IBorderGradientBackgroundModel from given background
 * @param background
 */
function createBorderGradientBackgroundModel(background) {
    return tslib_es6.__assign(tslib_es6.__assign({}, createBaseGradientBackgroundModel(background)), { backgroundType: 'borderGradient' });
}
/**
 * Create an IColorBackgroundModel from given background
 * @param background
 */
function createColorBackgroundModel(background) {
    return {
        backgroundType: 'color',
        color: getBackgroundValue(background)
    };
}
/**
 * Create an IPredominantBackgroundModel from given background
 * @param background
 */
function createPredominantBackgroundModel(background) {
    return tslib_es6.__assign(tslib_es6.__assign({}, createContrastPaletteBackgroundModel(background)), { backgroundType: 'predominant' });
}
/**
 * Create an IPredominantGradientBackgroundModel from given background
 * @param background
 */
function createPredominantGradientBackgroundModel(background) {
    return tslib_es6.__assign(tslib_es6.__assign({}, createBaseGradientBackgroundModel(background)), { backgroundType: 'predominantGradient' });
}
/**
 * Create an IBackgroundModel from given background
 * @param background
 */
function createBackgroundModel(background) {
    if (getBackgroundValue(background) === 'auto') {
        return createAutoBackgroundModel();
    }
    if (background instanceof qualifiers_background_shared_BlurredBackgroundAction) {
        return createBlurredBackgroundModel(background);
    }
    if (background instanceof qualifiers_background_shared_auto_BackgroundAutoBorderQualifier.BackgroundAutoBorderQualifier) {
        return createBorderBackgroundModel(background);
    }
    if (background instanceof qualifiers_background_shared_gradient_BackgroundBorderGradientQualifier.BackgroundBorderGradientQualifier) {
        return createBorderGradientBackgroundModel(background);
    }
    if (background instanceof qualifiers_background_shared_auto_BackgroundAutoPredominantQualifier.BackgroundAutoPredominantQualifier) {
        return createPredominantBackgroundModel(background);
    }
    if (background instanceof qualifiers_background_shared_gradient_BackgroundPredominantGradientQualifier.BackgroundPredominantGradientQualifier) {
        return createPredominantGradientBackgroundModel(background);
    }
    return createColorBackgroundModel(background);
}

exports.createBackgroundModel = createBackgroundModel;
