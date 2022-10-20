'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('../../qualifiers/rotate/RotationModeQualifierValue.cjs');
require('../../qualifiers/region/CustomRegion.cjs');
require('../../qualifiers/region/NamedRegion.cjs');
require('../../qualifiers/position/PositionQualifier.cjs');
require('../../qualifiers/gradientDirection/GradientDirectionQualifierValue.cjs');
require('../../qualifiers/format/FormatQualifier.cjs');
require('../internalConstants.cjs');
require('../../qualifiers/expression/ExpressionQualifier.cjs');
var qualifiers_background = require('../../qualifiers/background.cjs');
require('../../qualifiers/aspectRatio/AspectRatioQualifierValue.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../qualifiers/animatedFormat/AnimatedFormatQualifierValue.cjs');
require('../../qualifiers/gravity/compassGravity/CompassGravity.cjs');
require('../../qualifiers/gravity/focusOnGravity/FocusOnGravity.cjs');
require('../../qualifiers/gravity/autoGravity/AutoGravity.cjs');
require('../../qualifiers/gravity/xyCenterGravity/XYCenterGravity.cjs');
require('../../qualifiers/source/sourceTypes/VideoSource.cjs');
require('../../qualifiers/source/sourceTypes/ImageSource.cjs');
require('../../qualifiers/source/sourceTypes/SubtitlesSource.cjs');
require('../../qualifiers/source/sourceTypes/FetchSource.cjs');
require('../../qualifiers/source/sourceTypes/TextSource.cjs');
require('../../tslib.es6-f1398b83.cjs');
require('../qualifier/QualifierValue.cjs');
require('../qualifier/Qualifier.cjs');
require('./QualifierModel.cjs');
require('./qualifierToJson.cjs');
require('../utils/unsupportedError.cjs');
require('../Action.cjs');
require('../utils/dataStructureUtils.cjs');
require('./ActionModel.cjs');
require('./actionToJson.cjs');
require('../../qualifiers/flag.cjs');
require('./createGravityModel.cjs');
require('../../qualifiers/gravity.cjs');
require('../../qualifiers/gravity/qualifiers/focusOn/FocusOnValue.cjs');
require('../utils/objectFlip.cjs');
require('../utils/prepareColor.cjs');
require('../../qualifiers/background/shared/auto/BackgroundAutoBorderQualifier.cjs');
require('../../qualifiers/background/shared/base/BaseCommonBackground.cjs');
require('../../qualifiers/background/shared/base/BackgroundQualifier.cjs');
require('../../qualifiers/background/shared/gradient/BackgroundBorderGradientQualifier.cjs');
require('../../qualifiers/background/shared/base/BaseGradientBackground.cjs');
require('../../qualifiers/background/shared/auto/BackgroundAutoPredominantQualifier.cjs');
require('../../qualifiers/background/shared/gradient/BackgroundPredominantGradientQualifier.cjs');
require('../../qualifiers/background/shared/BlurredBackgroundAction.cjs');
require('../../qualifiers/gravity/GravityQualifier.cjs');
require('../../qualifiers/source/BaseSource.cjs');
require('../../qualifiers/source/sourceTypes/BaseTextSource.cjs');
require('../../qualifiers/textStyle.cjs');
require('../../qualifiers/fontWeight.cjs');
require('../../qualifiers/fontStyle.cjs');
require('../../qualifiers/textDecoration.cjs');
require('../utils/serializeCloudinaryCharacters.cjs');
require('../../qualifiers/textStroke.cjs');
require('./IStrokeModel.cjs');
require('../utils/base64Encode.cjs');
require('./createTextStyleFromModel.cjs');

/**
 * Create BackgroundQualifier from IBlurredBackgroundModel
 * @param backgroundModel
 */
function createBlurredBackground(backgroundModel) {
    var brightness = backgroundModel.brightness, intensity = backgroundModel.intensity;
    var result = qualifiers_background.Background.blurred();
    if (brightness || brightness == 0) {
        result.brightness(brightness);
    }
    if (intensity || intensity == 0) {
        result.intensity(intensity);
    }
    return result;
}
/**
 * Create a gradientBackground from given model
 * @param background
 * @param backgroundModel
 */
function createGradientBackground(background, backgroundModel) {
    var gradientColors = backgroundModel.gradientColors, gradientDirection = backgroundModel.gradientDirection, contrast = backgroundModel.contrast, palette = backgroundModel.palette;
    if (contrast) {
        background.contrast();
    }
    if (palette) {
        background.palette.apply(background, palette);
    }
    if (gradientColors) {
        background.gradientColors(+gradientColors);
    }
    if (gradientDirection) {
        background.gradientDirection(gradientDirection);
    }
    return background;
}
/**
 * Crete a background with contrast and palette from given model
 * @param background
 * @param backgroundModel
 */
function createContrastPaletteBackground(background, backgroundModel) {
    var contrast = backgroundModel.contrast, palette = backgroundModel.palette;
    if (contrast) {
        background.contrast();
    }
    if (palette) {
        background.palette.apply(background, palette);
    }
    return background;
}
/**
 * Create BackgroundQualifier from IBackgroundModel
 * @param backgroundModel
 */
function createBackgroundFromModel(backgroundModel) {
    var backgroundType = backgroundModel.backgroundType;
    switch (backgroundType) {
        case 'auto':
            return qualifiers_background.auto();
        case 'blurred':
            return createBlurredBackground(backgroundModel);
        case 'border':
            return createContrastPaletteBackground(qualifiers_background.border(), backgroundModel);
        case 'borderGradient':
            return createGradientBackground(qualifiers_background.borderGradient(), backgroundModel);
        case 'predominant':
            return createContrastPaletteBackground(qualifiers_background.predominant(), backgroundModel);
        case 'predominantGradient':
            return createGradientBackground(qualifiers_background.predominantGradient(), backgroundModel);
        default:
            return qualifiers_background.color(backgroundModel.color);
    }
}

exports.createBackgroundFromModel = createBackgroundFromModel;
