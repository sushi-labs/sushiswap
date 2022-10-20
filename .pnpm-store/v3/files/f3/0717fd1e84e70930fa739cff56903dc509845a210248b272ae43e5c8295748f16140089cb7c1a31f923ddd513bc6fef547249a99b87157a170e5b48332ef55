"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const ignore_1 = __importDefault(require("ignore"));
function isCodedError(error) {
    return (error !== null &&
        error !== undefined &&
        error.code !== undefined);
}
function clearRelative(s) {
    return s.replace(/(\n|^)\.\//g, '$1');
}
async function default_1(downloadPath, rootDirectory) {
    const readFile = async (p) => {
        try {
            return await fs_extra_1.default.readFile(p, 'utf8');
        }
        catch (error) {
            if (error.code === 'ENOENT' ||
                (error instanceof Error && error.message.includes('ENOENT'))) {
                return undefined;
            }
            throw error;
        }
    };
    const vercelIgnorePath = path_1.default.join(downloadPath, rootDirectory || '', '.vercelignore');
    const nowIgnorePath = path_1.default.join(downloadPath, rootDirectory || '', '.nowignore');
    const ignoreContents = [];
    try {
        ignoreContents.push(...(await Promise.all([readFile(vercelIgnorePath), readFile(nowIgnorePath)])).filter(Boolean));
    }
    catch (error) {
        if (isCodedError(error) && error.code === 'ENOTDIR') {
            console.log(`Warning: Cannot read ignore file from ${vercelIgnorePath}`);
        }
        else {
            throw error;
        }
    }
    if (ignoreContents.length === 2) {
        throw new Error('Cannot use both a `.vercelignore` and `.nowignore` file. Please delete the `.nowignore` file.');
    }
    if (ignoreContents.length === 0) {
        return () => false;
    }
    const ignoreFilter = ignore_1.default().add(clearRelative(ignoreContents[0]));
    return function (p) {
        // we should not ignore now.json and vercel.json if it asked to.
        // we depend on these files for building the app with sourceless
        if (p === 'now.json' || p === 'vercel.json')
            return false;
        return ignoreFilter.test(p).ignored;
    };
}
exports.default = default_1;
