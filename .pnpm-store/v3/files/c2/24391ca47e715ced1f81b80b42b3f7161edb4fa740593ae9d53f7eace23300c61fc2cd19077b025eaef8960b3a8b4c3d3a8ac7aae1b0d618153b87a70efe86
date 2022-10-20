import { Action } from "../../internal/Action.js";
import { Qualifier } from "../../internal/qualifier/Qualifier.js";
import { QualifierValue } from "../../internal/qualifier/QualifierValue.js";
/**
 * @description
 * Defines the mode of blending to use when overlaying an image.
 * Even though BlendMode is technically an actionQualifier, it implements exactly the same functionality as an action.
 * This is true because Position is actually compounded of multiple qualifiers
 *
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_transformations#overlay_blending_effects|Overlay blending effects}
 *
 * @memberOf Qualifiers.BlendMode
 * @extends SDK.Action
 */
class BlendModeQualifier extends Action {
    constructor(blendMode, level) {
        super();
        this.addQualifier(new Qualifier('e', new QualifierValue([blendMode, level])));
    }
}
export { BlendModeQualifier };
