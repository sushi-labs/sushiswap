"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.browserSha512 = exports.browserSha256 = exports.browserHmacSha512Sign = exports.browserHmacSha256Sign = exports.browserAesDecrypt = exports.browserAesEncrypt = exports.browserImportKey = exports.browserExportKey = exports.getOps = exports.getAlgo = void 0;
const env = __importStar(require("@walletconnect/environment"));
const constants_1 = require("../constants");
function getAlgo(type) {
    return type === constants_1.AES_BROWSER_ALGO
        ? { length: constants_1.AES_LENGTH, name: constants_1.AES_BROWSER_ALGO }
        : {
            hash: { name: constants_1.HMAC_BROWSER_ALGO },
            name: constants_1.HMAC_BROWSER,
        };
}
exports.getAlgo = getAlgo;
function getOps(type) {
    return type === constants_1.AES_BROWSER_ALGO
        ? [constants_1.ENCRYPT_OP, constants_1.DECRYPT_OP]
        : [constants_1.SIGN_OP, constants_1.VERIFY_OP];
}
exports.getOps = getOps;
function browserExportKey(cryptoKey, type = constants_1.AES_BROWSER_ALGO) {
    return __awaiter(this, void 0, void 0, function* () {
        const subtle = env.getSubtleCrypto();
        return new Uint8Array(yield subtle.exportKey("raw", cryptoKey));
    });
}
exports.browserExportKey = browserExportKey;
function browserImportKey(buffer, type = constants_1.AES_BROWSER_ALGO) {
    return __awaiter(this, void 0, void 0, function* () {
        return env.getSubtleCrypto().importKey("raw", buffer, getAlgo(type), true, getOps(type));
    });
}
exports.browserImportKey = browserImportKey;
function browserAesEncrypt(iv, key, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const subtle = env.getSubtleCrypto();
        const cryptoKey = yield browserImportKey(key, constants_1.AES_BROWSER_ALGO);
        const result = yield subtle.encrypt({
            iv,
            name: constants_1.AES_BROWSER_ALGO,
        }, cryptoKey, data);
        return new Uint8Array(result);
    });
}
exports.browserAesEncrypt = browserAesEncrypt;
function browserAesDecrypt(iv, key, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const subtle = env.getSubtleCrypto();
        const cryptoKey = yield browserImportKey(key, constants_1.AES_BROWSER_ALGO);
        const result = yield subtle.decrypt({
            iv,
            name: constants_1.AES_BROWSER_ALGO,
        }, cryptoKey, data);
        return new Uint8Array(result);
    });
}
exports.browserAesDecrypt = browserAesDecrypt;
function browserHmacSha256Sign(key, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const subtle = env.getSubtleCrypto();
        const cryptoKey = yield browserImportKey(key, constants_1.HMAC_BROWSER);
        const signature = yield subtle.sign({
            length: constants_1.HMAC_LENGTH,
            name: constants_1.HMAC_BROWSER,
        }, cryptoKey, data);
        return new Uint8Array(signature);
    });
}
exports.browserHmacSha256Sign = browserHmacSha256Sign;
function browserHmacSha512Sign(key, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const subtle = env.getSubtleCrypto();
        const cryptoKey = yield browserImportKey(key, constants_1.HMAC_BROWSER);
        const signature = yield subtle.sign({
            length: constants_1.LENGTH_512,
            name: constants_1.HMAC_BROWSER,
        }, cryptoKey, data);
        return new Uint8Array(signature);
    });
}
exports.browserHmacSha512Sign = browserHmacSha512Sign;
function browserSha256(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const subtle = env.getSubtleCrypto();
        const result = yield subtle.digest({
            name: constants_1.SHA256_BROWSER_ALGO,
        }, data);
        return new Uint8Array(result);
    });
}
exports.browserSha256 = browserSha256;
function browserSha512(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const subtle = env.getSubtleCrypto();
        const result = yield subtle.digest({
            name: constants_1.SHA512_BROWSER_ALGO,
        }, data);
        return new Uint8Array(result);
    });
}
exports.browserSha512 = browserSha512;
//# sourceMappingURL=browser.js.map