import { BackgroundQualifier } from "./base/BackgroundQualifier.js";
/**
 * @description A class for blurred background transformations.
 * @memberOf Qualifiers.Background
 * @extends {Qualifiers.Background.BackgroundQualifier}
 */
class BlurredBackgroundAction extends BackgroundQualifier {
    /**
     * @description Sets the intensity of the blur.
     * @param {number} value - The intensity of the blur.
     */
    intensity(value) {
        this.intensityLevel = value;
        return this;
    }
    /**
     * @description Sets the brightness of the background.
     * @param {number} value - The brightness of the background.
     */
    brightness(value) {
        this.brightnessLevel = value;
        return this;
    }
    /**
     * @description
     * Stringify the qualifier
     * BackgroundQualifiers don't have a value, but instead override the toString() function
     */
    toString() {
        // b_blurred:{intensity}:{brightness}
        return `
    b_blurred
    ${this.intensityLevel ? `:${this.intensityLevel}` : ''}
    ${this.brightnessLevel ? `:${this.brightnessLevel}` : ''}
    `.replace(/\s+/g, '');
    }
}
export default BlurredBackgroundAction;
