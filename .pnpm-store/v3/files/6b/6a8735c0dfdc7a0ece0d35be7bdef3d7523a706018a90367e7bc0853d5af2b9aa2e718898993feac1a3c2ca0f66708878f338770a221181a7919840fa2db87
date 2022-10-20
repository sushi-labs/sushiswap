import { Action } from "../../internal/Action.js";
import { QualifierValue } from "../../internal/qualifier/QualifierValue.js";
import { Qualifier } from "../../internal/qualifier/Qualifier.js";
/**
 * @description Specifies the ICC profile to use for the color space.
 * @memberOf Actions.Delivery
 * @extends SDK.Action
 * @see Visit {@link Actions.Delivery|Delivery} for an example
 */
class DeliveryColorSpaceFromICCAction extends Action {
    /**
     * @param {string} publicId
     */
    constructor(publicId) {
        super();
        this._actionModel = {};
        this._actionModel.actionType = 'colorSpaceFromICC';
        this._actionModel.publicId = publicId;
        const qualifierValue = new QualifierValue(['icc', publicId]).setDelimiter(':');
        this.addQualifier(new Qualifier('cs', qualifierValue));
    }
    static fromJson(actionModel) {
        const { publicId } = actionModel;
        return new this(publicId);
    }
}
export { DeliveryColorSpaceFromICCAction };
