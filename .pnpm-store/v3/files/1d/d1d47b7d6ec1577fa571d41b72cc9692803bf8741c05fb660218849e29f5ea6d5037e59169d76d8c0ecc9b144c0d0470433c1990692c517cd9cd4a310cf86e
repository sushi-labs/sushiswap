'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var actions_resize_ResizeSimpleAction = require('./ResizeSimpleAction.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
var internal_models_createGravityModel = require('../../internal/models/createGravityModel.cjs');
var internal_models_createGravityFromModel = require('../../internal/models/createGravityFromModel.cjs');
require('../../internal/Action.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/qualifier/QualifierValue.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');
require('../../internal/utils/toFloatAsString.cjs');
require('../../qualifiers/aspectRatio/AspectRatioQualifierValue.cjs');
require('../../qualifiers/flag.cjs');
require('../../internal/internalConstants.cjs');
require('../../internal/utils/objectFlip.cjs');
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
 * @description Defines an advanced resize.
 * @extends Actions.Resize.ResizeSimpleAction
 * @memberOf Actions.Resize
 * @see Visit {@link Actions.Resize| Resize} for examples
 */
var ResizeAdvancedAction = /** @class */ (function (_super) {
    tslib_es6.__extends(ResizeAdvancedAction, _super);
    function ResizeAdvancedAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @description Which part of the original image to include.
     * @param {Qualifiers.Gravity} gravity
     */
    ResizeAdvancedAction.prototype.gravity = function (gravity) {
        this._actionModel.gravity = internal_models_createGravityModel.createGravityModel(gravity);
        var gravityQualifier = typeof gravity === "string" ? new internal_qualifier_Qualifier.Qualifier('g', gravity) : gravity;
        return this.addQualifier(gravityQualifier);
    };
    ResizeAdvancedAction.fromJson = function (actionModel) {
        var result = _super.fromJson.apply(this, [actionModel]);
        if (actionModel.gravity) {
            result.gravity(internal_models_createGravityFromModel.createGravityFromModel(actionModel.gravity));
        }
        return result;
    };
    return ResizeAdvancedAction;
}(actions_resize_ResizeSimpleAction.ResizeSimpleAction));

exports.ResizeAdvancedAction = ResizeAdvancedAction;
