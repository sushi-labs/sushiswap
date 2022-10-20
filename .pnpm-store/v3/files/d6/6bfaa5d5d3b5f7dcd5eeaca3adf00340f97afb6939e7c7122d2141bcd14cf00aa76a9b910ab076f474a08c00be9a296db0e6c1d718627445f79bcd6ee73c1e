"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readConfigFile = void 0;
const js_yaml_1 = __importDefault(require("js-yaml"));
const toml_1 = __importDefault(require("@iarna/toml"));
const fs_extra_1 = require("fs-extra");
async function readFileOrNull(file) {
    try {
        const data = await fs_extra_1.readFile(file);
        return data;
    }
    catch (err) {
        if (err.code !== 'ENOENT') {
            throw err;
        }
    }
    return null;
}
async function readConfigFile(files) {
    files = Array.isArray(files) ? files : [files];
    for (const name of files) {
        const data = await readFileOrNull(name);
        if (data) {
            const str = data.toString('utf8');
            if (name.endsWith('.json')) {
                return JSON.parse(str);
            }
            else if (name.endsWith('.toml')) {
                return toml_1.default.parse(str);
            }
            else if (name.endsWith('.yaml') || name.endsWith('.yml')) {
                return js_yaml_1.default.safeLoad(str, { filename: name });
            }
        }
    }
    return null;
}
exports.readConfigFile = readConfigFile;
