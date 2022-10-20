import { EthereumRpcError, EthereumProviderError } from './classes';
interface EthereumErrorOptions<T> {
    message?: string;
    data?: T;
}
interface ServerErrorOptions<T> extends EthereumErrorOptions<T> {
    code: number;
}
declare type CustomErrorOptions<T> = ServerErrorOptions<T>;
declare type EthErrorsArg<T> = EthereumErrorOptions<T> | string;
export declare const ethErrors: {
    rpc: {
        /**
         * Get a JSON RPC 2.0 Parse (-32700) error.
         */
        parse: <T>(arg: EthErrorsArg<T>) => EthereumRpcError<T>;
        /**
         * Get a JSON RPC 2.0 Invalid Request (-32600) error.
         */
        invalidRequest: <T_1>(arg: EthErrorsArg<T_1>) => EthereumRpcError<T_1>;
        /**
         * Get a JSON RPC 2.0 Invalid Params (-32602) error.
         */
        invalidParams: <T_2>(arg: EthErrorsArg<T_2>) => EthereumRpcError<T_2>;
        /**
         * Get a JSON RPC 2.0 Method Not Found (-32601) error.
         */
        methodNotFound: <T_3>(arg: EthErrorsArg<T_3>) => EthereumRpcError<T_3>;
        /**
         * Get a JSON RPC 2.0 Internal (-32603) error.
         */
        internal: <T_4>(arg: EthErrorsArg<T_4>) => EthereumRpcError<T_4>;
        /**
         * Get a JSON RPC 2.0 Server error.
         * Permits integer error codes in the [ -32099 <= -32005 ] range.
         * Codes -32000 through -32004 are reserved by EIP-1474.
         */
        server: <T_5>(opts: ServerErrorOptions<T_5>) => EthereumRpcError<T_5>;
        /**
         * Get an Ethereum JSON RPC Invalid Input (-32000) error.
         */
        invalidInput: <T_6>(arg: EthErrorsArg<T_6>) => EthereumRpcError<T_6>;
        /**
         * Get an Ethereum JSON RPC Resource Not Found (-32001) error.
         */
        resourceNotFound: <T_7>(arg: EthErrorsArg<T_7>) => EthereumRpcError<T_7>;
        /**
         * Get an Ethereum JSON RPC Resource Unavailable (-32002) error.
         */
        resourceUnavailable: <T_8>(arg: EthErrorsArg<T_8>) => EthereumRpcError<T_8>;
        /**
         * Get an Ethereum JSON RPC Transaction Rejected (-32003) error.
         */
        transactionRejected: <T_9>(arg: EthErrorsArg<T_9>) => EthereumRpcError<T_9>;
        /**
         * Get an Ethereum JSON RPC Method Not Supported (-32004) error.
         */
        methodNotSupported: <T_10>(arg: EthErrorsArg<T_10>) => EthereumRpcError<T_10>;
        /**
         * Get an Ethereum JSON RPC Limit Exceeded (-32005) error.
         */
        limitExceeded: <T_11>(arg: EthErrorsArg<T_11>) => EthereumRpcError<T_11>;
    };
    provider: {
        /**
         * Get an Ethereum Provider User Rejected Request (4001) error.
         */
        userRejectedRequest: <T_12>(arg: EthErrorsArg<T_12>) => EthereumProviderError<T_12>;
        /**
         * Get an Ethereum Provider Unauthorized (4100) error.
         */
        unauthorized: <T_13>(arg: EthErrorsArg<T_13>) => EthereumProviderError<T_13>;
        /**
         * Get an Ethereum Provider Unsupported Method (4200) error.
         */
        unsupportedMethod: <T_14>(arg: EthErrorsArg<T_14>) => EthereumProviderError<T_14>;
        /**
         * Get an Ethereum Provider Not Connected (4900) error.
         */
        disconnected: <T_15>(arg: EthErrorsArg<T_15>) => EthereumProviderError<T_15>;
        /**
         * Get an Ethereum Provider Chain Not Connected (4901) error.
         */
        chainDisconnected: <T_16>(arg: EthErrorsArg<T_16>) => EthereumProviderError<T_16>;
        /**
         * Get a custom Ethereum Provider error.
         */
        custom: <T_17>(opts: CustomErrorOptions<T_17>) => EthereumProviderError<T_17>;
    };
};
export {};
