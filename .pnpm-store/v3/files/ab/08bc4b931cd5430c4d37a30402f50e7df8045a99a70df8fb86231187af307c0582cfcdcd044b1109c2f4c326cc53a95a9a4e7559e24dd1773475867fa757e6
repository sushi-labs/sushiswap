import { BackgroundQualifier } from "../../qualifiers/background/shared/base/BackgroundQualifier.js";
import { IGravity } from "../../qualifiers/gravity/GravityQualifier.js";
import { ResizeAdvancedAction } from "./ResizeAdvancedAction.js";
import { IActionModel } from "../../internal/models/IActionModel.js";
import { CompassGravity } from "../../qualifiers/gravity/compassGravity/CompassGravity.js";
/**
 * @description Defines an advanced resize with padding.
 * @extends Actions.Resize.ResizeAdvancedAction
 * @memberOf Actions.Resize
 * @see Visit {@link Actions.Resize| Resize} for examples
 */
declare class ResizePadAction<GravityType extends IGravity> extends ResizeAdvancedAction {
    /**
     * @description Sets the background.
     * @param {Qualifiers.Background} backgroundQualifier Defines the background color to use instead of
     * transparent background areas or when resizing with padding.
     */
    background(backgroundQualifier: BackgroundQualifier): this;
    /**
     * @description Horizontal position for custom-coordinates based padding.
     * @param {number} x The x position.
     */
    offsetX(x: number | string): this;
    /**
     * @description Vertical position for custom-coordinates based padding
     * @param {number} y The y position.
     */
    offsetY(y: number | string): this;
    static fromJson(actionModel: IActionModel): ResizePadAction<CompassGravity>;
}
export { ResizePadAction };
