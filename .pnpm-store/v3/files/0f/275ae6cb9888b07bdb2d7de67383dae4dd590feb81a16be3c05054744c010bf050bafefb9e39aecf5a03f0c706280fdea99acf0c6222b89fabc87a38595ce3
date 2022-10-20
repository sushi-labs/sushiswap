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
 * @description Controls the range of acceptable FPS (Frames Per Second) to ensure that video (even when optimized)
 * is delivered with
 * an expected FPS level (helps with sync to audio).
 *
 * <b>Learn more</b>: {@link https://cloudinary.com/documentation/video_transformation_reference#video_settings|Video settings}
 * @see Visit {@link Actions.Transcode|Transcode} for an example
 */
var FPSRangeAction = /** @class */ (function (_super) {
    tslib_es6.__extends(FPSRangeAction, _super);
    function FPSRangeAction(from, to) {
        var _this = _super.call(this) || this;
        _this._actionModel = {};
        _this.from = from;
        _this._actionModel = {
            actionType: 'fps',
            fps: { from: from }
        };
        if (to != null) {
            _this.to = to;
            _this._actionModel.fps.to = to;
        }
        return _this;
    }
    FPSRangeAction.prototype.prepareQualifiers = function () {
        var qualifierValue;
        if (this.from && this.to) {
            qualifierValue = new internal_qualifier_QualifierValue.QualifierValue(this.from + "-" + this.to);
        }
        else {
            qualifierValue = new internal_qualifier_QualifierValue.QualifierValue(this.from + "-");
        }
        this.addQualifier(new internal_qualifier_Qualifier.Qualifier('fps', qualifierValue));
        return this;
    };
    return FPSRangeAction;
}(internal_Action.Action));

module.exports = FPSRangeAction;
