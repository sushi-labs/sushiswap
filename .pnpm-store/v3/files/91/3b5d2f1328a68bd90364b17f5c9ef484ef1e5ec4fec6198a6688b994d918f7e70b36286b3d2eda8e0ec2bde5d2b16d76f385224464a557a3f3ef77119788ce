'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var actions_resize_ResizePadAction = require('./resize/ResizePadAction.cjs');
var actions_resize_ResizeSimpleAction = require('./resize/ResizeSimpleAction.cjs');
var actions_resize_ResizeScaleAction = require('./resize/ResizeScaleAction.cjs');
var actions_resize_ThumbnailAction = require('./resize/ThumbnailAction.cjs');
var actions_resize_ResizeCropAction = require('./resize/ResizeCropAction.cjs');
var actions_resize_ResizeFillAction = require('./resize/ResizeFillAction.cjs');
var actions_resize_ResizeLimitFitAction = require('./resize/ResizeLimitFitAction.cjs');
var actions_resize_ResizeLimitFillAction = require('./resize/ResizeLimitFillAction.cjs');
var actions_resize_ResizeLimitPadAction = require('./resize/ResizeLimitPadAction.cjs');
var actions_resize_ResizeMinimumPadAction = require('./resize/ResizeMinimumPadAction.cjs');
require('../tslib.es6-f1398b83.cjs');
require('../internal/qualifier/Qualifier.cjs');
require('../internal/qualifier/QualifierValue.cjs');
require('../internal/models/QualifierModel.cjs');
require('../internal/models/qualifierToJson.cjs');
require('../internal/utils/unsupportedError.cjs');
require('./resize/ResizeAdvancedAction.cjs');
require('../internal/models/createGravityModel.cjs');
require('../qualifiers/gravity/autoGravity/AutoGravity.cjs');
require('../qualifiers/gravity/GravityQualifier.cjs');
require('../qualifiers/gravity/focusOnGravity/FocusOnGravity.cjs');
require('../qualifiers/gravity.cjs');
require('../qualifiers/gravity/compassGravity/CompassGravity.cjs');
require('../qualifiers/gravity/xyCenterGravity/XYCenterGravity.cjs');
require('../qualifiers/gravity/qualifiers/focusOn/FocusOnValue.cjs');
require('../internal/models/createGravityFromModel.cjs');
require('../qualifiers/focusOn.cjs');
require('../qualifiers/autoFocus.cjs');
require('../qualifiers/gravity/qualifiers/compass/CompassQualifier.cjs');
require('../internal/models/createBackgroundModel.cjs');
require('../qualifiers/background/shared/BlurredBackgroundAction.cjs');
require('../qualifiers/background/shared/base/BackgroundQualifier.cjs');
require('../qualifiers/background/shared/auto/BackgroundAutoBorderQualifier.cjs');
require('../qualifiers/background/shared/base/BaseCommonBackground.cjs');
require('../internal/utils/prepareColor.cjs');
require('../qualifiers/background/shared/gradient/BackgroundBorderGradientQualifier.cjs');
require('../qualifiers/background/shared/base/BaseGradientBackground.cjs');
require('../qualifiers/background/shared/gradient/BackgroundPredominantGradientQualifier.cjs');
require('../qualifiers/background/shared/auto/BackgroundAutoPredominantQualifier.cjs');
require('../internal/models/createBackgroundFromModel.cjs');
require('../qualifiers/rotate/RotationModeQualifierValue.cjs');
require('../qualifiers/region/CustomRegion.cjs');
require('../qualifiers/region/NamedRegion.cjs');
require('../internal/Action.cjs');
require('../qualifiers/flag/FlagQualifier.cjs');
require('../internal/utils/dataStructureUtils.cjs');
require('../internal/models/ActionModel.cjs');
require('../internal/models/actionToJson.cjs');
require('../qualifiers/position/PositionQualifier.cjs');
require('../qualifiers/flag.cjs');
require('../qualifiers/gradientDirection/GradientDirectionQualifierValue.cjs');
require('../qualifiers/format/FormatQualifier.cjs');
require('../internal/internalConstants.cjs');
require('../internal/utils/objectFlip.cjs');
require('../qualifiers/expression/ExpressionQualifier.cjs');
require('../qualifiers/background.cjs');
require('../qualifiers/aspectRatio/AspectRatioQualifierValue.cjs');
require('../qualifiers/animatedFormat/AnimatedFormatQualifierValue.cjs');
require('../qualifiers/source/sourceTypes/VideoSource.cjs');
require('../qualifiers/source/BaseSource.cjs');
require('../qualifiers/source/sourceTypes/ImageSource.cjs');
require('../qualifiers/source/sourceTypes/SubtitlesSource.cjs');
require('../qualifiers/source/sourceTypes/BaseTextSource.cjs');
require('../qualifiers/textStyle.cjs');
require('../qualifiers/fontWeight.cjs');
require('../qualifiers/fontStyle.cjs');
require('../qualifiers/textDecoration.cjs');
require('../internal/utils/serializeCloudinaryCharacters.cjs');
require('../qualifiers/textStroke.cjs');
require('../internal/models/IStrokeModel.cjs');
require('../qualifiers/source/sourceTypes/FetchSource.cjs');
require('../internal/utils/base64Encode.cjs');
require('../qualifiers/source/sourceTypes/TextSource.cjs');
require('../internal/models/createTextStyleFromModel.cjs');
require('../internal/utils/toFloatAsString.cjs');

