import { Background } from "../../qualifiers.js";
import { auto, border, borderGradient, color, predominant, predominantGradient } from "../../qualifiers/background.js";
/**
 * Create BackgroundQualifier from IBlurredBackgroundModel
 * @param backgroundModel
 */
function createBlurredBackground(backgroundModel) {
    const { brightness, intensity } = backgroundModel;
    const result = Background.blurred();
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
    const { gradientColors, gradientDirection, contrast, palette } = backgroundModel;
    if (contrast) {
        background.contrast();
    }
    if (palette) {
        background.palette(...palette);
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
    const { contrast, palette } = backgroundModel;
    if (contrast) {
        background.contrast();
    }
    if (palette) {
        background.palette(...palette);
    }
    return background;
}
/**
 * Create BackgroundQualifier from IBackgroundModel
 * @param backgroundModel
 */
function createBackgroundFromModel(backgroundModel) {
    const { backgroundType } = backgroundModel;
    switch (backgroundType) {
        case 'auto':
            return auto();
        case 'blurred':
            return createBlurredBackground(backgroundModel);
        case 'border':
            return createContrastPaletteBackground(border(), backgroundModel);
        case 'borderGradient':
            return createGradientBackground(borderGradient(), backgroundModel);
        case 'predominant':
            return createContrastPaletteBackground(predominant(), backgroundModel);
        case 'predominantGradient':
            return createGradientBackground(predominantGradient(), backgroundModel);
        default:
            return color(backgroundModel.color);
    }
}
export { createBackgroundFromModel };
