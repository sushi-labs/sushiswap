import { BaseSource } from "../BaseSource.js";
import { IVideoSourceModel } from "../../../internal/models/IVideoSourceModel.js";
import { ITransformationFromJson } from "../../../internal/models/IHasFromJson.js";
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
declare class VideoSource extends BaseSource {
    readonly _publicID: string;
    constructor(publicID: string);
    /**
     * @description
     * Returns the opening string of the layer,
     * This method is used internally within {@link SDK.LayerAction|LayerAction}
     * @returns {string}
     */
    getOpenSourceString(layerType: 'u' | 'l'): string;
    static fromJson(qualifierModel: IVideoSourceModel, transformationFromJson: ITransformationFromJson): VideoSource;
}
export { VideoSource };
