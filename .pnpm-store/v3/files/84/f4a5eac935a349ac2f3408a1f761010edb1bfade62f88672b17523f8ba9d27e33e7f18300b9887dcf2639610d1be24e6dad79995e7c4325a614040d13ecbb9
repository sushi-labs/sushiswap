import IURLConfig from "../config/interfaces/Config/IURLConfig.js";
import { CloudinaryTransformable } from "./CloudinaryTransformable.js";
import ICloudConfig from "../config/interfaces/Config/ICloudConfig.js";
import { videoEditType } from "../actions/videoEdit.js";
import { ITranscodeAction } from "../actions/transcode.js";
/**
 * @desc Cloudinary video asset, with video-related transformations
 * @summary SDK
 * @memberOf SDK
 */
declare class CloudinaryVideo extends CloudinaryTransformable {
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
}
export { CloudinaryVideo };
