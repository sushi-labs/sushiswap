import ICloudinaryConfigurations from "../config/interfaces/Config/ICloudinaryConfigurations.js";
import { CloudinaryImage } from "../assets/CloudinaryImage.js";
import { CloudinaryVideo } from "../assets/CloudinaryVideo.js";
declare class Cloudinary {
    private cloudinaryConfig;
    constructor(cloudinaryConfig?: ICloudinaryConfigurations);
    image(publicID?: string): CloudinaryImage;
    video(publicID?: string): CloudinaryVideo;
    setConfig(cloudinaryConfig: ICloudinaryConfigurations): this;
    getConfig(): ICloudinaryConfigurations;
    extendConfig(): void;
}
export { Cloudinary };
