/// <reference types="node" />
import { JSONRPCRequest, JSONRPCResponse } from "../provider/JSONRPC";
import { AddressString, IntNumber, ProviderType, RegExpString } from "../types";
import { EthereumTransactionParams } from "./EthereumTransactionParams";
import { Session } from "./Session";
import { Web3Request } from "./Web3Request";
import { AddEthereumChainResponse, EthereumAddressFromSignedMessageResponse, GenericResponse, RequestEthereumAccountsResponse, ScanQRCodeResponse, SelectProviderResponse, SignEthereumMessageResponse, SignEthereumTransactionResponse, SubmitEthereumTransactionResponse, SwitchEthereumChainResponse, WatchAssetResponse, Web3Response } from "./Web3Response";
export declare const WALLET_USER_NAME_KEY = "walletUsername";
export declare const LOCAL_STORAGE_ADDRESSES_KEY = "Addresses";
export declare const APP_VERSION_KEY = "AppVersion";
export declare type CancelablePromise<T> = {
    promise: Promise<T>;
    cancel: (error?: Error) => void;
};
export declare abstract class WalletSDKRelayAbstract {
    abstract resetAndReload(): void;
    abstract requestEthereumAccounts(): CancelablePromise<RequestEthereumAccountsResponse>;
    abstract addEthereumChain(chainId: string, rpcUrls: string[], iconUrls: string[], blockExplorerUrls: string[], chainName: string, nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    }): CancelablePromise<AddEthereumChainResponse>;
    abstract watchAsset(type: string, address: string, symbol?: string, decimals?: number, image?: string, chainId?: string): CancelablePromise<WatchAssetResponse>;
    abstract selectProvider(providerOptions: ProviderType[]): CancelablePromise<SelectProviderResponse>;
    abstract switchEthereumChain(chainId: string): CancelablePromise<SwitchEthereumChainResponse>;
    abstract signEthereumMessage(message: Buffer, address: AddressString, addPrefix: boolean, typedDataJson?: string | null): CancelablePromise<SignEthereumMessageResponse>;
    abstract ethereumAddressFromSignedMessage(message: Buffer, signature: Buffer, addPrefix: boolean): CancelablePromise<EthereumAddressFromSignedMessageResponse>;
    abstract signEthereumTransaction(params: EthereumTransactionParams): CancelablePromise<SignEthereumTransactionResponse>;
    abstract signAndSubmitEthereumTransaction(params: EthereumTransactionParams): CancelablePromise<SubmitEthereumTransactionResponse>;
    abstract submitEthereumTransaction(signedTransaction: Buffer, chainId: IntNumber): CancelablePromise<SubmitEthereumTransactionResponse>;
    abstract scanQRCode(regExp: RegExpString): CancelablePromise<ScanQRCodeResponse>;
    abstract genericRequest(data: object, action: string): CancelablePromise<GenericResponse>;
    abstract sendRequest<T extends Web3Request, U extends Web3Response>(request: T): CancelablePromise<U>;
    abstract setAppInfo(appName: string, appLogoUrl: string | null): void;
    abstract setAccountsCallback(accountsCallback: (accounts: string[], isDisconnect?: boolean) => void): void;
    abstract setChainCallback(chainIdCallback: (chainId: string, jsonRpcUrl: string) => void): void;
    /**
     * Whether the relay supports the add ethereum chain call without
     * needing to be connected to the mobile client.
     */
    abstract inlineAddEthereumChain(chainId: string): boolean;
    makeEthereumJSONRPCRequest(request: JSONRPCRequest, jsonRpcUrl: string): Promise<JSONRPCResponse | void>;
    abstract get session(): Session;
}
