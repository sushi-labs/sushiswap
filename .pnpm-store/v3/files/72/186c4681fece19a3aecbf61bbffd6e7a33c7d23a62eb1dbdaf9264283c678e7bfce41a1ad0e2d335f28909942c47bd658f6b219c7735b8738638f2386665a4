import { Qualifier } from "../../internal/qualifier/Qualifier.js";
import { ResizeAdvancedAction } from "./ResizeAdvancedAction.js";
/**
 * @description Defines a thumbnail resize action.
 * @extends Actions.Resize.ResizeAdvancedAction
 * @memberOf Actions.Resize
 * @see Visit {@link Actions.Resize| Resize} for examples
 */
class ThumbResizeAction extends ResizeAdvancedAction {
    /**
     * @description Controls how much of the original image surrounding the face to keep when using either the 'crop' or 'thumb' cropping modes with face detection.
     * @param {number | string} z The zoom factor. (Default: 1.0)
     */
    zoom(z) {
        this._actionModel.zoom = z;
        return this.addQualifier(new Qualifier('z', z));
    }
    static fromJson(actionModel) {
        const result = super.fromJson.apply(this, [actionModel]);
        actionModel.zoom && result.zoom(actionModel.zoom);
        return result;
    }
}
export { ThumbResizeAction };
