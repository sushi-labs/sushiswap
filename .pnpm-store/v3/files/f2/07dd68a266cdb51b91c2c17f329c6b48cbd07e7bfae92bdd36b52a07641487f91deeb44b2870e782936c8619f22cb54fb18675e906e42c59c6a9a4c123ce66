import { Action } from "../../internal/Action.js";
import { SystemColors } from "../../qualifiers/color.js";
/**
 * @description A class that defines how to remove the background of an asset
 * @extends SDK.Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
declare class RemoveBackgroundAction extends Action {
    private _screen;
    private _colorToRemove;
    constructor();
    /**
     * @description Everytime this method is called, it will overwrite the e_bgremoval qualifier with new values
     * @private
     */
    private overwriteQualifier;
    /**
     * @description The strength of the shadow. (Range: 0 to 100, Server default: 40)
     * @param {number} useScreen Boolean, defaults to true
     * @return {this}
     */
    screen(useScreen?: boolean): this;
    /**
     * @description The color to remove from the background
     * @param {SystemColors} color
     * @return {this}
     */
    colorToRemove(color: SystemColors): this;
}
export { RemoveBackgroundAction };
