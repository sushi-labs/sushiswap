import { normal as normalFontWeight } from "./fontWeight.js";
import { normal as normalFontStyle } from "./fontStyle.js";
import { normal as normalTextDecoration } from "./textDecoration.js";
import { serializeCloudinaryCharacters } from "../internal/utils/serializeCloudinaryCharacters.js";
import { QualifierModel } from "../internal/models/QualifierModel.js";
import { solid } from "./textStroke.js";
import { isISolidStrokeModel } from "../internal/models/IStrokeModel.js";
/**
 * @summary qualifier
 * @description Specifies how to style your layered text, controls the font, font size, line spacing and more.
 * </br><b>Learn more</b>: {@link https://cloudinary.com/documentation/image_transformations#adding_text_overlays|Adding text overlays to images}
 * </br><b>Learn more</b>: {@link https://cloudinary.com/documentation/video_manipulation_and_delivery#adding_text_captions|Adding text overlays to videos}
 * @see {@link Actions.Overlay| The overlay action}
 * @see {@link Actions.Underlay| The underlay action}
 * @memberOf Qualifiers
 */
class TextStyle extends QualifierModel {
    /**
     * @param {string} fontFamily The font family
     * @param {number | string} fontSize The font size
     */
    constructor(fontFamily, fontSize) {
        super();
        if (!fontFamily || !fontSize) {
            throw `You must provide a fontFamily and fontSize to a TextStyle`;
        }
        this._qualifierModel.fontFamily = fontFamily;
        this._qualifierModel.fontSize = fontSize;
    }
    /**
     * @param {number} spacing The spacing between multiple lines in pixels.
     */
    lineSpacing(spacing) {
        this._qualifierModel.lineSpacing = spacing;
        return this;
    }
    /**
     * @param spacing The spacing between the letters, in pixels.
     */
    letterSpacing(spacing) {
        this._qualifierModel.letterSpacing = spacing;
        return this;
    }
    /**
     * The antialias setting to apply to the text. When this parameter is not specified, the default antialiasing for the subsystem and target device are applied.
     * @param {FontAntialiasType|string} antiAlias
     */
    fontAntialias(antiAlias) {
        this._qualifierModel.fontAntialias = antiAlias;
        return this;
    }
    /**
     * The name of any universally available font or a custom font, specified as the public ID of a raw, authenticated font in your account.
     * For details on custom fonts, see {@link https://cloudinary.com/documentation/image_transformations#using_custom_fonts_for_text_overlays|Using custom fonts for text overlays}.
     * @param {string} fontFamilyName
     */
    fontFamily(fontFamilyName) {
        this._qualifierModel.fontFamily = fontFamilyName;
        return this;
    }
    /**
     * @param {number} fontSize The font size
     */
    fontSize(fontSize) {
        this._qualifierModel.fontSize = fontSize;
        return this;
    }
    /**
     * @param {FontWeightType|string} fontWeight The font weight
     */
    fontWeight(fontWeight) {
        this._qualifierModel.fontWeight = fontWeight;
        return this;
    }
    /**
     *
     * @param {string} fontStyle The font style.
     */
    fontStyle(fontStyle) {
        this._qualifierModel.fontStyle = fontStyle;
        return this;
    }
    /**
     * @param {string} fontHinting The outline hinting style to apply to the text. When this parameter is not specified, the default hint style for the font and target device are applied.
     */
    fontHinting(fontHinting) {
        this._qualifierModel.fontHinting = fontHinting;
        return this;
    }
    /**
     *
     * @param {TextDecorationType|string} textDecoration The font decoration type.
     */
    textDecoration(textDecoration) {
        this._qualifierModel.textDecoration = textDecoration;
        return this;
    }
    /**
     * @param {TextAlignmentType|string} textAlignment The text alignment
     */
    textAlignment(textAlignment) {
        this._qualifierModel.textAlignment = textAlignment;
        return this;
    }
    /**
     * @description Whether to include an outline stroke. Set the color and weight of the stroke
     */
    stroke(textStroke) {
        if (textStroke) {
            const strokeStyle = textStroke.split('_');
            this._qualifierModel.stroke = {
                width: +(strokeStyle[1].replace('px', '')),
                color: strokeStyle[strokeStyle.length - 1]
            };
        }
        else {
            this._qualifierModel.stroke = true;
        }
        return this;
    }
    toString() {
        const { stroke } = this._qualifierModel;
        let strokeStr = '';
        if (stroke) {
            strokeStr = isISolidStrokeModel(stroke) ? `stroke_${solid(stroke.width, stroke.color)}` : 'stroke';
        }
        return [
            `${serializeCloudinaryCharacters(this._qualifierModel.fontFamily)}_${this._qualifierModel.fontSize}`,
            this._qualifierModel.fontWeight !== normalFontWeight() && this._qualifierModel.fontWeight,
            this._qualifierModel.fontStyle !== normalFontStyle() && this._qualifierModel.fontStyle,
            this._qualifierModel.textDecoration !== normalTextDecoration() && this._qualifierModel.textDecoration,
            this._qualifierModel.textAlignment,
            strokeStr,
            this._qualifierModel.letterSpacing && `letter_spacing_${this._qualifierModel.letterSpacing}`,
            this._qualifierModel.lineSpacing && `line_spacing_${this._qualifierModel.lineSpacing}`,
            this._qualifierModel.fontAntialias && `antialias_${this._qualifierModel.fontAntialias}`,
            this._qualifierModel.fontHinting && `hinting_${this._qualifierModel.fontHinting}`
        ].filter((a) => a).join('_');
    }
}
export { TextStyle };
