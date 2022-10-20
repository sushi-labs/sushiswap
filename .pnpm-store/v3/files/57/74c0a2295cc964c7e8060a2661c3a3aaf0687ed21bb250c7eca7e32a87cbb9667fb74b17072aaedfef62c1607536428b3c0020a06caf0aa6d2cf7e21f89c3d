import { BigNumber, BigNumberish, ethers, BytesLike } from 'ethers';
import { Provider } from './provider';
import { Address, PriorityOpResponse, BlockTag, Eip712Meta, PriorityQueueType, TransactionResponse, BalancesMap } from './types';
declare type Constructor<T = {}> = new (...args: any[]) => T;
interface TxSender {
    sendTransaction(tx: ethers.providers.TransactionRequest): Promise<ethers.providers.TransactionResponse>;
    getAddress(): Promise<Address>;
}
export declare function AdapterL1<TBase extends Constructor<TxSender>>(Base: TBase): {
    new (...args: any[]): {
        _providerL2(): Provider;
        _providerL1(): ethers.providers.Provider;
        _signerL1(): ethers.Signer;
        getMainContract(): Promise<import("../typechain").IZkSync>;
        getL1BridgeContracts(): Promise<{
            eth: import("../typechain").IL1Bridge;
            erc20: import("../typechain").IL1Bridge;
        }>;
        getBalanceL1(token?: Address, blockTag?: ethers.providers.BlockTag): Promise<BigNumber>;
        l2TokenAddress(token: Address): Promise<string>;
        approveERC20(token: Address, amount: BigNumberish, overrides?: ethers.Overrides & {
            bridgeAddress?: Address;
        }): Promise<ethers.providers.TransactionResponse>;
        getBaseCost(params: {
            ergsLimit: BigNumberish;
            calldataLength: BigNumberish;
            gasPrice?: BigNumberish;
            queueType?: PriorityQueueType;
        }): Promise<BigNumber>;
        deposit(transaction: {
            token: Address;
            amount: BigNumberish;
            to?: Address;
            queueType?: PriorityQueueType;
            operatorTip?: BigNumberish;
            bridgeAddress?: Address;
            approveERC20?: boolean;
            overrides?: ethers.PayableOverrides;
            approveOverrides?: ethers.Overrides;
        }): Promise<PriorityOpResponse>;
        finalizeWithdrawal(withdrawalHash: BytesLike, index?: number): Promise<ethers.ContractTransaction>;
        requestExecute(transaction: {
            contractAddress: Address;
            calldata: BytesLike;
            ergsLimit: BigNumberish;
            factoryDeps?: ethers.BytesLike[];
            queueType?: PriorityQueueType;
            operatorTip?: BigNumberish;
            overrides?: ethers.PayableOverrides;
        }): Promise<PriorityOpResponse>;
        sendTransaction(tx: ethers.providers.TransactionRequest): Promise<ethers.providers.TransactionResponse>;
        getAddress(): Promise<string>;
    };
} & TBase;
export declare function AdapterL2<TBase extends Constructor<TxSender>>(Base: TBase): {
    new (...args: any[]): {
        _providerL2(): Provider;
        _signerL2(): ethers.Signer;
        getBalance(token?: Address, blockTag?: BlockTag): Promise<BigNumber>;
        getAllBalances(): Promise<BalancesMap>;
        getL2BridgeContracts(): Promise<{
            eth: import("../typechain").IL2Bridge;
            erc20: import("../typechain").IL2Bridge;
        }>;
        _fillCustomData(data: Eip712Meta): Eip712Meta;
        withdraw(transaction: {
            token: Address;
            amount: BigNumberish;
            to?: Address;
            bridgeAddress?: Address;
            overrides?: ethers.Overrides;
        }): Promise<TransactionResponse>;
        transfer(transaction: {
            to: Address;
            amount: BigNumberish;
            token?: Address;
            overrides?: ethers.Overrides;
        }): Promise<TransactionResponse>;
        sendTransaction(tx: ethers.providers.TransactionRequest): Promise<ethers.providers.TransactionResponse>;
        getAddress(): Promise<string>;
    };
} & TBase;
export {};
