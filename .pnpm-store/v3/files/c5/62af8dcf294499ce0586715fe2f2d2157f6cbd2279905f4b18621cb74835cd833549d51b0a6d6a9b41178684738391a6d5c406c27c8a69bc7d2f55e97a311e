import { NamedTransformationAction } from "./namedTransformation/NamedTransformationAction.js";
/**
 * Applies a pre-defined named transformation of the given name.
 * @memberOf Actions
 * @namespace NamedTransformation
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {name} from "@cloudinary/url-gen/actions/namedTransformation";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.namedTransformation(
 *  name('my_named_transformation'),
 * );
 */
/**
 * @summary action
 * @description Applies a pre-defined named transformation of the given name.
 * @param {string} name Transformation name
 * @memberOf Actions.NamedTransformation
 * @return {Actions.NamedTransformation.NamedTransformationAction}
 */
function name(name) {
    return new NamedTransformationAction(name);
}
const NamedTransformation = { name };
export { NamedTransformation, name };
