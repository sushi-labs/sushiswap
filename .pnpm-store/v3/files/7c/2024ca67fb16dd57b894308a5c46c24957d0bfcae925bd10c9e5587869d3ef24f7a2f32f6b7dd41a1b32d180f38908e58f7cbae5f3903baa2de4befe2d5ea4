'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
var qualifiers_colorSpace = require('../../qualifiers/colorSpace.cjs');
var internal_internalConstants = require('../../internal/internalConstants.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/qualifier/QualifierValue.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');
require('../../internal/utils/objectFlip.cjs');

/**
 * @description Specifies the color space to use.
 * @memberOf Actions.Delivery
 * @extends SDK.Action
 * @see Visit {@link Actions.Delivery|Delivery} for an example
 */
var DeliveryColorSpaceAction = /** @class */ (function (_super) {
    tslib_es6.__extends(DeliveryColorSpaceAction, _super);
    /**
     * Create a new DeliveryColorSpaceAction
     * @param mode
     */
    function DeliveryColorSpaceAction(mode) {
        var _this = _super.call(this) || this;
        _this._actionModel = {};
        _this._actionModel = {
            actionType: 'colorSpace',
            mode: (internal_internalConstants.COLOR_SPACE_MODE_TO_COLOR_SPACE_MODEL_MODE_MAP[mode] || mode)
        };
        _this.addQualifier(new internal_qualifier_Qualifier.Qualifier('cs', qualifiers_colorSpace.ColorSpace[mode] ? qualifiers_colorSpace.ColorSpace[mode]() : mode));
        return _this;
    }
    DeliveryColorSpaceAction.fromJson = function (actionModel) {
        var mode = actionModel.mode;
        var colorSpaceMode = internal_internalConstants.COLOR_SPACE_MODEL_MODE_TO_COLOR_SPACE_MODE_MAP[mode] || mode;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        return new this(colorSpaceMode);
    };
    return DeliveryColorSpaceAction;
}(internal_Action.Action));

exports.DeliveryColorSpaceAction = DeliveryColorSpaceAction;
