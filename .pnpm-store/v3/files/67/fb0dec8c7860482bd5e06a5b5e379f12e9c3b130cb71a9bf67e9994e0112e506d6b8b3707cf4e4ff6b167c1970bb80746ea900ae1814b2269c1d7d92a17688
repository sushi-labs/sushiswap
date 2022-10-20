import { QualifierModel } from "../../internal/models/QualifierModel.js";
/**
 * @memberOf Qualifiers.Source
 * @extends {QualifierModel}
 * @description An abstract class extended by all Source objects
 */
class BaseSource extends QualifierModel {
    /**
     * @description Utility function to encode an asset publicID in an overlay
     * @protected
     * @example
     * encodeAssetPublicID('foo/bar'); // -> foo:bar
     */
    encodeAssetPublicID(publicID) {
        return publicID.replace(/\//g, ':');
    }
    /**
     * @description
     * Apply a transformation on the image source of the layer
     * @param {SDK.ImageTransformation} t An image transformation to apply to the layer
     * @returns {this}
     */
    transformation(t) {
        this._qualifierModel.transformation = t.toJson();
        this._transformation = t;
        return this;
    }
    /**
     * @description Returns the Transformation of the source
     * @return {SDK.Transformation}
     */
    getTransformation() {
        return this._transformation;
    }
}
export { BaseSource };
