import { EIP712Signer } from './signer';
import { Provider } from './provider';
import { ethers, utils } from 'ethers';
import { BlockTag, TransactionResponse, TransactionRequest } from './types';
import { ProgressCallback } from '@ethersproject/json-wallets';
declare const Wallet_base: {
    new (...args: any[]): {
        _providerL2(): Provider;
        _signerL2(): ethers.Signer;
        getBalance(token?: string, blockTag?: BlockTag): Promise<ethers.BigNumber>;
        getAllBalances(): Promise<import("./types").BalancesMap>;
        getL2BridgeContracts(): Promise<{
            eth: import("../typechain").IL2Bridge;
            erc20: import("../typechain").IL2Bridge;
        }>;
        _fillCustomData(data: import("./types").Eip712Meta): import("./types").Eip712Meta;
        withdraw(transaction: {
            token: string;
            amount: ethers.BigNumberish;
            to?: string;
            bridgeAddress?: string;
            overrides?: ethers.Overrides;
        }): Promise<TransactionResponse>;
        transfer(transaction: {
            to: string;
            amount: ethers.BigNumberish;
            token?: string;
            overrides?: ethers.Overrides;
        }): Promise<TransactionResponse>;
        sendTransaction(tx: ethers.providers.TransactionRequest): Promise<ethers.providers.TransactionResponse>;
        getAddress(): Promise<string>;
    };
} & {
    new (...args: any[]): {
        _providerL2(): Provider;
        _providerL1(): ethers.providers.Provider;
        _signerL1(): ethers.Signer;
        getMainContract(): Promise<import("../typechain").IZkSync>;
        getL1BridgeContracts(): Promise<{
            eth: import("../typechain").IL1Bridge;
            erc20: import("../typechain").IL1Bridge;
        }>;
        getBalanceL1(token?: string, blockTag?: ethers.providers.BlockTag): Promise<ethers.BigNumber>;
        l2TokenAddress(token: string): Promise<string>;
        approveERC20(token: string, amount: ethers.BigNumberish, overrides?: ethers.Overrides & {
            bridgeAddress?: string;
        }): Promise<ethers.providers.TransactionResponse>;
        getBaseCost(params: {
            ergsLimit: ethers.BigNumberish;
            calldataLength: ethers.BigNumberish;
            gasPrice?: ethers.BigNumberish;
            queueType?: import("./types").PriorityQueueType;
        }): Promise<ethers.BigNumber>;
        deposit(transaction: {
            token: string;
            amount: ethers.BigNumberish;
            to?: string;
            queueType?: import("./types").PriorityQueueType;
            operatorTip?: ethers.BigNumberish;
            bridgeAddress?: string;
            approveERC20?: boolean;
            overrides?: ethers.PayableOverrides;
            approveOverrides?: ethers.Overrides;
        }): Promise<import("./types").PriorityOpResponse>;
        finalizeWithdrawal(withdrawalHash: ethers.utils.BytesLike, index?: number): Promise<ethers.ContractTransaction>;
        requestExecute(transaction: {
            contractAddress: string;
            calldata: ethers.utils.BytesLike;
            ergsLimit: ethers.BigNumberish;
            factoryDeps?: ethers.utils.BytesLike[];
            queueType?: import("./types").PriorityQueueType;
            operatorTip?: ethers.BigNumberish;
            overrides?: ethers.PayableOverrides;
        }): Promise<import("./types").PriorityOpResponse>;
        sendTransaction(tx: ethers.providers.TransactionRequest): Promise<ethers.providers.TransactionResponse>;
        getAddress(): Promise<string>;
    };
} & typeof ethers.Wallet;
export declare class Wallet extends Wallet_base {
    readonly provider: Provider;
    providerL1?: ethers.providers.Provider;
    eip712: EIP712Signer;
    _providerL1(): ethers.providers.Provider;
    _providerL2(): Provider;
    _signerL1(): ethers.Wallet;
    _signerL2(): this;
    ethWallet(): ethers.Wallet;
    getNonce(blockTag?: BlockTag): Promise<number>;
    connect(provider: Provider): Wallet;
    connectToL1(provider: ethers.providers.Provider): Wallet;
    static fromMnemonic(mnemonic: string, path?: string, wordlist?: ethers.Wordlist): Wallet;
    static fromEncryptedJson(json: string, password?: string | ethers.Bytes, callback?: ProgressCallback): Promise<Wallet>;
    static fromEncryptedJsonSync(json: string, password?: string | ethers.Bytes): Wallet;
    static createRandom(options?: any): Wallet;
    constructor(privateKey: ethers.BytesLike | utils.SigningKey, providerL2?: Provider, providerL1?: ethers.providers.Provider);
    populateTransaction(transaction: TransactionRequest): Promise<TransactionRequest>;
    signTransaction(transaction: TransactionRequest): Promise<string>;
    sendTransaction(transaction: ethers.providers.TransactionRequest): Promise<TransactionResponse>;
}
export {};
