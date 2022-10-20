"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchDelegateToSchema = void 0;
const getLoader_js_1 = require("./getLoader.js");
function batchDelegateToSchema(options) {
    const key = options.key;
    if (key == null) {
        return null;
    }
    else if (Array.isArray(key) && !key.length) {
        return [];
    }
    const loader = (0, getLoader_js_1.getLoader)(options);
    return Array.isArray(key) ? loader.loadMany(key) : loader.load(key);
}
exports.batchDelegateToSchema = batchDelegateToSchema;
