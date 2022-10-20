'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var backwards_transformationProcessing_processLayer = require('./transformationProcessing/processLayer.cjs');
var backwards_transformationProcessing_processIf = require('./transformationProcessing/processIf.cjs');
var backwards_utils_toArray = require('./utils/toArray.cjs');
var backwards_transformationProcessing_processRadius = require('./transformationProcessing/processRadius.cjs');
var backwards_utils_isObject = require('./utils/isObject.cjs');
var backwards_transformationProcessing_processCustomFunction = require('./transformationProcessing/processCustomFunction.cjs');
var backwards_transformationProcessing_processCustomPreFunction = require('./transformationProcessing/processCustomPreFunction.cjs');
var backwards_utils_splitRange = require('./utils/splitRange.cjs');
var backwards_utils_legacyNormalizeExpression = require('./utils/legacyNormalizeExpression.cjs');
var backwards_utils_norm_range_values = require('./utils/norm_range_values.cjs');
var backwards_transformationProcessing_processVideoParams = require('./transformationProcessing/processVideoParams.cjs');
var backwards_transformation = require('./transformation.cjs');
var backwards_transformationProcessing_processDpr = require('./transformationProcessing/processDpr.cjs');
require('../internal/utils/base64Encode.cjs');
require('./consts.cjs');
require('./utils/smartEscape.cjs');
require('./legacyLayer/textlayer.cjs');
require('../tslib.es6-f1398b83.cjs');
require('./legacyLayer/layer.cjs');
require('./utils/snakeCase.cjs');
require('./utils/isEmpty.cjs');
require('./utils/isNumberLike.cjs');
require('./condition.cjs');
require('./expression.cjs');
require('./configuration.cjs');
require('../internal/utils/cloneDeep.cjs');
require('./utils/legacyBaseUtil.cjs');
require('./legacyLayer/subtitleslayer.cjs');
require('./legacyLayer/fetchlayer.cjs');
require('../internal/utils/dataStructureUtils.cjs');
require('./utils/isFunction.cjs');

/**
 * Things dropped
 * - responsive_width
 * - config().dpr
 * - SSL Detected
 * - Provisioning API
 * - Magical configuration auto-mapping (everything has to be explicit)
 * - Signatures
 * - Secure is default true
 * @param transformationOptions
 */
