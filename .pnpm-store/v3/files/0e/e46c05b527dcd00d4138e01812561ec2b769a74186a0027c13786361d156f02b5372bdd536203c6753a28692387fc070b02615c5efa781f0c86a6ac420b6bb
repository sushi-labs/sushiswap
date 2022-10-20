import { Action } from "../../internal/Action.js";
import { FormatQualifier } from "../../qualifiers/format/FormatQualifier.js";
import { Qualifier } from "../../internal/qualifier/Qualifier.js";
import { DELIVERY_MODE_TO_ACTION_TYPE_MAP } from "../../internal/internalConstants.js";
/**
 * @description Qualifies the delivery of an asset.
 * @memberOf Actions.Delivery
 * @extends SDK.Action
 */
class DeliveryAction extends Action {
    /**
     * @param {string} deliveryKey A generic Delivery Action Key (such as q, f, dn, etc.)
     * @param {string} deliveryType A Format Qualifiers for the action, such as Quality.auto()
     * @param {string} modelProperty internal model property of the action, for example quality uses `level` while dpr uses `density`
     * @see Visit {@link Actions.Delivery|Delivery} for an example
     */
    constructor(deliveryKey, deliveryType, modelProperty) {
        super();
        this._actionModel = {};
        let deliveryTypeValue;
        if (deliveryType instanceof FormatQualifier) {
            deliveryTypeValue = deliveryType.getValue();
        }
        else {
            deliveryTypeValue = deliveryType;
        }
        this._actionModel.actionType = DELIVERY_MODE_TO_ACTION_TYPE_MAP[deliveryKey];
        this._actionModel[modelProperty] = deliveryTypeValue;
        this.addQualifier(new Qualifier(deliveryKey, deliveryType));
    }
}
export { DeliveryAction };
