import { Action } from "../../internal/Action.js";
import { IActionModel } from "../../internal/models/IActionModel.js";
import { ColorSpaceType } from "../../types/types.js";
import { IDeliveryColorSpaceActionModel } from "../../internal/models/IDeliveryActionModel.js";
/**
 * @description Specifies the color space to use.
 * @memberOf Actions.Delivery
 * @extends SDK.Action
 * @see Visit {@link Actions.Delivery|Delivery} for an example
 */
declare class DeliveryColorSpaceAction extends Action {
    protected _actionModel: IDeliveryColorSpaceActionModel;
    /**
     * Create a new DeliveryColorSpaceAction
     * @param mode
     */
    constructor(mode: ColorSpaceType);
    static fromJson(actionModel: IActionModel): DeliveryColorSpaceAction;
}
export { DeliveryColorSpaceAction };
