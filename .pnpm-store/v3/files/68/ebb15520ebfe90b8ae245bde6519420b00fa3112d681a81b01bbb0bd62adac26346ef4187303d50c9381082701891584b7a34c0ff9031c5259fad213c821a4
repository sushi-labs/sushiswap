import { ethers } from 'ethers';
import { Provider } from './provider';
import { BlockTag, TransactionResponse, Signature, TransactionRequest } from './types';
import { TypedDataSigner } from '@ethersproject/abstract-signer';
export declare const eip712Types: {
    Transaction: {
        name: string;
        type: string;
    }[];
};
export declare class EIP712Signer {
    private ethSigner;
    private eip712Domain;
    constructor(ethSigner: ethers.Signer & TypedDataSigner, chainId: number | Promise<number>);
    static getSignInput(transaction: TransactionRequest): {
        txType: number;
        to: string;
        feeToken: string;
        ergsLimit: ethers.BigNumberish;
        ergsPerPubdataByteLimit: ethers.BigNumberish;
        ergsPrice: ethers.BigNumberish;
        nonce: ethers.BigNumberish;
        value: ethers.BigNumberish;
        data: ethers.utils.BytesLike;
    };
    sign(transaction: TransactionRequest): Promise<Signature>;
    static getSignedDigest(transaction: TransactionRequest): ethers.BytesLike;
}
declare const Signer_base: {
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
} & typeof ethers.providers.JsonRpcSigner;
export declare class Signer extends Signer_base {
    provider: Provider;
    eip712: EIP712Signer;
    _signerL2(): this;
    _providerL2(): Provider;
    static from(signer: ethers.providers.JsonRpcSigner & {
        provider: Provider;
    }): Signer;
    getNonce(blockTag?: BlockTag): Promise<number>;
    sendTransaction(transaction: TransactionRequest): Promise<TransactionResponse>;
}
declare const L1Signer_base: {
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
} & typeof ethers.providers.JsonRpcSigner;
export declare class L1Signer extends L1Signer_base {
    providerL2: Provider;
    _providerL2(): Provider;
    _providerL1(): ethers.providers.JsonRpcProvider;
    _signerL1(): this;
    static from(signer: ethers.providers.JsonRpcSigner, zksyncProvider: Provider): L1Signer;
    connectToL2(provider: Provider): this;
}
export {};
