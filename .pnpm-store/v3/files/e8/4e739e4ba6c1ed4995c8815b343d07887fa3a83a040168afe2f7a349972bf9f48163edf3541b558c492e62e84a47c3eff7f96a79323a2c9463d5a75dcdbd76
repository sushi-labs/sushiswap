import { Action } from "../../internal/Action.js";
import { ITrimActionModel } from "../../internal/models/ITrimActionModel.js";
import { IActionModel } from "../../internal/models/IActionModel.js";
/**
 * @description Class for shortening a video to the specified range.
 * @extends SDK.Action
 * @memberOf Actions.VideoEdit
 * @see Visit {@link Actions.VideoEdit|VideoEdit} for an example
 */
declare class TrimAction extends Action {
    protected _actionModel: ITrimActionModel;
    constructor();
    /**
     *
     * @description Support Percentages in values (30% -> 30p)
     * @param {string|number} val
     * @private
     * @return {string}
     */
    private parseVal;
    /**
     * @description Sets the starting position of the part of the video to keep when trimming videos.
     *
     * @param {string|number} offset The starting position of the part of the video to keep. This can be specified as a
     *                           float representing the time in seconds or a string representing the percentage of the
     *                           video length (for example, "30%" or "30p").
     * @return {this}
     */
    startOffset(offset: string | number): this;
    /**
     * @description Sets the end position of the part of the video to keep when trimming videos.
     *
     * @param {string|number} offset The end position of the part of the video to keep. This can be specified as a
     *                         float representing the time in seconds or a string representing the percentage of the
     *                         video length (for example, "30%" or "30p").
     * @return {this}
     */
    endOffset(offset: string | number): this;
    /**
     * @description Sets the duration of the video to keep.
     *
     * @param {string|number} duration The length of the part of the video to keep. This can be specified as a float
     *                        representing the time in seconds or a string representing the percentage of the
     *                        video length (for example, "30%" or "30p").
     * @return {this}
     */
    duration(duration: string | number): this;
    static fromJson(actionModel: IActionModel): TrimAction;
}
export default TrimAction;
