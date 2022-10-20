import { Action } from "../../internal/Action.js";
import { AnimatedFormatQualifierValue } from "../../qualifiers/animatedFormat/AnimatedFormatQualifierValue.js";
import { IToAnimatedActionModel } from "../../internal/models/ITranscodeActionModel.js";
import { IActionModel } from "../../internal/models/IActionModel.js";
/**
 * @extends SDK.Action
 * @memberOf Actions.Transcode
 * @description Converts a video to an animated webp or gif.
 * The resulting transformation includes format (f_format) and the animated flag (fl_animated).
 * The flag fl_awebp is added only when an animated webp is requested.
 * @see Visit {@link Actions.Transcode|Transcode} for an example
 */
declare class ToAnimatedAction extends Action {
    protected _actionModel: IToAnimatedActionModel;
    constructor(animatedFormat?: AnimatedFormatQualifierValue | string);
    /**
     * @description Sets the time between frames.
     * @param delayValue The time in milliseconds.
     */
    delay(delayValue: number): this;
    /**
     * @description Sets the frequency at which the video is sampled.
     * @param sampling As a string (e.g. '2.3s'), samples one frame every 2.3 seconds.<br>As a number (e.g. 20),
     * samples that many equally spaced frames over the duration of the video.
     */
    sampling(sampling: string | number): this;
    static fromJson(actionModel: IActionModel): ToAnimatedAction;
}
export default ToAnimatedAction;
