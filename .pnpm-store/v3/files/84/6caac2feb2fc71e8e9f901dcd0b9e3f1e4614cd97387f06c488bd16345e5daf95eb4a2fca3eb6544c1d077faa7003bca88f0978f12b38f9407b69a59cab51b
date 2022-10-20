import { ImageTransformation } from "../transformation/ImageTransformation.js";
import { CloudinaryTransformable } from "./CloudinaryTransformable.js";
/**
 * @desc Cloudinary image asset, with image-related transformations
 * @summary SDK
 * @memberOf SDK
 */
class CloudinaryImage extends CloudinaryTransformable {
    constructor(publicID, cloudConfig, urlConfig) {
        /* istanbul ignore next */
        super(publicID, cloudConfig, urlConfig, new ImageTransformation());
    }
}
export { CloudinaryImage };
