'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var internal_utils_objectFlip = require('./utils/objectFlip.cjs');

/**
 * This file is for internal constants only.
 * It is not intended for public use and is not part of the public API
 */
/**
 * @private
 */
var ALLOWED_URL_CONFIG = [
    'cname',
    'secureDistribution',
    'privateCdn',
    'signUrl',
    'longUrlSignature',
    'shorten',
    'useRootPath',
    'secure',
    'forceVersion',
    'analytics'
];
/**
 * @private
 */
var ALLOWED_CLOUD_CONFIG = [
    'cloudName',
    'apiKey',
    'apiSecret',
    'authToken'
];
/**
 * @private
 */
var INVALID_TYPE_MESSAGE = 'Invalid Type or key received';
var CONDITIONAL_OPERATORS = {
    "=": "eq",
    "!=": "ne",
    "<": "lt",
    ">": "gt",
    "<=": "lte",
    ">=": "gte",
    "&&": "and",
    "||": "or",
    "*": "mul",
    "/": "div",
    "+": "add",
    "-": "sub",
    "^": "pow"
};
var RESERVED_NAMES = {
    "aspect_ratio": "ar",
    "aspectRatio": "ar",
    "current_page": "cp",
    "currentPage": "cp",
    "duration": "du",
    "face_count": "fc",
    "faceCount": "fc",
    "height": "h",
    "initial_aspect_ratio": "iar",
    "initial_height": "ih",
    "initial_width": "iw",
    "initialAspectRatio": "iar",
    "initialHeight": "ih",
    "initialWidth": "iw",
    "initial_duration": "idu",
    "initialDuration": "idu",
    "page_count": "pc",
    "page_x": "px",
    "page_y": "py",
    "pageCount": "pc",
    "pageX": "px",
    "pageY": "py",
    "tags": "tags",
    "width": "w",
    "trimmed_aspect_ratio": "tar",
    "current_public_id": "cpi",
    "initial_density": "idn",
    "page_names": "pgnames"
};
var ACTION_TYPE_TO_CROP_MODE_MAP = {
    limitFit: 'limit',
    limitFill: 'lfill',
    minimumFit: 'mfit',
    thumbnail: 'thumb',
    limitPad: 'lpad',
    minimumPad: 'mpad'
};
var ACTION_TYPE_TO_DELIVERY_MODE_MAP = {
    colorSpace: 'cs',
    dpr: 'dpr',
    density: 'dn',
    defaultImage: 'd',
    format: 'f',
    quality: 'q'
};
var ACTION_TYPE_TO_EFFECT_MODE_MAP = {
    redEye: 'redeye',
    advancedRedEye: 'adv_redeye',
    oilPaint: 'oil_paint',
    unsharpMask: 'unsharp_mask',
    makeTransparent: 'make_transparent'
};
var ACTION_TYPE_TO_QUALITY_MODE_MAP = {
    autoBest: 'auto:best',
    autoEco: 'auto:eco',
    autoGood: 'auto:good',
    autoLow: 'auto:low',
    jpegminiHigh: 'jpegmini:1',
    jpegminiMedium: 'jpegmini:2',
    jpegminiBest: 'jpegmini:0'
};
var ACTION_TYPE_TO_STREAMING_PROFILE_MODE_MAP = {
    fullHd: 'full_hd',
    fullHdWifi: 'full_hd_wifi',
    fullHdLean: 'full_hd_lean',
    hdLean: 'hd_lean'
};
var CHROMA_VALUE_TO_CHROMA_MODEL_ENUM = {
    444: "CHROMA_444",
    420: "CHROMA_420"
};
var COLOR_SPACE_MODEL_MODE_TO_COLOR_SPACE_MODE_MAP = {
    'noCmyk': 'no_cmyk',
    'keepCmyk': 'keep_cmyk',
    'tinySrgb': 'tinysrgb',
    'srgbTrueColor': 'srgb:truecolor'
};
var ACTION_TYPE_TO_BLEND_MODE_MAP = {
    'antiRemoval': 'anti_removal'
};
var CHROMA_MODEL_ENUM_TO_CHROMA_VALUE = internal_utils_objectFlip.objectFlip(CHROMA_VALUE_TO_CHROMA_MODEL_ENUM);
var COLOR_SPACE_MODE_TO_COLOR_SPACE_MODEL_MODE_MAP = internal_utils_objectFlip.objectFlip(COLOR_SPACE_MODEL_MODE_TO_COLOR_SPACE_MODE_MAP);
var CROP_MODE_TO_ACTION_TYPE_MAP = internal_utils_objectFlip.objectFlip(ACTION_TYPE_TO_CROP_MODE_MAP);
var DELIVERY_MODE_TO_ACTION_TYPE_MAP = internal_utils_objectFlip.objectFlip(ACTION_TYPE_TO_DELIVERY_MODE_MAP);
var EFFECT_MODE_TO_ACTION_TYPE_MAP = internal_utils_objectFlip.objectFlip(ACTION_TYPE_TO_EFFECT_MODE_MAP);
var QUALITY_MODE_TO_ACTION_TYPE_MAP = internal_utils_objectFlip.objectFlip(ACTION_TYPE_TO_QUALITY_MODE_MAP);
var STREAMING_PROFILE_TO_ACTION_TYPE_MAP = internal_utils_objectFlip.objectFlip(ACTION_TYPE_TO_STREAMING_PROFILE_MODE_MAP);

