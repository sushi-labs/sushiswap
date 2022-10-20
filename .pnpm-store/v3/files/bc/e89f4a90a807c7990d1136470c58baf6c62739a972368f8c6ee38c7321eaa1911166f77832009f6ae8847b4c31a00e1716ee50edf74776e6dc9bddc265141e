'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var qualifiers_textStyle = require('../../qualifiers/textStyle.cjs');
var qualifiers_textStroke = require('../../qualifiers/textStroke.cjs');
require('../../tslib.es6-f1398b83.cjs');
require('../../qualifiers/fontWeight.cjs');
require('../../qualifiers/fontStyle.cjs');
require('../../qualifiers/textDecoration.cjs');
require('../utils/serializeCloudinaryCharacters.cjs');
require('./QualifierModel.cjs');
require('./qualifierToJson.cjs');
require('../utils/unsupportedError.cjs');
require('./IStrokeModel.cjs');

/**
 * Create TextStyle from ITextStyleModel
 * @param textStyleModel
 */
function createTextStyleFromModel(textStyleModel) {
    var fontFamily = textStyleModel.fontFamily, fontSize = textStyleModel.fontSize, fontWeight = textStyleModel.fontWeight, fontStyle = textStyleModel.fontStyle, fontAntialias = textStyleModel.fontAntialias, fontHinting = textStyleModel.fontHinting, textDecoration = textStyleModel.textDecoration, textAlignment = textStyleModel.textAlignment, stroke = textStyleModel.stroke, letterSpacing = textStyleModel.letterSpacing, lineSpacing = textStyleModel.lineSpacing;
    var result = new qualifiers_textStyle.TextStyle(fontFamily, fontSize);
    if (fontWeight) {
        result.fontWeight(fontWeight);
    }
    if (fontStyle) {
        result.fontStyle(fontStyle);
    }
    if (fontAntialias) {
        result.fontAntialias(fontAntialias);
    }
    if (fontHinting) {
        result.fontHinting(fontHinting);
    }
    if (textDecoration) {
        result.textDecoration(textDecoration);
    }
    if (textAlignment) {
        result.textAlignment(textAlignment);
    }
    if (stroke) {
        result.stroke();
        if (typeof stroke !== "boolean") {
            result.stroke(qualifiers_textStroke.solid(stroke.width, stroke.color));
        }
    }
    if (letterSpacing) {
        result.letterSpacing(letterSpacing);
    }
    if (lineSpacing) {
        result.lineSpacing(lineSpacing);
    }
    return result;
}

exports.createTextStyleFromModel = createTextStyleFromModel;
