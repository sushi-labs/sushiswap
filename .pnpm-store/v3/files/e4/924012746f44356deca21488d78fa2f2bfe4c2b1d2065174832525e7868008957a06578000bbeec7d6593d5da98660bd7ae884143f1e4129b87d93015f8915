import { BaseSource } from "../qualifiers/source/BaseSource.js";
import { LayerAction } from "./layer/LayerAction.js";
/**
 * @description Adds a video, text or an image layer as an overlay over the base layer. </br>
 * @memberOf Actions
 * @namespace Overlay
 * @see Visit {@link Qualifiers.TextStyle|TextStyle} for advanced text options
 * @see {@link Actions.Underlay| The underlay action}
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const myVideo = yourCldInstance.video('dog');
 *
 * import {source} from "@cloudinary/url-gen/actions/overlay"
 * import {image, video, text} from "@cloudinary/url-gen/qualifiers/source"
 * import {TextStyle} from '@cloudinary/url-gen/qualifiers/textStyle
 *
 * myVideo.overlay(
 *       source(image('myImage'))
 *     )
 *
 * myVideo.overlay(
 *       source(video('myVideo'))
 *     )
 *
 * myVideo.overlay(
 *       source(text('My text'), 'arial_15')
 *     )
 *
 * // Or a text with more complex options
 * myVideo.overlay(
 *       source(text('My text'), new TextStyle('arial', 50))
 *     )
 */
/**
 * @summary action
 * @memberOf Actions.Overlay
 * @description Adds a layer for an asset
 * @param {Qualifiers.Source.ImageSource | Qualifiers.Source.TextSource | Qualifiers.Source.VideoSource} source
 *        The Source used for the layer, use the functions provided {@link Qualifiers.Source|here} to easily create these objects
 * @return {SDK.LayerAction}
 */
declare function source(source: BaseSource): LayerAction;
declare const Overlay: {
    source: typeof source;
};
export { Overlay, source };
