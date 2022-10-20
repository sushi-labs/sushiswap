'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
var internal_utils_toFloatAsString = require('../../internal/utils/toFloatAsString.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/qualifier/QualifierValue.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');

/**
 * @description Specifies the dpr.
 * @memberOf Actions.Delivery
 * @extends SDK.Action
 * @see Visit {@link Actions.Delivery|Delivery} for an example
 */
var DeliveryDPRAction = /** @class */ (function (_super) {
    tslib_es6.__extends(DeliveryDPRAction, _super);
    /**
     * Create a new DeliveryDPRAction
     * @param dprValue
     */
    function DeliveryDPRAction(dprValue) {
        var _this = _super.call(this) || this;
        _this._actionModel = { actionType: 'dpr' };
        // toFloatAsString is used to ensure 1 turns into 1.0
        var dprAsFloat = internal_utils_toFloatAsString.toFloatAsString(dprValue);
        _this._actionModel.dpr = dprAsFloat;
        _this.addQualifier(new internal_qualifier_Qualifier.Qualifier('dpr', dprAsFloat));
        return _this;
    }
    DeliveryDPRAction.fromJson = function (actionModel) {
        var dpr = actionModel.dpr;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        return new this(dpr);
    };
    return DeliveryDPRAction;
}(internal_Action.Action));

exports.DeliveryDPRAction = DeliveryDPRAction;
