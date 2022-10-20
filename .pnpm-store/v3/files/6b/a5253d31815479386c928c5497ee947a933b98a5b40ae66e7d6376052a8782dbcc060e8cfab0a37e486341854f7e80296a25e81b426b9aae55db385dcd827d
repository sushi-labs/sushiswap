import { Qualifier } from "../../../internal/qualifier/Qualifier.js";
import { Action } from "../../../internal/Action.js";
import { custom, faces } from "../../../qualifiers/region.js";
/**
 * @description The Action class of the pixelate Builder
 * @extends SDK.Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
class Pixelate extends Action {
    constructor(squareSize) {
        super();
        this._actionModel = {};
        this._squareSize = squareSize;
        this._actionModel.actionType = 'pixelate';
        this._actionModel.squareSize = squareSize;
    }
    /**
     * @description Specifies the region to piexlate.
     * @param {NamedRegion} pixelateRegion
     */
    region(pixelateRegion) {
        this._region = pixelateRegion;
        this._actionModel.region = { RegionType: this._region.regionType };
        return this;
    }
    /**
     * @description Sets the squareSize of the pixelate effect.
     * @param {number | string} squareSize
     */
    squareSize(squareSize) {
        this._squareSize = squareSize;
        this._actionModel.squareSize = squareSize;
        return this;
    }
    prepareQualifiers() {
        /*
         * pixelate with region is a unique object in this codebase.
         * On top of pixelate being an Action with Qualifiers,
         * it also accepts a Qualifier called Region.
         *
         * This Qualifier is in itself composite of qualifiers (such as height, or width).
         * The existence of Region changes the output of pixelate in non traditional ways
         * which forced this relatively ad-hoc implementation.
         *
         * Aside from all of that, all of the Qualifiers in the component should be alphabetized
         * This happens naturally in the Action class,
         * however since we're dealing with two levels of qualifiers (pixelate and Region),
         * these need to be merged.
         *
         * This function will merge the Region qualifiers with pixelate
         * and add all needed implicit qualifiers (like g_ocr_text).
         * We're not using the full Gravity Qualifier here to prevent the code import for such a simplistic case
         */
        const str = this._squareSize ? `:${this._squareSize}` : '';
        if ('_region' in this) {
            const qualifiers = this._region.qualifiers;
            // Copy qualifiers from the region "action" to the pixelate action
            qualifiers.forEach((q) => this.addQualifier(q));
            if (this._region.regionType === 'named') {
                this.addQualifier(new Qualifier('e', `pixelate_region${str}`));
            }
            if (this._region.regionType === 'ocr_text') {
                this.addQualifier(new Qualifier('e', `pixelate_region${str}`));
                this.addQualifier(new Qualifier('g', `ocr_text`));
            }
            if (this._region.regionType === 'faces') {
                this.addQualifier(new Qualifier('e', `pixelate_faces${str}`));
            }
        }
        else {
            this.addQualifier(new Qualifier('e', `pixelate${str}`));
        }
    }
    static fromJson(actionModel) {
        const { actionType, region, squareSize } = actionModel;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        const result = new this(squareSize);
        squareSize && result.squareSize(squareSize);
        if (region && region.RegionType === 'faces') {
            result.region(faces());
        }
        if (region && region.RegionType === 'custom') {
            result.region(custom());
        }
        return result;
    }
}
export { Pixelate };
