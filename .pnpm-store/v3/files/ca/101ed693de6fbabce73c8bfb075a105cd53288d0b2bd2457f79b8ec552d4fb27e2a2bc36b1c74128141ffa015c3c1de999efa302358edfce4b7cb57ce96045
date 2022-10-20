import { BaseSource } from "../BaseSource.js";
import { FormatQualifier } from "../../format/FormatQualifier.js";
import { ITransformationFromJson } from "../../../internal/models/IHasFromJson.js";
import { IFetchSourceModel } from "../../../internal/models/IFetchSourceModel.js";
/**
 * @memberOf Qualifiers.Source
 * @extends {Qualifiers.Source.BaseSource}
 * @description Defines how to manipulate a Fetch layer
 * <div class="panel panel-warning">
 *   <div class="panel-heading">Notice</div>
 *   <div class="panel-body">
 *     This class is used as a Qualifier for the asset.overlay() and asset.underlay() methods.</br>
 *     You can find regular images and videos transformations below:
 *   </div>
  *   <ul>
 *     <li>{@link SDK.ImageTransformation| Image Transformations}</li>
 *     <li>{@link SDK.VideoTransformation| Video Transformations}</li>
 *   </ul>
 * </div>
 *
 * {@link https://cloudinary.com/documentation/fetch_remote_images|Learn more about fetching from a remote URL}
 */
declare class FetchSource extends BaseSource {
    readonly _remoteURL: string;
    private _format;
    constructor(remoteURL: string);
    /**
     * @description
     * Returns the opening string of the layer,
     * This method is used internally within {@link SDK.LayerAction|LayerAction}
     * @returns {string}
     */
    getOpenSourceString(layerType: 'l' | 'u'): string;
    /**
     * @description
     * Apply a format for the image source of the layer
     * @param {FormatQualifier} format A to apply to the layered image, see more {@link Qualifiers.Format|here}
     * @returns {this}
     */
    format(format: FormatQualifier): this;
    static fromJson(qualifierModel: IFetchSourceModel, transformationFromJson: ITransformationFromJson): FetchSource;
}
export { FetchSource };
