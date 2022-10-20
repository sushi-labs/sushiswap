"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractFactory = exports.Contract = void 0;
const ethers_1 = require("ethers");
const utils_1 = require("./utils");
var ethers_2 = require("ethers");
Object.defineProperty(exports, "Contract", { enumerable: true, get: function () { return ethers_2.Contract; } });
class ContractFactory extends ethers_1.ethers.ContractFactory {
    constructor(abi, bytecode, signer, deploymentType) {
        super(abi, bytecode, signer);
        this.deploymentType = deploymentType || 'create';
    }
    getDeployTransaction(...args) {
        var _a, _b, _c;
        var _d;
        // TODO: the users should be able to provide the salt
        let salt = '0x0000000000000000000000000000000000000000000000000000000000000000';
        // The overrides will be popped out in this call:
        const txRequest = super.getDeployTransaction(...args);
        let overrides = {};
        if (this.interface.deploy.inputs.length + 1 == args.length) {
            // pop out the overrides
            overrides = args.pop();
        }
        // Salt argument is not used, so we provide a placeholder value.
        const bytecodeHash = (0, utils_1.hashBytecode)(this.bytecode);
        const value = ethers_1.BigNumber.from((_a = overrides.value) !== null && _a !== void 0 ? _a : 0);
        const constructorCalldata = ethers_1.utils.arrayify(this.interface.encodeDeploy(args));
        const deployCalldata = utils_1.CONTRACT_DEPLOYER.encodeFunctionData(this.deploymentType, [
            salt,
            bytecodeHash,
            value,
            constructorCalldata
        ]);
        txRequest.type = utils_1.EIP712_TX_TYPE;
        txRequest.to = utils_1.CONTRACT_DEPLOYER_ADDRESS;
        txRequest.data = deployCalldata;
        (_b = txRequest.customData) !== null && _b !== void 0 ? _b : (txRequest.customData = {});
        (_c = (_d = txRequest.customData).factoryDeps) !== null && _c !== void 0 ? _c : (_d.factoryDeps = []);
        txRequest.customData.factoryDeps.push(this.bytecode);
        return txRequest;
    }
    async deploy(...args) {
        const contract = await super.deploy(...args);
        const deployTxReceipt = await contract.deployTransaction.wait();
        const deployedAddresses = (0, utils_1.getDeployedContracts)(deployTxReceipt).map((info) => info.deployedAddress);
        const contractWithCorrectAddress = new ethers_1.ethers.Contract(deployedAddresses[deployedAddresses.length - 1], contract.interface, contract.signer);
        ethers_1.utils.defineReadOnly(contractWithCorrectAddress, 'deployTransaction', contract.deployTransaction);
        return contractWithCorrectAddress;
    }
}
exports.ContractFactory = ContractFactory;
