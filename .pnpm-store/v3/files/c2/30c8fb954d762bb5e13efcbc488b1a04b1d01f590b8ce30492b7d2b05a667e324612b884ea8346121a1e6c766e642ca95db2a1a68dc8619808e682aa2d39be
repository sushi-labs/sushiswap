"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3Provider = exports.Provider = void 0;
const ethers_1 = require("ethers");
var Formatter = ethers_1.providers.Formatter;
const web_1 = require("@ethersproject/web");
const typechain_1 = require("../typechain");
const types_1 = require("./types");
const utils_1 = require("./utils");
const signer_1 = require("./signer");
class Provider extends ethers_1.ethers.providers.JsonRpcProvider {
    constructor(url, network) {
        super(url, network);
        this.pollingInterval = 500;
        const blockTag = this.formatter.blockTag.bind(this.formatter);
        this.formatter.blockTag = (tag) => {
            if (tag == 'committed' || tag == 'finalized') {
                return tag;
            }
            return blockTag(tag);
        };
        this.contractAddresses = {};
        this.formatter.transaction = utils_1.parseTransaction;
    }
    async getTransactionReceipt(transactionHash) {
        await this.getNetwork();
        transactionHash = await transactionHash;
        const params = { transactionHash: this.formatter.hash(transactionHash, true) };
        return (0, web_1.poll)(async () => {
            const result = await this.perform('getTransactionReceipt', params);
            if (result == null) {
                if (this._emitted['t:' + transactionHash] == null) {
                    return null;
                }
                return undefined;
            }
            if (result.blockHash == null) {
                if (result.status != null && ethers_1.BigNumber.from(result.status).isZero()) {
                    // transaction is rejected in the state-keeper
                    return {
                        ...this.formatter.receipt({
                            ...result,
                            confirmations: 1,
                            blockNumber: 0,
                            blockHash: ethers_1.ethers.constants.HashZero
                        }),
                        blockNumber: null,
                        blockHash: null
                    };
                }
                else {
                    // receipt is not ready
                    return undefined;
                }
            }
            else {
                const receipt = this.formatter.receipt(result);
                if (receipt.blockNumber == null) {
                    receipt.confirmations = 0;
                }
                else if (receipt.confirmations == null) {
                    const blockNumber = await this._getInternalBlockNumber(100 + 2 * this.pollingInterval);
                    // Add the confirmations using the fast block number (pessimistic)
                    let confirmations = blockNumber - receipt.blockNumber + 1;
                    if (confirmations <= 0) {
                        confirmations = 1;
                    }
                    receipt.confirmations = confirmations;
                }
                return receipt;
            }
        }, { oncePoll: this });
    }
    async getBalance(address, blockTag, tokenAddress) {
        const tag = this.formatter.blockTag(blockTag);
        if (tokenAddress == null || (0, utils_1.isETH)(tokenAddress)) {
            // requesting ETH balance
            return await super.getBalance(address, tag);
        }
        else {
            try {
                let token = typechain_1.IERC20Factory.connect(tokenAddress, this);
                return await token.balanceOf(address, { blockTag: tag });
            }
            catch {
                return ethers_1.BigNumber.from(0);
            }
        }
    }
    async l2TokenAddress(token) {
        if (token == utils_1.ETH_ADDRESS) {
            return utils_1.ETH_ADDRESS;
        }
        else {
            const erc20BridgeAddress = (await this.getDefaultBridgeAddresses()).erc20L2;
            const erc20Bridge = typechain_1.IL2BridgeFactory.connect(erc20BridgeAddress, this);
            return await erc20Bridge.l2TokenAddress(token);
        }
    }
    async l1TokenAddress(token) {
        if (token == utils_1.ETH_ADDRESS) {
            return utils_1.ETH_ADDRESS;
        }
        else {
            const erc20BridgeAddress = (await this.getDefaultBridgeAddresses()).erc20L2;
            const erc20Bridge = typechain_1.IL2BridgeFactory.connect(erc20BridgeAddress, this);
            return await erc20Bridge.l1TokenAddress(token);
        }
    }
    // This function is used when formatting requests for
    // eth_call and eth_estimateGas. We override it here
    // because we have extra stuff to serialize (customData).
    // This function is for internal use only.
    static hexlifyTransaction(transaction, allowExtra) {
        var _a, _b, _c;
        const result = ethers_1.ethers.providers.JsonRpcProvider.hexlifyTransaction(transaction, {
            ...allowExtra,
            customData: true,
            from: true
        });
        if (transaction.customData == null) {
            return result;
        }
        result.eip712Meta = {
            feeToken: ethers_1.utils.hexlify((_a = transaction.customData.feeToken) !== null && _a !== void 0 ? _a : utils_1.ETH_ADDRESS),
            ergsPerStorage: ethers_1.utils.hexValue((_b = transaction.customData.ergsPerStorage) !== null && _b !== void 0 ? _b : 0),
            ergsPerPubdata: ethers_1.utils.hexValue((_c = transaction.customData.ergsPerPubdata) !== null && _c !== void 0 ? _c : 0)
        };
        if (transaction.customData.factoryDeps) {
            // @ts-ignore
            result.eip712Meta.factoryDeps = transaction.customData.factoryDeps.map((dep) => 
            // TODO: we arraify instead of hexlifying because server expects Vec<u8>.
            // We should change deserealization there.
            Array.from(ethers_1.utils.arrayify(dep)));
        }
        return result;
    }
    async estimateGas(transaction) {
        await this.getNetwork();
        const params = await ethers_1.utils.resolveProperties({
            transaction: this._getTransactionRequest(transaction)
        });
        if (transaction.customData != null) {
            // @ts-ignore
            params.transaction.customData = transaction.customData;
        }
        const result = await this.perform('estimateGas', params);
        try {
            return ethers_1.BigNumber.from(result);
        }
        catch (error) {
            throw new Error(`bad result from backend (estimateGas): ${result}`);
        }
    }
    async getGasPrice(token) {
        const params = token ? [token] : [];
        const price = await this.send('eth_gasPrice', params);
        return ethers_1.BigNumber.from(price);
    }
    async getMessageProof(blockNumber, sender, messageHash, logIndex) {
        return await this.send('zks_getL2ToL1MsgProof', [
            ethers_1.BigNumber.from(blockNumber).toNumber(),
            sender,
            ethers_1.ethers.utils.hexlify(messageHash),
            logIndex
        ]);
    }
    async getMainContractAddress() {
        if (!this.contractAddresses.mainContract) {
            this.contractAddresses.mainContract = await this.send('zks_getMainContract', []);
        }
        return this.contractAddresses.mainContract;
    }
    async getDefaultBridgeAddresses() {
        if (!this.contractAddresses.ethBridgeL1) {
            let addresses = await this.send('zks_getBridgeContracts', []);
            this.contractAddresses.ethBridgeL1 = addresses.l1EthDefaultBridge;
            this.contractAddresses.erc20BridgeL1 = addresses.l1Erc20DefaultBridge;
            this.contractAddresses.ethBridgeL2 = addresses.l2EthDefaultBridge;
            this.contractAddresses.erc20BridgeL2 = addresses.l2Erc20DefaultBridge;
        }
        return {
            ethL1: this.contractAddresses.ethBridgeL1,
            erc20L1: this.contractAddresses.erc20BridgeL1,
            ethL2: this.contractAddresses.ethBridgeL2,
            erc20L2: this.contractAddresses.erc20BridgeL2
        };
    }
    async getConfirmedTokens(start = 0, limit = 255) {
        const tokens = await this.send('zks_getConfirmedTokens', [start, limit]);
        return tokens.map((token) => ({ address: token.l2Address, ...token }));
    }
    async isTokenLiquid(token) {
        return await this.send('zks_isTokenLiquid', [token]);
    }
    async getTokenPrice(token) {
        return await this.send('zks_getTokenPrice', [token]);
    }
    async getAllAccountBalances(address) {
        let balances = await this.send('zks_getAllAccountBalances', [address]);
        for (let token in balances) {
            balances[token] = ethers_1.BigNumber.from(balances[token]);
        }
        return balances;
    }
    async getWithdrawTx(transaction) {
        var _a, _b, _c;
        var _d;
        const { ...tx } = transaction;
        if (tx.to == null && tx.from == null) {
            throw new Error('withdrawal target address is undefined');
        }
        (_a = tx.to) !== null && _a !== void 0 ? _a : (tx.to = tx.from);
        (_b = tx.overrides) !== null && _b !== void 0 ? _b : (tx.overrides = {});
        (_c = (_d = tx.overrides).from) !== null && _c !== void 0 ? _c : (_d.from = tx.from);
        if (tx.bridgeAddress == null) {
            const bridges = await this.getDefaultBridgeAddresses();
            tx.bridgeAddress = (0, utils_1.isETH)(tx.token) ? bridges.ethL2 : bridges.erc20L2;
        }
        const bridge = typechain_1.IL2BridgeFactory.connect(tx.bridgeAddress, this);
        return bridge.populateTransaction.withdraw(tx.to, tx.token, tx.amount, tx.overrides);
    }
    async estimateGasWithdraw(transaction) {
        const withdrawTx = await this.getWithdrawTx(transaction);
        return await this.estimateGas(withdrawTx);
    }
    async getTransferTx(transaction) {
        var _a, _b;
        var _c;
        const { ...tx } = transaction;
        (_a = tx.overrides) !== null && _a !== void 0 ? _a : (tx.overrides = {});
        (_b = (_c = tx.overrides).from) !== null && _b !== void 0 ? _b : (_c.from = tx.from);
        if (tx.token == null || tx.token == utils_1.ETH_ADDRESS) {
            return {
                ...(await ethers_1.ethers.utils.resolveProperties(tx.overrides)),
                to: tx.to,
                value: tx.amount
            };
        }
        else {
            const token = typechain_1.IERC20Factory.connect(tx.token, this);
            return await token.populateTransaction.transfer(tx.to, tx.amount, tx.overrides);
        }
    }
    async estimateGasTransfer(transaction) {
        const transferTx = await this.getTransferTx(transaction);
        return await this.estimateGas(transferTx);
    }
    static getDefaultProvider() {
        // TODO: different urls for different networks
        return new Provider(process.env.ZKSYNC_WEB3_API_URL || 'http://localhost:3050');
    }
    async newFilter(filter) {
        filter = await filter;
        const id = await this.send('eth_newFilter', [this._prepareFilter(filter)]);
        return ethers_1.BigNumber.from(id);
    }
    async newBlockFilter() {
        const id = await this.send('eth_newBlockFilter', []);
        return ethers_1.BigNumber.from(id);
    }
    async newPendingTransactionsFilter() {
        const id = await this.send('eth_newPendingTransactionFilter', []);
        return ethers_1.BigNumber.from(id);
    }
    async getFilterChanges(idx) {
        const logs = await this.send('eth_getFilterChanges', [idx.toHexString()]);
        return typeof logs[0] === 'string' ? logs : this._parseLogs(logs);
    }
    async getLogs(filter = {}) {
        filter = await filter;
        const logs = await this.send('eth_getLogs', [this._prepareFilter(filter)]);
        return this._parseLogs(logs);
    }
    _parseLogs(logs) {
        return Formatter.arrayOf(this.formatter.filterLog.bind(this.formatter))(logs);
    }
    _prepareFilter(filter) {
        return {
            ...filter,
            fromBlock: filter.fromBlock == null ? null : this.formatter.blockTag(filter.fromBlock),
            toBlock: filter.fromBlock == null ? null : this.formatter.blockTag(filter.toBlock)
        };
    }
    _wrapTransaction(tx, hash) {
        const response = super._wrapTransaction(tx, hash);
        response.waitFinalize = async () => {
            const receipt = await response.wait();
            while (true) {
                const block = await this.getBlock('finalized');
                if (receipt.blockNumber <= block.number) {
                    return receipt;
                }
                else {
                    await (0, utils_1.sleep)(this.pollingInterval);
                }
            }
        };
        return response;
    }
    // This is inefficient. Status should probably be indicated in the transaction receipt.
    async getTransactionStatus(txHash) {
        const tx = await this.getTransaction(txHash);
        if (tx == null) {
            return types_1.TransactionStatus.NotFound;
        }
        if (tx.blockNumber == null) {
            return types_1.TransactionStatus.Processing;
        }
        const verifiedBlock = await this.getBlock('finalized');
        if (tx.blockNumber <= verifiedBlock.number) {
            return types_1.TransactionStatus.Finalized;
        }
        return types_1.TransactionStatus.Committed;
    }
    async getTransaction(hash) {
        hash = await hash;
        const tx = await super.getTransaction(hash);
        return tx ? this._wrapTransaction(tx, hash) : null;
    }
    async sendTransaction(transaction) {
        return (await super.sendTransaction(transaction));
    }
    async getL2TransactionFromPriorityOp(l1TxResponse) {
        const receipt = await l1TxResponse.wait();
        const l2Hash = (0, utils_1.getL2HashFromPriorityOp)(receipt, await this.getMainContractAddress());
        let status = null;
        do {
            status = await this.getTransactionStatus(l2Hash);
            await (0, utils_1.sleep)(this.pollingInterval);
        } while (status == types_1.TransactionStatus.NotFound);
        return await this.getTransaction(l2Hash);
    }
    async getPriorityOpResponse(l1TxResponse) {
        const l2Response = { ...l1TxResponse };
        l2Response.waitL1Commit = l2Response.wait;
        l2Response.wait = async () => {
            const l2Tx = await this.getL2TransactionFromPriorityOp(l1TxResponse);
            return await l2Tx.wait();
        };
        l2Response.waitFinalize = async () => {
            const l2Tx = await this.getL2TransactionFromPriorityOp(l1TxResponse);
            return await l2Tx.waitFinalize();
        };
        return l2Response;
    }
}
exports.Provider = Provider;
class Web3Provider extends Provider {
    constructor(provider, network) {
        if (provider == null) {
            throw new Error('missing provider');
        }
        if (!provider.request) {
            throw new Error('provider must implement eip-1193');
        }
        let path = provider.host || provider.path || (provider.isMetaMask ? 'metamask' : 'eip-1193:');
        super(path, network);
        this.provider = provider;
    }
    async send(method, params) {
        params !== null && params !== void 0 ? params : (params = []);
        // Metamask complains about eth_sign (and on some versions hangs)
        if (method == 'eth_sign' && (this.provider.isMetaMask || this.provider.isStatus)) {
            // https://github.com/ethereum/go-ethereum/wiki/Management-APIs#personal_sign
            method = 'personal_sign';
            params = [params[1], params[0]];
        }
        return await this.provider.request({ method, params });
    }
    getSigner(addressOrIndex) {
        return signer_1.Signer.from(super.getSigner(addressOrIndex));
    }
    async estimateGas(transaction) {
        const gas = await super.estimateGas(transaction);
        const metamaskMinimum = ethers_1.BigNumber.from(21000);
        const isEIP712 = transaction.customData != null || transaction.type == utils_1.EIP712_TX_TYPE;
        return gas.gt(metamaskMinimum) || isEIP712 ? gas : metamaskMinimum;
    }
}
exports.Web3Provider = Web3Provider;
