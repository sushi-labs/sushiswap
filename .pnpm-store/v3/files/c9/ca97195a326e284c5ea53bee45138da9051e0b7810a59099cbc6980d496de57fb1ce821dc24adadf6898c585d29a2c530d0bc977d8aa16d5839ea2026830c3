'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../../internal/Action.cjs');
var internal_qualifier_Qualifier = require('../../../internal/qualifier/Qualifier.cjs');
var internal_qualifier_QualifierValue = require('../../../internal/qualifier/QualifierValue.cjs');
require('../../../qualifiers/flag/FlagQualifier.cjs');
require('../../../internal/utils/dataStructureUtils.cjs');
require('../../../internal/models/ActionModel.cjs');
require('../../../internal/models/actionToJson.cjs');
require('../../../internal/utils/unsupportedError.cjs');
require('../../../internal/models/QualifierModel.cjs');
require('../../../internal/models/qualifierToJson.cjs');

/**
 * @description Changes the speed of the video playback using the rate() method
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
var AccelerationEffectAction = /** @class */ (function (_super) {
    tslib_es6.__extends(AccelerationEffectAction, _super);
    function AccelerationEffectAction(rate) {
        var _this = _super.call(this) || this;
        _this._actionModel = { actionType: 'accelerate' };
        rate && _this.rate(rate);
        return _this;
    }
    AccelerationEffectAction.prototype.rate = function (rate) {
        this._actionModel.rate = rate;
        this._rate = rate;
        return this;
    };
    AccelerationEffectAction.prototype.prepareQualifiers = function () {
        var qualifierValue = new internal_qualifier_QualifierValue.QualifierValue(['accelerate', this._rate]).setDelimiter(':');
        this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', qualifierValue));
        return this;
    };
    AccelerationEffectAction.fromJson = function (actionModel) {
        var rate = actionModel.rate;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        // @ts-ignore
        var result = new this();
        rate && result.rate(rate);
        return result;
    };
    return AccelerationEffectAction;
}(internal_Action.Action));

exports.AccelerationEffectAction = AccelerationEffectAction;
