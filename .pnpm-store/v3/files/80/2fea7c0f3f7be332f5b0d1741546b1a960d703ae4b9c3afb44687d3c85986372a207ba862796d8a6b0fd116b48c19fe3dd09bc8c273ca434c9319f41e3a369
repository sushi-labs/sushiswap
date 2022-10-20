import { Action } from "../../internal/Action.js";
import { Qualifier } from "../../internal/qualifier/Qualifier.js";
/**
 * @description Class for shortening a video to the specified range.
 * @extends SDK.Action
 * @memberOf Actions.VideoEdit
 * @see Visit {@link Actions.VideoEdit|VideoEdit} for an example
 */
class TrimAction extends Action {
    constructor() {
        super();
        this._actionModel = {
            actionType: 'trimVideo'
        };
    }
    /**
     *
     * @description Support Percentages in values (30% -> 30p)
     * @param {string|number} val
     * @private
     * @return {string}
     */
    parseVal(val) {
        return typeof val === 'number' ? val : val.replace('%', 'p');
    }
    /**
     * @description Sets the starting position of the part of the video to keep when trimming videos.
     *
     * @param {string|number} offset The starting position of the part of the video to keep. This can be specified as a
     *                           float representing the time in seconds or a string representing the percentage of the
     *                           video length (for example, "30%" or "30p").
     * @return {this}
     */
    startOffset(offset) {
        this._actionModel.startOffset = +offset;
        return this.addQualifier(new Qualifier('so', this.parseVal(offset)));
    }
    /**
     * @description Sets the end position of the part of the video to keep when trimming videos.
     *
     * @param {string|number} offset The end position of the part of the video to keep. This can be specified as a
     *                         float representing the time in seconds or a string representing the percentage of the
     *                         video length (for example, "30%" or "30p").
     * @return {this}
     */
    endOffset(offset) {
        this._actionModel.endOffset = +offset;
        return this.addQualifier(new Qualifier('eo', this.parseVal(offset)));
    }
    /**
     * @description Sets the duration of the video to keep.
     *
     * @param {string|number} duration The length of the part of the video to keep. This can be specified as a float
     *                        representing the time in seconds or a string representing the percentage of the
     *                        video length (for example, "30%" or "30p").
     * @return {this}
     */
    duration(duration) {
        this._actionModel.duration = duration;
        return this.addQualifier(new Qualifier('du', this.parseVal(duration)));
    }
    static fromJson(actionModel) {
        const { duration, startOffset, endOffset } = actionModel;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        const result = new this();
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
    }
}
export default TrimAction;
