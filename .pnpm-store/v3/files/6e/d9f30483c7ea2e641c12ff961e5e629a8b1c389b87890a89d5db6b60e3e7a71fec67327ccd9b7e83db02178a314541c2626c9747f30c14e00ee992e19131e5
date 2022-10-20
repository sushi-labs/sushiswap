"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tempFile = void 0;
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const primitives_1 = __importDefault(require("@edge-runtime/primitives"));
const { crypto } = primitives_1.default;
/**
 * Creates a temporary file with the provided content and returns the
 * generated path and a function to remove the file once it has
 * been used. This allows to hide details.
 */
function tempFile(code) {
    const filepath = path_1.default.join(os_1.default.tmpdir(), crypto.randomUUID());
    fs_1.default.writeFileSync(filepath, code);
    return {
        path: filepath,
        remove: () => fs_1.default.unlinkSync(filepath),
    };
}
exports.tempFile = tempFile;
//# sourceMappingURL=temp-file.js.map