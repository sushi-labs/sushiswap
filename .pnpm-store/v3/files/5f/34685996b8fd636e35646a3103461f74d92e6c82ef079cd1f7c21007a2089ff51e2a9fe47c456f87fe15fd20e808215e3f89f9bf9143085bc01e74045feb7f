import { Action } from "../../internal/Action.js";
import { Qualifier } from "../../internal/qualifier/Qualifier.js";
import { toFloatAsString } from "../../internal/utils/toFloatAsString.js";
/**
 * @description Specifies the dpr.
 * @memberOf Actions.Delivery
 * @extends SDK.Action
 * @see Visit {@link Actions.Delivery|Delivery} for an example
 */
class DeliveryDPRAction extends Action {
    /**
     * Create a new DeliveryDPRAction
     * @param dprValue
     */
    constructor(dprValue) {
        super();
        this._actionModel = { actionType: 'dpr' };
        // toFloatAsString is used to ensure 1 turns into 1.0
        const dprAsFloat = toFloatAsString(dprValue);
        this._actionModel.dpr = dprAsFloat;
        this.addQualifier(new Qualifier('dpr', dprAsFloat));
    }
    static fromJson(actionModel) {
        const { dpr } = actionModel;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        return new this(dpr);
    }
}
export { DeliveryDPRAction };
