"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldServe = void 0;
const path_1 = require("path");
const shouldServe = ({ entrypoint, files, requestPath, }) => {
    requestPath = requestPath.replace(/\/$/, ''); // sanitize trailing '/'
    entrypoint = entrypoint.replace(/\\/, '/'); // windows compatibility
    if (entrypoint === requestPath && hasProp(files, entrypoint)) {
        return true;
    }
    const { dir, name } = path_1.parse(entrypoint);
    if (name === 'index' && dir === requestPath && hasProp(files, entrypoint)) {
        return true;
    }
    return false;
};
exports.shouldServe = shouldServe;
function hasProp(obj, key) {
    return Object.hasOwnProperty.call(obj, key);
}
