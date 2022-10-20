import { TimelinePosition } from "../../qualifiers/video/TimelinePosition.js";
/**
 * Create TimelinePosition from given ITimelinePositionModel
 * @param timelinePosition
 */
export function createTimelinePositionFromModel(timelinePosition) {
    const { startOffset, endOffset, duration } = timelinePosition;
    const result = new TimelinePosition();
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
