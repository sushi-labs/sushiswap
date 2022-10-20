'use strict';

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
var internal_qualifier_QualifierValue = require('../../internal/qualifier/QualifierValue.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');

/**
 * @extends SDK.Action
 * @memberOf Actions.Transcode
 * @description  Defines the video bitrate in bits per second.
 *
 * <b>Learn more</b>: {@link https://cloudinary.com/documentation/video_manipulation_and_delivery#bitrate_control|Bitrate control}
 * @see Visit {@link Actions.Transcode|Transcode} for an example
 */
var BitRateAction = /** @class */ (function (_super) {
    tslib_es6.__extends(BitRateAction, _super);
    function BitRateAction(bitRate) {
        var _this = _super.call(this) || this;
        _this.isConstant = false;
        _this._actionModel = { actionType: 'bitRate' };
        _this.bitRate = bitRate;
        _this._actionModel.bitRate = bitRate;
        return _this;
    }
    /**
     * @description video plays with a constant bitrate (CBR).
     */
    BitRateAction.prototype.constant = function () {
        this.isConstant = true;
        this._actionModel.constant = true;
        return this;
    };
    BitRateAction.prototype.prepareQualifiers = function () {
        var qualifierValue;
        if (this.isConstant) {
            qualifierValue = new internal_qualifier_QualifierValue.QualifierValue([this.bitRate, 'constant']).setDelimiter(':');
        }
        else {
            qualifierValue = new internal_qualifier_QualifierValue.QualifierValue(this.bitRate);
        }
        this.addQualifier(new internal_qualifier_Qualifier.Qualifier('br', qualifierValue));
        return this;
    };
    BitRateAction.fromJson = function (actionModel) {
        var _a = actionModel, bitRate = _a.bitRate, constant = _a.constant;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        var result = new this(bitRate);
        constant && result.constant();
        return result;
    };
    return BitRateAction;
}(internal_Action.Action));

module.exports = BitRateAction;
