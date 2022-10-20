import { ethers, BigNumber, BigNumberish, utils, providers, BytesLike } from 'ethers';
import Formatter = providers.Formatter;
import { Log } from '@ethersproject/abstract-provider';
import { ExternalProvider, TransactionReceipt } from '@ethersproject/providers';
import { ConnectionInfo, poll } from '@ethersproject/web';
import { IERC20Factory, IL2BridgeFactory } from '../typechain';
import {
    Address,
    EventFilter,
    BlockTag,
    TransactionResponse,
    TransactionRequest,
    TransactionStatus,
    Token,
    PriorityOpResponse,
    BalancesMap,
    MessageProof
} from './types';
import { sleep, parseTransaction, ETH_ADDRESS, isETH, getL2HashFromPriorityOp, EIP712_TX_TYPE } from './utils';
import { Signer } from './signer';

export class Provider extends ethers.providers.JsonRpcProvider {
    protected contractAddresses: {
        mainContract?: Address;
        ethBridgeL1?: Address;
        ethBridgeL2?: Address;
        erc20BridgeL1?: Address;
        erc20BridgeL2?: Address;
    };

    override async getTransactionReceipt(transactionHash: string | Promise<string>): Promise<TransactionReceipt> {
        await this.getNetwork();

        transactionHash = await transactionHash;

        const params = { transactionHash: this.formatter.hash(transactionHash, true) };

        return poll(
            async () => {
                const result = await this.perform('getTransactionReceipt', params);

                if (result == null) {
                    if (this._emitted['t:' + transactionHash] == null) {
                        return null;
                    }
                    return undefined;
                }

                if (result.blockHash == null) {
                    if (result.status != null && BigNumber.from(result.status).isZero()) {
                        // transaction is rejected in the state-keeper
                        return {
                            ...this.formatter.receipt({
                                ...result,
                                confirmations: 1,
                                blockNumber: 0,
                                blockHash: ethers.constants.HashZero
                            }),
                            blockNumber: null,
                            blockHash: null
                        };
                    } else {
                        // receipt is not ready
                        return undefined;
                    }
                } else {
                    const receipt = this.formatter.receipt(result);
                    if (receipt.blockNumber == null) {
                        receipt.confirmations = 0;
                    } else if (receipt.confirmations == null) {
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
            },
            { oncePoll: this }
        );
    }

    override async getBalance(address: Address, blockTag?: BlockTag, tokenAddress?: Address) {
        const tag = this.formatter.blockTag(blockTag);
        if (tokenAddress == null || isETH(tokenAddress)) {
            // requesting ETH balance
            return await super.getBalance(address, tag);
        } else {
            try {
                let token = IERC20Factory.connect(tokenAddress, this);
                return await token.balanceOf(address, { blockTag: tag });
            } catch {
                return BigNumber.from(0);
            }
        }
    }

    async l2TokenAddress(token: Address) {
        if (token == ETH_ADDRESS) {
            return ETH_ADDRESS;
        } else {
            const erc20BridgeAddress = (await this.getDefaultBridgeAddresses()).erc20L2;
            const erc20Bridge = IL2BridgeFactory.connect(erc20BridgeAddress, this);
            return await erc20Bridge.l2TokenAddress(token);
        }
    }

    async l1TokenAddress(token: Address) {
        if (token == ETH_ADDRESS) {
            return ETH_ADDRESS;
        } else {
            const erc20BridgeAddress = (await this.getDefaultBridgeAddresses()).erc20L2;
            const erc20Bridge = IL2BridgeFactory.connect(erc20BridgeAddress, this);
            return await erc20Bridge.l1TokenAddress(token);
        }
    }

    // This function is used when formatting requests for
    // eth_call and eth_estimateGas. We override it here
    // because we have extra stuff to serialize (customData).
    // This function is for internal use only.
    static override hexlifyTransaction(
        transaction: ethers.providers.TransactionRequest,
        allowExtra?: Record<string, boolean>
    ) {
        const result = ethers.providers.JsonRpcProvider.hexlifyTransaction(transaction, {
            ...allowExtra,
            customData: true,
            from: true
        });
        if (transaction.customData == null) {
            return result;
        }
        result.eip712Meta = {
            feeToken: utils.hexlify(transaction.customData.feeToken ?? ETH_ADDRESS),
            ergsPerStorage: utils.hexValue(transaction.customData.ergsPerStorage ?? 0),
            ergsPerPubdata: utils.hexValue(transaction.customData.ergsPerPubdata ?? 0)
        } as any;
        if (transaction.customData.factoryDeps) {
            // @ts-ignore
            result.eip712Meta.factoryDeps = transaction.customData.factoryDeps.map((dep: ethers.BytesLike) =>
                // TODO: we arraify instead of hexlifying because server expects Vec<u8>.
                // We should change deserealization there.
                Array.from(utils.arrayify(dep))
            );
        }
        return result;
    }

    override async estimateGas(transaction: utils.Deferrable<TransactionRequest>): Promise<BigNumber> {
        await this.getNetwork();
        const params = await utils.resolveProperties({
            transaction: this._getTransactionRequest(transaction)
        });
        if (transaction.customData != null) {
            // @ts-ignore
            params.transaction.customData = transaction.customData;
        }
        const result = await this.perform('estimateGas', params);
        try {
            return BigNumber.from(result);
        } catch (error) {
            throw new Error(`bad result from backend (estimateGas): ${result}`);
        }
    }

    override async getGasPrice(token?: Address): Promise<BigNumber> {
        const params = token ? [token] : [];
        const price = await this.send('eth_gasPrice', params);
        return BigNumber.from(price);
    }

    constructor(url?: ConnectionInfo | string, network?: ethers.providers.Networkish) {
        super(url, network);
        this.pollingInterval = 500;

        const blockTag = this.formatter.blockTag.bind(this.formatter);
        this.formatter.blockTag = (tag: any) => {
            if (tag == 'committed' || tag == 'finalized') {
                return tag;
            }
            return blockTag(tag);
        };
        this.contractAddresses = {};
        this.formatter.transaction = parseTransaction;
    }

    async getMessageProof(
        blockNumber: ethers.BigNumberish,
        sender: Address,
        messageHash: BytesLike,
        logIndex?: number
    ): Promise<MessageProof | null> {
        return await this.send('zks_getL2ToL1MsgProof', [
            BigNumber.from(blockNumber).toNumber(),
            sender,
            ethers.utils.hexlify(messageHash),
            logIndex
        ]);
    }

    async getMainContractAddress(): Promise<Address> {
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

    async getConfirmedTokens(start: number = 0, limit: number = 255): Promise<Token[]> {
        const tokens: Token[] = await this.send('zks_getConfirmedTokens', [start, limit]);
        return tokens.map((token) => ({ address: token.l2Address, ...token }));
    }

    async isTokenLiquid(token: Address): Promise<boolean> {
        return await this.send('zks_isTokenLiquid', [token]);
    }

    async getTokenPrice(token: Address): Promise<string | null> {
        return await this.send('zks_getTokenPrice', [token]);
    }

    async getAllAccountBalances(address: Address): Promise<BalancesMap> {
        let balances = await this.send('zks_getAllAccountBalances', [address]);
        for (let token in balances) {
            balances[token] = BigNumber.from(balances[token]);
        }
        return balances;
    }

    async getWithdrawTx(transaction: {
        token: Address;
        amount: BigNumberish;
        from?: Address;
        to?: Address;
        bridgeAddress?: Address;
        overrides?: ethers.CallOverrides;
    }): Promise<ethers.providers.TransactionRequest> {
        const { ...tx } = transaction;

        if (tx.to == null && tx.from == null) {
            throw new Error('withdrawal target address is undefined');
        }

        tx.to ??= tx.from;
        tx.overrides ??= {};
        tx.overrides.from ??= tx.from;

        if (tx.bridgeAddress == null) {
            const bridges = await this.getDefaultBridgeAddresses();
            tx.bridgeAddress = isETH(tx.token) ? bridges.ethL2 : bridges.erc20L2;
        }

        const bridge = IL2BridgeFactory.connect(tx.bridgeAddress!, this);
        return bridge.populateTransaction.withdraw(tx.to, tx.token, tx.amount, tx.overrides);
    }

    async estimateGasWithdraw(transaction: {
        token: Address;
        amount: BigNumberish;
        from?: Address;
        to?: Address;
        bridgeAddress?: Address;
        overrides?: ethers.CallOverrides;
    }): Promise<BigNumber> {
        const withdrawTx = await this.getWithdrawTx(transaction);
        return await this.estimateGas(withdrawTx);
    }

    async getTransferTx(transaction: {
        to: Address;
        amount: BigNumberish;
        from?: Address;
        token?: Address;
        overrides?: ethers.CallOverrides;
    }): Promise<ethers.providers.TransactionRequest> {
        const { ...tx } = transaction;
        tx.overrides ??= {};
        tx.overrides.from ??= tx.from;

        if (tx.token == null || tx.token == ETH_ADDRESS) {
            return {
                ...(await ethers.utils.resolveProperties(tx.overrides)),
                to: tx.to,
                value: tx.amount
            };
        } else {
            const token = IERC20Factory.connect(tx.token, this);
            return await token.populateTransaction.transfer(tx.to, tx.amount, tx.overrides);
        }
    }

    async estimateGasTransfer(transaction: {
        to: Address;
        amount: BigNumberish;
        from?: Address;
        token?: Address;
        overrides?: ethers.CallOverrides;
    }): Promise<BigNumber> {
        const transferTx = await this.getTransferTx(transaction);
        return await this.estimateGas(transferTx);
    }

    static getDefaultProvider() {
        // TODO: different urls for different networks
        return new Provider(process.env.ZKSYNC_WEB3_API_URL || 'http://localhost:3050');
    }

    async newFilter(filter: EventFilter | Promise<EventFilter>): Promise<BigNumber> {
        filter = await filter;
        const id = await this.send('eth_newFilter', [this._prepareFilter(filter)]);
        return BigNumber.from(id);
    }

    async newBlockFilter(): Promise<BigNumber> {
        const id = await this.send('eth_newBlockFilter', []);
        return BigNumber.from(id);
    }

    async newPendingTransactionsFilter(): Promise<BigNumber> {
        const id = await this.send('eth_newPendingTransactionFilter', []);
        return BigNumber.from(id);
    }

    async getFilterChanges(idx: BigNumber): Promise<Array<Log | string>> {
        const logs = await this.send('eth_getFilterChanges', [idx.toHexString()]);
        return typeof logs[0] === 'string' ? logs : this._parseLogs(logs);
    }

    override async getLogs(filter: EventFilter | Promise<EventFilter> = {}): Promise<Array<Log>> {
        filter = await filter;
        const logs = await this.send('eth_getLogs', [this._prepareFilter(filter)]);
        return this._parseLogs(logs);
    }

    protected _parseLogs(logs: any[]): Array<Log> {
        return Formatter.arrayOf(this.formatter.filterLog.bind(this.formatter))(logs);
    }

    protected _prepareFilter(filter: EventFilter) {
        return {
            ...filter,
            fromBlock: filter.fromBlock == null ? null : this.formatter.blockTag(filter.fromBlock),
            toBlock: filter.fromBlock == null ? null : this.formatter.blockTag(filter.toBlock)
        };
    }

    override _wrapTransaction(tx: ethers.Transaction, hash?: string): TransactionResponse {
        const response = super._wrapTransaction(tx, hash) as TransactionResponse;

        response.waitFinalize = async () => {
            const receipt = await response.wait();
            while (true) {
                const block = await this.getBlock('finalized');
                if (receipt.blockNumber <= block.number) {
                    return receipt;
                } else {
                    await sleep(this.pollingInterval);
                }
            }
        };

        return response;
    }

    // This is inefficient. Status should probably be indicated in the transaction receipt.
    async getTransactionStatus(txHash: string) {
        const tx = await this.getTransaction(txHash);
        if (tx == null) {
            return TransactionStatus.NotFound;
        }
        if (tx.blockNumber == null) {
            return TransactionStatus.Processing;
        }
        const verifiedBlock = await this.getBlock('finalized');
        if (tx.blockNumber <= verifiedBlock.number) {
            return TransactionStatus.Finalized;
        }
        return TransactionStatus.Committed;
    }

    override async getTransaction(hash: string | Promise<string>): Promise<TransactionResponse> {
        hash = await hash;
        const tx = await super.getTransaction(hash);
        return tx ? this._wrapTransaction(tx, hash) : null;
    }

    override async sendTransaction(transaction: string | Promise<string>): Promise<TransactionResponse> {
        return (await super.sendTransaction(transaction)) as TransactionResponse;
    }

    async getL2TransactionFromPriorityOp(
        l1TxResponse: ethers.providers.TransactionResponse
    ): Promise<TransactionResponse> {
        const receipt = await l1TxResponse.wait();
        const l2Hash = getL2HashFromPriorityOp(receipt, await this.getMainContractAddress());

        let status = null;
        do {
            status = await this.getTransactionStatus(l2Hash);
            await sleep(this.pollingInterval);
        } while (status == TransactionStatus.NotFound);

        return await this.getTransaction(l2Hash);
    }

    async getPriorityOpResponse(l1TxResponse: ethers.providers.TransactionResponse): Promise<PriorityOpResponse> {
        const l2Response = { ...l1TxResponse } as PriorityOpResponse;

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

export class Web3Provider extends Provider {
    readonly provider: ExternalProvider;

    constructor(provider: ExternalProvider, network?: ethers.providers.Networkish) {
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

    override async send(method: string, params?: Array<any>): Promise<any> {
        params ??= [];
        // Metamask complains about eth_sign (and on some versions hangs)
        if (method == 'eth_sign' && (this.provider.isMetaMask || this.provider.isStatus)) {
            // https://github.com/ethereum/go-ethereum/wiki/Management-APIs#personal_sign
            method = 'personal_sign';
            params = [params[1], params[0]];
        }
        return await this.provider.request({ method, params });
    }

    override getSigner(addressOrIndex?: number | string): Signer {
        return Signer.from(super.getSigner(addressOrIndex) as any);
    }

    override async estimateGas(transaction: ethers.utils.Deferrable<TransactionRequest>) {
        const gas: BigNumber = await super.estimateGas(transaction);
        const metamaskMinimum = BigNumber.from(21000);
        const isEIP712 = transaction.customData != null || transaction.type == EIP712_TX_TYPE;
        return gas.gt(metamaskMinimum) || isEIP712 ? gas : metamaskMinimum;
    }
}
