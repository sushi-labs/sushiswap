import { Action } from "../../internal/Action.js";
import { CompassGravity } from "../gravity/compassGravity/CompassGravity.js";
import { FocusOnGravity } from "../gravity/focusOnGravity/FocusOnGravity.js";
import { IPositionModel } from "../../internal/models/IPositionModel.js";
/**
 * @description
 * Defines the position of a layer: overlay or underlay.</br>
 * Even though Position is technically an action qualifier, it implements exactly the same functionality as an action.</br>
 * This is true because Position is compounded of multiple qualifiers</br>
 *
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_transformations#image_and_text_overlays|Applying overlays to images} | {@link https://cloudinary.com/documentation/video_manipulation_and_delivery#adding_image_overlays|Applying overlays to videos}
 *
 * @extends {SDK.Actions}
 */
declare class PositionQualifier extends Action {
    _actionModel: IPositionModel;
    constructor();
    gravity(gravityQualifier: CompassGravity | FocusOnGravity): this;
    /**
     * @description Tiles the overlay across your image.
     * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_transformations#tiling_overlays|Tiling overlay}
     */
    tiled(): this;
    /**
     * TODO - This should accept a boolean value
     * @description Prevents an image or text overlay from extending a delivered image canvas beyond the dimensions of the base image
     * <b>Learn more:</b> {@link https://cloudinary.com/documentation/transformation_reference#fl_no_overflow|Overflow in overlays}
     */
    allowOverflow(bool?: boolean): this;
    /**
     * @description Set the X Offset
     * @param {number | string} offsetX
     * @return {this}
     */
    offsetX(offsetX: number | string): this;
    /**
     * @description Set the Y Offset
     * @param {number | string} offsetY
     * @return {this}
     */
    offsetY(offsetY: number | string): this;
}
export { PositionQualifier };