/**
 * @description Determines how to crop, scale, and/or zoom the delivered asset according to the requested dimensions.
 * @memberOf Actions
 * @namespace Resize
 * @see Learn more about Gravity and Focus {@link Qualifiers.Gravity| here }
 * @example
 * <caption> <h4>Scaling an image</h4> </caption>
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {scale, fit, pad, crop} from '@cloudinary/url-gen/actions/resize';
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 *
 * image.resize( scale(100, 100) );
 * // All resize actions have a similar interface.
 * // image.resize( fit(100, 100)) );
 * // image.resize( pad(100, 100)) );
 * // image.resize( crop(100, 100)) );
 * // However, Some actions have additional arguments exposed as builder methods.
 * // See the documentation for each method for more information
 *
 *
 * // Alternative syntax, using builder methods
 * image.resize(
 *  scale()
 *    .width(100)
 *    .height(100)
 * );
 * image.toURL()
 *
 * @example
 * <caption> <h4>Cropping with automatic focus(Gravity)</h4> </caption>
 * import {Cloudinary} from "@cloudinary/url-gen";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 *
 * import {scale} from '@cloudinary/url-gen/actions/resize';
 * import {autoGravity} from '@cloudinary/url-gen/qualifiers/gravity';
 *
 * image.resize( crop(100, 100).gravity(autoGravity()) );
 *
 * // Alternative syntax, using builder methods
 * image.resize(
 *  scale()
 *    .width(100)
 *    .height(100)
 *    .gravity(autoGravity())
 * );
 * image.toURL()
 */
/**
 * @summary action
 * @description
 * Changes the size of the image exactly to the given width and height without necessarily retaining the original aspect ratio:<br/>
 * all original image parts are visible but might be stretched or shrunk.
 * @memberOf Actions.Resize
 * @param {number|string} width The required width of a transformed asset.
 * @param {number|string} height The required height of a transformed asset.
 * @return {Actions.Resize.ScaleAction}
 */
function scale(width, height) {
    return new actions_resize_ResizeScaleAction.ResizeScaleAction('scale', width, height);
}
/**
 * @summary action
 * @description
 * Scales your image based on automatically calculated areas of interest within each specific photo.
 *
 * For details, see the Imagga Crop and Scale {@link  https://cloudinary.com/documentation/imagga_crop_and_scale_addon#smartly_scale_images|add-on documentation}.
 * @memberOf Actions.Resize
 * @param {number|string} width The required width of a transformed asset.
 * @param {number|string} height The required height of a transformed asset.
 * @return {Actions.Resize.ResizeSimpleAction}
 */