exports.ACTION_TYPE_TO_BLEND_MODE_MAP = ACTION_TYPE_TO_BLEND_MODE_MAP;
exports.ACTION_TYPE_TO_CROP_MODE_MAP = ACTION_TYPE_TO_CROP_MODE_MAP;
exports.ACTION_TYPE_TO_DELIVERY_MODE_MAP = ACTION_TYPE_TO_DELIVERY_MODE_MAP;
exports.ACTION_TYPE_TO_EFFECT_MODE_MAP = ACTION_TYPE_TO_EFFECT_MODE_MAP;
exports.ACTION_TYPE_TO_QUALITY_MODE_MAP = ACTION_TYPE_TO_QUALITY_MODE_MAP;
exports.ACTION_TYPE_TO_STREAMING_PROFILE_MODE_MAP = ACTION_TYPE_TO_STREAMING_PROFILE_MODE_MAP;
exports.ALLOWED_CLOUD_CONFIG = ALLOWED_CLOUD_CONFIG;
exports.ALLOWED_URL_CONFIG = ALLOWED_URL_CONFIG;
exports.CHROMA_MODEL_ENUM_TO_CHROMA_VALUE = CHROMA_MODEL_ENUM_TO_CHROMA_VALUE;
exports.CHROMA_VALUE_TO_CHROMA_MODEL_ENUM = CHROMA_VALUE_TO_CHROMA_MODEL_ENUM;
exports.COLOR_SPACE_MODEL_MODE_TO_COLOR_SPACE_MODE_MAP = COLOR_SPACE_MODEL_MODE_TO_COLOR_SPACE_MODE_MAP;
exports.COLOR_SPACE_MODE_TO_COLOR_SPACE_MODEL_MODE_MAP = COLOR_SPACE_MODE_TO_COLOR_SPACE_MODEL_MODE_MAP;
exports.CONDITIONAL_OPERATORS = CONDITIONAL_OPERATORS;
exports.CROP_MODE_TO_ACTION_TYPE_MAP = CROP_MODE_TO_ACTION_TYPE_MAP;
exports.DELIVERY_MODE_TO_ACTION_TYPE_MAP = DELIVERY_MODE_TO_ACTION_TYPE_MAP;
exports.EFFECT_MODE_TO_ACTION_TYPE_MAP = EFFECT_MODE_TO_ACTION_TYPE_MAP;
exports.INVALID_TYPE_MESSAGE = INVALID_TYPE_MESSAGE;
exports.QUALITY_MODE_TO_ACTION_TYPE_MAP = QUALITY_MODE_TO_ACTION_TYPE_MAP;
exports.RESERVED_NAMES = RESERVED_NAMES;
exports.STREAMING_PROFILE_TO_ACTION_TYPE_MAP = STREAMING_PROFILE_TO_ACTION_TYPE_MAP;
