import { Action } from "../../internal/Action.js";
import { IFPSActionModel } from "../../internal/models/ITranscodeActionModel.js";
import { IActionModel } from "../../internal/models/IActionModel.js";
import FPSRangeAction from "./FPSRangeAction.js";
/**
 * @extends SDK.Action
 * @memberOf Actions.Transcode
 * @description Controls the FPS (Frames Per Second) to ensure that video (even when optimized)
 * is delivered with
 * an expected FPS level (helps with sync to audio).
 *
 * <b>Learn more</b>: {@link https://cloudinary.com/documentation/video_transformation_reference#video_settings|Video settings}
 * @see Visit {@link Actions.Transcode|Transcode} for an example
 */
declare class FPSAction extends Action {
    protected _actionModel: IFPSActionModel;
    constructor(from: number);
    static fromJson(actionModel: IActionModel): FPSAction | FPSRangeAction;
}
export default FPSAction;
