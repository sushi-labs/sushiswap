import { Action } from "../../internal/Action.js";
/**
 * @description Removes the edges of the image based on the color of the corner pixels.
 * Specify a color other than the color of the corner pixels using the colorOverride() method
 * @extends SDK.Action
 * @memberOf Actions.Reshape
 * @see Visit {@link Actions.Reshape| Reshape} for examples
 */
class TrimAction extends Action {
    /**
     * @param {number} tolerance The tolerance level for color similarity.
     */
    colorSimilarity(tolerance) {
        this._tolerance = tolerance;
        return this;
    }
    /**
     * @param {string | Qualifiers.Color} color Overrides the corner pixels color with the specified color.
     */
    colorOverride(color) {
        this._color = color;
        return this;
    }
    toString() {
        // image.reshape(Reshape.trim()->colorSimilarity(50)->colorOverride(Color.YELLOW));
        // e_trim:50:yellow
        return [
            'e_trim',
            this._tolerance,
            this._color
        ].filter((a) => a).join(':');
    }
}
export { TrimAction };
