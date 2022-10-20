'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
require('../flag/FlagQualifier.cjs');
require('../../internal/qualifier/QualifierValue.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');

/**
 * @description Defines a video range using startOffset, endOffset, duration.
 * @namespace TimelinePosition
 * @memberOf Qualifiers
 */
/**
 * TimelinePosition
 * @memberOf Qualifiers.TimelinePosition
 */
var TimelinePosition = /** @class */ (function (_super) {
    tslib_es6.__extends(TimelinePosition, _super);
    function TimelinePosition() {
        var _this = _super.call(this) || this;
        _this._actionModel = {};
        return _this;
    }
    /**
     * @param {string | number} startOffset
     */
    TimelinePosition.prototype.startOffset = function (startOffset) {
        var startOffsetQualifier = new internal_qualifier_Qualifier.Qualifier('so', startOffset);
        this.addQualifier(startOffsetQualifier);
        this._actionModel.startOffset = startOffsetQualifier.qualifierValue.toString();
        return this;
    };
    /**
     * @param {string | number} endOffset
     */
    TimelinePosition.prototype.endOffset = function (endOffset) {
        var endOffsetQualifier = new internal_qualifier_Qualifier.Qualifier('eo', endOffset);
        this.addQualifier(endOffsetQualifier);
        this._actionModel.endOffset = endOffsetQualifier.qualifierValue.toString();
        return this;
    };
    /**
     * @param {string | number} duration
     */
    TimelinePosition.prototype.duration = function (duration) {
        var durationQualifier = new internal_qualifier_Qualifier.Qualifier('du', duration);
        this.addQualifier(durationQualifier);
        this._actionModel.duration = durationQualifier.qualifierValue.toString();
        return this;
    };
    return TimelinePosition;
}(internal_Action.Action));

exports.TimelinePosition = TimelinePosition;
