"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwUnsupportedNetwork = void 0;
const plugins_1 = require("hardhat/plugins");
const constants_1 = require("./constants");
function throwUnsupportedNetwork(networkName, chainID) {
    const message = `
Trying to verify a contract in a network with chain id ${chainID}, but the plugin doesn't recognize it as a supported chain.

You can manually add support for it by following these instructions: https://hardhat.org/verify-custom-networks

To see the list of supported networks, run this command:

  npx hardhat verify --list-networks`.trimStart();
    throw new plugins_1.NomicLabsHardhatPluginError(constants_1.pluginName, message);
}
exports.throwUnsupportedNetwork = throwUnsupportedNetwork;
//# sourceMappingURL=errors.js.map