'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
var actions_resize_ResizeAdvancedAction = require('./ResizeAdvancedAction.cjs');
require('../../internal/qualifier/QualifierValue.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('./ResizeSimpleAction.cjs');
require('../../internal/Action.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');
require('../../internal/utils/toFloatAsString.cjs');
require('../../qualifiers/aspectRatio/AspectRatioQualifierValue.cjs');
require('../../qualifiers/flag.cjs');
require('../../internal/internalConstants.cjs');
require('../../internal/utils/objectFlip.cjs');
require('../../internal/models/createGravityModel.cjs');
require('../../qualifiers/gravity/autoGravity/AutoGravity.cjs');
require('../../qualifiers/gravity/GravityQualifier.cjs');
require('../../qualifiers/gravity/focusOnGravity/FocusOnGravity.cjs');
require('../../qualifiers/gravity.cjs');
require('../../qualifiers/gravity/compassGravity/CompassGravity.cjs');
require('../../qualifiers/gravity/xyCenterGravity/XYCenterGravity.cjs');
require('../../qualifiers/gravity/qualifiers/focusOn/FocusOnValue.cjs');
require('../../internal/models/createGravityFromModel.cjs');
require('../../qualifiers/focusOn.cjs');
require('../../qualifiers/autoFocus.cjs');
require('../../qualifiers/gravity/qualifiers/compass/CompassQualifier.cjs');

/**
 * @description Defines how to crop an asset
 * @extends Actions.Resize.ResizeAdvancedAction
 * @memberOf Actions.Resize
 * @see Visit {@link Actions.Resize| Resize} for examples
 */
var ResizeCropAction = /** @class */ (function (_super) {
    tslib_es6.__extends(ResizeCropAction, _super);
    function ResizeCropAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @description Horizontal position for custom-coordinates based cropping.
     * @param {number} x The x position.
     */
    ResizeCropAction.prototype.x = function (x) {
        this._actionModel.x = x;
        return this.addQualifier(new internal_qualifier_Qualifier.Qualifier('x', x));
    };
    /**
     * @description Vertical position for custom-coordinates based cropping
     * @param {number} y The y position.
     */
    ResizeCropAction.prototype.y = function (y) {
        this._actionModel.y = y;
        return this.addQualifier(new internal_qualifier_Qualifier.Qualifier('y', y));
    };
    /**
     * @description Controls how much of the original image surrounding the face to keep when using either the 'crop' or 'thumb' cropping modes with face detection.
     * @param {number | string} z The zoom factor. (Default: 1.0)
     */
    ResizeCropAction.prototype.zoom = function (z) {
        this._actionModel.zoom = z;
        return this.addQualifier(new internal_qualifier_Qualifier.Qualifier('z', z));
    };
    ResizeCropAction.fromJson = function (actionModel) {
        var result = _super.fromJson.apply(this, [actionModel]);
        actionModel.x && result.x(actionModel.x);
        actionModel.y && result.y(actionModel.y);
        actionModel.zoom && result.zoom(actionModel.zoom);
        return result;
    };
    return ResizeCropAction;
}(actions_resize_ResizeAdvancedAction.ResizeAdvancedAction));

exports.ResizeCropAction = ResizeCropAction;
