import { DeliveryAction } from "./DeliveryAction.js";
import { IActionModel } from "../../internal/models/IActionModel.js";
/**
 * @description Controls the quality of the delivered image or video.
 * @memberOf Actions.Delivery
 * @extends {Actions.Delivery.DeliveryAction}
 * @see Visit {@link Actions.Delivery|Delivery} for an example
 */
declare class DeliveryQualityAction extends DeliveryAction {
    private qualityValue;
    /**
     * @param {Qualifiers.Quality} qualityValue a Quality value
     */
    constructor(qualityValue: string | number);
    /**
     * Selet the Chroma sub sampling</br>
     * <b>Learn more</b>: {@link https://cloudinary.com/documentation/image_transformations#toggling_chroma_subsampling|Toggling chroma subsampling}
     * @param {420 | 444 | number} type The chroma sub sampling type
     */
    chromaSubSampling(type: 420 | 444 | number): this;
    /**
     * Controls the final quality by setting a maximum quantization percentage
     * @param {number} val
     */
    quantization(val: number): this;
    static fromJson(actionModel: IActionModel): DeliveryQualityAction;
}
export { DeliveryQualityAction };
