"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const assert_1 = __importDefault(require("assert"));
const glob_1 = __importDefault(require("glob"));
const util_1 = require("util");
const fs_extra_1 = require("fs-extra");
const normalize_path_1 = require("./normalize-path");
const file_fs_ref_1 = __importDefault(require("../file-fs-ref"));
const vanillaGlob = util_1.promisify(glob_1.default);
async function glob(pattern, opts, mountpoint) {
    let options;
    if (typeof opts === 'string') {
        options = { cwd: opts };
    }
    else {
        options = opts;
    }
    if (!options.cwd) {
        throw new Error('Second argument (basePath) must be specified for names of resulting files');
    }
    if (!path_1.default.isAbsolute(options.cwd)) {
        throw new Error(`basePath/cwd must be an absolute path (${options.cwd})`);
    }
    const results = {};
    options.symlinks = {};
    options.statCache = {};
    options.stat = true;
    options.dot = true;
    const files = await vanillaGlob(pattern, options);
    for (const relativePath of files) {
        const fsPath = normalize_path_1.normalizePath(path_1.default.join(options.cwd, relativePath));
        let stat = options.statCache[fsPath];
        assert_1.default(stat, `statCache does not contain value for ${relativePath} (resolved to ${fsPath})`);
        const isSymlink = options.symlinks[fsPath];
        if (isSymlink || stat.isFile()) {
            if (isSymlink) {
                stat = await fs_extra_1.lstat(fsPath);
            }
            let finalPath = relativePath;
            if (mountpoint) {
                finalPath = path_1.default.join(mountpoint, finalPath);
            }
            results[finalPath] = new file_fs_ref_1.default({ mode: stat.mode, fsPath });
        }
    }
    return results;
}
exports.default = glob;
