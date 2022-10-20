import { Action } from "../../internal/Action.js";
import { PositionQualifier } from "../../qualifiers/position/PositionQualifier.js";
import { ImageSource } from "../../qualifiers/source/sourceTypes/ImageSource.js";
import { TextSource } from "../../qualifiers/source/sourceTypes/TextSource.js";
import { FetchSource } from "../../qualifiers/source/sourceTypes/FetchSource.js";
/**
 * @description Trims pixels according to the transparency levels of a given overlay image.
 * Wherever the overlay image is transparent, the original is shown, and wherever the overlay is opaque, the resulting image is transparent.
 * @extends SDK.Action
 * @param {Qualifiers.Source.ImageSource} imageSource
 * @memberOf Actions.Reshape
 * @see Visit {@link Actions.Reshape| Reshape} for examples
 */
declare class CutByImage extends Action {
    private source;
    private _position;
    constructor(source: ImageSource | TextSource | FetchSource);
    /**
     * @description Defines the position of the layer.
     * @param {Qualifiers.Position} position The position of the overlay with respect to the base image.
     * @return {this}
     */
    position(position: PositionQualifier): this;
    toString(): string;
}
export default CutByImage;
