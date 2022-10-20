import { processLayer } from "./transformationProcessing/processLayer.js";
import { process_if } from "./transformationProcessing/processIf.js";
import { toArray } from "./utils/toArray.js";
import { processRadius } from "./transformationProcessing/processRadius.js";
import { isObject } from "./utils/isObject.js";
import { processCustomFunction } from "./transformationProcessing/processCustomFunction.js";
import { processCustomPreFunction } from "./transformationProcessing/processCustomPreFunction.js";
import { splitRange } from "./utils/splitRange.js";
import { legacyNormalizeExpression } from "./utils/legacyNormalizeExpression.js";
import { normRangeValues } from "./utils/norm_range_values.js";
import { processVideoParams } from "./transformationProcessing/processVideoParams.js";
import Transformation from "./transformation.js";
import { processDpr } from "./transformationProcessing/processDpr.js";
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
export function generateTransformationString(transformationOptions) {
    if (typeof transformationOptions === 'string') {
        return transformationOptions;
    }
    if (transformationOptions instanceof Transformation) {
        return transformationOptions.toString();
    }
    if (Array.isArray(transformationOptions)) {
        return transformationOptions
            .map((singleTransformation) => {
            return generateTransformationString(singleTransformation);
        }).filter((a) => { return a; }).join('/');
    }
    // let responsive_width = consumeOption(transformationOptions, "responsive_width", config().responsive_width);
    let width;
    let height;
    const size = transformationOptions.size;
    const hasLayer = transformationOptions.overlay || transformationOptions.underlay;
    const crop = transformationOptions.crop;
    const angle = toArray(transformationOptions.angle).join(".");
    const background = (transformationOptions.background || '').replace(/^#/, "rgb:");
    const color = (transformationOptions.color || '').replace(/^#/, "rgb:");
    const flags = (toArray(transformationOptions.flags || [])).join('.');
    const dpr = transformationOptions.dpr === undefined ? transformationOptions.dpr : processDpr(transformationOptions.dpr);
    const overlay = processLayer(transformationOptions.overlay);
    const radius = processRadius(transformationOptions.radius);
    const underlay = processLayer(transformationOptions.underlay);
    const ifValue = process_if(transformationOptions.if);
    const custom_function = processCustomFunction(transformationOptions.custom_function);
    const custom_pre_function = processCustomPreFunction(transformationOptions.custom_pre_function);
    // These will change down the line, heads up!
    let fps = transformationOptions.fps;
    let namedTransformations = [];
    let childTransformations = toArray(transformationOptions.transformation || []);
    let effect = transformationOptions.effect;
    // TODO, Do we need this?
    const no_html_sizes = hasLayer || angle || crop === "fit" || crop === "limit";
    if (size) {
        const [sizeWidth, sizeHeight] = size.split("x");
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
    const isAnyChildAnObject = childTransformations.some((transformation) => typeof transformation === 'object');
    // If array of objects, or array of strings?
    if (isAnyChildAnObject) {
        childTransformations = childTransformations.map((transformation) => {
            if (isObject(transformation)) {
                return generateTransformationString(transformation);
            }
            else {
                return generateTransformationString({ transformation });
            }
        }).filter((a) => a);
    }
    else {
        namedTransformations = childTransformations.join(".");
        childTransformations = []; // Reset child transfomrations
    }
    if (Array.isArray(effect)) {
        effect = effect.join(":");
    }
    else if (isObject(effect)) {
        effect = Object.entries(effect).map(([key, value]) => `${key}:${value}`);
    }
    let border = transformationOptions.border;
    if (isObject(border)) {
        border = `${border.width != null ? border.width : 2}px_solid_${(border.color != null ? border.color : "black").replace(/^#/, 'rgb:')}`;
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
    const urlParams = {
        a: legacyNormalizeExpression(angle),
        ar: legacyNormalizeExpression(transformationOptions.aspect_ratio),
        b: background,
        bo: border,
        c: crop,
        co: color,
        dpr: legacyNormalizeExpression(dpr),
        e: legacyNormalizeExpression(effect),
        fl: flags,
        fn: custom_function || custom_pre_function,
        fps: fps,
        h: legacyNormalizeExpression(height),
        ki: legacyNormalizeExpression(transformationOptions.keyframe_interval),
        l: overlay,
        o: legacyNormalizeExpression(transformationOptions.opacity),
        q: legacyNormalizeExpression(transformationOptions.quality),
        r: radius,
        t: namedTransformations,
        u: underlay,
        w: legacyNormalizeExpression(width),
        x: legacyNormalizeExpression(transformationOptions.x),
        y: legacyNormalizeExpression(transformationOptions.y),
        z: legacyNormalizeExpression(transformationOptions.zoom),
        ac: transformationOptions.audio_codec,
        af: transformationOptions.audio_frequency,
        br: transformationOptions.bit_rate,
        cs: transformationOptions.color_space,
        d: transformationOptions.default_image,
        dl: transformationOptions.delay,
        dn: transformationOptions.density,
        du: normRangeValues(transformationOptions.duration),
        eo: normRangeValues(splitRange(transformationOptions.offset)[1]),
        f: transformationOptions.fetch_format,
        g: transformationOptions.gravity,
        pg: transformationOptions.page,
        p: transformationOptions.prefix,
        so: normRangeValues(splitRange(transformationOptions.offset)[0]),
        sp: transformationOptions.streaming_profile,
        vc: processVideoParams(transformationOptions.video_codec),
        vs: transformationOptions.video_sampling
    };
    // We can accept variables in here transformationOptions, or in here transformationOptions.variables
    const variables = Object.entries(transformationOptions)
        .filter(([key, value]) => key.startsWith('$'))
        .map(([key, value]) => {
        // delete transformationOptions[key]; // Delete the variables, so we don't add them twice
        return `${key}_${legacyNormalizeExpression(value)}`;
    }).sort().concat(
    // @ts-ignore
    (transformationOptions.variables || []).map(([name, value]) => `${name}_${legacyNormalizeExpression(value)}`)).join(',');
    // Clean up!
    const urlImageTransfomrations = Object.entries(urlParams)
        .filter(([key, value]) => {
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
        .map(([key, value]) => `${key}_${value}`)
        .sort()
        .join(',');
    const finalTransformationString = [
        ifValue,
        variables,
        urlImageTransfomrations,
        transformationOptions.raw_transformation
    ].filter((a) => a).join(",");
    if (finalTransformationString) {
        childTransformations.push(finalTransformationString);
    }
    // console.log(childTransformations);
    return childTransformations.join("/");
}
