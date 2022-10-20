"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_platform_env_1 = require("./get-platform-env");
function debug(message, ...additional) {
    if (get_platform_env_1.getPlatformEnv('BUILDER_DEBUG')) {
        console.log(message, ...additional);
    }
}
exports.default = debug;
