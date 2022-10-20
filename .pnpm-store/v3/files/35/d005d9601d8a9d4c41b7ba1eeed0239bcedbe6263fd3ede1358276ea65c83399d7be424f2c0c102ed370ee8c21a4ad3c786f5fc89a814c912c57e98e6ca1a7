import { Qualifier } from "../../internal/qualifier/Qualifier.js";
import { ResizeAdvancedAction } from "./ResizeAdvancedAction.js";
import { createBackgroundModel } from "../../internal/models/createBackgroundModel.js";
import { createBackgroundFromModel } from "../../internal/models/createBackgroundFromModel.js";
/**
 * @description Defines an advanced resize with padding.
 * @extends Actions.Resize.ResizeAdvancedAction
 * @memberOf Actions.Resize
 * @see Visit {@link Actions.Resize| Resize} for examples
 */
class ResizePadAction extends ResizeAdvancedAction {
    /**
     * @description Sets the background.
     * @param {Qualifiers.Background} backgroundQualifier Defines the background color to use instead of
     * transparent background areas or when resizing with padding.
     */
    background(backgroundQualifier) {
        this._actionModel.background = createBackgroundModel(backgroundQualifier);
        return this.addQualifier(backgroundQualifier);
    }
    /**
     * @description Horizontal position for custom-coordinates based padding.
     * @param {number} x The x position.
     */
    offsetX(x) {
        this._actionModel.x = x;
        return this.addQualifier(new Qualifier('x', x));
    }
    /**
     * @description Vertical position for custom-coordinates based padding
     * @param {number} y The y position.
     */
    offsetY(y) {
        this._actionModel.y = y;
        return this.addQualifier(new Qualifier('y', y));
    }
    static fromJson(actionModel) {
        const result = super.fromJson.apply(this, [actionModel]);
        actionModel.background && result.background(createBackgroundFromModel(actionModel.background));
        actionModel.x && result.offsetX(actionModel.x);
        actionModel.y && result.offsetY(actionModel.y);
        actionModel.zoom && result.zoom(actionModel.zoom);
        return result;
    }
}
export { ResizePadAction };
