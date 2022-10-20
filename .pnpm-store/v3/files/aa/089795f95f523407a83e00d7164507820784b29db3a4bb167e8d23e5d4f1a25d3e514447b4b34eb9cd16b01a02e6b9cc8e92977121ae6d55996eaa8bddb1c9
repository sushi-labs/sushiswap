import { Action } from "../../internal/Action.js";
import { RotationModeQualifierValue } from "../../qualifiers/rotate/RotationModeQualifierValue.js";
import { RotationModeType } from "../../types/types.js";
/**
 * @description Rotates or flips an image or video.
 *
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_transformations#rotating_image|Rotating images}
 * {@link https://cloudinary.com/documentation/video_manipulation_and_delivery#rotating_videos|Rotating videos}
 * @extends SDK.Action
 * @memberOf Actions.Rotate
 * @see Visit {@link Actions.Rotate|Rotate} for an example
 */
declare class RotateAction extends Action {
    constructor(angle?: number);
    /**
     * @description Rotates an asset using a defined mode.
     * @param {Qualifiers.RotationMode | RotationModeType | string} rotationMode
     * For a list of supported rotation modes see {@link Qualifiers.RotationMode| types of rotation modes} for
     * possible values
     * @return {this}
     */
    mode(rotationMode: RotationModeQualifierValue | RotationModeType | string): this;
    /**
     * @description Rotates an asset by the specified degrees.
     * @param {number} degrees rotation in degrees e.g 90, 45, 33
     * @return {this}
     */
    angle(degrees: number): this;
}
export default RotateAction;