function imaggaScale(width, height) {
    return new actions_resize_ResizeSimpleAction.ResizeSimpleAction('imagga_scale', width, height);
}
/**
 * @summary action
 * @description
 * Crops your image based on automatically calculated areas of interest within each specific photo.
 *
 * For details, see the Imagga Crop and Scale {@link  https://cloudinary.com/documentation/imagga_crop_and_scale_addon#smartly_crop_images|add-on documentation}.
 * @memberOf Actions.Resize
 * @param {number|string} width The required width of a transformed asset.
 * @param {number|string} height The required height of a transformed asset.
 * @return {Actions.Resize.ResizeSimpleAction}
 */
function imaggaCrop(width, height) {
    return new actions_resize_ResizeSimpleAction.ResizeSimpleAction('imagga_crop', width, height);
}
/**
 * @summary action
 * @description Extracts a region of the given width and height out of the original image.
 * @memberOf Actions.Resize
 * @param {number|string} width The required width of a transformed asset.
 * @param {number|string} height The required height of a transformed asset.
 * @return {Actions.Resize.ResizeCropAction}
 */
function crop(width, height) {
    return new actions_resize_ResizeCropAction.ResizeCropAction('crop', width, height);
}
/**
 * @summary action
 * @description
 * Creates an image with the exact given width and height without distorting the image.<br/>
 * This option first scales up or down as much as needed to at least fill both of the given dimensions.<br/><br/>
 * If the requested aspect ratio is different than the original, cropping will occur on the dimension that exceeds the requested size after scaling.
 * @memberOf Actions.Resize
 * @param {number|string} width The required width of a transformed asset.
 * @param {number|string} height The required height of a transformed asset.
 * @return {Actions.Resize.ResizeFillAction}
 */
function fill(width, height) {
    return new actions_resize_ResizeFillAction.ResizeFillAction('fill', width, height);
}
/**
 * @summary action
 * @description
 * The image is resized so that it takes up as much space as possible within a bounding box defined by the given width and height parameters.</br>
 * The original aspect ratio is retained and all of the original image is visible.
 * @memberOf Actions.Resize
 * @param {number|string} width The required width of a transformed asset.
 * @param {number|string} height The required height of a transformed asset.
 * @return {Actions.Resize.ResizeSimpleAction}
 */
function fit(width, height) {
    return new actions_resize_ResizeSimpleAction.ResizeSimpleAction('fit', width, height);
}
/**
 * @summary action
 * @description
 * Resizes the asset to fill the given width and height while retaining the original aspect ratio.
 *
 * If the proportions of the original asset do not match the given width and height, padding is added to the asset
 * to reach the required size.
 * @memberOf Actions.Resize
 * @param {number|string} width The required width of a transformed asset.
 * @param {number|string} height The required height of a transformed asset.
 * @return {Actions.Resize.ResizePadAction}
 */
function pad(width, height) {
    return new actions_resize_ResizePadAction.ResizePadAction('pad', width, height);
}
/**
 * @summary action
 * @description
 * Creates an asset with the exact given width and height without distorting the asset, but only if the original
 * asset is larger than the specified resolution limits.
 *
 * The asset is scaled down to fill the given width and height without distorting the asset, and then the dimension
 * that exceeds the request is cropped. If the original dimensions are both smaller than the requested size, it is
 * not resized at all.
 *
 * @memberOf Actions.Resize
 * @param {number|string} width The required width of a transformed asset.
 * @param {number|string} height The required height of a transformed asset.
 * @return {Actions.Resize.ResizeLimitFillAction}
 */
function limitFill(width, height) {
    return new actions_resize_ResizeLimitFillAction.ResizeLimitFillAction('lfill', width, height);
}
/**
 * @summary action
 * @description
 * Resizes the asset so that it takes up as much space as possible within a bounding box defined by the given
 * width and height parameters, but only if the original asset is larger than the given limit (width and height).
 *
 * The asset is scaled down, the original aspect ratio is retained and all of the original asset is visible.
 * @memberOf Actions.Resize
 * @param {number|string} width The required width of a transformed asset.
 * @param {number|string} height The required height of a transformed asset.
 * @return {Actions.Resize.ResizeSimpleAction}
 */
