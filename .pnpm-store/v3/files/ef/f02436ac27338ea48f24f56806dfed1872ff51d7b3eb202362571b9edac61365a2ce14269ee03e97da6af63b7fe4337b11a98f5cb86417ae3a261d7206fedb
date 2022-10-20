"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
const plugins_1 = require("hardhat/plugins");
const helpers_1 = require("./helpers");
require("./type-extensions");
const config_2 = require("hardhat/config");
const task_names_1 = require("hardhat/builtin-tasks/task-names");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// necessary as newest version of typechain assume specific hardhat-ethers type which are not compatible with hardhat-deploy-ethers
config_2.task(task_names_1.TASK_COMPILE, undefined).setAction(async (args, hre, runSuper) => {
    var _a;
    const result = await runSuper(args);
    try {
        const typechainFolder = ((_a = hre.config.typechain) === null || _a === void 0 ? void 0 : _a.outDir) || 'typechain';
        fs_1.default.unlinkSync(path_1.default.join(typechainFolder, 'hardhat.d.ts'));
    }
    catch (e) { }
    return result;
});
config_1.extendEnvironment((hre) => {
    hre.ethers = plugins_1.lazyObject(() => {
        const { createProviderProxy, } = require("./provider-proxy");
        const { ethers } = require("ethers");
        const providerProxy = createProviderProxy(hre.network.provider);
        return Object.assign(Object.assign({}, ethers), { 
            // The provider wrapper should be removed once this is released
            // https://github.com/nomiclabs/hardhat/pull/608
            provider: providerProxy, 
            // We cast to any here as we hit a limitation of Function#bind and
            // overloads. See: https://github.com/microsoft/TypeScript/issues/28582
            getContractFactory: helpers_1.getContractFactory.bind(null, hre), getContractAt: async (nameOrAbi, address, signer) => helpers_1.getContractAt(hre, nameOrAbi, address, signer), getSigners: async () => helpers_1.getSigners(hre), getSigner: async (address) => helpers_1.getSigner(hre, address), getSignerOrNull: async (address) => helpers_1.getSignerOrNull(hre, address), getNamedSigners: async () => helpers_1.getNamedSigners(hre), getNamedSigner: async (name) => helpers_1.getNamedSigner(hre, name), getNamedSignerOrNull: async (name) => helpers_1.getNamedSignerOrNull(hre, name), getUnnamedSigners: async () => helpers_1.getUnnamedSigners(hre), getContract: async (name, signer) => helpers_1.getContract(hre, name, signer), getContractOrNull: async (name, signer) => helpers_1.getContractOrNull(hre, name, signer) });
    });
});
//# sourceMappingURL=index.js.map