function generateTransformationString(transformationOptions) {
    if (typeof transformationOptions === 'string') {
        return transformationOptions;
    }
    if (transformationOptions instanceof backwards_transformation["default"]) {
        return transformationOptions.toString();
    }
    if (Array.isArray(transformationOptions)) {
        return transformationOptions
            .map(function (singleTransformation) {
            return generateTransformationString(singleTransformation);
        }).filter(function (a) { return a; }).join('/');
    }
    // let responsive_width = consumeOption(transformationOptions, "responsive_width", config().responsive_width);
    var width;
    var height;
    var size = transformationOptions.size;
    var hasLayer = transformationOptions.overlay || transformationOptions.underlay;
    var crop = transformationOptions.crop;
    var angle = backwards_utils_toArray.toArray(transformationOptions.angle).join(".");
    var background = (transformationOptions.background || '').replace(/^#/, "rgb:");
    var color = (transformationOptions.color || '').replace(/^#/, "rgb:");
    var flags = (backwards_utils_toArray.toArray(transformationOptions.flags || [])).join('.');
    var dpr = transformationOptions.dpr === undefined ? transformationOptions.dpr : backwards_transformationProcessing_processDpr.processDpr(transformationOptions.dpr);
    var overlay = backwards_transformationProcessing_processLayer.processLayer(transformationOptions.overlay);
    var radius = backwards_transformationProcessing_processRadius.processRadius(transformationOptions.radius);
    var underlay = backwards_transformationProcessing_processLayer.processLayer(transformationOptions.underlay);
    var ifValue = backwards_transformationProcessing_processIf.process_if(transformationOptions.if);
    var custom_function = backwards_transformationProcessing_processCustomFunction.processCustomFunction(transformationOptions.custom_function);
    var custom_pre_function = backwards_transformationProcessing_processCustomPreFunction.processCustomPreFunction(transformationOptions.custom_pre_function);
    // These will change down the line, heads up!
    var fps = transformationOptions.fps;
    var namedTransformations = [];
    var childTransformations = backwards_utils_toArray.toArray(transformationOptions.transformation || []);
    var effect = transformationOptions.effect;
    // TODO, Do we need this?
    var no_html_sizes = hasLayer || angle || crop === "fit" || crop === "limit";
    if (size) {
        var _a = size.split("x"), sizeWidth = _a[0], sizeHeight = _a[1];
        width = sizeWidth;
        height = sizeHeight;
    }
    else {
        width = transformationOptions.width;
        height = transformationOptions.height;
    }
    if (width && (width.toString().indexOf("auto") === 0 || no_html_sizes || parseFloat(width.toString()) < 1)) {
        delete transformationOptions.width;
    }
    if (height && (no_html_sizes || parseFloat(height.toString()) < 1)) {
        delete transformationOptions.height;
    }
    // Is any child transformation an object?
    var isAnyChildAnObject = childTransformations.some(function (transformation) { return typeof transformation === 'object'; });
    // If array of objects, or array of strings?
    if (isAnyChildAnObject) {
        childTransformations = childTransformations.map(function (transformation) {
            if (backwards_utils_isObject.isObject(transformation)) {
                return generateTransformationString(transformation);
            }
            else {
                return generateTransformationString({ transformation: transformation });
            }
        }).filter(function (a) { return a; });
    }
    else {
        namedTransformations = childTransformations.join(".");
        childTransformations = []; // Reset child transfomrations
    }
    if (Array.isArray(effect)) {
        effect = effect.join(":");
    }
    else if (backwards_utils_isObject.isObject(effect)) {
        effect = Object.entries(effect).map(function (_a) {
            var key = _a[0], value = _a[1];
            return key + ":" + value;
        });
    }
    var border = transformationOptions.border;
    if (backwards_utils_isObject.isObject(border)) {
        border = (border.width != null ? border.width : 2) + "px_solid_" + (border.color != null ? border.color : "black").replace(/^#/, 'rgb:');
    }
    else {
        // @ts-ignore
        if (/^\d+$/.exec(border)) { // fallback to html border attributes
            transformationOptions.border = border;
            border = void 0;
        }
    }
    if (Array.isArray(fps)) {
        fps = fps.join('-');
    }
    // ocr(value) {
    //   return this.param(value, "ocr", "ocr");
    // }
    var urlParams = {
        a: backwards_utils_legacyNormalizeExpression.legacyNormalizeExpression(angle),
        ar: backwards_utils_legacyNormalizeExpression.legacyNormalizeExpression(transformationOptions.aspect_ratio),
        b: background,
        bo: border,
        c: crop,
        co: color,
        dpr: backwards_utils_legacyNormalizeExpression.legacyNormalizeExpression(dpr),
        e: backwards_utils_legacyNormalizeExpression.legacyNormalizeExpression(effect),
        fl: flags,
        fn: custom_function || custom_pre_function,
        fps: fps,
        h: backwards_utils_legacyNormalizeExpression.legacyNormalizeExpression(height),
        ki: backwards_utils_legacyNormalizeExpression.legacyNormalizeExpression(transformationOptions.keyframe_interval),
        l: overlay,
        o: backwards_utils_legacyNormalizeExpression.legacyNormalizeExpression(transformationOptions.opacity),
        q: backwards_utils_legacyNormalizeExpression.legacyNormalizeExpression(transformationOptions.quality),
        r: radius,
        t: namedTransformations,
        u: underlay,
        w: backwards_utils_legacyNormalizeExpression.legacyNormalizeExpression(width),
        x: backwards_utils_legacyNormalizeExpression.legacyNormalizeExpression(transformationOptions.x),
        y: backwards_utils_legacyNormalizeExpression.legacyNormalizeExpression(transformationOptions.y),
        z: backwards_utils_legacyNormalizeExpression.legacyNormalizeExpression(transformationOptions.zoom),
        ac: transformationOptions.audio_codec,
        af: transformationOptions.audio_frequency,
        br: transformationOptions.bit_rate,
        cs: transformationOptions.color_space,
        d: transformationOptions.default_image,
        dl: transformationOptions.delay,
        dn: transformationOptions.density,
        du: backwards_utils_norm_range_values.normRangeValues(transformationOptions.duration),
        eo: backwards_utils_norm_range_values.normRangeValues(backwards_utils_splitRange.splitRange(transformationOptions.offset)[1]),
        f: transformationOptions.fetch_format,
        g: transformationOptions.gravity,
        pg: transformationOptions.page,
        p: transformationOptions.prefix,
        so: backwards_utils_norm_range_values.normRangeValues(backwards_utils_splitRange.splitRange(transformationOptions.offset)[0]),
        sp: transformationOptions.streaming_profile,
        vc: backwards_transformationProcessing_processVideoParams.processVideoParams(transformationOptions.video_codec),
        vs: transformationOptions.video_sampling
    };
    // We can accept variables in here transformationOptions, or in here transformationOptions.variables
    var variables = Object.entries(transformationOptions)
        .filter(function (_a) {
        var key = _a[0]; _a[1];
        return key.startsWith('$');
    })
        .map(function (_a) {
        var key = _a[0], value = _a[1];
        // delete transformationOptions[key]; // Delete the variables, so we don't add them twice
        return key + "_" + backwards_utils_legacyNormalizeExpression.legacyNormalizeExpression(value);
    }).sort().concat(
    // @ts-ignore
    (transformationOptions.variables || []).map(function (_a) {
        var name = _a[0], value = _a[1];
        return name + "_" + backwards_utils_legacyNormalizeExpression.legacyNormalizeExpression(value);
    })).join(',');
    // Clean up!
    var urlImageTransfomrations = Object.entries(urlParams)
        .filter(function (_a) {
        _a[0]; var value = _a[1];
        if (typeof value === 'undefined' || value === null) {
            return false;
        }
        if (typeof value === 'string' && value.length === 0) {
            return false;
        }
        if (Array.isArray(value) && value.length === 0) {
            return false;
        }
        return true;
    })
        .map(function (_a) {
        var key = _a[0], value = _a[1];
        return key + "_" + value;
    })
        .sort()
        .join(',');
    var finalTransformationString = [
        ifValue,
        variables,
        urlImageTransfomrations,
        transformationOptions.raw_transformation
    ].filter(function (a) { return a; }).join(",");
    if (finalTransformationString) {
        childTransformations.push(finalTransformationString);
    }
    // console.log(childTransformations);
    return childTransformations.join("/");
}

exports.generateTransformationString = generateTransformationString;
