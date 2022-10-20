import { Action } from "../../internal/Action.js";
import { SimulateColorBlindType } from "../../types/types.js";
import { ISimulateColorBlindEffectModel } from "../../internal/models/IEffectActionModel.js";
import { IActionModel } from "../../internal/models/IActionModel.js";
/**
 * @description Simulates the way an image would appear to someone with the specified color blind condition
 * @extends SDK.Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
declare class SimulateColorBlindEffectAction extends Action {
    protected _actionModel: ISimulateColorBlindEffectModel;
    constructor();
    private setQualifier;
    /**
     * @description Sets the color blind condition to simulate.
     * @param {Qualifiers.simulateColorBlindValues | SimulateColorBlindType | string} cond
     * @return {this}
     */
    condition(cond: SimulateColorBlindType | string): this;
    static fromJson(actionModel: IActionModel): SimulateColorBlindEffectAction;
}
export { SimulateColorBlindEffectAction };
