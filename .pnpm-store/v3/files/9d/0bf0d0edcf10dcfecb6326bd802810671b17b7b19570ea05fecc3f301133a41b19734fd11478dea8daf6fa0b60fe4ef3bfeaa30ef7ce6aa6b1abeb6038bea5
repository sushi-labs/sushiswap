import { BaseGradientBackground } from "../base/BaseGradientBackground.js";
/**
 * @description Specifies that the gradient fade effect, used for the background when resizing with padding, uses the
 * predominant colors in the whole of the image.
 * @memberOf Qualifiers.Background
 * @extends {Qualifiers.Background.BaseGradientBackground}
 */
class BackgroundPredominantGradientQualifier extends BaseGradientBackground {
    /**
     * @description
     * Stringify the qualifier
     * BackgroundQualifiers don't have a value, but instead override the toString() function.
     */
    toString() {
        return `
    b_auto:predominant_gradient
    ${this._contrast ? '_contrast' : ''}
    ${this._gradientColors ? `:${this._gradientColors}` : ''}
    ${this._gradientDirection ? `:${this._gradientDirection}` : ''}
    ${this._palette.length ? `:palette_${this._palette.join('_')}` : ''}
    `.replace(/\s+/g, '');
    }
}
export { BackgroundPredominantGradientQualifier };
