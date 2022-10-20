import { DeliveryAction } from "./DeliveryAction.js";
import { ProgressiveQualifier } from "../../qualifiers/progressive.js";
import { FormatQualifier } from "../../qualifiers/format/FormatQualifier.js";
import { ProgressiveType } from "../../types/types.js";
import { IActionModel } from "../../internal/models/IActionModel.js";
/**
 * @memberOf Actions.Delivery
 * @extends {Actions.Delivery.DeliveryAction}
 * @see Visit {@link Actions.Delivery|Delivery} for an example
 */
declare class DeliveryFormatAction extends DeliveryAction {
    constructor(deliveryKey?: string, deliveryType?: FormatQualifier | string | number);
    /**
     * @description Uses lossy compression when delivering animated GIF files.
     * @return {this}
     */
    lossy(): this;
    /**
     * @description Uses progressive compression when delivering JPG file format.
     * @return {this}
     */
    progressive(mode?: ProgressiveType | ProgressiveQualifier): this;
    /**
     * @description Ensures that images with a transparency channel are delivered in PNG format.
     */
    preserveTransparency(): this;
    static fromJson(actionModel: IActionModel): DeliveryFormatAction;
}
export { DeliveryFormatAction };
