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
exports.printSupportedNetworks = exports.buildContractUrl = void 0;
const chalk_1 = __importDefault(require("chalk"));
const ChainConfig_1 = require("./ChainConfig");
function buildContractUrl(browserURL, contractAddress) {
    const normalizedBrowserURL = browserURL.trim().replace(/\/$/, "");
    return `${normalizedBrowserURL}/address/${contractAddress}#code`;
}
exports.buildContractUrl = buildContractUrl;
async function printSupportedNetworks(customChains) {
    const { table } = await Promise.resolve().then(() => __importStar(require("table")));
    // supported networks
    const supportedNetworks = Object.entries(ChainConfig_1.chainConfig)
        .map(([network, config]) => [network, config.chainId])
        // sort by chain id
        .sort((a, b) => a[1] - b[1]);
    const supportedNetworksTable = table([
        [chalk_1.default.bold("network"), chalk_1.default.bold("chain id")],
        ...supportedNetworks,
    ]);
    // custom networks
    const customNetworks = customChains.map(({ network, chainId }) => [
        network,
        chainId,
    ]);
    const customNetworksTable = customNetworks.length > 0
        ? table([
            [chalk_1.default.bold("network"), chalk_1.default.bold("chain id")],
            ...customNetworks,
        ])
        : table([["No custom networks were added"]]);
    // print message
    console.log(`
Networks supported by hardhat-etherscan:

${supportedNetworksTable}

Custom networks added by you or by plugins:

${customNetworksTable}

To learn how to add custom networks, follow these instructions: https://hardhat.org/verify-custom-networks
`.trimStart());
}
exports.printSupportedNetworks = printSupportedNetworks;
//# sourceMappingURL=util.js.map