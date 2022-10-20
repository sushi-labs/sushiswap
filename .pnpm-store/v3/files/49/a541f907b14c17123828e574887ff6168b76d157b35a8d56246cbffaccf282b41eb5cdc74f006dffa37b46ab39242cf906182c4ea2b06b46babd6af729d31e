'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../tslib.es6-f1398b83.cjs');
var qualifiers_fontWeight = require('./fontWeight.cjs');
var qualifiers_fontStyle = require('./fontStyle.cjs');
var qualifiers_textDecoration = require('./textDecoration.cjs');
var internal_utils_serializeCloudinaryCharacters = require('../internal/utils/serializeCloudinaryCharacters.cjs');
var internal_models_QualifierModel = require('../internal/models/QualifierModel.cjs');
var qualifiers_textStroke = require('./textStroke.cjs');
var internal_models_IStrokeModel = require('../internal/models/IStrokeModel.cjs');
require('../internal/models/qualifierToJson.cjs');
require('../internal/utils/unsupportedError.cjs');

/**
 * @summary qualifier
 * @description Specifies how to style your layered text, controls the font, font size, line spacing and more.
 * </br><b>Learn more</b>: {@link https://cloudinary.com/documentation/image_transformations#adding_text_overlays|Adding text overlays to images}
 * </br><b>Learn more</b>: {@link https://cloudinary.com/documentation/video_manipulation_and_delivery#adding_text_captions|Adding text overlays to videos}
 * @see {@link Actions.Overlay| The overlay action}
 * @see {@link Actions.Underlay| The underlay action}
 * @memberOf Qualifiers
 */
var TextStyle = /** @class */ (function (_super) {
    tslib_es6.__extends(TextStyle, _super);
    /**
     * @param {string} fontFamily The font family
     * @param {number | string} fontSize The font size
     */
    function TextStyle(fontFamily, fontSize) {
        var _this = _super.call(this) || this;
        if (!fontFamily || !fontSize) {
            throw "You must provide a fontFamily and fontSize to a TextStyle";
        }
        _this._qualifierModel.fontFamily = fontFamily;
        _this._qualifierModel.fontSize = fontSize;
        return _this;
    }
    /**
     * @param {number} spacing The spacing between multiple lines in pixels.
     */
    TextStyle.prototype.lineSpacing = function (spacing) {
        this._qualifierModel.lineSpacing = spacing;
        return this;
    };
    /**
     * @param spacing The spacing between the letters, in pixels.
     */
    TextStyle.prototype.letterSpacing = function (spacing) {
        this._qualifierModel.letterSpacing = spacing;
        return this;
    };
    /**
     * The antialias setting to apply to the text. When this parameter is not specified, the default antialiasing for the subsystem and target device are applied.
     * @param {FontAntialiasType|string} antiAlias
     */
    TextStyle.prototype.fontAntialias = function (antiAlias) {
        this._qualifierModel.fontAntialias = antiAlias;
        return this;
    };
    /**
     * The name of any universally available font or a custom font, specified as the public ID of a raw, authenticated font in your account.
     * For details on custom fonts, see {@link https://cloudinary.com/documentation/image_transformations#using_custom_fonts_for_text_overlays|Using custom fonts for text overlays}.
     * @param {string} fontFamilyName
     */
    TextStyle.prototype.fontFamily = function (fontFamilyName) {
        this._qualifierModel.fontFamily = fontFamilyName;
        return this;
    };
    /**
     * @param {number} fontSize The font size
     */
    TextStyle.prototype.fontSize = function (fontSize) {
        this._qualifierModel.fontSize = fontSize;
        return this;
    };
    /**
     * @param {FontWeightType|string} fontWeight The font weight
     */
    TextStyle.prototype.fontWeight = function (fontWeight) {
        this._qualifierModel.fontWeight = fontWeight;
        return this;
    };
    /**
     *
     * @param {string} fontStyle The font style.
     */
    TextStyle.prototype.fontStyle = function (fontStyle) {
        this._qualifierModel.fontStyle = fontStyle;
        return this;
    };
    /**
     * @param {string} fontHinting The outline hinting style to apply to the text. When this parameter is not specified, the default hint style for the font and target device are applied.
     */
    TextStyle.prototype.fontHinting = function (fontHinting) {
        this._qualifierModel.fontHinting = fontHinting;
        return this;
    };
    /**
     *
     * @param {TextDecorationType|string} textDecoration The font decoration type.
     */
    TextStyle.prototype.textDecoration = function (textDecoration) {
        this._qualifierModel.textDecoration = textDecoration;
        return this;
    };
    /**
     * @param {TextAlignmentType|string} textAlignment The text alignment
     */
    TextStyle.prototype.textAlignment = function (textAlignment) {
        this._qualifierModel.textAlignment = textAlignment;
        return this;
    };
    /**
     * @description Whether to include an outline stroke. Set the color and weight of the stroke
     */
    TextStyle.prototype.stroke = function (textStroke) {
        if (textStroke) {
            var strokeStyle = textStroke.split('_');
            this._qualifierModel.stroke = {
                width: +(strokeStyle[1].replace('px', '')),
                color: strokeStyle[strokeStyle.length - 1]
            };
        }
        else {
            this._qualifierModel.stroke = true;
        }
        return this;
    };
    TextStyle.prototype.toString = function () {
        var stroke = this._qualifierModel.stroke;
        var strokeStr = '';
        if (stroke) {
            strokeStr = internal_models_IStrokeModel.isISolidStrokeModel(stroke) ? "stroke_" + qualifiers_textStroke.solid(stroke.width, stroke.color) : 'stroke';
        }
        return [
            internal_utils_serializeCloudinaryCharacters.serializeCloudinaryCharacters(this._qualifierModel.fontFamily) + "_" + this._qualifierModel.fontSize,
            this._qualifierModel.fontWeight !== qualifiers_fontWeight.normal() && this._qualifierModel.fontWeight,
            this._qualifierModel.fontStyle !== qualifiers_fontStyle.normal() && this._qualifierModel.fontStyle,
            this._qualifierModel.textDecoration !== qualifiers_textDecoration.normal() && this._qualifierModel.textDecoration,
            this._qualifierModel.textAlignment,
            strokeStr,
            this._qualifierModel.letterSpacing && "letter_spacing_" + this._qualifierModel.letterSpacing,
            this._qualifierModel.lineSpacing && "line_spacing_" + this._qualifierModel.lineSpacing,
            this._qualifierModel.fontAntialias && "antialias_" + this._qualifierModel.fontAntialias,
            this._qualifierModel.fontHinting && "hinting_" + this._qualifierModel.fontHinting
        ].filter(function (a) { return a; }).join('_');
    };
    return TextStyle;
}(internal_models_QualifierModel.QualifierModel));

exports.TextStyle = TextStyle;
