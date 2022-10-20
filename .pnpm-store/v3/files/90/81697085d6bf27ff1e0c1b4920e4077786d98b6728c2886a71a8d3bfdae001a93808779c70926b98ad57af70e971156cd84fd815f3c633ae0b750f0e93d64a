import { LayerAction } from "./layer/LayerAction.js";
/**
 * @memberOf Actions
 * @namespace Underlay
 * @description Adds an image or a text layer as an underlay under the base layer. </br>
 * @see Visit {@link Qualifiers.TextStyle|TextStyle} for advanced text options
 * @see {@link Actions.Overlay| The overlay action}
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const myVideo = yourCldInstance.video('dog');
 *
 * import {source} from "@cloudinary/url-gen/actions/underlay"
 * import {image, video, text} from "@cloudinary/url-gen/qualifiers/source"
 * import {TextStyle} from '@cloudinary/url-gen/qualifiers/textStyle
 *
 * myVideo.underlay(
 *       source(image('myImage'))
 *     )
 *
 * myVideo.underlay(
 *       source(video('myVideo'))
 *     )
 *
 * myVideo.underlay(
 *       source(text('My text'), 'arial_15')
 *     )
 *
 * // Or a text with more complex options
 * myVideo.underlay(
 *       source(text('My text'), new TextStyle('arial', 50))
 *     )
 */
/**
 * @summary action
 * @description Adds a layer for an asset
 * @param {Qualifiers.Source.ImageSource | Qualifiers.Source.TextSource} source
 *        The Source used for the layer, use the functions provided {@link Qualifiers.Source|here} to easily create these objects
 * @memberOf Actions.Underlay
 * @return {SDK.LayerAction}
 */
function source(source) {
    return new LayerAction(source)
        .setLayerType('u');
}
const Underlay = { source };
export { Underlay, source };