function limitFit(width, height) {
    return new actions_resize_ResizeLimitFitAction.ResizeLimitFitAction('limit', width, height);
}
/**
 * @summary action
 * @description
 * Resizes the asset to fill the given width and height while retaining the original aspect ratio, but only if the
 * original asset is smaller than the given minimum (width and height).
 *
 * The asset is scaled up.  If the proportions of the original asset do not match the given width and height,
 * padding is added to the asset to reach the required size.
 * @memberOf Actions.Resize
 * @param {number|string} width The required width of a transformed asset.
 * @param {number|string} height The required height of a transformed asset.
 * @return {Actions.Resize.ResizePadAction}
 */
function minimumPad(width, height) {
    return new actions_resize_ResizeMinimumPadAction.ResizeMinimumPadAction('mpad', width, height);
}
/**
 * @summary action
 * @description
 * Resizes the asset so that it takes up as much space as possible within a bounding box defined by the given
 * width and height parameters, but only if the original asset is smaller than the given minimum (width and height).
 *
 * The asset is scaled up, the original aspect ratio is retained and all of the original asset is visible.
 * @memberOf Actions.Resize
 * @param {number|string} width The required width of a transformed asset.
 * @param {number|string} height The required height of a transformed asset.
 * @return {Actions.Resize.ResizeSimpleAction}
 */
function minimumFit(width, height) {
    return new actions_resize_ResizeSimpleAction.ResizeSimpleAction('mfit', width, height);
}
/**
 * @summary action
 * @memberOf Actions.Resize
 * @description
 * Tries to prevent a "bad crop" by first attempting to use the fill mode, but adding padding if it is determined
 * that more of the original image needs to be included in the final image.
 *
 * Especially useful if the aspect ratio of the delivered image is considerably different from the original's
 * aspect ratio.
 *
 * Only supported in conjunction with Automatic cropping.
 *
 * @param {number|string} width The required width of a transformed asset.
 * @param {number|string} height The required height of a transformed asset.
 * @return {Actions.Resize.ResizePadAction}
 */
function fillPad(width, height) {
    return new actions_resize_ResizePadAction.ResizePadAction('fill_pad', width, height);
}
/**
 * @summary action
 * @description
 * The thumb cropping mode is specifically used for creating image thumbnails from either face or custom coordinates,</br>
 * and must always be accompanied by the gravity parameter set to one of the face detection or custom values.
 * @memberOf Actions.Resize
 * @param {number|string} width The required width of a transformed asset.
 * @param {number|string} height The required height of a transformed asset.
 * @return {Actions.Resize.ThumbResizeAction}
 */
function thumbnail(width, height) {
    return new actions_resize_ThumbnailAction.ThumbResizeAction('thumb', width, height);
}
/**
 * @summary action
 * @description
 * Resizes the asset to fill the given width and height while retaining the original aspect ratio, but only if the
 * original asset is larger than the given limit (width and height).
 *
 * The asset is scaled down.  If the proportions of the original asset do not match the given width and height,
 * padding is added to the asset to reach the required size.
 *
 * @memberOf Actions.Resize
 * @param {number|string} width The required width of a transformed asset.
 * @param {number|string} height The required height of a transformed asset.
 * @return {Actions.Resize.ResizePadAction}
 */
function limitPad(width, height) {
    return new actions_resize_ResizeLimitPadAction.ResizeLimitPadAction('lpad', width, height);
}
var Resize = {
    imaggaScale: imaggaScale,
    imaggaCrop: imaggaCrop,
    crop: crop,
    fill: fill,
    scale: scale,
    minimumPad: minimumPad,
    fit: fit,
    pad: pad,
    limitFit: limitFit,
    thumbnail: thumbnail,
    limitFill: limitFill,
    minimumFit: minimumFit,
    limitPad: limitPad,
    fillPad: fillPad
};

exports.Resize = Resize;
exports.crop = crop;
exports.fill = fill;
exports.fillPad = fillPad;
exports.fit = fit;
exports.imaggaCrop = imaggaCrop;
exports.imaggaScale = imaggaScale;
exports.limitFill = limitFill;
exports.limitFit = limitFit;
exports.limitPad = limitPad;
exports.minimumFit = minimumFit;
exports.minimumPad = minimumPad;
exports.pad = pad;
exports.scale = scale;
exports.thumbnail = thumbnail;
