import { Session } from "../relay/Session";
import { CancelablePromise, WalletSDKRelayAbstract } from "../relay/WalletSDKRelayAbstract";
import { AddEthereumChainResponse, EthereumAddressFromSignedMessageResponse, GenericResponse, RequestEthereumAccountsResponse, ScanQRCodeResponse, SelectProviderResponse, SignEthereumMessageResponse, SignEthereumTransactionResponse, SubmitEthereumTransactionResponse, SwitchEthereumChainResponse, WatchAssetResponse, Web3Response } from "../relay/Web3Response";
export declare class MockRelayClass extends WalletSDKRelayAbstract {
    constructor();
    resetAndReload(): void;
    requestEthereumAccounts(): CancelablePromise<RequestEthereumAccountsResponse>;
    addEthereumChain(): CancelablePromise<AddEthereumChainResponse>;
    watchAsset(): CancelablePromise<WatchAssetResponse>;
    selectProvider(): CancelablePromise<SelectProviderResponse>;
    switchEthereumChain(): CancelablePromise<SwitchEthereumChainResponse>;
    signEthereumMessage(): CancelablePromise<SignEthereumMessageResponse>;
    ethereumAddressFromSignedMessage(): CancelablePromise<EthereumAddressFromSignedMessageResponse>;
    signEthereumTransaction(): CancelablePromise<SignEthereumTransactionResponse>;
    signAndSubmitEthereumTransaction(): CancelablePromise<SubmitEthereumTransactionResponse>;
    submitEthereumTransaction(): CancelablePromise<SubmitEthereumTransactionResponse>;
    scanQRCode(): CancelablePromise<ScanQRCodeResponse>;
    genericRequest(): CancelablePromise<GenericResponse>;
    sendRequest<_, U extends Web3Response>(): CancelablePromise<U>;
    setAppInfo(): void;
    inlineAddEthereumChain(): boolean;
    setAccountsCallback(): void;
    setChainCallback(): void;
    get session(): Session;
}
