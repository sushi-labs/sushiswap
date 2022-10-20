/**
 * Parse layer options
 * @private
 * @param {object|*} layer The layer to parse.
 * @return {string} layer transformation string
 */
import { isObject } from "../utils/isObject.js";
import { base64Encode } from "../../internal/utils/base64Encode.js";
import { LAYER_KEYWORD_PARAMS } from "../consts.js";
import { smartEscape } from "../utils/smartEscape.js";
import TextLayer from "../legacyLayer/textlayer.js";
import Layer from "../legacyLayer/layer.js";
export function textStyle(layer) {
    const keywords = [];
    let style = "";
    Object.keys(LAYER_KEYWORD_PARAMS).forEach((attr) => {
        let default_value = LAYER_KEYWORD_PARAMS[attr];
        let attr_value = layer[attr] || default_value;
        if (attr_value !== default_value) {
            keywords.push(attr_value);
        }
    });
    Object.keys(layer).forEach((attr) => {
        if (attr === "letter_spacing" || attr === "line_spacing") {
            keywords.push(`${attr}_${layer[attr]}`);
        }
        if (attr === "font_hinting") {
            keywords.push(`${attr.split("_").pop()}_${layer[attr]}`);
        }
        if (attr === "font_antialiasing") {
            keywords.push(`antialias_${layer[attr]}`);
        }
    });
    if (layer.hasOwnProperty("font_size" || "font_family") || !keywords || keywords.length === 0) {
        if (!layer.font_size)
            throw `Must supply font_size for text in overlay/underlay`;
        if (!layer.font_family)
            throw `Must supply font_family for text in overlay/underlay`;
        keywords.unshift(layer.font_size);
        keywords.unshift(layer.font_family);
        style = keywords.filter((a) => a).join("_");
    }
    return style;
}
export function processLayer(layer) {
    if (layer instanceof TextLayer || layer instanceof Layer) {
        return layer.toString();
    }
    let result = '';
    if (isObject(layer)) {
        if (layer.resource_type === "fetch" || (layer.url != null)) {
            result = `fetch:${base64Encode(layer.url)}`;
        }
        else {
            let public_id = layer.public_id;
            let format = layer.format;
            let resource_type = layer.resource_type || "image";
            let type = layer.type || "upload";
            let text = layer.text;
            let style = null;
            let components = [];
            const noPublicId = !public_id || public_id.length === 0;
            if (!noPublicId) {
                public_id = public_id.replace(new RegExp("/", 'g'), ":");
                if (format != null) {
                    public_id = `${public_id}.${format}`;
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
                    const noStyle = !style;
                    if (!(noPublicId || noStyle) || (noPublicId && noStyle)) {
                        throw "Must supply either style parameters or a public_id when providing text parameter in a text overlay/underlay";
                    }
                    let re = /\$\([a-zA-Z]\w*\)/g;
                    let start = 0;
                    let textSource = smartEscape(decodeURIComponent(text), /[,\/]/g);
                    text = "";
                    for (let res = re.exec(textSource); res; res = re.exec(textSource)) {
                        text += smartEscape(textSource.slice(start, res.index));
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
            result = components.filter((a) => a).join(":");
        }
    }
    else if (/^fetch:.+/.test(layer)) {
        result = `fetch:${base64Encode(layer.substr(6))}`;
    }
    else {
        result = layer;
    }
    return result;
}
