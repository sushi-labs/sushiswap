import { Connector } from './connectors';
import { Chain } from './types';
/**
 * Error subclass implementing JSON RPC 2.0 errors and Ethereum RPC errors per EIP-1474.
 * @see https://eips.ethereum.org/EIPS/eip-1474
 */
export declare class RpcError<T = undefined> extends Error {
    readonly code: number;
    readonly data?: T;
    readonly internal?: unknown;
    constructor(
    /** Number error code */
    code: number, 
    /** Human-readable string */
    message: string, 
    /** Low-level error */
    internal?: unknown, 
    /** Other useful information about error */
    data?: T);
}
/**
 * Error subclass implementing Ethereum Provider errors per EIP-1193.
 * @see https://eips.ethereum.org/EIPS/eip-1193
 */
export declare class ProviderRpcError<T = undefined> extends RpcError<T> {
    /**
     * Create an Ethereum Provider JSON-RPC error.
     * `code` must be an integer in the 1000 <= 4999 range.
     */
    constructor(
    /**
     * Number error code
     * @see https://eips.ethereum.org/EIPS/eip-1193#error-standards
     */
    code: 4001 | 4100 | 4200 | 4900 | 4901 | 4902, 
    /** Human-readable string */
    message: string, 
    /** Low-level error */
    internal?: unknown, 
    /** Other useful information about error */
    data?: T);
}
export declare class AddChainError extends Error {
    name: string;
    message: string;
}
export declare class ChainDoesNotSupportMulticallError extends Error {
    name: string;
    constructor({ blockNumber, chain }: {
        blockNumber?: number;
        chain: Chain;
    });
}
export declare class ChainMismatchError extends Error {
    name: string;
    constructor({ activeChain, targetChain, }: {
        activeChain: string;
        targetChain: string;
    });
}
export declare class ChainNotConfiguredError extends Error {
    name: string;
    message: string;
}
export declare class ConnectorAlreadyConnectedError extends Error {
    name: string;
    message: string;
}
export declare class ConnectorNotFoundError extends Error {
    name: string;
    message: string;
}
export declare class ContractMethodDoesNotExistError extends Error {
    name: string;
    constructor({ addressOrName, chainId, functionName, }: {
        addressOrName: string;
        chainId?: number;
        functionName: string;
    });
}
export declare class ContractMethodNoResultError extends Error {
    name: string;
    constructor({ addressOrName, args, chainId, functionName, }: {
        addressOrName: string;
        args: any;
        chainId: number;
        functionName: string;
    });
}
export declare class ContractMethodRevertedError extends Error {
    name: string;
    constructor({ addressOrName, args, chainId, functionName, errorMessage, }: {
        addressOrName: string;
        args: any;
        chainId: number;
        functionName: string;
        errorMessage: string;
    });
}
export declare class ContractResultDecodeError extends Error {
    name: string;
    constructor({ addressOrName, args, chainId, functionName, errorMessage, }: {
        addressOrName: string;
        args: any;
        chainId: number;
        functionName: string;
        errorMessage: string;
    });
}
export declare class ProviderChainsNotFound extends Error {
    name: string;
    message: string;
}
export declare class ResourceUnavailableError extends RpcError {
    name: string;
    constructor(error: unknown);
}
export declare class SwitchChainError extends ProviderRpcError {
    name: string;
    constructor(error: unknown);
}
export declare class SwitchChainNotSupportedError extends Error {
    name: string;
    constructor({ connector }: {
        connector: Connector;
    });
}
export declare class UserRejectedRequestError extends ProviderRpcError {
    name: string;
    constructor(error: unknown);
}
