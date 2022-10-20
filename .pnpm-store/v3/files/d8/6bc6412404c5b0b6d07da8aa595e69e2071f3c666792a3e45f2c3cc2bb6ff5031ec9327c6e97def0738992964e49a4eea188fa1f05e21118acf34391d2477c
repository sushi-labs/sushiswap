"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageFormatter = void 0;
const utils_1 = require("../utils");
const utils_2 = require("./utils");
class MessageFormatter {
}
exports.MessageFormatter = MessageFormatter;
MessageFormatter.makeRequest = (method, params) => {
    const id = (0, utils_2.generateRequestId)();
    return {
        id,
        method,
        params,
        env: {
            sdkVersion: (0, utils_1.getSDKVersion)(),
        },
    };
};
MessageFormatter.makeResponse = (id, data, version) => ({
    id,
    success: true,
    version,
    data,
});
MessageFormatter.makeErrorResponse = (id, error, version) => ({
    id,
    success: false,
    error,
    version,
});
//# sourceMappingURL=messageFormatter.js.map