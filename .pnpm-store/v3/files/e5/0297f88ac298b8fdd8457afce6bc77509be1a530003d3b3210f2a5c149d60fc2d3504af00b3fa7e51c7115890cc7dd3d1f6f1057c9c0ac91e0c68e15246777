import { ClipAction } from "./psdTools/ClipAction.js";
import { GetLayerAction } from "./psdTools/GetLayerAction.js";
import { SmartObjectAction } from "./psdTools/SmartObjectAction.js";
/**
 * @namespace PSDTools
 * @description Represents a layer in a Photoshop document.
 * </br><b>Learn more:</b> {@link https://cloudinary.com/documentation/paged_and_layered_media#deliver_selected_layers_of_a_psd_image|Deliver selected layers of a PSD image}
 * @memberOf Actions
 * @example
 * // See examples under each method
 */
/**
 * @summary action
 * @description Trims the pixels of a PSD image according to a Photoshop clipping path that is stored in the image's metadata.
 * @memberOf Actions.PSDTools
 * @return {Actions.PSDTools.ClipAction}
 * @example
 * import {Cloudinary} from '@cloudinary/url-gen';
 * import {clip} from '@cloudinary/url-gen/actions/psdTools';
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 *
 * image.psdTools(
 *  clip()
 *    .byName('foo') // either name, or number
 *    .byNumber(2)   // either name, or number
 *    .evenOdd()     // Use the evenodd clipping rule
 * );
 */
function clip() {
    return new ClipAction();
}
/**
 * @summary action
 * @description Delivers an image containing only specified layers of a Photoshop image.
 *
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/paged_and_layered_media#deliver_selected_layers_of_a_psd_image|Deliver selected layers of a PSD image}
 * @memberOf Actions.PSDTools
 * @return {Actions.PSDTools.GetLayerAction}
 * @example
 * import {Cloudinary} from '@cloudinary/url-gen';
 * import {getLayer} from '@cloudinary/url-gen/actions/psdTools';
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 *
 * image.psdTools(
 *  getLayer()
 *    .byName('foo') // One of the three
 *    .byIndex(2)    // One of the three
 *    .byRange(1, 3) // One of the three
 * );
 */
function getLayer() {
    return new GetLayerAction();
}
/**
 * @summary action
 * @description Extracts the original content of an embedded object of a Photoshop image.
 * @memberOf Actions.PSDTools
 * @return {Actions.PSDTools.SmartObjectAction}
 * @example
 * import {Cloudinary} from '@cloudinary/url-gen';
 * import {smartObject} from '@cloudinary/url-gen/actions/psdTools';
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 *
 * image.psdTools(
 *  smartObject()
 *    .byLayerName('foo') // either name, or number
 *    .byIndex(2)         // either name, or number
 * );
 */
function smartObject() {
    return new SmartObjectAction();
}
const PSDTools = { clip, getLayer, smartObject };
export { PSDTools, clip, getLayer, smartObject };
