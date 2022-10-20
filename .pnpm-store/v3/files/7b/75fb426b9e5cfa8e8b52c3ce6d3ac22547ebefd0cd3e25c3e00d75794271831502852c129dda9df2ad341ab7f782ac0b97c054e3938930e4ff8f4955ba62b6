'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
var internal_qualifier_QualifierValue = require('../../internal/qualifier/QualifierValue.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');

/**
 * @description Specifies the ICC profile to use for the color space.
 * @memberOf Actions.Delivery
 * @extends SDK.Action
 * @see Visit {@link Actions.Delivery|Delivery} for an example
 */
var DeliveryColorSpaceFromICCAction = /** @class */ (function (_super) {
    tslib_es6.__extends(DeliveryColorSpaceFromICCAction, _super);
    /**
     * @param {string} publicId
     */
    function DeliveryColorSpaceFromICCAction(publicId) {
        var _this = _super.call(this) || this;
        _this._actionModel = {};
        _this._actionModel.actionType = 'colorSpaceFromICC';
        _this._actionModel.publicId = publicId;
        var qualifierValue = new internal_qualifier_QualifierValue.QualifierValue(['icc', publicId]).setDelimiter(':');
        _this.addQualifier(new internal_qualifier_Qualifier.Qualifier('cs', qualifierValue));
        return _this;
    }
    DeliveryColorSpaceFromICCAction.fromJson = function (actionModel) {
        var publicId = actionModel.publicId;
        return new this(publicId);
    };
    return DeliveryColorSpaceFromICCAction;
}(internal_Action.Action));

exports.DeliveryColorSpaceFromICCAction = DeliveryColorSpaceFromICCAction;
