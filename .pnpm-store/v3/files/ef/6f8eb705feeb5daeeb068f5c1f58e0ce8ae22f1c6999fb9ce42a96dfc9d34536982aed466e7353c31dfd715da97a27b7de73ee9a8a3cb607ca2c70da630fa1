'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var actions_roundCorners_RoundCornersAction = require('./roundCorners/RoundCornersAction.cjs');
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
 * @description Round one or more corners of an image or video.
 *
 * <b>Learn more:</b>
 * {@link https://cloudinary.com/documentation/image_transformations#rounding_corners_and_creating_circular_images|Rounded images}
 * {@link https://cloudinary.com/documentation/video_manipulation_and_delivery#rounding_corners_and_creating_circular_videos|Rounded videos}
 * @memberOf Actions
 * @namespace RoundCorners
 * @example
 * <caption>Round corners by a radius</caption>
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {byRadius, max} from "@cloudinary/url-gen/actions/roundCorners";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 * // By a radius
 * image.roundCorners(byRadius(10));
 * // Or just the maximum possible
 * image.roundCorners(max());
 * image.toURL();
 */
/**
 * @summary action
 * @description Generates an asset with a circular crop using the 'max' radius value.
 * @memberOf Actions.RoundCorners
 * @return {Actions.RoundCorners.RoundCornersAction}
 */
function max() {
    return new actions_roundCorners_RoundCornersAction().max();
}
/**
 * @summary action
 * @description Rounds the specified corners of an image or a video by specifying 1-4 pixel values as follows:
 *
 * * 1 value: All four corners are rounded equally according to the specified value.
 * * 2 values: 1st value => top-left & bottom-right. 2nd value => top-right & bottom-left.
 * * 3 values: 1st value => top-left. 2nd value => top-right & bottom-left. 3rd value => bottom-right.
 * * 4 values: Each corner specified separately, in clockwise order, starting with top-left.
 *
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @memberOf Actions.RoundCorners
 * @return {Actions.RoundCorners.RoundCornersAction}
 */
function byRadius(a, b, c, d) {
    return new actions_roundCorners_RoundCornersAction().radius(a, b, c, d);
}
var RoundCorners = { byRadius: byRadius, max: max };

exports.RoundCorners = RoundCorners;
exports.byRadius = byRadius;
exports.max = max;
