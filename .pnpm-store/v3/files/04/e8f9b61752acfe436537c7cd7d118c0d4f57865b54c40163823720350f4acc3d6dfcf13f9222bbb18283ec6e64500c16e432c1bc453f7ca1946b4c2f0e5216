import { Action } from "../../internal/Action.js";
/**
 * @description
 * Maps an input color and those similar to the input color to corresponding shades of a specified output color, taking luminosity and chroma into account, in order to recolor objects in your image in a natural way.</br>
 * More highly saturated input colors usually give the best results. It is recommended to avoid input colors approaching white, black, or gray.</br>
 *
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_transformations#replace_color_effect|Replace colors example}
 * @memberOf Actions.Adjust
 */
declare class ReplaceColorAction extends Action {
    private baseColor;
    private toleranceLevel;
    private targetColor;
    /**
     * @description Sets the target output color.
     * @param {string} toColor - The HTML name or RGB/A hex code of the target output color.
     */
    constructor(toColor: string);
    /**
     * @description Sets the tolerance threshold.
     * @param {number} toleranceLevel - The tolerance threshold (a radius in the LAB color space) from the input color, </br>
     *                                  representing the span of colors that should be replaced with a correspondingly adjusted version of the target output color. </br>
     *                                  Larger values result in replacing more colors within the image. </br>
     *                                  The more saturated the original input color, the more a change in value will impact the result (Server default: 50).
     * @return {this}
     */
    tolerance(toleranceLevel: number): this;
    /**
     * @description Sets the base input color to map.
     * @param {string} baseColor - The HTML name or RGB/A hex code of the base input color to map (Server default: the most prominent high-saturation color in the image).
     * @return {this}
     */
    fromColor(baseColor: string): this;
    protected prepareQualifiers(): this;
}
export { ReplaceColorAction };
