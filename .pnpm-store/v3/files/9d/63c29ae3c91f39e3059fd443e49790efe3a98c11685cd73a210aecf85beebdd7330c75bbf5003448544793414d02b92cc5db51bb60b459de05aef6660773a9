import { Action } from "../../internal/Action.js";
import { SystemColors } from "../../qualifiers/color.js";
/**
 * @description Removes the edges of the image based on the color of the corner pixels.
 * Specify a color other than the color of the corner pixels using the colorOverride() method
 * @extends SDK.Action
 * @memberOf Actions.Reshape
 * @see Visit {@link Actions.Reshape| Reshape} for examples
 */
declare class TrimAction extends Action {
    private _tolerance;
    private _color;
    /**
     * @param {number} tolerance The tolerance level for color similarity.
     */
    colorSimilarity(tolerance: number): this;
    /**
     * @param {string | Qualifiers.Color} color Overrides the corner pixels color with the specified color.
     */
    colorOverride(color: SystemColors | string): this;
    toString(): string;
}
export { TrimAction };
