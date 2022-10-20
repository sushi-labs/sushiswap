import { Action } from "../../internal/Action.js";
import { QualifierValue } from "../../internal/qualifier/QualifierValue.js";
import { Qualifier } from "../../internal/qualifier/Qualifier.js";
/**
 * @description A class that defines how to remove the background of an asset
 * @extends SDK.Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
class RemoveBackgroundAction extends Action {
    constructor() {
        super();
        this.overwriteQualifier();
    }
    /**
     * @description Everytime this method is called, it will overwrite the e_bgremoval qualifier with new values
     * @private
     */
    overwriteQualifier() {
        const value = ['bgremoval', this._screen ? 'screen' : '', (this._colorToRemove || '').replace('#', '')];
        return this.addQualifier(new Qualifier('e', new QualifierValue(value)));
    }
    /**
     * @description The strength of the shadow. (Range: 0 to 100, Server default: 40)
     * @param {number} useScreen Boolean, defaults to true
     * @return {this}
     */
    screen(useScreen = true) {
        this._screen = useScreen;
        return this.overwriteQualifier();
    }
    /**
     * @description The color to remove from the background
     * @param {SystemColors} color
     * @return {this}
     */
    colorToRemove(color) {
        this._colorToRemove = color;
        return this.overwriteQualifier();
    }
}
export { RemoveBackgroundAction };
