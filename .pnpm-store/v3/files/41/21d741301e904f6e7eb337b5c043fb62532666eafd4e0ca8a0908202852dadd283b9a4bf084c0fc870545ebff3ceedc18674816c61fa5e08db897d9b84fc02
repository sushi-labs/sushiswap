import CloudConfig from "./CloudConfig.js";
import URLConfig from "./URLConfig.js";
class CloudinaryConfig {
    constructor(configurations = {}) {
        this.cloud = new CloudConfig(configurations.cloud);
        this.url = new URLConfig(configurations.url || {});
    }
    /**
     * @description Setter for the cloudConfig
     * @param {ICloudConfig} cld
     */
    setCloudConfig(cld) {
        this.cloud = new CloudConfig(cld);
        return this;
    }
    /**
     * @description Setter for the urlConfig
     * @param {IURLConfig} url
     */
    setURLConfig(url) {
        this.url = new URLConfig(url);
        return this;
    }
    extend(configurations) {
        this.cloud = this.cloud.extend(configurations.cloud || {});
        this.url = this.url.extend(configurations.url || {});
        return this;
    }
}
export default CloudinaryConfig;
