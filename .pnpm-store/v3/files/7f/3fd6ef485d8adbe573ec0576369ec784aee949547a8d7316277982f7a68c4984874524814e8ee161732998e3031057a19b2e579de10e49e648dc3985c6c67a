import { CloudinaryTransformable } from "./CloudinaryTransformable.js";
import { VideoTransformation } from "../transformation/VideoTransformation.js";
/**
 * @desc Cloudinary video asset, with video-related transformations
 * @summary SDK
 * @memberOf SDK
 */
class CloudinaryVideo extends CloudinaryTransformable {
    constructor(publicID, cloudConfig, urlConfig) {
        /* istanbul ignore next */
        super(publicID, cloudConfig, urlConfig, new VideoTransformation());
        this.assetType = 'video';
    }
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Transcode} action
     * @return {this}
     */
    transcode(action) {
        this.transformation.transcode(action);
        return this;
    }
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.VideoEdit} action
     * @return {this}
     */
    videoEdit(action) {
        this.transformation.videoEdit(action);
        return this;
    }
}
export { CloudinaryVideo };
