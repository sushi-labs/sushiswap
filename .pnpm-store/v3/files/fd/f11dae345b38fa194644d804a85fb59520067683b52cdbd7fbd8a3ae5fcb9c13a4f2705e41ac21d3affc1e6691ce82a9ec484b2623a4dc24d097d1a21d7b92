'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
var internal_utils_toFloatAsString = require('../../internal/utils/toFloatAsString.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/qualifier/QualifierValue.cjs');
require('../../internal/qualifier/Qualifier.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');

/**
 * @description Class for creating a preview of a video
 * @memberOf Actions.VideoEdit
 * @extends SDK.Action
 * @see Visit {@link Actions.VideoEdit|VideoEdit} for an example
 */
var PreviewAction = /** @class */ (function (_super) {
    tslib_es6.__extends(PreviewAction, _super);
    function PreviewAction() {
        var _this = _super.call(this) || this;
        _this._actionModel = {
            actionType: 'preview'
        };
        return _this;
    }
    /**
     * @description Control the duration of the video segments
     * @param {string|number} minSegDuration The duration of a video segment
     * @return {this}
     */
    PreviewAction.prototype.minimumSegmentDuration = function (minSegDuration) {
        this._actionModel.minimumSegmentDuration = +minSegDuration;
        this._minSeg = minSegDuration;
        return this;
    };
    /**
     * @description Control the number of the video segments
     * @param {string|number} maxSeg The number of the video segments.
     * @return {this}
     */
    PreviewAction.prototype.maximumSegments = function (maxSeg) {
        this._actionModel.maximumSegments = +maxSeg;
        this._maxSeg = maxSeg;
        return this;
    };
    /**
     * @description control the length of the generated preview
     * @param {string|number} duration The duration in seconds such as 1.2, or 5.0
     * @return {this}
     */
    PreviewAction.prototype.duration = function (duration) {
        this._actionModel.duration = +duration;
        this._duration = duration;
        return this;
    };
    PreviewAction.prototype.toString = function () {
        return [
            'e_preview',
            this._duration && "duration_" + internal_utils_toFloatAsString.toFloatAsString(this._duration),
            this._maxSeg && "max_seg_" + this._maxSeg,
            this._minSeg && "min_seg_dur_" + internal_utils_toFloatAsString.toFloatAsString(this._minSeg)
        ].filter(function (a) { return a; }).join(':');
    };
    PreviewAction.fromJson = function (actionModel) {
        var _a = actionModel, duration = _a.duration, maximumSegments = _a.maximumSegments, minimumSegmentDuration = _a.minimumSegmentDuration;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        var result = new this();
        if (duration != null) {
            result.duration(duration);
        }
        if (maximumSegments != null) {
            result.maximumSegments(maximumSegments);
        }
        if (minimumSegmentDuration != null) {
            result.minimumSegmentDuration(minimumSegmentDuration);
        }
        return result;
    };
    return PreviewAction;
}(internal_Action.Action));

exports.PreviewAction = PreviewAction;
