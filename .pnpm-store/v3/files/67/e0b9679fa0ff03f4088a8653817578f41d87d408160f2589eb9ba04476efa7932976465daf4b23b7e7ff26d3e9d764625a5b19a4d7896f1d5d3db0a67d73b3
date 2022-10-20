import { Action } from "../../internal/Action.js";
import { Qualifier } from "../../internal/qualifier/Qualifier.js";
const QUALIFIER_KEY = 'a';
/**
 * @description Rotates or flips an image or video.
 *
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_transformations#rotating_image|Rotating images}
 * {@link https://cloudinary.com/documentation/video_manipulation_and_delivery#rotating_videos|Rotating videos}
 * @extends SDK.Action
 * @memberOf Actions.Rotate
 * @see Visit {@link Actions.Rotate|Rotate} for an example
 */
class RotateAction extends Action {
    constructor(angle) {
        super();
        this.addQualifier(new Qualifier(QUALIFIER_KEY, angle));
    }
    /**
     * @description Rotates an asset using a defined mode.
     * @param {Qualifiers.RotationMode | RotationModeType | string} rotationMode
     * For a list of supported rotation modes see {@link Qualifiers.RotationMode| types of rotation modes} for
     * possible values
     * @return {this}
     */
    mode(rotationMode) {
        return this.addValueToQualifier(QUALIFIER_KEY, rotationMode);
    }
    /**
     * @description Rotates an asset by the specified degrees.
     * @param {number} degrees rotation in degrees e.g 90, 45, 33
     * @return {this}
     */
    angle(degrees) {
        return this.addValueToQualifier(QUALIFIER_KEY, degrees);
    }
}
export default RotateAction;
