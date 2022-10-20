import { Action } from "../../internal/Action.js";
import { IFPSRangeActionModel } from "../../internal/models/ITranscodeActionModel.js";
/**
 * @extends SDK.Action
 * @memberOf Actions.Transcode
 * @description Controls the range of acceptable FPS (Frames Per Second) to ensure that video (even when optimized)
 * is delivered with
 * an expected FPS level (helps with sync to audio).
 *
 * <b>Learn more</b>: {@link https://cloudinary.com/documentation/video_transformation_reference#video_settings|Video settings}
 * @see Visit {@link Actions.Transcode|Transcode} for an example
 */
declare class FPSRangeAction extends Action {
    private from;
    private to;
    protected _actionModel: IFPSRangeActionModel;
    constructor(from: number, to?: number);
    protected prepareQualifiers(): this;
}
export default FPSRangeAction;
