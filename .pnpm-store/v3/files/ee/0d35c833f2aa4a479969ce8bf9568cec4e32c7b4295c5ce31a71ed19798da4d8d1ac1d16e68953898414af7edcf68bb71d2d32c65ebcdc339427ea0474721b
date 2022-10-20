import { CloudinaryImage } from "../assets/CloudinaryImage.js";
import { CloudinaryVideo } from "../assets/CloudinaryVideo.js";
class Cloudinary {
    constructor(cloudinaryConfig) {
        if (cloudinaryConfig) {
            this.cloudinaryConfig = cloudinaryConfig;
        }
    }
    image(publicID) {
        return new CloudinaryImage(publicID, this.cloudinaryConfig.cloud, this.cloudinaryConfig.url);
    }
    video(publicID) {
        return new CloudinaryVideo(publicID, this.cloudinaryConfig.cloud, this.cloudinaryConfig.url);
    }
    setConfig(cloudinaryConfig) {
        this.cloudinaryConfig = cloudinaryConfig;
        return this;
    }
    getConfig() {
        return this.cloudinaryConfig;
    }
    extendConfig() {
        // Future implementation
    }
}
export { Cloudinary };
