import CloudConfig from "./CloudConfig.js";
import URLConfig from "./URLConfig.js";
import ICloudinaryConfigurations from "./interfaces/Config/ICloudinaryConfigurations.js";
import ICloudConfig from "./interfaces/Config/ICloudConfig.js";
import IURLConfig from "./interfaces/Config/IURLConfig.js";
declare class CloudinaryConfig {
    cloud: CloudConfig;
    url: URLConfig;
    constructor(configurations?: ICloudinaryConfigurations);
    /**
     * @description Setter for the cloudConfig
     * @param {ICloudConfig} cld
     */
    setCloudConfig(cld: ICloudConfig): this;
    /**
     * @description Setter for the urlConfig
     * @param {IURLConfig} url
     */
    setURLConfig(url: IURLConfig): this;
    extend(configurations: ICloudinaryConfigurations): CloudinaryConfig;
}
export default CloudinaryConfig;
