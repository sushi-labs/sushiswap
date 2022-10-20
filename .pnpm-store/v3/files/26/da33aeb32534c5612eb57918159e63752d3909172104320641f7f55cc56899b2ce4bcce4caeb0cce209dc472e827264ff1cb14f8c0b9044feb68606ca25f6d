import { Action } from "../../internal/Action.js";
import { IPreviewActionModel } from "../../internal/models/IPreviewActionModel.js";
import { IActionModel } from "../../internal/models/IActionModel.js";
/**
 * @description Class for creating a preview of a video
 * @memberOf Actions.VideoEdit
 * @extends SDK.Action
 * @see Visit {@link Actions.VideoEdit|VideoEdit} for an example
 */
declare class PreviewAction extends Action {
    protected _actionModel: IPreviewActionModel;
    private _minSeg;
    private _maxSeg;
    private _duration;
    constructor();
    /**
     * @description Control the duration of the video segments
     * @param {string|number} minSegDuration The duration of a video segment
     * @return {this}
     */
    minimumSegmentDuration(minSegDuration: string | number): this;
    /**
     * @description Control the number of the video segments
     * @param {string|number} maxSeg The number of the video segments.
     * @return {this}
     */
    maximumSegments(maxSeg: string | number): this;
    /**
     * @description control the length of the generated preview
     * @param {string|number} duration The duration in seconds such as 1.2, or 5.0
     * @return {this}
     */
    duration(duration: string | number): this;
    toString(): string;
    static fromJson(actionModel: IActionModel): PreviewAction;
}
export { PreviewAction };
