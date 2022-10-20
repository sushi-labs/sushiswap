import { Action } from "../../internal/Action.js";
import { Qualifier } from "../../internal/qualifier/Qualifier.js";
import { QualifierValue } from "../../internal/qualifier/QualifierValue.js";
/**
 * @description Represents an embedded smart object in a Photoshop document.
 * </br><b>Learn more:</b> {@link https://cloudinary.com/documentation/paged_and_layered_media#extract_the_original_content_of_an_embedded_object|Extract the original content of an embedded Photoshop object}
 * @extends SDK.Action
 * @memberOf Actions.PSDTools
 * @see Visit {@link Actions.PSDTools| PSDTools} for an example
 */
class SmartObjectAction extends Action {
    constructor() {
        super();
        this.qualifierValue = new QualifierValue();
        this.useName = false;
        this.qualifierValue.delimiter = ';';
    }
    /**
     * @description Creates a new instance using the specified number.
     * @param index The number.
     */
    byIndex(index) {
        this.smartObjectValue = index;
        this.qualifierValue.addValue(index);
        return this;
    }
    /**
     * @description Creates an instance using the name.
     * @param {string} layerName The name of the layer
     */
    byLayerName(layerName) {
        this.useName = true;
        this.qualifierValue.addValue(layerName);
        return this;
    }
    prepareQualifiers() {
        let qualifierValue;
        if (this.useName) {
            qualifierValue = new QualifierValue(['embedded:name', this.qualifierValue]);
        }
        else {
            qualifierValue = new QualifierValue(['embedded', this.qualifierValue]);
        }
        this.addQualifier(new Qualifier('pg', qualifierValue));
    }
}
export { SmartObjectAction };
