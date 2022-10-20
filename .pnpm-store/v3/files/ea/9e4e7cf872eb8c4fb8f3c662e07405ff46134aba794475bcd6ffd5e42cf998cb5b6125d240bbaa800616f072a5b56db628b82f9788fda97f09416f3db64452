'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../tslib.es6-f1398b83.cjs');
var qualifiers_gravity_compassGravity_CompassGravity = require('./gravity/compassGravity/CompassGravity.cjs');
var qualifiers_gravity_focusOnGravity_FocusOnGravity = require('./gravity/focusOnGravity/FocusOnGravity.cjs');
var qualifiers_gravity_autoGravity_AutoGravity = require('./gravity/autoGravity/AutoGravity.cjs');
var qualifiers_gravity_xyCenterGravity_XYCenterGravity = require('./gravity/xyCenterGravity/XYCenterGravity.cjs');
require('./gravity/GravityQualifier.cjs');
require('../internal/qualifier/Qualifier.cjs');
require('../internal/qualifier/QualifierValue.cjs');
require('../internal/models/QualifierModel.cjs');
require('../internal/models/qualifierToJson.cjs');
require('../internal/utils/unsupportedError.cjs');

/**
 * @description Defines the gravity based on directional values from a compass.
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_transformations#control_gravity|Control gravity for images}
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_transformations#control_gravity|Control gravity for videos}
 * @param {Qualifiers.Compass | string} direction A compass Values
 * @memberOf Qualifiers.Gravity
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {compass} from "@cloudinary/url-gen/qualifiers/gravity";
 * import {north} from "@cloudinary/url-gen/qualifiers/compass";
 * import {crop} from "@cloudinary/url-gen/actions/resize";
 *
 * const yourCldInstance = new Cloudinary({cloud: {cloudName: 'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.resize(crop().width(300).gravity(compass(north())))
 * @return {CompassGravity}
 */
function compass(direction) {
    return new qualifiers_gravity_compassGravity_CompassGravity.CompassGravity(direction);
}
/**
 * @summary qualifier
 * @description Specifies what to focus on, for example: faces, objects, eyes, etc.
 * @param {...Qualifier.FocusOn} args One or more objects to focus on
 * @memberOf Qualifiers.Gravity
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {focusOn} from "@cloudinary/url-gen/qualifiers/gravity";
 * import {crop} from "@cloudinary/url-gen/actions/resize";
 * import {cat} from "@cloudinary/url-gen/qualifiers/focusOn";
 *
 * const yourCldInstance = new Cloudinary({cloud: {cloudName: 'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.resize(crop().width(300).gravity(focusOn(cat())))
 * @return {FocusOnGravity}
 */
function focusOn() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var res = tslib_es6.__spreadArrays(args);
    return new qualifiers_gravity_focusOnGravity_FocusOnGravity.FocusOnGravity(res);
}
/**
 * @summary qualifier
 * @description Automatically identifies the most interesting regions in the asset, can be qualified further by including what to focus on.
 * @memberOf Qualifiers.Gravity
 * @return {Qualifiers.Gravity.AutoGravity}
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {autoGravity} from "@cloudinary/url-gen/qualifiers/gravity";
 * import {crop} from "@cloudinary/url-gen/actions/resize";
 *
 * const yourCldInstance = new Cloudinary({cloud: {cloudName: 'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.resize(crop().width(300).gravity(autoGravity()))
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {autoGravity} from "@cloudinary/url-gen/qualifiers/gravity";
 * import {crop} from "@cloudinary/url-gen/actions/resize";
 * import {cat} from "@cloudinary/url-gen/qualifiers/focusOn";
 * import {AutoFocus} from "@cloudinary/url-gen/qualifiers/autoFocus";
 *
 * const yourCldInstance = new Cloudinary({cloud: {cloudName: 'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.resize(crop().width(300).gravity(autoGravity().autoFocus(AutoFocus.focusOn(cat()))))
 */
function autoGravity() {
    return new qualifiers_gravity_autoGravity_AutoGravity.AutoGravity();
}
/**
 * @summary qualifier
 * @description Set the center of gravity to the given x & y coordinates.
 * @memberOf Qualifiers.Gravity
 * @return {XYCenterGravity}
 */
function xyCenter() {
    return new qualifiers_gravity_xyCenterGravity_XYCenterGravity.XYCenterGravity();
}
/**
 * @description A qualifier that determines which part of an asset to focus on, and thus which part of the asset to keep, </br>
 *              when any part of the asset is cropped. For overlays, this setting determines where to place the overlay.
 * @namespace Gravity
 * @memberOf Qualifiers
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {compass} from "@cloudinary/url-gen/qualifiers/gravity";
 * import {north} from "@cloudinary/url-gen/qualifiers/compass";
 * import {crop} from "@cloudinary/url-gen/actions/resize";
 *
 * const yourCldInstance = new Cloudinary({cloud: {cloudName: 'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.resize(crop().width(300).gravity(compass(north())))
 *
 * // Expand every function separately to see its own example
 */
var Gravity = {
    compass: compass,
    autoGravity: autoGravity,
    focusOn: focusOn,
    xyCenter: xyCenter
};

exports.Gravity = Gravity;
exports.autoGravity = autoGravity;
exports.compass = compass;
exports.focusOn = focusOn;
exports.xyCenter = xyCenter;
