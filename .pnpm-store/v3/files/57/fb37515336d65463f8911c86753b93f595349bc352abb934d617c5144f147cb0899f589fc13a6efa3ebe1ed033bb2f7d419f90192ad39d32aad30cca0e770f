'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
var qualifiers_format_FormatQualifier = require('../../qualifiers/format/FormatQualifier.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
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
 * @description Qualifies the delivery of an asset.
 * @memberOf Actions.Delivery
 * @extends SDK.Action
 */
var DeliveryAction = /** @class */ (function (_super) {
    tslib_es6.__extends(DeliveryAction, _super);
    /**
     * @param {string} deliveryKey A generic Delivery Action Key (such as q, f, dn, etc.)
     * @param {string} deliveryType A Format Qualifiers for the action, such as Quality.auto()
     * @param {string} modelProperty internal model property of the action, for example quality uses `level` while dpr uses `density`
     * @see Visit {@link Actions.Delivery|Delivery} for an example
     */
    function DeliveryAction(deliveryKey, deliveryType, modelProperty) {
        var _this = _super.call(this) || this;
        _this._actionModel = {};
        var deliveryTypeValue;
        if (deliveryType instanceof qualifiers_format_FormatQualifier.FormatQualifier) {
            deliveryTypeValue = deliveryType.getValue();
        }
        else {
            deliveryTypeValue = deliveryType;
        }
        _this._actionModel.actionType = internal_internalConstants.DELIVERY_MODE_TO_ACTION_TYPE_MAP[deliveryKey];
        _this._actionModel[modelProperty] = deliveryTypeValue;
        _this.addQualifier(new internal_qualifier_Qualifier.Qualifier(deliveryKey, deliveryType));
        return _this;
    }
    return DeliveryAction;
}(internal_Action.Action));

exports.DeliveryAction = DeliveryAction;
