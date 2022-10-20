"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeLocal = exports.getLocal = exports.setLocal = void 0;
const json_1 = require("./json");
const browser_1 = require("./browser");
function setLocal(key, data) {
    const raw = (0, json_1.safeJsonStringify)(data);
    const local = (0, browser_1.getLocalStorage)();
    if (local) {
        local.setItem(key, raw);
    }
}
exports.setLocal = setLocal;
function getLocal(key) {
    let data = null;
    let raw = null;
    const local = (0, browser_1.getLocalStorage)();
    if (local) {
        raw = local.getItem(key);
    }
    data = raw ? (0, json_1.safeJsonParse)(raw) : raw;
    return data;
}
exports.getLocal = getLocal;
function removeLocal(key) {
    const local = (0, browser_1.getLocalStorage)();
    if (local) {
        local.removeItem(key);
    }
}
exports.removeLocal = removeLocal;
//# sourceMappingURL=local.js.map