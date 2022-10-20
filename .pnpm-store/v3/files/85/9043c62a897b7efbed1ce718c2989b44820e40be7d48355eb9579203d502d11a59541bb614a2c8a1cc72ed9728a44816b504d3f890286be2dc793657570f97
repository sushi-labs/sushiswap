'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var actions_reshape_CutByImage = require('./reshape/CutByImage.cjs');
var actions_reshape_DistortArc = require('./reshape/DistortArc.cjs');
var actions_reshape_Shear = require('./reshape/Shear.cjs');
var actions_reshape_Distort = require('./reshape/Distort.cjs');
var actions_reshape_TrimAction = require('./reshape/TrimAction.cjs');
require('../tslib.es6-f1398b83.cjs');
require('../internal/Action.cjs');
require('../qualifiers/flag/FlagQualifier.cjs');
require('../internal/qualifier/QualifierValue.cjs');
require('../internal/qualifier/Qualifier.cjs');
require('../internal/models/QualifierModel.cjs');
require('../internal/models/qualifierToJson.cjs');
require('../internal/utils/unsupportedError.cjs');
require('../internal/utils/dataStructureUtils.cjs');
require('../internal/models/ActionModel.cjs');
require('../internal/models/actionToJson.cjs');

/**
 * @summary action
 * @memberOf Actions
 * @namespace Reshape
 * @description Adjusts the shape of the delivered image. </br>
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_transformations#image_shape_changes_and_distortion_effects|Shape changes and distortion effects}
 * @example
 * // Expand every function separately to see its own example
 */
/**
 * @summary action
 * @description Trims pixels according to the transparency levels of a given overlay image.
 * Wherever the overlay image is transparent, the original is shown, and wherever the overlay is opaque, the resulting image is transparent.
 * @param {Qualifiers.Source.ImageSource} imageSource
 * @memberOf Actions.Reshape
 * @return {Actions.Reshape.CutByImage}
 * @example
 * <caption> <h4>Cut an image by using another image(Gravity)</h4> </caption>
 * import {Cloudinary, Transformation} from "@cloudinary/url-gen";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const img = yourCldInstance.image('woman');
 *
 * import {cutByImage} from '@cloudinary/url-gen/actions/reshape';
 * import {image} from "@cloudinary/url-gen/qualifiers/source";
 *
 * img.reshape(
 *    cutByImage(
 *        image('sourceImage').transformation(new Transformation())
 * ))
 * img.toURL()
 */
function cutByImage(imageSource) {
    return new actions_reshape_CutByImage(imageSource);
}
/**
 * @summary action
 * @description Distorts the image to an arc shape.
 *
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/transformation_reference#e_distort|Distorting images}</br>
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_transformations#image_shape_changes_and_distortion_effects|Distortion effects}
 *
 * @param {number} degrees The degrees to arc the image
 * @memberOf Actions.Reshape
 * @return {Actions.Reshape.DistortArcAction}
 * @example
 * <caption> <h4>Distort arc</h4> </caption>
 * import {Cloudinary, Transformation} from "@cloudinary/url-gen";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const img = yourCldInstance.image('woman');
 *
 * import {distortArc} from '@cloudinary/url-gen/actions/reshape';
 *
 * img.reshape(
 *    distortArc(200)
 * )
 * img.toURL()
 */
function distortArc(degrees) {
    return new actions_reshape_DistortArc.DistortArcAction(degrees);
}
/**
 * @summary action
 * @description Distorts the image to a new shape by adjusting its corners to achieve perception warping.
 * Specify four corner coordinates, representing the new coordinates for each of the image's four corners,
 * in clockwise order from the top-left corner.
 *
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/transformation_reference#e_distort|Distorting images}
 *
 * @param {number[]} coordinates - Four x/y pairs representing the new image corners
 * @memberOf Actions.Reshape
 * @return {Actions.Reshape.DistortAction}
 * @example
 * <caption> <h4>Distorting an image</h4> </caption>
 * import {Cloudinary, Transformation} from "@cloudinary/url-gen";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const img = yourCldInstance.image('woman');
 *
 * import {distort} from '@cloudinary/url-gen/actions/reshape';
 *
 * img.reshape(
 *    distort([100, 100, 100, 200, 200, 200, 200, 100])
 * )
 * img.toURL()
 */
function distort(coordinates) {
    return new actions_reshape_Distort.DistortAction(coordinates);
}
/**
 * @summary action
 * @description Skews the image according to the two specified values in degrees.
 * @param {number} x Skews the image according to the two specified values in degrees. (X and Y)
 * @param {number} y Skews the image according to the two specified values in degrees. (X and Y)
 * @memberOf Actions.Reshape
 * @return {Actions.Reshape.ShearAction}
 * @example
 * <caption> <h4>Shearing an image</h4> </caption>
 * import {Cloudinary, Transformation} from "@cloudinary/url-gen";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const img = yourCldInstance.image('woman');
 *
 * import {shear} from '@cloudinary/url-gen/actions/reshape';
 *
 * img.reshape(
 *    shear(50, 0)
 * )
 * img.toURL()
 */
function shear(x, y) {
    return new actions_reshape_Shear.ShearAction(x, y);
}
/**
 * @summary action
 * @description Removes the edges of the image based on the color of the corner pixels.
 * Specify a color other than the color of the corner pixels using the colorOverride() method
 * @memberOf Actions.Reshape
 * @return {Actions.Reshape.TrimAction}
 * @example
 * <caption> <h4>Trimming an image</h4> </caption>
 * import {Cloudinary, Transformation} from "@cloudinary/url-gen";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const img = yourCldInstance.image('woman');
 *
 * import {trim} from '@cloudinary/url-gen/actions/reshape';
 *
 * img.reshape(
 *    trim().colorOverride('blue').colorSimilarity(15)
 * )
 * img.toURL()
 */
function trim() {
    return new actions_reshape_TrimAction.TrimAction();
}
var Reshape = { cutByImage: cutByImage, distortArc: distortArc, distort: distort, shear: shear, trim: trim };

exports.Reshape = Reshape;
exports.cutByImage = cutByImage;
exports.distort = distort;
exports.distortArc = distortArc;
exports.shear = shear;
exports.trim = trim;
