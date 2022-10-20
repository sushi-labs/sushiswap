import { lossy, preserveTransparency, progressive } from "../../qualifiers/flag.js";
import { DeliveryAction } from "./DeliveryAction.js";
import { ProgressiveQualifier } from "../../qualifiers/progressive.js";
/**
 * @memberOf Actions.Delivery
 * @extends {Actions.Delivery.DeliveryAction}
 * @see Visit {@link Actions.Delivery|Delivery} for an example
 */
class DeliveryFormatAction extends DeliveryAction {
    constructor(deliveryKey, deliveryType) {
        super(deliveryKey, deliveryType, 'formatType');
    }
    /**
     * @description Uses lossy compression when delivering animated GIF files.
     * @return {this}
     */
    lossy() {
        this._actionModel.lossy = true;
        this.addFlag(lossy());
        return this;
    }
    /**
     * @description Uses progressive compression when delivering JPG file format.
     * @return {this}
     */
    progressive(mode) {
        if (mode instanceof ProgressiveQualifier) {
            this._actionModel.progressive = { mode: mode.getFlagValue() };
            this.addFlag(mode);
        }
        else {
            this._actionModel.progressive = { mode: mode };
            this.addFlag(progressive(mode));
        }
        return this;
    }
    /**
     * @description Ensures that images with a transparency channel are delivered in PNG format.
     */
    preserveTransparency() {
        this._actionModel.preserveTransparency = true;
        this.addFlag(preserveTransparency());
        return this;
    }
    static fromJson(actionModel) {
        const { formatType, lossy, progressive, preserveTransparency } = actionModel;
        let result;
        if (formatType) {
            result = new this('f', formatType);
        }
        else {
            result = new this('f');
        }
        if (progressive) {
            if (progressive.mode) {
                result.progressive(progressive.mode);
            }
            else {
                result.progressive();
            }
        }
        lossy && result.lossy();
        preserveTransparency && result.preserveTransparency();
        return result;
    }
}
export { DeliveryFormatAction };
