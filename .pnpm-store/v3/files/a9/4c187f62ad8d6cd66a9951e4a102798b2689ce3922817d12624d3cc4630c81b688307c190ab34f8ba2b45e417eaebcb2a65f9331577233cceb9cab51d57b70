import { Action } from "../../../internal/Action.js";
import { IActionModel } from "../../../internal/models/IActionModel.js";
import { IAccelerateActionModel } from "../../../internal/models/IEffectActionModel.js";
/**
 * @description Changes the speed of the video playback using the rate() method
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
declare class AccelerationEffectAction extends Action {
    private _rate;
    protected _actionModel: IAccelerateActionModel;
    constructor(rate?: string | number);
    rate(rate: number | string): this;
    protected prepareQualifiers(): this;
    static fromJson(actionModel: IActionModel): AccelerationEffectAction;
}
export { AccelerationEffectAction };
