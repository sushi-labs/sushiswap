'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var actions_delivery_DeliveryFormatAction = require('./delivery/DeliveryFormatAction.cjs');
var actions_delivery_DeliveryQualityAction = require('./delivery/DeliveryQualityAction.cjs');
var actions_delivery_DeliveryColorSpaceFromICCAction = require('./delivery/DeliveryColorSpaceFromICCAction.cjs');
var actions_delivery_DeliveryAction = require('./delivery/DeliveryAction.cjs');
var actions_delivery_DeliveryColorSpaceAction = require('./delivery/DeliveryColorSpaceAction.cjs');
var actions_delivery_DeliveryDPRAction = require('./delivery/DeliveryDPRAction.cjs');
require('../tslib.es6-f1398b83.cjs');
require('../qualifiers/flag.cjs');
require('../qualifiers/flag/FlagQualifier.cjs');
require('../internal/qualifier/QualifierValue.cjs');
require('../internal/qualifier/Qualifier.cjs');
require('../internal/models/QualifierModel.cjs');
require('../internal/models/qualifierToJson.cjs');
require('../internal/utils/unsupportedError.cjs');
require('../qualifiers/progressive.cjs');
require('../internal/internalConstants.cjs');
require('../internal/utils/objectFlip.cjs');
require('../internal/Action.cjs');
require('../internal/utils/dataStructureUtils.cjs');
require('../internal/models/ActionModel.cjs');
require('../internal/models/actionToJson.cjs');
require('../qualifiers/format/FormatQualifier.cjs');
require('../qualifiers/colorSpace.cjs');
require('../internal/utils/toFloatAsString.cjs');

/**
 * @description Defines transformations for delivering your assets without changing the visual or audio experience for the end user.
 * @memberOf Actions
 * @namespace Delivery
 * @example
 * See the examples under every method
 */
/**
 * @summary action
 * @description Defines the format of the delivered asset.
 *
 * <b>Learn more:</b>
 * {@link https://cloudinary.com/documentation/image_transformations#image_format_support|Image formats}
 * {@link https://cloudinary.com/documentation/video_manipulation_and_delivery#transcoding_video_to_other_formats|Video formats}
 *
 * @memberOf Actions.Delivery
 * @param {string} format The file format. For a list of supported format types see {@link Qualifiers.Format| format types} for
 * possible values
 * @return {Actions.Delivery.DeliveryFormat}
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {format} from "@cloudinary/url-gen/actions/delivery";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.delivery(
 *  format('jpg'),
 * );
 *
 */
function format(format) {
    return new actions_delivery_DeliveryFormatAction.DeliveryFormatAction('f', format);
}
/**
 * @summary action
 * @description Deliver the image in the specified device pixel ratio.
 * @memberOf Actions.Delivery
 * @param {string} dpr The DPR (Device Pixel Ratio). Any positive float value.
 * @return {Actions.Delivery.DeliveryAction}
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {dpr} from "@cloudinary/url-gen/actions/delivery";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.delivery(
 *  dpr('2.0'),
 * );
 */
function dpr(dpr) {
    return new actions_delivery_DeliveryDPRAction.DeliveryDPRAction(dpr);
}
/**
 * @summary action
 * @description Controls the quality of the delivered image or video.
 *
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_optimization#how_to_optimize_image_quality|Image quality}
 *  {@link https://cloudinary.com/documentation/video_manipulation_and_delivery#quality_control|Video quality}
 * @memberOf Actions.Delivery
 * @param {QualityTypes | string | number | Qualifiers.Quality} qualityType For a list of supported quality types see
 * {@link Qualifiers.Quality| quality types} for
 * possible values.
 * @return {Actions.Delivery.DeliveryQualityAction}
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {quality} from "@cloudinary/url-gen/actions/delivery";
 * import {quality} from "@cloudinary/url-gen/qualifiers/quantity";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.delivery(
 *  quality('auto'),
 * );
 */
function quality(qualityType) {
    return new actions_delivery_DeliveryQualityAction.DeliveryQualityAction(qualityType);
}
/**
 * @summary action
 * @description Controls the density to use when delivering an image or when converting a vector file such as a PDF or EPS
 * document to a web image delivery format.
 * @memberOf Actions.Delivery
 * @param {number | string} value The density in dpi.
 * @return {Actions.Delivery.DeliveryAction}
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {density} from "@cloudinary/url-gen/actions/delivery";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.delivery(
 *  density(150),
 * );
 */
function density(value) {
    return new actions_delivery_DeliveryAction.DeliveryAction('dn', value, 'density');
}
/**
 * @summary action
 * @description Default images can be used in the case that a requested image does not exist.
 * @memberOf Actions.Delivery
 * @param {string} publicIdWithExtension Default image public ID
 * @return {Actions.Delivery.DeliveryAction}
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {defaultImage} from "@cloudinary/url-gen/actions/delivery";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.delivery(
 *  defaultImage('sample'),
 * );
 */
function defaultImage(publicIdWithExtension) {
    return new actions_delivery_DeliveryAction.DeliveryAction('d', publicIdWithExtension, 'defaultImage');
}
/**
 * @summary action
 * @description Controls the color space used for the delivered image.
 * @memberOf Actions.Delivery
 * @param {string | Qualifiers.ColorSpace} mode The color space.
 * @return {Actions.Delivery.DeliveryAction}
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {colorSpace} from "@cloudinary/url-gen/actions/delivery";
 * import {trueColor} from "@cloudinary/url-gen/qualifiers/colorSpace";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.delivery(
 *  colorSpace(trueColor()),
 * );
 */
function colorSpace(mode) {
    return new actions_delivery_DeliveryColorSpaceAction.DeliveryColorSpaceAction(mode);
}
/**
 * @summary action
 * @description Specifies the ICC profile to use for the color space.
 * The ICC file must be uploaded to your account as a raw, authenticated file.
 * @memberOf Actions.Delivery
 * @param {string} publicId The public ID (including the file extension) of the ICC profile that defines the
 * color space.
 * @return {Actions.Delivery.DeliveryColorSpaceFromICC}
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {colorSpaceFromICC} from "@cloudinary/url-gen/actions/delivery";
 * import {trueColor} from "@cloudinary/url-gen/qualifiers/colorSpace";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.delivery(
 *  colorSpaceFromICC('sample.icc'),
 * );
 */
function colorSpaceFromICC(publicId) {
    return new actions_delivery_DeliveryColorSpaceFromICCAction.DeliveryColorSpaceFromICCAction(publicId);
}
var Delivery = {
    format: format,
    dpr: dpr,
    density: density,
    defaultImage: defaultImage,
    colorSpace: colorSpace,
    colorSpaceFromICC: colorSpaceFromICC,
    quality: quality
};

exports.Delivery = Delivery;
exports.colorSpace = colorSpace;
exports.colorSpaceFromICC = colorSpaceFromICC;
exports.defaultImage = defaultImage;
exports.density = density;
exports.dpr = dpr;
exports.format = format;
exports.quality = quality;
