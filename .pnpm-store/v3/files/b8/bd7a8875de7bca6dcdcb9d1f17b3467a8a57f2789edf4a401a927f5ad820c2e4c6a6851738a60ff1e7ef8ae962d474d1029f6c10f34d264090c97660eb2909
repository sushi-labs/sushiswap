import { Action } from "../../internal/Action.js";
import { Qualifier } from "../../internal/qualifier/Qualifier.js";
/**
 * @description Defines a video range using startOffset, endOffset, duration.
 * @namespace TimelinePosition
 * @memberOf Qualifiers
 */
/**
 * TimelinePosition
 * @memberOf Qualifiers.TimelinePosition
 */
class TimelinePosition extends Action {
    constructor() {
        super();
        this._actionModel = {};
    }
    /**
     * @param {string | number} startOffset
     */
    startOffset(startOffset) {
        const startOffsetQualifier = new Qualifier('so', startOffset);
        this.addQualifier(startOffsetQualifier);
        this._actionModel.startOffset = startOffsetQualifier.qualifierValue.toString();
        return this;
    }
    /**
     * @param {string | number} endOffset
     */
    endOffset(endOffset) {
        const endOffsetQualifier = new Qualifier('eo', endOffset);
        this.addQualifier(endOffsetQualifier);
        this._actionModel.endOffset = endOffsetQualifier.qualifierValue.toString();
        return this;
    }
    /**
     * @param {string | number} duration
     */
    duration(duration) {
        const durationQualifier = new Qualifier('du', duration);
        this.addQualifier(durationQualifier);
        this._actionModel.duration = durationQualifier.qualifierValue.toString();
        return this;
    }
}
export { TimelinePosition };
