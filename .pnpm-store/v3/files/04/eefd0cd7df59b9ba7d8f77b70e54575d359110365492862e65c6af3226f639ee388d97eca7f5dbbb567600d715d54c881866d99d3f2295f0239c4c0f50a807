'use strict';

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var backwards_legacyLayer_layer = require('./layer.cjs');
var backwards_utils_snakeCase = require('../utils/snakeCase.cjs');
var backwards_utils_isEmpty = require('../utils/isEmpty.cjs');
var backwards_utils_smartEscape = require('../utils/smartEscape.cjs');
var backwards_utils_isNumberLike = require('../utils/isNumberLike.cjs');

var TextLayer = /** @class */ (function (_super) {
    tslib_es6.__extends(TextLayer, _super);
    /**
     * @constructor TextLayer
     * @param {Object} options - layer parameters
     */
    function TextLayer(options) {
        var _this = this;
        var keys;
        _this = _super.call(this, options) || this;
        keys = ["resourceType", "resourceType", "fontFamily", "fontSize", "fontWeight", "fontStyle", "textDecoration", "textAlign", "stroke", "letterSpacing", "lineSpacing", "fontHinting", "fontAntialiasing", "text"];
        if (options != null) {
            keys.forEach(function (key) {
                var ref;
                // @ts-ignore
                return _this.options[key] = (ref = options[key]) != null ? ref : options[backwards_utils_snakeCase.snakeCase(key)];
            });
        }
        _this.options.resourceType = "text";
        return _this;
    }
    //@ts-ignore
    TextLayer.prototype.resourceType = function (resourceType) {
        throw "Cannot modify resourceType for text layers";
    };
    //@ts-ignore
    TextLayer.prototype.type = function (type) {
        throw "Cannot modify type for text layers";
    };
    TextLayer.prototype.format = function (format) {
        throw "Cannot modify format for text layers";
    };
    TextLayer.prototype.fontFamily = function (fontFamily) {
        this.options.fontFamily = fontFamily;
        return this;
    };
    TextLayer.prototype.fontSize = function (fontSize) {
        this.options.fontSize = fontSize;
        return this;
    };
    TextLayer.prototype.fontWeight = function (fontWeight) {
        this.options.fontWeight = fontWeight;
        return this;
    };
    TextLayer.prototype.fontStyle = function (fontStyle) {
        this.options.fontStyle = fontStyle;
        return this;
    };
    TextLayer.prototype.textDecoration = function (textDecoration) {
        this.options.textDecoration = textDecoration;
        return this;
    };
    TextLayer.prototype.textAlign = function (textAlign) {
        this.options.textAlign = textAlign;
        return this;
    };
    TextLayer.prototype.stroke = function (stroke) {
        this.options.stroke = stroke;
        return this;
    };
    TextLayer.prototype.letterSpacing = function (letterSpacing) {
        this.options.letterSpacing = letterSpacing;
        return this;
    };
    TextLayer.prototype.lineSpacing = function (lineSpacing) {
        this.options.lineSpacing = lineSpacing;
        return this;
    };
    TextLayer.prototype.fontHinting = function (fontHinting) {
        this.options.fontHinting = fontHinting;
        return this;
    };
    TextLayer.prototype.fontAntialiasing = function (fontAntialiasing) {
        this.options.fontAntialiasing = fontAntialiasing;
        return this;
    };
    TextLayer.prototype.text = function (text) {
        this.options.text = text;
        return this;
    };
    /**
     * generate the string representation of the layer
     * @function TextLayer#toString
     * @return {String}
     */
    TextLayer.prototype.toString = function () {
        var components, hasPublicId, hasStyle, publicId, re, res, start, style, text, textSource;
        style = this.textStyleIdentifier();
        if (this.options.publicId != null) {
            publicId = this.getFullPublicId();
        }
        if (this.options.text != null) {
            hasPublicId = !backwards_utils_isEmpty.isEmpty(publicId);
            hasStyle = !backwards_utils_isEmpty.isEmpty(style);
            if (hasPublicId && hasStyle || !hasPublicId && !hasStyle) {
                throw "Must supply either style parameters or a public_id when providing text parameter in a text overlay/underlay, but not both!";
            }
            re = /\$\([a-zA-Z]\w*\)/g;
            start = 0;
            //        textSource = text.replace(new RegExp("[,/]", 'g'), (c)-> "%#{c.charCodeAt(0).toString(16).toUpperCase()}")
            textSource = backwards_utils_smartEscape.smartEscape(this.options.text, /[,\/]/g);
            text = "";
            while (res = re.exec(textSource)) {
                text += backwards_utils_smartEscape.smartEscape(textSource.slice(start, res.index));
                text += res[0];
                start = res.index + res[0].length;
            }
            text += backwards_utils_smartEscape.smartEscape(textSource.slice(start));
        }
        components = [this.options.resourceType, style, publicId, text];
        return (components).filter(function (x) { return !!x; }).join(":");
    };
    TextLayer.prototype.textStyleIdentifier = function () {
        var components;
        components = [];
        if (this.options.fontWeight !== "normal") {
            components.push(this.options.fontWeight);
        }
        if (this.options.fontStyle !== "normal") {
            components.push(this.options.fontStyle);
        }
        if (this.options.textDecoration !== "none") {
            components.push(this.options.textDecoration);
        }
        components.push(this.options.textAlign);
        if (this.options.stroke !== "none") {
            components.push(this.options.stroke);
        }
        if (!(backwards_utils_isEmpty.isEmpty(this.options.letterSpacing) && !backwards_utils_isNumberLike.isNumberLike(this.options.letterSpacing))) {
            components.push("letter_spacing_" + this.options.letterSpacing);
        }
        if (!(backwards_utils_isEmpty.isEmpty(this.options.lineSpacing) && !backwards_utils_isNumberLike.isNumberLike(this.options.lineSpacing))) {
            components.push("line_spacing_" + this.options.lineSpacing);
        }
        if (!(backwards_utils_isEmpty.isEmpty(this.options.fontAntialiasing))) {
            components.push("antialias_" + this.options.fontAntialiasing);
        }
        if (!(backwards_utils_isEmpty.isEmpty(this.options.fontHinting))) {
            components.push("hinting_" + this.options.fontHinting);
        }
        if (!backwards_utils_isEmpty.isEmpty(components.filter(function (x) { return !!x; }))) {
            if (backwards_utils_isEmpty.isEmpty(this.options.fontFamily)) {
                throw "Must supply fontFamily. " + components;
            }
            if (backwards_utils_isEmpty.isEmpty(this.options.fontSize) && !backwards_utils_isNumberLike.isNumberLike(this.options.fontSize)) {
                throw "Must supply fontSize.";
            }
        }
        components.unshift(this.options.fontFamily, this.options.fontSize);
        components = components.filter(function (x) { return !!x; }).join("_");
        return components;
    };
    return TextLayer;
}(backwards_legacyLayer_layer));

module.exports = TextLayer;
