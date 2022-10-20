"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ripemd160 = exports.sha512 = exports.sha256 = void 0;
const node_1 = require("../lib/node");
function sha256(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = node_1.nodeSha256(msg);
        return result;
    });
}
exports.sha256 = sha256;
function sha512(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = node_1.nodeSha512(msg);
        return result;
    });
}
exports.sha512 = sha512;
function ripemd160(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = node_1.nodeRipemd160(msg);
        return result;
    });
}
exports.ripemd160 = ripemd160;
//# sourceMappingURL=sha2.js.map