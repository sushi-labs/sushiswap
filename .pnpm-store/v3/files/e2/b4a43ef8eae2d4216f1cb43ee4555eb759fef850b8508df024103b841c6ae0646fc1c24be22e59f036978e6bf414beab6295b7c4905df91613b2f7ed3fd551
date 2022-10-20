import { Action } from "../../internal/Action.js";
import { Qualifier } from "../../internal/qualifier/Qualifier.js";
/**
 * @description Trims pixels according to the transparency levels of a given overlay image.
 * Wherever the overlay image is transparent, the original is shown, and wherever the overlay is opaque, the resulting image is transparent.
 * @extends SDK.Action
 * @param {Qualifiers.Source.ImageSource} imageSource
 * @memberOf Actions.Reshape
 * @see Visit {@link Actions.Reshape| Reshape} for examples
 */
class CutByImage extends Action {
    constructor(source) {
        super();
        this.source = source;
    }
    /**
     * @description Defines the position of the layer.
     * @param {Qualifiers.Position} position The position of the overlay with respect to the base image.
     * @return {this}
     */
    position(position) {
        this._position = position;
        return this;
    }
    toString() {
        var _a;
        const close = new Action();
        // Our implementation prevents two `fl` keys in the same URL component
        // We also don't want to concatenate flags (fl_layer_apply.cutter)
        // We use this trick to create two separate flags
        close.addQualifier(new Qualifier('fl', 'cutter,fl_layer_apply'));
        (_a = this._position) === null || _a === void 0 ? void 0 : _a.qualifiers.forEach((qualifier) => {
            close.addQualifier(qualifier);
        });
        return [
            this.source.getOpenSourceString('l'),
            this.source.getTransformation(),
            close
        ].filter((a) => a).join('/');
    }
}
export default CutByImage;
