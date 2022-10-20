"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitSourcesToSourcify = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const chalk_1 = __importDefault(require("chalk"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const stream_1 = require("stream");
function log(...args) {
    console.log(...args);
}
function logError(...args) {
    console.log(chalk_1.default.red(...args));
}
function logInfo(...args) {
    console.log(chalk_1.default.yellow(...args));
}
function logSuccess(...args) {
    console.log(chalk_1.default.green(...args));
}
function ensureTrailingSlash(s) {
    const lastChar = s.substr(-1);
    if (lastChar != '/') {
        s = s + '/';
    }
    return s;
}
// const defaultEndpoint = 'https://server.verificationstaging.shardlabs.io/';
const defaultEndpoint = 'https://sourcify.dev/server/';
async function submitSourcesToSourcify(hre, config) {
    config = config || {};
    const chainId = await hre.getChainId();
    const all = await hre.deployments.all();
    const url = config.endpoint
        ? ensureTrailingSlash(config.endpoint)
        : defaultEndpoint;
    async function submit(name) {
        const deployment = all[name];
        const { address, metadata: metadataString } = deployment;
        try {
            const checkResponse = await axios_1.default.get(`${url}checkByAddresses?addresses=${address.toLowerCase()}&chainIds=${chainId}`);
            const { data: checkData } = checkResponse;
            if (checkData[0].status === 'perfect') {
                log(`already verified: ${name} (${address}), skipping.`);
                return;
            }
        }
        catch (e) {
            logError((e.response && JSON.stringify(e.response.data)) || e);
        }
        if (!metadataString) {
            logError(`Contract ${name} was deployed without saving metadata. Cannot submit to sourcify, skipping.`);
            return;
        }
        logInfo(`verifying ${name} (${address} on chain ${chainId}) ...`);
        const formData = new form_data_1.default();
        formData.append('address', address);
        formData.append('chain', chainId);
        const fileStream = new stream_1.Readable();
        fileStream.push(metadataString);
        fileStream.push(null);
        formData.append('files', fileStream, 'metadata.json');
        try {
            const submissionResponse = await axios_1.default.post(url, formData, {
                headers: formData.getHeaders(),
            });
            if (submissionResponse.data.result[0].status === 'perfect') {
                logSuccess(` => contract ${name} is now verified`);
            }
            else {
                logError(` => contract ${name} is not verified`);
            }
        }
        catch (e) {
            if (config && config.writeFailingMetadata) {
                const failingMetadataFolder = path_1.default.join('failing_metadata', chainId);
                fs_extra_1.default.ensureDirSync(failingMetadataFolder);
                fs_extra_1.default.writeFileSync(path_1.default.join(failingMetadataFolder, `${name}_at_${address}.json`), metadataString);
            }
            logError((e.response && JSON.stringify(e.response.data)) || e);
        }
    }
    if (config.contractName) {
        await submit(config.contractName);
    }
    else {
        for (const name of Object.keys(all)) {
            await submit(name);
        }
    }
}
exports.submitSourcesToSourcify = submitSourcesToSourcify;
//# sourceMappingURL=sourcify.js.map