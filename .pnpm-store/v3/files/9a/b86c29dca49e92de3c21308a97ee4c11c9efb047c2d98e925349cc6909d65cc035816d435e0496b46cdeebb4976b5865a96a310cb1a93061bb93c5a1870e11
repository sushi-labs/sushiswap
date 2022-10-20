'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var qualifiers_position_PositionQualifier = require('../../qualifiers/position/PositionQualifier.cjs');
var internal_models_createGravityFromModel = require('./createGravityFromModel.cjs');
require('../../tslib.es6-f1398b83.cjs');
require('../Action.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../qualifier/QualifierValue.cjs');
require('../qualifier/Qualifier.cjs');
require('./QualifierModel.cjs');
require('./qualifierToJson.cjs');
require('../utils/unsupportedError.cjs');
require('../utils/dataStructureUtils.cjs');
require('./ActionModel.cjs');
require('./actionToJson.cjs');
require('../../qualifiers/flag.cjs');
require('./createGravityModel.cjs');
require('../../qualifiers/gravity/autoGravity/AutoGravity.cjs');
require('../../qualifiers/gravity/GravityQualifier.cjs');
require('../../qualifiers/gravity/focusOnGravity/FocusOnGravity.cjs');
require('../../qualifiers/gravity.cjs');
require('../../qualifiers/gravity/compassGravity/CompassGravity.cjs');
require('../../qualifiers/gravity/xyCenterGravity/XYCenterGravity.cjs');
require('../../qualifiers/gravity/qualifiers/focusOn/FocusOnValue.cjs');
require('../../qualifiers/focusOn.cjs');
require('../../qualifiers/autoFocus.cjs');
require('../../qualifiers/gravity/qualifiers/compass/CompassQualifier.cjs');

/**
 * Create Position from given IPositionModel
 * @param position
 */
function createPositionFromModel(position) {
    var offsetX = position.offsetX, offsetY = position.offsetY, tiled = position.tiled, allowOverflow = position.allowOverflow, gravity = position.gravity;
    var result = new qualifiers_position_PositionQualifier.PositionQualifier();
    if (offsetX) {
        result.offsetX(offsetX);
    }
    if (offsetY) {
        result.offsetY(offsetY);
    }
    if (tiled) {
        result.tiled();
    }
    if (allowOverflow != null) {
        result.allowOverflow(allowOverflow);
    }
    if (gravity) {
        result.gravity(internal_models_createGravityFromModel.createGravityFromModel(gravity));
    }
    return result;
}

exports.createPositionFromModel = createPositionFromModel;
