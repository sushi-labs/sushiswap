import { BaseCommonBackground } from "../base/BaseCommonBackground.js";
/**
 * @description Automatically determines the color to use for padding, if needed when resizing an asset. Selects the
 * predominant color from the whole image.
 * @memberOf Qualifiers.Background
 * @extends {Qualifiers.Background.BaseCommonBackground}
 */
class BackgroundAutoPredominantQualifier extends BaseCommonBackground {
    /**
     * @description
     * Stringify the qualifier
     * BackgroundQualifiers don't have a value, but instead override the toString() function.
     */
    toString() {
        return `
    b_auto:predominant
    ${this._contrast ? '_contrast' : ''}
    ${this._palette.length ? `:palette_${this._palette.join('_')}` : ''}
    `.replace(/\s+/g, '');
    }
}
export { BackgroundAutoPredominantQualifier };
