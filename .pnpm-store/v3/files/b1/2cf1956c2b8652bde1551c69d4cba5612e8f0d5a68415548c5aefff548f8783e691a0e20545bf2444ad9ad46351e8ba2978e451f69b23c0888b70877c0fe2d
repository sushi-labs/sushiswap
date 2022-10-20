"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdapterL2 = exports.AdapterL1 = void 0;
const ethers_1 = require("ethers");
const utils_1 = require("./utils");
const typechain_1 = require("../typechain");
const types_1 = require("./types");
function AdapterL1(Base) {
    return class Adapter extends Base {
        _providerL2() {
            throw new Error('Must be implemented by the derived class!');
        }
        _providerL1() {
            throw new Error('Must be implemented by the derived class!');
        }
        _signerL1() {
            throw new Error('Must be implemented by the derived class!');
        }
        async getMainContract() {
            const address = await this._providerL2().getMainContractAddress();
            return typechain_1.IZkSyncFactory.connect(address, this._signerL1());
        }
        async getL1BridgeContracts() {
            const addresses = await this._providerL2().getDefaultBridgeAddresses();
            return {
                eth: typechain_1.IL1BridgeFactory.connect(addresses.ethL1, this._signerL1()),
                erc20: typechain_1.IL1BridgeFactory.connect(addresses.erc20L1, this._signerL1())
            };
        }
        async getBalanceL1(token, blockTag) {
            token !== null && token !== void 0 ? token : (token = utils_1.ETH_ADDRESS);
            if ((0, utils_1.isETH)(token)) {
                return await this._providerL1().getBalance(await this.getAddress(), blockTag);
            }
            else {
                const erc20contract = typechain_1.IERC20Factory.connect(token, this._providerL1());
                return await erc20contract.balanceOf(await this.getAddress());
            }
        }
        async l2TokenAddress(token) {
            if (token == utils_1.ETH_ADDRESS) {
                return utils_1.ETH_ADDRESS;
            }
            else {
                const erc20Bridge = (await this.getL1BridgeContracts()).erc20;
                return await erc20Bridge.l2TokenAddress(token);
            }
        }
        async approveERC20(token, amount, overrides) {
            if ((0, utils_1.isETH)(token)) {
                throw new Error("ETH token can't be approved. The address of the token does not exist on L1.");
            }
            let bridgeAddress = overrides === null || overrides === void 0 ? void 0 : overrides.bridgeAddress;
            const erc20contract = typechain_1.IERC20Factory.connect(token, this._signerL1());
            if (bridgeAddress == null) {
                bridgeAddress = (await this._providerL2().getDefaultBridgeAddresses()).erc20L1;
            }
            else {
                delete overrides.bridgeAddress;
            }
            let gasLimit;
            if (overrides === null || overrides === void 0 ? void 0 : overrides.gasLimit) {
                gasLimit = await overrides.gasLimit;
            }
            else {
                // For some reason, gas estimation for approves may be imprecise.
                // At least in the localhost scenario.
                gasLimit = await erc20contract.estimateGas.approve(bridgeAddress, amount);
                gasLimit = gasLimit.gt(utils_1.RECOMMENDED_GAS_LIMIT.ERC20_APPROVE)
                    ? gasLimit
                    : utils_1.RECOMMENDED_GAS_LIMIT.ERC20_APPROVE;
            }
            return await erc20contract.approve(bridgeAddress, amount, { gasLimit, ...overrides });
        }
        async getBaseCost(params) {
            var _a;
            const zksyncContract = await this.getMainContract();
            const parameters = { ...(0, utils_1.layer1TxDefaults)(), ...params };
            (_a = parameters.gasPrice) !== null && _a !== void 0 ? _a : (parameters.gasPrice = await this._providerL1().getGasPrice());
            return ethers_1.BigNumber.from(await zksyncContract.l2TransactionBaseCost(parameters.gasPrice, parameters.ergsLimit, parameters.calldataLength, parameters.queueType));
        }
        async deposit(transaction) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            const bridgeContracts = await this.getL1BridgeContracts();
            if (transaction.bridgeAddress) {
                bridgeContracts.eth.attach(transaction.bridgeAddress);
                bridgeContracts.erc20.attach(transaction.bridgeAddress);
            }
            const { ...tx } = transaction;
            (_a = tx.queueType) !== null && _a !== void 0 ? _a : (tx.queueType = types_1.PriorityQueueType.Deque);
            (_b = tx.to) !== null && _b !== void 0 ? _b : (tx.to = await this.getAddress());
            (_c = tx.operatorTip) !== null && _c !== void 0 ? _c : (tx.operatorTip = ethers_1.BigNumber.from(0));
            (_d = tx.overrides) !== null && _d !== void 0 ? _d : (tx.overrides = {});
            const { to, token, amount, queueType, operatorTip, overrides } = tx;
            (_e = overrides.gasPrice) !== null && _e !== void 0 ? _e : (overrides.gasPrice = await this._providerL1().getGasPrice());
            (_f = overrides.gasLimit) !== null && _f !== void 0 ? _f : (overrides.gasLimit = ethers_1.BigNumber.from(utils_1.RECOMMENDED_GAS_LIMIT.DEPOSIT));
            const baseCost = ethers_1.BigNumber.from(0);
            // TODO
            // const baseCost = await this.getBaseCost({
            //     gasPrice: await overrides.gasPrice,
            //     ergsLimit: 0,
            //     calldataLength: 0,
            //     opTree,
            //     queueType,
            // });
            const args = [to, token, amount, queueType];
            if (token == utils_1.ETH_ADDRESS) {
                (_g = overrides.value) !== null && _g !== void 0 ? _g : (overrides.value = baseCost.add(operatorTip).add(amount));
                await (0, utils_1.checkBaseCost)(baseCost, overrides.value);
                return this._providerL2().getPriorityOpResponse(await bridgeContracts.eth.deposit(...args, overrides));
            }
            else {
                (_h = overrides.value) !== null && _h !== void 0 ? _h : (overrides.value = baseCost.add(operatorTip));
                await (0, utils_1.checkBaseCost)(baseCost, overrides.value);
                if (transaction.approveERC20) {
                    const approveTx = await this.approveERC20(token, amount, {
                        bridgeAddress: bridgeContracts.erc20.address,
                        ...transaction.approveOverrides
                    });
                    (_j = overrides.nonce) !== null && _j !== void 0 ? _j : (overrides.nonce = approveTx.nonce + 1);
                }
                if (overrides.gasLimit == null) {
                    const gasEstimate = await bridgeContracts.erc20.estimateGas
                        .deposit(...args, overrides)
                        .catch(() => ethers_1.BigNumber.from(0));
                    const recommendedGasLimit = utils_1.RECOMMENDED_GAS_LIMIT.DEPOSIT;
                    overrides.gasLimit = gasEstimate.gte(recommendedGasLimit) ? gasEstimate : recommendedGasLimit;
                }
                return await this._providerL2().getPriorityOpResponse(await bridgeContracts.erc20.deposit(...args, overrides));
            }
        }
        async finalizeWithdrawal(withdrawalHash, index = 0) {
            const hash = ethers_1.ethers.utils.hexlify(withdrawalHash);
            const receipt = await this._providerL2().getTransactionReceipt(hash);
            const log = receipt.logs.filter((log) => log.topics[0] == ethers_1.ethers.utils.id('L1MessageSent(address,bytes32,bytes)'))[index];
            const sender = ethers_1.ethers.utils.hexDataSlice(log.topics[1], 12);
            const proof = await this._providerL2().getMessageProof(receipt.blockNumber, sender, log.topics[2], log.logIndex);
            const message = ethers_1.ethers.utils.defaultAbiCoder.decode(['bytes'], log.data)[0];
            const l2Bridge = typechain_1.IL2BridgeFactory.connect(sender, this._providerL2());
            const l1Bridge = typechain_1.IL1BridgeFactory.connect(await l2Bridge.l1Bridge(), this._signerL1());
            return await l1Bridge.finalizeWithdrawal(receipt.blockNumber, proof.id, message, proof.proof);
        }
        async requestExecute(transaction) {
            var _a, _b, _c, _d, _e, _f, _g;
            const zksyncContract = await this.getMainContract();
            const { ...tx } = transaction;
            (_a = tx.queueType) !== null && _a !== void 0 ? _a : (tx.queueType = types_1.PriorityQueueType.Deque);
            (_b = tx.operatorTip) !== null && _b !== void 0 ? _b : (tx.operatorTip = ethers_1.BigNumber.from(0));
            (_c = tx.factoryDeps) !== null && _c !== void 0 ? _c : (tx.factoryDeps = []);
            (_d = tx.overrides) !== null && _d !== void 0 ? _d : (tx.overrides = {});
            const { contractAddress, calldata, ergsLimit, factoryDeps, queueType, operatorTip, overrides } = tx;
            (_e = overrides.gasPrice) !== null && _e !== void 0 ? _e : (overrides.gasPrice = await this._providerL1().getGasPrice());
            (_f = overrides.gasLimit) !== null && _f !== void 0 ? _f : (overrides.gasLimit = ethers_1.BigNumber.from(utils_1.RECOMMENDED_GAS_LIMIT.EXECUTE));
            const baseCost = await this.getBaseCost({
                gasPrice: await overrides.gasPrice,
                calldataLength: ethers_1.ethers.utils.hexDataLength(calldata),
                ergsLimit,
                queueType
            });
            (_g = overrides.value) !== null && _g !== void 0 ? _g : (overrides.value = baseCost.add(operatorTip));
            await (0, utils_1.checkBaseCost)(baseCost, overrides.value);
            return this._providerL2().getPriorityOpResponse(await zksyncContract.requestL2Transaction(contractAddress, calldata, ergsLimit, factoryDeps, queueType, overrides));
        }
    };
}
exports.AdapterL1 = AdapterL1;
function AdapterL2(Base) {
    return class Adapter extends Base {
        _providerL2() {
            throw new Error('Must be implemented by the derived class!');
        }
        _signerL2() {
            throw new Error('Must be implemented by the derived class!');
        }
        async getBalance(token, blockTag = 'committed') {
            return await this._providerL2().getBalance(await this.getAddress(), blockTag, token);
        }
        async getAllBalances() {
            return await this._providerL2().getAllAccountBalances(await this.getAddress());
        }
        async getL2BridgeContracts() {
            const addresses = await this._providerL2().getDefaultBridgeAddresses();
            return {
                eth: typechain_1.IL2BridgeFactory.connect(addresses.ethL2, this._signerL2()),
                erc20: typechain_1.IL2BridgeFactory.connect(addresses.erc20L2, this._signerL2())
            };
        }
        _fillCustomData(data) {
            var _a, _b, _c;
            const customData = { ...data };
            (_a = customData.feeToken) !== null && _a !== void 0 ? _a : (customData.feeToken = utils_1.ETH_ADDRESS);
            (_b = customData.ergsPerPubdata) !== null && _b !== void 0 ? _b : (customData.ergsPerPubdata = 0);
            (_c = customData.factoryDeps) !== null && _c !== void 0 ? _c : (customData.factoryDeps = []);
            return customData;
        }
        async withdraw(transaction) {
            const withdrawTx = await this._providerL2().getWithdrawTx({
                from: await this.getAddress(),
                ...transaction
            });
            const txResponse = await this.sendTransaction(withdrawTx);
            return this._providerL2()._wrapTransaction(txResponse);
        }
        async transfer(transaction) {
            const transferTx = await this._providerL2().getTransferTx({
                from: await this.getAddress(),
                ...transaction
            });
            const txResponse = await this.sendTransaction(transferTx);
            return this._providerL2()._wrapTransaction(txResponse);
        }
    };
}
exports.AdapterL2 = AdapterL2;
