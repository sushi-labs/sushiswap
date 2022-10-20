import { ResizeSimpleAction } from "./ResizeSimpleAction.js";
import { GravityQualifier } from "../../qualifiers/gravity/GravityQualifier.js";
/**
 * @description Defines a scaling resize action.
 * @extends Actions.Resize.ResizeSimpleAction
 * @memberOf Actions.Resize
 * @see Visit {@link Actions.Resize| Resize} for examples
 */
class ResizeScaleAction extends ResizeSimpleAction {
    /**
     * @description Changes the aspect ratio of an image while retaining all important content and avoiding unnatural
     * distortions.
     * @return {this}
     */
    liquidRescaling() {
        return this.addQualifier(new GravityQualifier('liquid'));
    }
}
export { ResizeScaleAction };
