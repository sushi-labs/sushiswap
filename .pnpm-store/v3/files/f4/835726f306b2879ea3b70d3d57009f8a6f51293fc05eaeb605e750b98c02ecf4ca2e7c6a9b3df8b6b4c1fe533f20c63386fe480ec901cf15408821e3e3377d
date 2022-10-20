"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveEtherscanApiKey = void 0;
const plugins_1 = require("hardhat/plugins");
const constants_1 = require("./constants");
const resolveEtherscanApiKey = (apiKey, network) => {
    if (apiKey === undefined || apiKey === "") {
        throwMissingApiKeyError(network);
    }
    if (typeof apiKey === "string") {
        return apiKey;
    }
    const key = apiKey[network];
    if (key === undefined || key === "") {
        throwMissingApiKeyError(network);
    }
    return key;
};
exports.resolveEtherscanApiKey = resolveEtherscanApiKey;
function throwMissingApiKeyError(network) {
    throw new plugins_1.NomicLabsHardhatPluginError(constants_1.pluginName, `You are trying to verify a contract in '${network}', but no API token was found for this network. Please provide one in your hardhat config. For example:

{
  ...
  etherscan: {
    apiKey: {
      ${network}: 'your API key'
    }
  }
}

See https://etherscan.io/apis`);
}
//# sourceMappingURL=resolveEtherscanApiKey.js.map