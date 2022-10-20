import BlurredBackgroundAction from "../../qualifiers/background/shared/BlurredBackgroundAction.js";
import { BackgroundAutoBorderQualifier } from "../../qualifiers/background/shared/auto/BackgroundAutoBorderQualifier.js";
import { BackgroundBorderGradientQualifier } from "../../qualifiers/background/shared/gradient/BackgroundBorderGradientQualifier.js";
import { BackgroundPredominantGradientQualifier } from "../../qualifiers/background/shared/gradient/BackgroundPredominantGradientQualifier.js";
import { BackgroundAutoPredominantQualifier } from "../../qualifiers/background/shared/auto/BackgroundAutoPredominantQualifier.js";
/**
 * Get the value of given background
 * @param background
 */
function getBackgroundValue(background) {
    return `${background}`.replace('b_', '');
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
    const { intensityLevel, brightnessLevel } = background;
    const result = {
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
    const contrast = background._contrast;
    const palette = background._palette;
    const result = {
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
    return Object.assign(Object.assign({}, createContrastPaletteBackgroundModel(background)), { backgroundType: 'border' });
}
/**
 * Create an IBaseGradientBackgroundModel from given background
 * @param background
 */
function createBaseGradientBackgroundModel(background) {
    const gradientColors = background._gradientColors;
    const gradientDirection = `${background._gradientDirection}`;
    const result = createContrastPaletteBackgroundModel(background);
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
    return Object.assign(Object.assign({}, createBaseGradientBackgroundModel(background)), { backgroundType: 'borderGradient' });
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
    return Object.assign(Object.assign({}, createContrastPaletteBackgroundModel(background)), { backgroundType: 'predominant' });
}
/**
 * Create an IPredominantGradientBackgroundModel from given background
 * @param background
 */
function createPredominantGradientBackgroundModel(background) {
    return Object.assign(Object.assign({}, createBaseGradientBackgroundModel(background)), { backgroundType: 'predominantGradient' });
}
/**
 * Create an IBackgroundModel from given background
 * @param background
 */
function createBackgroundModel(background) {
    if (getBackgroundValue(background) === 'auto') {
        return createAutoBackgroundModel();
    }
    if (background instanceof BlurredBackgroundAction) {
        return createBlurredBackgroundModel(background);
    }
    if (background instanceof BackgroundAutoBorderQualifier) {
        return createBorderBackgroundModel(background);
    }
    if (background instanceof BackgroundBorderGradientQualifier) {
        return createBorderGradientBackgroundModel(background);
    }
    if (background instanceof BackgroundAutoPredominantQualifier) {
        return createPredominantBackgroundModel(background);
    }
    if (background instanceof BackgroundPredominantGradientQualifier) {
        return createPredominantGradientBackgroundModel(background);
    }
    return createColorBackgroundModel(background);
}
export { createBackgroundModel };
