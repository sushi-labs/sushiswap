import { Action } from "../internal/Action.js";
/**
 * @description Extracts an image or a page using an index, a range, or a name from a layered media asset.
 * @memberOf Actions
 * @namespace Extract
 * @example
 * import {Cloudinary} from '@cloudinary/url-gen';
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 *
 * import {getFrame, getPage} from '@cloudinary/url-gen/actions/extract';
 *
 * image.extract(
 *  getFrame()
 *    .byRange(1, 3) // These are mutually exclusive
 *    .byNumber(5) // These are mutually exclusive
 * );
 *
 * image.extract(
 *  getPage()
 *    .byRange(1, 3) // These are mutually exclusive
 *    .byNumber(5) // These are mutually exclusive
 * );
 *
 */
/**
 * @description Extracts an image or a page using an index, a range, or a name from a layered media asset.
 * @extends SDK.Action
 * @memberOf Actions.Extract
 * @see Visit {@link Actions.Extract} for examples
 */
declare class ExtractAction extends Action {
    private qualifierValue;
    constructor();
    /**
     * @description Extract an image containing only specified layer of an asset
     * @param {string|number} from The layer number
     */
    byNumber(from: string | number): this;
    /**
     * @description Extract an image containing only specified range of layers of an asset
     * @param {string|number} from The layer number
     * @param {string|number} to The layer number
     */
    byRange(from: string | number, to: string | number): this;
    protected prepareQualifiers(): this;
}
/**
 * @summary action
 * @description Extracts an image containing only specified layers of a Photoshop image.
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/paged_and_layered_media#deliver_selected_layers_of_a_psd_image|Deliver selected layers of a PSD image}
 * @memberOf Actions.Extract
 * @return {Actions.Extract.ExtractAction}
 */
declare function getFrame(): ExtractAction;
/**
 * @summary action
 * @description Extracts the original content of an embedded object of a Photoshop image.
 * @memberOf Actions.Extract
 * @return {Actions.Extract.ExtractAction}
 */
declare function getPage(): ExtractAction;
declare const Extract: {
    getFrame: typeof getFrame;
    getPage: typeof getPage;
    ExtractAction: typeof ExtractAction;
};
export { getFrame, getPage, ExtractAction, Extract };
