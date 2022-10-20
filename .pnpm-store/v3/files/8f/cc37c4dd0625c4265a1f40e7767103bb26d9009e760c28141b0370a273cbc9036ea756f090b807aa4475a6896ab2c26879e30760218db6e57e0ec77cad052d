'use strict';

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/qualifier/QualifierValue.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');

/**
 * @description Class for shortening a video to the specified range.
 * @extends SDK.Action
 * @memberOf Actions.VideoEdit
 * @see Visit {@link Actions.VideoEdit|VideoEdit} for an example
 */
var TrimAction = /** @class */ (function (_super) {
    tslib_es6.__extends(TrimAction, _super);
    function TrimAction() {
        var _this = _super.call(this) || this;
        _this._actionModel = {
            actionType: 'trimVideo'
        };
        return _this;
    }
    /**
     *
     * @description Support Percentages in values (30% -> 30p)
     * @param {string|number} val
     * @private
     * @return {string}
     */
    TrimAction.prototype.parseVal = function (val) {
        return typeof val === 'number' ? val : val.replace('%', 'p');
    };
    /**
     * @description Sets the starting position of the part of the video to keep when trimming videos.
     *
     * @param {string|number} offset The starting position of the part of the video to keep. This can be specified as a
     *                           float representing the time in seconds or a string representing the percentage of the
     *                           video length (for example, "30%" or "30p").
     * @return {this}
     */
    TrimAction.prototype.startOffset = function (offset) {
        this._actionModel.startOffset = +offset;
        return this.addQualifier(new internal_qualifier_Qualifier.Qualifier('so', this.parseVal(offset)));
    };
    /**
     * @description Sets the end position of the part of the video to keep when trimming videos.
     *
     * @param {string|number} offset The end position of the part of the video to keep. This can be specified as a
     *                         float representing the time in seconds or a string representing the percentage of the
     *                         video length (for example, "30%" or "30p").
     * @return {this}
     */
    TrimAction.prototype.endOffset = function (offset) {
        this._actionModel.endOffset = +offset;
        return this.addQualifier(new internal_qualifier_Qualifier.Qualifier('eo', this.parseVal(offset)));
    };
    /**
     * @description Sets the duration of the video to keep.
     *
     * @param {string|number} duration The length of the part of the video to keep. This can be specified as a float
     *                        representing the time in seconds or a string representing the percentage of the
     *                        video length (for example, "30%" or "30p").
     * @return {this}
     */
    TrimAction.prototype.duration = function (duration) {
        this._actionModel.duration = duration;
        return this.addQualifier(new internal_qualifier_Qualifier.Qualifier('du', this.parseVal(duration)));
    };
    TrimAction.fromJson = function (actionModel) {
        var _a = actionModel, duration = _a.duration, startOffset = _a.startOffset, endOffset = _a.endOffset;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        var result = new this();
        if (duration != null) {
            result.duration(duration);
        }
        if (startOffset != null) {
            result.startOffset(startOffset);
        }
        if (endOffset != null) {
            result.endOffset(endOffset);
        }
        return result;
    };
    return TrimAction;
}(internal_Action.Action));

module.exports = TrimAction;
