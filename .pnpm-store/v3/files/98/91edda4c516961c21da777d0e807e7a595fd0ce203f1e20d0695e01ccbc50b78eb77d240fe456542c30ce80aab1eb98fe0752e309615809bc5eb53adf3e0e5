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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.download = void 0;
const fs_1 = __importDefault(require("fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("util"));
const packageInfo_1 = require("./packageInfo");
const TEMP_FILE_PREFIX = "tmp-";
const hardhatVersion = (0, packageInfo_1.getHardhatVersion)();
function resolveTempFileName(filePath) {
    const { dir, ext, name } = path_1.default.parse(filePath);
    return path_1.default.format({
        dir,
        ext,
        name: `${TEMP_FILE_PREFIX}${name}`,
    });
}
async function download(url, filePath, timeoutMillis = 10000) {
    const { pipeline } = await Promise.resolve().then(() => __importStar(require("stream")));
    const { getGlobalDispatcher, ProxyAgent, request } = await Promise.resolve().then(() => __importStar(require("undici")));
    const streamPipeline = util_1.default.promisify(pipeline);
    function chooseDispatcher() {
        if (process.env.HTTPS_PROXY !== undefined) {
            return new ProxyAgent(process.env.HTTPS_PROXY);
        }
        if (process.env.HTTP_PROXY !== undefined) {
            return new ProxyAgent(process.env.HTTP_PROXY);
        }
        return getGlobalDispatcher();
    }
    // Fetch the url
    const response = await request(url, {
        dispatcher: chooseDispatcher(),
        headersTimeout: timeoutMillis,
        maxRedirections: 10,
        method: "GET",
        headers: {
            "User-Agent": `hardhat ${hardhatVersion !== null && hardhatVersion !== void 0 ? hardhatVersion : "(unknown version)"}`,
        },
    });
    if (response.statusCode >= 200 && response.statusCode <= 299) {
        const tmpFilePath = resolveTempFileName(filePath);
        await fs_extra_1.default.ensureDir(path_1.default.dirname(filePath));
        await streamPipeline(response.body, fs_1.default.createWriteStream(tmpFilePath));
        return fs_extra_1.default.move(tmpFilePath, filePath, { overwrite: true });
    }
    // eslint-disable-next-line @nomiclabs/hardhat-internal-rules/only-hardhat-error
    throw new Error(`Failed to download ${url} - ${response.statusCode} received. ${await response.body.text()}`);
}
exports.download = download;
//# sourceMappingURL=download.js.map