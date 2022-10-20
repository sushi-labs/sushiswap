import { Action } from "../../../internal/Action.js";
import { IFadeOutEffectActionModel } from "../../../internal/models/IEffectActionModel.js";
import { IActionModel } from "../../../internal/models/IActionModel.js";
/**
 * @description Fade out at the end of the video, use the length() method to set the time in ms for the fade to occur. (Server default: 2000)
 * @extends LeveledEffectAction
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
declare class FadeOutEffectAction extends Action {
    protected _actionModel: IFadeOutEffectActionModel;
    constructor(duration: number);
    /**
     *
     * @description Sets the duration level for the action
     * @param {string | number} duration - The duration of the effect
     */
    duration(duration: number | string): this;
    static fromJson(actionModel: IActionModel): FadeOutEffectAction;
}
export { FadeOutEffectAction };
