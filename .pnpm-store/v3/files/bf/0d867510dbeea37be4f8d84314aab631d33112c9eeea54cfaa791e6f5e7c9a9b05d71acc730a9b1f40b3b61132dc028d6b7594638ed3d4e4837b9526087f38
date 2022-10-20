"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function rename(files, delegate) {
    return Object.keys(files).reduce((newFiles, name) => ({
        ...newFiles,
        [delegate(name)]: files[name],
    }), {});
}
exports.default = rename;
