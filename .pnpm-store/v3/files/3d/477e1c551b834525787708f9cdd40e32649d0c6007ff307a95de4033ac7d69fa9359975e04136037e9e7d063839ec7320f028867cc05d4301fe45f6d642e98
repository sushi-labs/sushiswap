import { BaseSource } from "../BaseSource.js";
/**
 * @memberOf Qualifiers.Source
 * @extends {Qualifiers.Source.BaseSource}
 * @description Defines how to manipulate an image layer
 * <div class="panel panel-warning">
 *   <div class="panel-heading">Notice</div>
 *   <div class="panel-body">
 *     This class is used as a Qualifier for the asset.overlay() and asset.underlay() methods.</br>
 *     You can find regular images and videos transformations below:
 *   </div>
 *   <ul>
 *     <li>{@link SDK.ImageTransformation| Image Transformations}</li>
 *     <li>{@link SDK.VideoTransformation| Video Transformations}
 *   </ul>
 * </div>
 */
class ImageSource extends BaseSource {
    constructor(publicID) {
        super();
        this._publicID = publicID;
        this._qualifierModel = {
            publicId: publicID,
            sourceType: 'image'
        };
    }
    /**
     * @description
     * Returns the opening string of the layer,
     * This method is used internally within {@link SDK.LayerAction|LayerAction}
     * @returns {string}
     */
    getOpenSourceString(layerType) {
        const encodedPublicID = this.encodeAssetPublicID(this._publicID);
        if (this._format) {
            return `${layerType}_${encodedPublicID}.${this._format.toString()}`;
        }
        else {
            return `${layerType}_${encodedPublicID}`;
        }
    }
    /**
     * @description
     * Apply a format for the image source of the layer
     * @param {FormatQualifier} format A to apply to the layered image, see more {@link Qualifiers.Format|here}
     * @returns {this}
     */
    format(format) {
        this._format = format;
        return this;
    }
    toJson() {
        const result = super.toJson();
        if (result.publicId && this._format) {
            result.publicId = `${result.publicId}.${this._format.toString()}`;
        }
        return result;
    }
    static fromJson(qualifierModel, transformationFromJson) {
        const { publicId, transformation } = qualifierModel;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [qualifierModel])
        // This allows the inheriting classes to determine the class to be created
        // @ts-ignore
        const result = new this(publicId);
        if (transformation) {
            result.transformation(transformationFromJson(transformation));
        }
        return result;
    }
}
export { ImageSource };
