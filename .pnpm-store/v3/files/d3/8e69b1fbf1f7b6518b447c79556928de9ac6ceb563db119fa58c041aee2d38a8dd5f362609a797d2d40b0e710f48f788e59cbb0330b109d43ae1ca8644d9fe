import { QualifierValue } from "../internal/qualifier/QualifierValue.js";
import { Qualifier } from "../internal/qualifier/Qualifier.js";
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
class ExtractAction extends Action {
    constructor() {
        super();
        this.qualifierValue = new QualifierValue();
        this.qualifierValue.delimiter = ';';
    }
    /**
     * @description Extract an image containing only specified layer of an asset
     * @param {string|number} from The layer number
     */
    byNumber(from) {
        this.qualifierValue.addValue(from);
        return this;
    }
    /**
     * @description Extract an image containing only specified range of layers of an asset
     * @param {string|number} from The layer number
     * @param {string|number} to The layer number
     */
    byRange(from, to) {
        const range = new QualifierValue(from);
        range.addValue(to);
        range.delimiter = '-';
        this.qualifierValue.addValue(range);
        return this;
    }
    prepareQualifiers() {
        this.addQualifier(new Qualifier('pg', this.qualifierValue));
        return this;
    }
}
/**
 * @summary action
 * @description Extracts an image containing only specified layers of a Photoshop image.
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/paged_and_layered_media#deliver_selected_layers_of_a_psd_image|Deliver selected layers of a PSD image}
 * @memberOf Actions.Extract
 * @return {Actions.Extract.ExtractAction}
 */
function getFrame() {
    return new ExtractAction();
}
/**
 * @summary action
 * @description Extracts the original content of an embedded object of a Photoshop image.
 * @memberOf Actions.Extract
 * @return {Actions.Extract.ExtractAction}
 */
function getPage() {
    return new ExtractAction();
}
const Extract = {
    getFrame, getPage, ExtractAction
};
export { getFrame, getPage, ExtractAction, Extract };
