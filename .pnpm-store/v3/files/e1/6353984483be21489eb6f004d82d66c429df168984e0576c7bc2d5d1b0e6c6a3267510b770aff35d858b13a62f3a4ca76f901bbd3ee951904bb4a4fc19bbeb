import { AddressString, BigIntString, HexString, IntNumber, ProviderType, RegExpString } from "../types";
import { Web3Method } from "./Web3Method";
interface BaseWeb3Request<Method extends Web3Method, Params extends object = Record<string, unknown>> {
    method: Method;
    params: Params;
}
export declare type RequestEthereumAccountsRequest = BaseWeb3Request<Web3Method.requestEthereumAccounts, {
    appName: string;
    appLogoUrl: string | null;
}>;
export declare type AddEthereumChainRequest = BaseWeb3Request<Web3Method.addEthereumChain, {
    chainId: string;
    blockExplorerUrls?: string[];
    chainName?: string;
    iconUrls?: string[];
    rpcUrls: string[];
    nativeCurrency?: {
        name: string;
        symbol: string;
        decimals: number;
    };
}>;
export declare type SwitchEthereumChainRequest = BaseWeb3Request<Web3Method.switchEthereumChain, {
    chainId: string;
}>;
export declare type SignEthereumMessageRequest = BaseWeb3Request<Web3Method.signEthereumMessage, {
    message: HexString;
    address: AddressString;
    addPrefix: boolean;
    typedDataJson: string | null;
}>;
export declare type SignEthereumTransactionRequest = BaseWeb3Request<Web3Method.signEthereumTransaction, {
    fromAddress: AddressString;
    toAddress: AddressString | null;
    weiValue: BigIntString;
    data: HexString;
    nonce: IntNumber | null;
    gasPriceInWei: BigIntString | null;
    maxFeePerGas: BigIntString | null;
    maxPriorityFeePerGas: BigIntString | null;
    gasLimit: BigIntString | null;
    chainId: IntNumber;
    shouldSubmit: boolean;
}>;
export declare type SubmitEthereumTransactionRequest = BaseWeb3Request<Web3Method.submitEthereumTransaction, {
    signedTransaction: HexString;
    chainId: IntNumber;
}>;
export declare type EthereumAddressFromSignedMessageRequest = BaseWeb3Request<Web3Method.ethereumAddressFromSignedMessage, {
    message: HexString;
    signature: HexString;
    addPrefix: boolean;
}>;
export declare type ScanQRCodeRequest = BaseWeb3Request<Web3Method.scanQRCode, {
    regExp: RegExpString;
}>;
export declare type GenericRequest = BaseWeb3Request<Web3Method.generic, {
    action: string;
    data: object;
}>;
export declare type SelectProviderRequest = BaseWeb3Request<Web3Method.selectProvider, {
    providerOptions: ProviderType[];
}>;
export declare type MakeEthereumJSONRPCRequest = BaseWeb3Request<Web3Method.makeEthereumJSONRPCRequest, {
    rpcMethod: string;
    rpcParams: unknown[];
    chainId: string;
}>;
declare type WatchAssetRequestBaseParams = {
    type: string;
    options: {
        address: string;
        symbol?: string;
        decimals?: number;
        image?: string;
    };
};
export declare type WatchAssetRequest = BaseWeb3Request<Web3Method.watchAsset, WatchAssetRequestBaseParams & {
    chainId?: string;
}>;
export declare type Web3Request = RequestEthereumAccountsRequest | SignEthereumMessageRequest | SignEthereumTransactionRequest | SubmitEthereumTransactionRequest | EthereumAddressFromSignedMessageRequest | ScanQRCodeRequest | GenericRequest | AddEthereumChainRequest | SwitchEthereumChainRequest | MakeEthereumJSONRPCRequest | WatchAssetRequest | SelectProviderRequest;
export {};
