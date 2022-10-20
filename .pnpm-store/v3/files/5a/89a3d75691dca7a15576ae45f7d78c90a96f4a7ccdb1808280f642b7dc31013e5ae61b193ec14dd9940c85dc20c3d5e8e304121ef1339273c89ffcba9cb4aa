import { FontAntialiasType, FontWeightType, TextAlignmentType, TextDecorationType } from "../types/types.js";
import { ITextStyleModel } from "../internal/models/ITextStyleModel.js";
import { QualifierModel } from "../internal/models/QualifierModel.js";
/**
 * @summary qualifier
 * @description Specifies how to style your layered text, controls the font, font size, line spacing and more.
 * </br><b>Learn more</b>: {@link https://cloudinary.com/documentation/image_transformations#adding_text_overlays|Adding text overlays to images}
 * </br><b>Learn more</b>: {@link https://cloudinary.com/documentation/video_manipulation_and_delivery#adding_text_captions|Adding text overlays to videos}
 * @see {@link Actions.Overlay| The overlay action}
 * @see {@link Actions.Underlay| The underlay action}
 * @memberOf Qualifiers
 */
declare class TextStyle extends QualifierModel {
    protected _qualifierModel: ITextStyleModel;
    /**
     * @param {string} fontFamily The font family
     * @param {number | string} fontSize The font size
     */
    constructor(fontFamily: string, fontSize: string | number);
    /**
     * @param {number} spacing The spacing between multiple lines in pixels.
     */
    lineSpacing(spacing: number): this;
    /**
     * @param spacing The spacing between the letters, in pixels.
     */
    letterSpacing(spacing: number): this;
    /**
     * The antialias setting to apply to the text. When this parameter is not specified, the default antialiasing for the subsystem and target device are applied.
     * @param {FontAntialiasType|string} antiAlias
     */
    fontAntialias(antiAlias: FontAntialiasType | string): this;
    /**
     * The name of any universally available font or a custom font, specified as the public ID of a raw, authenticated font in your account.
     * For details on custom fonts, see {@link https://cloudinary.com/documentation/image_transformations#using_custom_fonts_for_text_overlays|Using custom fonts for text overlays}.
     * @param {string} fontFamilyName
     */
    fontFamily(fontFamilyName: string): this;
    /**
     * @param {number} fontSize The font size
     */
    fontSize(fontSize: number | string): this;
    /**
     * @param {FontWeightType|string} fontWeight The font weight
     */
    fontWeight(fontWeight: FontWeightType | string): this;
    /**
     *
     * @param {string} fontStyle The font style.
     */
    fontStyle(fontStyle: 'normal' | 'italic' | string): this;
    /**
     * @param {string} fontHinting The outline hinting style to apply to the text. When this parameter is not specified, the default hint style for the font and target device are applied.
     */
    fontHinting(fontHinting: string): this;
    /**
     *
     * @param {TextDecorationType|string} textDecoration The font decoration type.
     */
    textDecoration(textDecoration: TextDecorationType | string): this;
    /**
     * @param {TextAlignmentType|string} textAlignment The text alignment
     */
    textAlignment(textAlignment: TextAlignmentType | string): this;
    /**
     * @description Whether to include an outline stroke. Set the color and weight of the stroke
     */
    stroke(textStroke?: string): this;
    toString(): string;
}
export { TextStyle };
