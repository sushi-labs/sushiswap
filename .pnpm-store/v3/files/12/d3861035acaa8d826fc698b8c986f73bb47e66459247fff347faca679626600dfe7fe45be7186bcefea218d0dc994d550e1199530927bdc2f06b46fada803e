import { Transformation } from "../../transformation/Transformation.js";
import { ImageTransformation } from "../../transformation/ImageTransformation.js";
import { QualifierModel } from "../../internal/models/QualifierModel.js";
/**
 * @memberOf Qualifiers.Source
 * @extends {QualifierModel}
 * @description An abstract class extended by all Source objects
 */
declare abstract class BaseSource extends QualifierModel {
    protected _transformation: Transformation;
    /**
     * @description Utility function to encode an asset publicID in an overlay
     * @protected
     * @example
     * encodeAssetPublicID('foo/bar'); // -> foo:bar
     */
    protected encodeAssetPublicID(publicID: string): string;
    /**
     * @description
     * Apply a transformation on the image source of the layer
     * @param {SDK.ImageTransformation} t An image transformation to apply to the layer
     * @returns {this}
     */
    transformation(t: ImageTransformation): this;
    /**
     * @description Returns the Transformation of the source
     * @return {SDK.Transformation}
     */
    getTransformation(): Transformation;
    abstract getOpenSourceString(layerType: 'u' | 'l'): string;
}
export { BaseSource };
