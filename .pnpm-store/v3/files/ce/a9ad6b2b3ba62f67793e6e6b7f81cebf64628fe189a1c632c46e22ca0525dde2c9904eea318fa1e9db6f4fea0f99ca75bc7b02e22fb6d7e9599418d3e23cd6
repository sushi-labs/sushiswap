'use strict';

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
var actions_transcode_FPSRangeAction = require('./FPSRangeAction.cjs');
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
 * @description Controls the FPS (Frames Per Second) to ensure that video (even when optimized)
 * is delivered with
 * an expected FPS level (helps with sync to audio).
 *
 * <b>Learn more</b>: {@link https://cloudinary.com/documentation/video_transformation_reference#video_settings|Video settings}
 * @see Visit {@link Actions.Transcode|Transcode} for an example
 */
var FPSAction = /** @class */ (function (_super) {
    tslib_es6.__extends(FPSAction, _super);
    function FPSAction(from) {
        var _this = _super.call(this) || this;
        _this._actionModel = { actionType: 'fps' };
        _this._actionModel.fps = from;
        _this.addQualifier(new internal_qualifier_Qualifier.Qualifier('fps', from));
        return _this;
    }
    FPSAction.fromJson = function (actionModel) {
        var fps = actionModel.fps;
        var result;
        if (typeof fps === 'object') {
            //@ts-ignore
            result = new actions_transcode_FPSRangeAction(fps.from, fps.to);
        }
        else {
            result = new this(fps);
        }
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        return result;
    };
    return FPSAction;
}(internal_Action.Action));

module.exports = FPSAction;
