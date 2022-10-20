'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var qualifiers_gravity = require('../../qualifiers/gravity.cjs');
var qualifiers_focusOn = require('../../qualifiers/focusOn.cjs');
var qualifiers_autoFocus = require('../../qualifiers/autoFocus.cjs');
var qualifiers_gravity_compassGravity_CompassGravity = require('../../qualifiers/gravity/compassGravity/CompassGravity.cjs');
var qualifiers_gravity_qualifiers_compass_CompassQualifier = require('../../qualifiers/gravity/qualifiers/compass/CompassQualifier.cjs');
var qualifiers_gravity_qualifiers_focusOn_FocusOnValue = require('../../qualifiers/gravity/qualifiers/focusOn/FocusOnValue.cjs');
require('../../tslib.es6-f1398b83.cjs');
require('../../qualifiers/gravity/focusOnGravity/FocusOnGravity.cjs');
require('../../qualifiers/gravity/GravityQualifier.cjs');
require('../qualifier/Qualifier.cjs');
require('../qualifier/QualifierValue.cjs');
require('./QualifierModel.cjs');
require('./qualifierToJson.cjs');
require('../utils/unsupportedError.cjs');
require('../../qualifiers/gravity/autoGravity/AutoGravity.cjs');
require('../../qualifiers/gravity/xyCenterGravity/XYCenterGravity.cjs');

/**
 * Validates that gravityModel is an ICompassGravityModel
 * @param gravityModel
 */
function isCompassGravityModel(gravityModel) {
    return gravityModel.gravityType === 'direction';
}
/**
 * Validates that gravityModel is an IOcrGravityModel
 * @param gravityModel
 */
function isOcrGravityModel(gravityModel) {
    return gravityModel.gravityType === 'ocr';
}
/**
 * Validates that gravityModel is an IAutoGravityModel
 * @param gravityModel
 */
function isAutoGravityModel(gravityModel) {
    return gravityModel.gravityType === 'auto';
}
/**
 * Create AutoFocus from IAutoGravityObjectModel
 * @param autoGravityObjectModel
 */
function createAutoFocusFromModel(autoGravityObjectModel) {
    var object = autoGravityObjectModel.object, weight = autoGravityObjectModel.weight, avoid = autoGravityObjectModel.avoid;
    var autoFocus = new qualifiers_autoFocus.AutoFocus(new qualifiers_gravity_qualifiers_focusOn_FocusOnValue.FocusOnValue(object));
    (weight || weight === 0) && autoFocus.weight(weight);
    avoid && autoFocus.avoid();
    return autoFocus;
}
/**
 * Create AutoGravity from IAutoGravityModel
 * @param gravityModel
 */
function createAutoGravityFromModel(gravityModel) {
    var _a;
    var autoFocusModel = gravityModel.autoFocus || [];
    var autoFocus = autoFocusModel.map(createAutoFocusFromModel);
    return (_a = qualifiers_gravity.autoGravity()).autoFocus.apply(_a, autoFocus);
}
/**
 * Create FocusOnGravity from given IFocusOnGravityModel
 * @param gravityModel
 */
function createFocusOnGravityFromModel(gravityModel) {
    var focusOnObjects = (gravityModel.focusOnObjects || []).map(function (str) { return new qualifiers_gravity_qualifiers_focusOn_FocusOnValue.FocusOnValue(str); });
    var result = qualifiers_gravity.focusOn.apply(void 0, focusOnObjects);
    if (gravityModel.fallbackGravity) {
        var autoGravity_1 = createAutoGravityFromModel(gravityModel.fallbackGravity);
        result.fallbackGravity(autoGravity_1);
    }
    return result;
}
/**
 * Create gravity instance from given gravity model
 * @param gravityModel
 */
function createGravityFromModel(gravityModel) {
    if (isCompassGravityModel(gravityModel)) {
        return new qualifiers_gravity_compassGravity_CompassGravity.CompassGravity(new qualifiers_gravity_qualifiers_compass_CompassQualifier.CompassQualifier(gravityModel.compass));
    }
    if (isOcrGravityModel(gravityModel)) {
        return qualifiers_gravity.focusOn(qualifiers_focusOn.ocr());
    }
    if (isAutoGravityModel(gravityModel)) {
        return createAutoGravityFromModel(gravityModel);
    }
    return createFocusOnGravityFromModel(gravityModel);
}

exports.createGravityFromModel = createGravityFromModel;
