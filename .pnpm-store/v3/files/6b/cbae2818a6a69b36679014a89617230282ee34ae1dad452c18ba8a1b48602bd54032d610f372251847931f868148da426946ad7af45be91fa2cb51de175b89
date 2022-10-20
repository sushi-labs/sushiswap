'use strict';

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
var qualifiers_flag = require('../../qualifiers/flag.cjs');
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
 * @description Converts a video to an animated webp or gif.
 * The resulting transformation includes format (f_format) and the animated flag (fl_animated).
 * The flag fl_awebp is added only when an animated webp is requested.
 * @see Visit {@link Actions.Transcode|Transcode} for an example
 */
var ToAnimatedAction = /** @class */ (function (_super) {
    tslib_es6.__extends(ToAnimatedAction, _super);
    function ToAnimatedAction(animatedFormat) {
        if (animatedFormat === void 0) { animatedFormat = ''; }
        var _this = _super.call(this) || this;
        _this._actionModel = { actionType: 'toAnimated' };
        if (animatedFormat.toString() === 'webp') {
            _this.addFlag(qualifiers_flag.animatedWebP());
        }
        _this.addFlag(qualifiers_flag.animated());
        if (animatedFormat) {
            _this.addQualifier(new internal_qualifier_Qualifier.Qualifier('f', animatedFormat));
        }
        _this._actionModel.animatedFormat = animatedFormat;
        return _this;
    }
    /**
     * @description Sets the time between frames.
     * @param delayValue The time in milliseconds.
     */
    ToAnimatedAction.prototype.delay = function (delayValue) {
        this.addQualifier(new internal_qualifier_Qualifier.Qualifier('dl', delayValue));
        this._actionModel.delay = delayValue;
        return this;
    };
    /**
     * @description Sets the frequency at which the video is sampled.
     * @param sampling As a string (e.g. '2.3s'), samples one frame every 2.3 seconds.<br>As a number (e.g. 20),
     * samples that many equally spaced frames over the duration of the video.
     */
    ToAnimatedAction.prototype.sampling = function (sampling) {
        this.addQualifier(new internal_qualifier_Qualifier.Qualifier('vs', sampling));
        this._actionModel.sampling = sampling;
        return this;
    };
    ToAnimatedAction.fromJson = function (actionModel) {
        var _a = actionModel, animatedFormat = _a.animatedFormat, sampling = _a.sampling, delay = _a.delay;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        var result = new this(animatedFormat);
        sampling && result.sampling(sampling);
        delay && result.delay(delay);
        return result;
    };
    return ToAnimatedAction;
}(internal_Action.Action));

module.exports = ToAnimatedAction;
