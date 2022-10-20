import { Action } from "../../internal/Action.js";
import { ImageSource } from "../../qualifiers/source/sourceTypes/ImageSource.js";
/**
 * @description - This Action, while belonging to Effect, acts as a modified overlay.
 *                The class implements the Builder pattern, where strength() and preserveColor()
 *                are applied to the instance, and toString() is responsible to combining them into the right result.
 * @extends SDK.Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
declare class StyleTransfer extends Action {
    private imageSource;
    private effectStrength;
    private preserve;
    /**
     * The Image Source used to create the style transfer,
     * Use the Image Source builder to quickly create a source:
     * </br>Import: {@link Qualifiers.Source|import Sources from '@cloudinary/url-gen/qualifiers/sources';}
     * </br>Create: `Source.image('dog')`
     * @param {ImageSource} imageSource
     */
    constructor(imageSource: ImageSource);
    /**
     * Determines the strength in which the styleTransfer is applied.
     * @param {number} [effectStrength] - The strength level, 1-100, default: 100
     * @return {this}
     */
    strength(effectStrength?: number): this;
    /**
     * More aggressively preserves the colors of the the target photo,
     * Can be used with `strength()` to enhance this behaviour
     * @param {boolean} bool
     * @return {this}
     */
    preserveColor(bool?: boolean): this;
    /**
     * The `build` phase of the Action, used internally to concat all the options received into a single string.
     * The result of this method is the toString() of the imageLayer provided in the constructor.
     * @return {string}
     */
    toString(): string;
}
export { StyleTransfer };
