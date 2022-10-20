import { Action } from "../../internal/Action.js";
/**
 * @description Represents an embedded smart object in a Photoshop document.
 * </br><b>Learn more:</b> {@link https://cloudinary.com/documentation/paged_and_layered_media#extract_the_original_content_of_an_embedded_object|Extract the original content of an embedded Photoshop object}
 * @extends SDK.Action
 * @memberOf Actions.PSDTools
 * @see Visit {@link Actions.PSDTools| PSDTools} for an example
 */
declare class SmartObjectAction extends Action {
    private smartObjectValue;
    private qualifierValue;
    private useName;
    constructor();
    /**
     * @description Creates a new instance using the specified number.
     * @param index The number.
     */
    byIndex(index: string | number): this;
    /**
     * @description Creates an instance using the name.
     * @param {string} layerName The name of the layer
     */
    byLayerName(layerName: string): this;
    protected prepareQualifiers(): void;
}
export { SmartObjectAction };
