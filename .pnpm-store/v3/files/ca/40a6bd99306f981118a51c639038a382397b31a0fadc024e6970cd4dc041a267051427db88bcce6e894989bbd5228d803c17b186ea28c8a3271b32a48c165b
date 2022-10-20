import { BaseSource } from "../BaseSource.js";
/**
 * @memberOf Qualifiers.Source
 * @extends {Qualifiers.Source.BaseSource}
 * @description Defines how to manipulate a video layer, is an instance of a {@link VideoTransformation|VideoTransformation}
 * <div class="panel panel-primary">
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
class VideoSource extends BaseSource {
    constructor(publicID) {
        super();
        this._publicID = publicID;
        this._qualifierModel = {
            publicId: publicID,
            sourceType: 'video'
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
        return `${layerType}_video:${encodedPublicID}`;
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
export { VideoSource };
