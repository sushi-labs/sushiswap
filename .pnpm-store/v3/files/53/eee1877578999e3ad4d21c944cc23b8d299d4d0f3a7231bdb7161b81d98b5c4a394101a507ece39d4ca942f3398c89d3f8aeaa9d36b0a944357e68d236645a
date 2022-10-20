"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const os_1 = require("os");
const fs_extra_1 = require("fs-extra");
async function getWritableDirectory() {
    const name = Math.floor(Math.random() * 0x7fffffff).toString(16);
    const directory = path_1.join(os_1.tmpdir(), name);
    await fs_extra_1.mkdirp(directory);
    return directory;
}
exports.default = getWritableDirectory;
