'use strict';

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
 * @extends SDK.Action
 * @memberOf Actions.Transcode
 * @description Controls the keyframe interval of the delivered video.
 * @see Visit {@link Actions.Transcode|Transcode} for an example
 */
var KeyframeIntervalsAction = /** @class */ (function (_super) {
    tslib_es6.__extends(KeyframeIntervalsAction, _super);
    function KeyframeIntervalsAction(interval) {
        var _this = _super.call(this) || this;
        _this._actionModel = { actionType: 'keyframeInterval' };
        _this._actionModel.interval = interval;
        _this.addQualifier(new internal_qualifier_Qualifier.Qualifier('ki', internal_utils_toFloatAsString.toFloatAsString(interval)));
        return _this;
    }
    KeyframeIntervalsAction.fromJson = function (actionModel) {
        var interval = actionModel.interval;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        var result = new this(interval);
        return result;
    };
    return KeyframeIntervalsAction;
}(internal_Action.Action));

module.exports = KeyframeIntervalsAction;
