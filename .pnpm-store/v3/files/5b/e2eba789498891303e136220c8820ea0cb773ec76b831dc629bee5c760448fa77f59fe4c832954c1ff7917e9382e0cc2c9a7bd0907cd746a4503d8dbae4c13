'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var qualifiers_gravity_autoGravity_AutoGravity = require('../../qualifiers/gravity/autoGravity/AutoGravity.cjs');
var qualifiers_gravity_focusOnGravity_FocusOnGravity = require('../../qualifiers/gravity/focusOnGravity/FocusOnGravity.cjs');
var qualifiers_gravity = require('../../qualifiers/gravity.cjs');
var qualifiers_gravity_qualifiers_focusOn_FocusOnValue = require('../../qualifiers/gravity/qualifiers/focusOn/FocusOnValue.cjs');
require('../../tslib.es6-f1398b83.cjs');
require('../../qualifiers/gravity/GravityQualifier.cjs');
require('../qualifier/Qualifier.cjs');
require('../qualifier/QualifierValue.cjs');
require('./QualifierModel.cjs');
require('./qualifierToJson.cjs');
require('../utils/unsupportedError.cjs');
require('../../qualifiers/gravity/compassGravity/CompassGravity.cjs');
require('../../qualifiers/gravity/xyCenterGravity/XYCenterGravity.cjs');

/**
 * true if gravity starts with 'auto' or 'auto:'
 * @param gravity
 */
function isIAutoGravityString(gravity) {
    return gravity && ("" + gravity).split(':')[0] === 'auto';
}
/**
 * Validate that given val is an ICompassGravity
 * @param gravity
 */
function isCompassGravity(gravity) {
    //const gravityString = `${(typeof gravity === "string" ? gravity : gravity.qualifierValue)}`;
    var gravityValue = getGravityValue(gravity);
    return ['north', 'center', 'east', 'west', 'south', 'north_west', 'south_east', 'south_west', 'north_east'].includes(gravityValue);
}
/**
 * Get the value of given gravity
 * @param gravity
 */
function getGravityValue(gravity) {
    return ("" + gravity).replace('g_', '');
}
/**
 * Creates a compassGravity model
 * @param gravity
 */
function createCompassGravityModel(gravity) {
    return {
        compass: getGravityValue(gravity),
        gravityType: 'direction'
    };
}
/**
 * Validate that given gravity is an instance of ocr gravity
 * @param gravity
 */
function isOcrGravity(gravity) {
    return getGravityValue(gravity) === 'ocr_text';
}
/**
 * Creates an ocr gravity model
 */
function createOcrGravityModel() {
    return {
        gravityType: 'ocr'
    };
}
/**
 * Validate that given gravity is an instance of AutoGravity
 * @param gravity
 */
function isAutoGravity(gravity) {
    return ("" + gravity.qualifierValue).split(':')[0] === 'auto';
}
/**
 * Create an instance of IAutoGravityObjectModel
 * @param gravity
 */
function createIAutoFocusObject(gravity) {
    var gravityString = gravity.toString();
    var values = gravityString.split('_');
    var result = {
        object: values[0]
    };
    if (values.length > 1) {
        if (values[1] === 'avoid') {
            result.avoid = true;
        }
        else {
            result.weight = +values[1];
        }
    }
    return result;
}
/**
 * Creates an auto gravity model from given AutoGravity
 * @param gravity
 */
function createAutoGravityModel(gravity) {
    var values;
    var gravityQualifier = gravity === 'auto' ? new qualifiers_gravity_autoGravity_AutoGravity.AutoGravity() : gravity;
    if (("" + gravity).startsWith('auto:')) {
        values = ("" + gravity).split(':').filter(function (v) { return v !== 'auto'; });
    }
    else {
        values = gravityQualifier.qualifierValue.values.filter(function (v) { return v !== 'auto'; });
    }
    var autoFocus = values.map(createIAutoFocusObject);
    return {
        gravityType: 'auto',
        autoFocus: autoFocus
    };
}
/**
 * Create IFocusOnGravityModel from FocusOnGravity
 * @param gravity
 */
function createFocusOnGravityModel(gravity) {
    var _a;
    var hasAutoGravity = ("" + gravity).split(':').includes('auto');
    var values = gravity.qualifierValue.values;
    var focusOnValues = hasAutoGravity ? values.slice(0, values.length - 1) : values;
    var result = {
        gravityType: 'object',
        focusOnObjects: focusOnValues.map(function (v) { return "" + v; })
    };
    if (hasAutoGravity) {
        // Remove the first 'auto' value by slicing it, because it's added by autoGravity()
        var autoFocusObjects = values[values.length - 1].values.slice(1);
        var autoGravityInstance = (_a = qualifiers_gravity.autoGravity()).autoFocus.apply(_a, autoFocusObjects);
        result.fallbackGravity = createAutoGravityModel(autoGravityInstance);
    }
    return result;
}
/**
 * Creates a FocusOnGravity from given string
 * @param gravity
 */
function createFocusOnGravity(gravity) {
    var values = gravity.split(':');
    var focusOnValues = values.map(function (g) { return new qualifiers_gravity_qualifiers_focusOn_FocusOnValue.FocusOnValue(g); });
    return new qualifiers_gravity_focusOnGravity_FocusOnGravity.FocusOnGravity(focusOnValues);
}
/**
 * Create a model of given gravity
 * @param gravity
 */
function createGravityModel(gravity) {
    if (isCompassGravity(gravity)) {
        return createCompassGravityModel(gravity);
    }
    if (isOcrGravity(gravity)) {
        return createOcrGravityModel();
    }
    if (isIAutoGravityString(gravity) || isAutoGravity(gravity)) {
        return createAutoGravityModel(gravity);
    }
    return createFocusOnGravityModel(typeof gravity === 'string' ? createFocusOnGravity(gravity) : gravity);
}

exports.createGravityModel = createGravityModel;
