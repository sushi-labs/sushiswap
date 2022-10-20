import { Action } from "../../internal/Action.js";
/**
 * @description Represents a layer in a Photoshop document.
 * </br><b>Learn more:</b> {@link https://cloudinary.com/documentation/paged_and_layered_media#deliver_selected_layers_of_a_psd_image|Deliver selected layers of a PSD image}
 * @extends SDK.Action
 * @memberOf Actions.PSDTools
 * @see Visit {@link Actions.PSDTools| PSDTools} for an example
 */
declare class GetLayerAction extends Action {
    private name;
    private qualifierValue;
    constructor();
    /**
     * @description deliver an image containing only specified layer of a Photoshop image from The layer index
     * @param {string|number} from the index of the layer
     */
    byIndex(from: string | number): this;
    /**
     * @description deliver an image containing only specified range of layers of a Photoshop image
     * @param {string|number} from The layer number
     * @param {string|number} to The layer number
     */
    byRange(from: string | number, to: string | number): this;
    /**
     * @description deliver an image containing only specified layer by name of a Photoshop image
     * @param {string|number} name The layer by name
     */
    byName(name: string): this;
    protected prepareQualifiers(): this;
}
export { GetLayerAction };
