import { Action } from "../../internal/Action.js";
import { IBitRateActionModel } from "../../internal/models/ITranscodeActionModel.js";
import { IActionModel } from "../../internal/models/IActionModel.js";
/**
 * @extends SDK.Action
 * @memberOf Actions.Transcode
 * @description  Defines the video bitrate in bits per second.
 *
 * <b>Learn more</b>: {@link https://cloudinary.com/documentation/video_manipulation_and_delivery#bitrate_control|Bitrate control}
 * @see Visit {@link Actions.Transcode|Transcode} for an example
 */
declare class BitRateAction extends Action {
    private bitRate;
    private isConstant;
    protected _actionModel: IBitRateActionModel;
    constructor(bitRate: string | number);
    /**
     * @description video plays with a constant bitrate (CBR).
     */
    constant(): this;
    protected prepareQualifiers(): this;
    static fromJson(actionModel: IActionModel): BitRateAction;
}
export default BitRateAction;
