import { CloudinaryTransformable } from "./CloudinaryTransformable.js";
import { Transformation } from "../transformation/Transformation.js";
import { cloneDeep } from '../internal/utils/cloneDeep.js';
/**
 * @desc Cloudinary media asset, with all possible transformations
 * @summary SDK
 * @memberOf SDK
 */
class CloudinaryMedia extends CloudinaryTransformable {
    constructor(publicID, cloudConfig, urlConfig) {
        /* istanbul ignore next */
        super(publicID, cloudConfig, urlConfig, new Transformation());
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
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @return {this}
     */
    underlay(underlayAction) {
        this.transformation.underlay(underlayAction);
        return this;
    }
    clone() {
        return cloneDeep(this);
    }
}
export { CloudinaryMedia };
