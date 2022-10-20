import { Action } from "../../../internal/Action.js";
/**
 * Enhances an image to its best visual quality with the Viesus Automatic Image Enhancement add-on.</br>
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/viesus_automatic_image_enhancement_addon|Viesus Automatic Image Enhancement.}
 * @memberOf Actions.Adjust
 */
declare class ViesusCorrectAdjustAction extends Action {
    private _noRedEye;
    private _skinSaturation;
    private _skinSaturationLevel;
    /**
     * @description Enhances the image without correcting for red eye.
     */
    noRedEye(): this;
    /**
     * @description Applies saturation to the skin tones in the image.
     * @param level The saturation level. (Range: -100 to 100, Server default: 50).
     */
    skinSaturation(level?: number): this;
    protected prepareQualifiers(): void;
}
export { ViesusCorrectAdjustAction };
