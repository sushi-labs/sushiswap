'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var backwards_utils_isObject = require('../utils/isObject.cjs');
var internal_utils_base64Encode = require('../../internal/utils/base64Encode.cjs');
var backwards_consts = require('../consts.cjs');
var backwards_utils_smartEscape = require('../utils/smartEscape.cjs');
var backwards_legacyLayer_textlayer = require('../legacyLayer/textlayer.cjs');
var backwards_legacyLayer_layer = require('../legacyLayer/layer.cjs');
require('../../tslib.es6-f1398b83.cjs');
require('../utils/snakeCase.cjs');
require('../utils/isEmpty.cjs');
require('../utils/isNumberLike.cjs');

/**
 * Parse layer options
 * @private
 * @param {object|*} layer The layer to parse.
 * @return {string} layer transformation string
 */
function textStyle(layer) {
    var keywords = [];
    var style = "";
    Object.keys(backwards_consts.LAYER_KEYWORD_PARAMS).forEach(function (attr) {
        var default_value = backwards_consts.LAYER_KEYWORD_PARAMS[attr];
        var attr_value = layer[attr] || default_value;
        if (attr_value !== default_value) {
            keywords.push(attr_value);
        }
    });
    Object.keys(layer).forEach(function (attr) {
        if (attr === "letter_spacing" || attr === "line_spacing") {
            keywords.push(attr + "_" + layer[attr]);
        }
        if (attr === "font_hinting") {
            keywords.push(attr.split("_").pop() + "_" + layer[attr]);
        }
        if (attr === "font_antialiasing") {
            keywords.push("antialias_" + layer[attr]);
        }
    });
    if (layer.hasOwnProperty("font_size" ) || !keywords || keywords.length === 0) {
        if (!layer.font_size)
            throw "Must supply font_size for text in overlay/underlay";
        if (!layer.font_family)
            throw "Must supply font_family for text in overlay/underlay";
        keywords.unshift(layer.font_size);
        keywords.unshift(layer.font_family);
        style = keywords.filter(function (a) { return a; }).join("_");
    }
    return style;
}
function processLayer(layer) {
    if (layer instanceof backwards_legacyLayer_textlayer || layer instanceof backwards_legacyLayer_layer) {
        return layer.toString();
    }
    var result = '';
    if (backwards_utils_isObject.isObject(layer)) {
        if (layer.resource_type === "fetch" || (layer.url != null)) {
            result = "fetch:" + internal_utils_base64Encode.base64Encode(layer.url);
        }
        else {
            var public_id = layer.public_id;
            var format = layer.format;
            var resource_type = layer.resource_type || "image";
            var type = layer.type || "upload";
            var text = layer.text;
            var style = null;
            var components = [];
            var noPublicId = !public_id || public_id.length === 0;
            if (!noPublicId) {
                public_id = public_id.replace(new RegExp("/", 'g'), ":");
                if (format != null) {
                    public_id = public_id + "." + format;
                }
            }
            if ((!text || text.length === 0) && resource_type !== "text") {
                if (noPublicId) {
                    throw "Must supply public_id for resource_type layer_parameter";
                }
                if (resource_type === "subtitles") {
                    style = textStyle(layer);
                }
            }
            else {
                resource_type = "text";
                type = null;
                // type is ignored for text layers
                style = textStyle(layer);
                if (text && text.length >= 0) {
                    var noStyle = !style;
                    if (!(noPublicId || noStyle) || (noPublicId && noStyle)) {
                        throw "Must supply either style parameters or a public_id when providing text parameter in a text overlay/underlay";
                    }
                    var re = /\$\([a-zA-Z]\w*\)/g;
                    var start = 0;
                    var textSource = backwards_utils_smartEscape.smartEscape(decodeURIComponent(text), /[,\/]/g);
                    text = "";
                    for (var res = re.exec(textSource); res; res = re.exec(textSource)) {
                        text += backwards_utils_smartEscape.smartEscape(textSource.slice(start, res.index));
                        text += res[0];
                        start = res.index + res[0].length;
                    }
                    text += encodeURIComponent(textSource.slice(start));
                }
            }
            if (resource_type !== "image") {
                components.push(resource_type);
            }
            if (type !== "upload") {
                components.push(type);
            }
            components.push(style);
            components.push(public_id);
            components.push(text);
            result = components.filter(function (a) { return a; }).join(":");
        }
    }
    else if (/^fetch:.+/.test(layer)) {
        result = "fetch:" + internal_utils_base64Encode.base64Encode(layer.substr(6));
    }
    else {
        result = layer;
    }
    return result;
}

exports.processLayer = processLayer;
exports.textStyle = textStyle;
