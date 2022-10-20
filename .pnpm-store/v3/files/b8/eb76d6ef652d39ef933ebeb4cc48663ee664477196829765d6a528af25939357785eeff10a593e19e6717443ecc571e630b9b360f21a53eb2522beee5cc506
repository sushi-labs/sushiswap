import { Qualifier } from "../internal/qualifier/Qualifier.js";
/**
 * @description Contains functions that Applies automatic multi-line text wrap.
 * <b>Learn more</b>: {@link https://cloudinary.com/documentation/layers#adding_multi_line_text|Adding multi line text}
 * @memberOf Qualifiers
 * @namespace TextFitQualifier
 */
class TextFitQualifier extends Qualifier {
    constructor(width, height) {
        //@ts-ignore
        super();
        this._width = width;
        this._height = height;
    }
    height(height) {
        this._height = height;
        return this;
    }
    toString() {
        return this._height ? `c_fit,w_${this._width},h_${this._height}` : `c_fit,w_${this._width}`;
    }
}
/**
 * @summary qualifier Adding an automatic multi-line text wrap.
 * @memberOf Qualifiers.TextFitQualifier
 * @param {number} width The width in pixels.
 * @param {number} height The height in pixels.
 */
function size(width, height) {
    return new TextFitQualifier(width, height);
}
const TextFit = { size };
export { TextFit, size, TextFitQualifier };
