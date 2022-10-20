"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.etherscanConfigExtender = exports.verifyAllowedChains = void 0;
const plugins_1 = require("hardhat/plugins");
const ChainConfig_1 = require("./ChainConfig");
const constants_1 = require("./constants");
const verifyAllowedChains = (etherscanConfig) => {
    if (etherscanConfig.apiKey === null ||
        etherscanConfig.apiKey === undefined ||
        typeof etherscanConfig.apiKey !== "object") {
        return;
    }
    // check if any of the configured api keys is for an unsupported network
    const builtinChains = Object.keys(ChainConfig_1.chainConfig);
    const customChains = etherscanConfig.customChains.map((x) => x.network);
    const allowedChains = [...builtinChains, ...customChains];
    const actual = Object.keys(etherscanConfig.apiKey);
    const invalidNetwork = actual.find((chain) => !allowedChains.includes(chain));
    if (invalidNetwork !== undefined) {
        throw new plugins_1.NomicLabsHardhatPluginError(constants_1.pluginName, `You set an Etherscan API token for the network "${invalidNetwork}" but the plugin doesn't support it, or it's spelled incorrectly.

To see the list of supported networks, run this command:

  npx hardhat verify --list-networks

Learn more at https://hardhat.org/verify-multiple-networks`);
    }
};
exports.verifyAllowedChains = verifyAllowedChains;
const etherscanConfigExtender = (resolvedConfig, config) => {
    const defaultConfig = {
        apiKey: "",
        customChains: [],
    };
    if (config.etherscan !== undefined) {
        const { cloneDeep } = require("lodash");
        const customConfig = cloneDeep(config.etherscan);
        resolvedConfig.etherscan = Object.assign(Object.assign({}, defaultConfig), customConfig);
    }
    else {
        resolvedConfig.etherscan = defaultConfig;
    }
};
exports.etherscanConfigExtender = etherscanConfigExtender;
//# sourceMappingURL=config.js.map