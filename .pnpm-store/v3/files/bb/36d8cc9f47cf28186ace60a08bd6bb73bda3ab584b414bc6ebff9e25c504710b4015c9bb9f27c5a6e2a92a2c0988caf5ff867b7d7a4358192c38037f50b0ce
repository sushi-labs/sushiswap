'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../tslib.es6-f1398b83.cjs');
var internal_qualifier_Qualifier = require('../internal/qualifier/Qualifier.cjs');
require('../internal/qualifier/QualifierValue.cjs');
require('../internal/models/QualifierModel.cjs');
require('../internal/models/qualifierToJson.cjs');
require('../internal/utils/unsupportedError.cjs');

/**
 * @description Contains functions that Applies automatic multi-line text wrap.
 * <b>Learn more</b>: {@link https://cloudinary.com/documentation/layers#adding_multi_line_text|Adding multi line text}
 * @memberOf Qualifiers
 * @namespace TextFitQualifier
 */
var TextFitQualifier = /** @class */ (function (_super) {
    tslib_es6.__extends(TextFitQualifier, _super);
    function TextFitQualifier(width, height) {
        var _this = 
        //@ts-ignore
        _super.call(this) || this;
        _this._width = width;
        _this._height = height;
        return _this;
    }
    TextFitQualifier.prototype.height = function (height) {
        this._height = height;
        return this;
    };
    TextFitQualifier.prototype.toString = function () {
        return this._height ? "c_fit,w_" + this._width + ",h_" + this._height : "c_fit,w_" + this._width;
    };
    return TextFitQualifier;
}(internal_qualifier_Qualifier.Qualifier));
/**
 * @summary qualifier Adding an automatic multi-line text wrap.
 * @memberOf Qualifiers.TextFitQualifier
 * @param {number} width The width in pixels.
 * @param {number} height The height in pixels.
 */
function size(width, height) {
    return new TextFitQualifier(width, height);
}
var TextFit = { size: size };

exports.TextFit = TextFit;
exports.TextFitQualifier = TextFitQualifier;
exports.size = size;
