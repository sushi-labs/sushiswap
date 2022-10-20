import { ChainInfo as _ChainInfo } from '@gnosis.pm/safe-react-gateway-sdk';
import { BigNumberish, BytesLike } from 'ethers';
export declare type ChainInfo = Pick<_ChainInfo, 'chainName' | 'chainId' | 'shortName' | 'nativeCurrency' | 'blockExplorerUriTemplate'>;
export { NativeCurrency } from '@gnosis.pm/safe-react-gateway-sdk';
export declare type BaseTransaction = {
    to: string;
    value: string;
    data: string;
};
export declare type GetTxBySafeTxHashParams = {
    safeTxHash: string;
};
export interface SendTransactionRequestParams {
    safeTxGas?: number;
}
export interface SendTransactionsParams {
    txs: BaseTransaction[];
    params?: SendTransactionRequestParams;
}
export declare type GetBalanceParams = {
    currency?: string;
};
export declare type SignMessageParams = {
    message: string;
};
export interface TypedDataDomain {
    name?: string;
    version?: string;
    chainId?: BigNumberish;
    verifyingContract?: string;
    salt?: BytesLike;
}
export interface TypedDataTypes {
    name: string;
    type: string;
}
export declare type TypedMessageTypes = {
    [key: string]: TypedDataTypes[];
};
export declare type EIP712TypedData = {
    domain: TypedDataDomain;
    types: TypedMessageTypes;
    message: Record<string, any>;
};
export declare type SignTypedMessageParams = {
    typedData: EIP712TypedData;
};
export declare type SendTransactionsResponse = {
    safeTxHash: string;
};
export declare type SafeInfo = {
    safeAddress: string;
    chainId: number;
    threshold: number;
    owners: string[];
    isReadOnly: boolean;
};
export declare type EnvironmentInfo = {
    origin: string;
};
export declare type PostMessageOptions = {
    transfer?: any[];
};
export declare type AddressBookItem = {
    address: string;
    chainId: string;
    name: string;
};
export declare const isObjectEIP712TypedData: (obj?: unknown) => obj is EIP712TypedData;
