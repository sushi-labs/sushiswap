import { AddressString, HexString, ProviderType } from "../types";
import { Web3Method } from "./Web3Method";
interface BaseWeb3Response<Result> {
    method: Web3Method;
    errorMessage?: string | null;
    result?: Result;
}
export interface ErrorResponse extends BaseWeb3Response<void> {
    errorCode?: number;
    errorMessage: string;
}
export declare function ErrorResponse(method: Web3Method, errorMessage: string, errorCode?: number): ErrorResponse;
export declare type RequestEthereumAccountsResponse = BaseWeb3Response<AddressString[]>;
export declare type AddEthereumChainResponse = BaseWeb3Response<AddResponse>;
export declare type WatchAssetResponse = BaseWeb3Response<boolean>;
export declare type SelectProviderResponse = BaseWeb3Response<ProviderType>;
export declare type AddResponse = {
    isApproved: boolean;
    rpcUrl: string;
};
export declare function AddEthereumChainResponse(addResponse: AddResponse): SwitchEthereumChainResponse;
export declare type SwitchEthereumChainResponse = BaseWeb3Response<SwitchResponse>;
export declare type SwitchResponse = {
    isApproved: boolean;
    rpcUrl: string;
};
export declare function SwitchEthereumChainResponse(switchResponse: SwitchResponse): SwitchEthereumChainResponse;
export declare function RequestEthereumAccountsResponse(addresses: AddressString[]): RequestEthereumAccountsResponse;
export declare function WatchAssetReponse(success: boolean): WatchAssetResponse;
export declare function SelectProviderResponse(selectedProviderKey: ProviderType): SelectProviderResponse;
export declare function isRequestEthereumAccountsResponse(res: any): res is RequestEthereumAccountsResponse;
export declare function SignEthereumMessageResponse(signature: HexString): SignEthereumMessageResponse;
export declare type SignEthereumMessageResponse = BaseWeb3Response<HexString>;
export declare function SignEthereumTransactionResponse(signedData: HexString): SignEthereumTransactionResponse;
export declare type SignEthereumTransactionResponse = BaseWeb3Response<HexString>;
export declare function SubmitEthereumTransactionResponse(txHash: HexString): SubmitEthereumTransactionResponse;
export declare type SubmitEthereumTransactionResponse = BaseWeb3Response<HexString>;
export declare function EthereumAddressFromSignedMessageResponse(address: AddressString): EthereumAddressFromSignedMessageResponse;
export declare type EthereumAddressFromSignedMessageResponse = BaseWeb3Response<AddressString>;
export declare type ScanQRCodeResponse = BaseWeb3Response<string>;
export declare type GenericResponse = BaseWeb3Response<string>;
export declare type MakeEthereumJSONRPCResponse = BaseWeb3Response<unknown>;
export declare type Web3Response = ErrorResponse | RequestEthereumAccountsResponse | SignEthereumMessageResponse | SignEthereumTransactionResponse | SubmitEthereumTransactionResponse | EthereumAddressFromSignedMessageResponse | ScanQRCodeResponse | GenericResponse | AddEthereumChainResponse | SwitchEthereumChainResponse | MakeEthereumJSONRPCResponse;
export {};
