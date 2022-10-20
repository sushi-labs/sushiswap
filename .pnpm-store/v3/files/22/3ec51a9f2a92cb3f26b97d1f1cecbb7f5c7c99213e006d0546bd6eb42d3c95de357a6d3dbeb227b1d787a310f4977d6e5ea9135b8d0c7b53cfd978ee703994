import { ResizeSimpleAction } from "./ResizeSimpleAction.js";
import { IGravity } from "../../qualifiers/gravity/GravityQualifier.js";
import { IActionModel } from "../../internal/models/IActionModel.js";
import { IResizeAdvancedActionModel } from "../../internal/models/IResizeAdvancedActionModel.js";
/**
 * @description Defines an advanced resize.
 * @extends Actions.Resize.ResizeSimpleAction
 * @memberOf Actions.Resize
 * @see Visit {@link Actions.Resize| Resize} for examples
 */
declare class ResizeAdvancedAction extends ResizeSimpleAction {
    protected _actionModel: IResizeAdvancedActionModel;
    /**
     * @description Which part of the original image to include.
     * @param {Qualifiers.Gravity} gravity
     */
    gravity(gravity: IGravity): this;
    static fromJson(actionModel: IActionModel): ResizeAdvancedAction;
}
export { ResizeAdvancedAction };
