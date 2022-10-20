import { CloudinaryTransformable } from "./CloudinaryTransformable.js";
import { videoEditType } from "../actions/videoEdit.js";
import { LayerAction } from "../actions/layer/LayerAction.js";
import ICloudConfig from "../config/interfaces/Config/ICloudConfig.js";
import IURLConfig from "../config/interfaces/Config/IURLConfig.js";
import { ITranscodeAction } from "../actions/transcode.js";
/**
 * @desc Cloudinary media asset, with all possible transformations
 * @summary SDK
 * @memberOf SDK
 */
declare class CloudinaryMedia extends CloudinaryTransformable {
    constructor(publicID?: string, cloudConfig?: ICloudConfig, urlConfig?: IURLConfig);
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Transcode} action
     * @return {this}
     */
    transcode(action: ITranscodeAction): this;
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.VideoEdit} action
     * @return {this}
     */
    videoEdit(action: videoEditType): this;
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @return {this}
     */
    underlay(underlayAction: LayerAction): this;
    clone(): this;
}
export { CloudinaryMedia };
