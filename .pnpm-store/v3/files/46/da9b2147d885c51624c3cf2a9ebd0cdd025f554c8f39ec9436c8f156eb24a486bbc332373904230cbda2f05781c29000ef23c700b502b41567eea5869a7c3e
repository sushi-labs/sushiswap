import { Action } from "../../../internal/Action.js";
import { IFadeInEffectActionModel } from "../../../internal/models/IEffectActionModel.js";
import { IActionModel } from "../../../internal/models/IActionModel.js";
/**
 * @description Fade out at the end of the video, use the length() method to set the time in ms for the fade to occur. (Server default: 2000)
 * @extends Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
declare class FadeInEffectAction extends Action {
    protected _actionModel: IFadeInEffectActionModel;
    constructor(duration?: number);
    /**
     *
     * @description Sets the duration level for the action
     * @param {string | number} duration - The duration of the effect
     */
    duration(duration: number | string): this;
    static fromJson(actionModel: IActionModel): FadeInEffectAction;
}
export { FadeInEffectAction };
