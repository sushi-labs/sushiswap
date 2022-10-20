'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var qualifiers_video_TimelinePosition = require('../../qualifiers/video/TimelinePosition.cjs');
require('../../tslib.es6-f1398b83.cjs');
require('../Action.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../qualifier/QualifierValue.cjs');
require('../qualifier/Qualifier.cjs');
require('./QualifierModel.cjs');
require('./qualifierToJson.cjs');
require('../utils/unsupportedError.cjs');
require('../utils/dataStructureUtils.cjs');
require('./ActionModel.cjs');
require('./actionToJson.cjs');

/**
 * Create TimelinePosition from given ITimelinePositionModel
 * @param timelinePosition
 */
function createTimelinePositionFromModel(timelinePosition) {
    var startOffset = timelinePosition.startOffset, endOffset = timelinePosition.endOffset, duration = timelinePosition.duration;
    var result = new qualifiers_video_TimelinePosition.TimelinePosition();
    if (startOffset) {
        result.startOffset(startOffset);
    }
    if (endOffset) {
        result.endOffset(endOffset);
    }
    if (duration) {
        result.duration(duration);
    }
    return result;
}

exports.createTimelinePositionFromModel = createTimelinePositionFromModel;
