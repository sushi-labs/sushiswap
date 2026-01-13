import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

// Type alias for missing contract-specific type
export type SqrtPriceX96 = u256;

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  unknown: {
    networkPassphrase: "Public Global Stellar Network ; September 2015",
    contractId: "CD3YDAM5QV235R4PNPJB4J2STZRJGMSB6KR3R2VATKULSLHZNI5KWLPH",
  }
} as const

/**
 * Custom errors for the SwapRouter contract
 */
export const SwapRouterError = {
  /**
   * Router has already been initialized
   */
  1: {message:"AlreadyInitialized"},
  /**
   * Router has not been initialized
   */
  2: {message:"NotInitialized"},
  /**
   * Transaction deadline has passed
   */
  3: {message:"DeadlineExpired"},
  /**
   * Insufficient output amount
   */
  4: {message:"InsufficientOutputAmount"},
  /**
   * Excessive input amount
   */
  5: {message:"ExcessiveInputAmount"},
  /**
   * Invalid swap path
   */
  6: {message:"InvalidPath"},
  /**
   * Invalid token address
   */
  7: {message:"InvalidToken"},
  /**
   * Invalid fee tier
   */
  8: {message:"InvalidFee"},
  /**
   * Invalid amount (zero or negative)
   */
  9: {message:"InvalidAmount"},
  /**
   * Insufficient liquidity in pool
   */
  10: {message:"InsufficientLiquidity"},
  /**
   * Price limit exceeded
   */
  11: {message:"PriceLimitExceeded"},
  /**
   * Not authorized to perform this action
   */
  12: {message:"NotAuthorized"},
  /**
   * Token transfer failed
   */
  13: {message:"TransferFailed"},
  /**
   * Pool does not exist
   */
  14: {message:"PoolNotFound"},
  /**
   * Invalid recipient address
   */
  15: {message:"InvalidRecipient"},
  /**
   * Slippage tolerance exceeded
   */
  16: {message:"SlippageExceeded"},
  /**
   * Path too long (too many hops)
   */
  17: {message:"PathTooLong"},
  /**
   * Identical tokens in swap
   */
  18: {message:"IdenticalTokens"},
  /**
   * Insufficient balance
   */
  19: {message:"InsufficientBalance"},
  /**
   * Invalid sqrt price limit
   */
  20: {message:"InvalidSqrtPriceLimit"},
  /**
   * Invalid pool address
   */
  21: {message:"InvalidPool"},
  /**
   * Insufficient output from swap
   */
  22: {message:"InsufficientOutput"},
  /**
   * Excessive input required for swap
   */
  23: {message:"ExcessiveInputRequired"},
  /**
   * Operation not supported
   */
  24: {message:"NotSupported"},
  /**
   * Swap operation failed
   */
  25: {message:"SwapFailed"}
}




export interface QuoteResult {
  amount: i128;
  sqrt_price_x96_after: u256;
}


/**
 * Swap result from pool
 */
export interface SwapResult {
  amount0: i128;
  amount1: i128;
  liquidity: u128;
  sqrt_price_x96: u256;
  tick: i32;
}


/**
 * Oracle hints for deterministic footprint (must match pool's OracleHints)
 */
export interface OracleHints {
  checkpoint: u32;
  slot: u128;
}


/**
 * Parameters for single-hop exact input swap
 */
export interface ExactInputSingleParams {
  /**
 * The amount of input tokens to swap
 */
amount_in: i128;
  /**
 * The minimum amount of output tokens to receive
 */
amount_out_minimum: i128;
  /**
 * Unix timestamp after which the transaction will revert
 */
deadline: u64;
  /**
 * The fee tier of the pool
 */
fee: u32;
  /**
 * Address that will receive the output tokens
 */
recipient: string;
  /**
 * Address funding the swap
 */
sender: string;
  /**
 * The Q64.96 sqrt price limit
 */
sqrt_price_limit_x96: u128;
  /**
 * The token being swapped from
 */
token_in: string;
  /**
 * The token being swapped to
 */
token_out: string;
}


/**
 * Parameters for multi-hop exact input swap
 */
export interface ExactInputParams {
  /**
 * The amount of input tokens to swap
 */
amount_in: i128;
  /**
 * The minimum amount of output tokens to receive
 */
amount_out_minimum: i128;
  /**
 * Unix timestamp after which the transaction will revert
 */
deadline: u64;
  /**
 * Fee tier for each hop (length = path.len() - 1)
 */
fees: Array<u32>;
  /**
 * Ordered list of tokens for the swap path (length >= 2)
 */
path: Array<string>;
  /**
 * Address that will receive the output tokens
 */
recipient: string;
  /**
 * Address funding the swap
 */
sender: string;
}


/**
 * Parameters for single-hop exact output swap
 */
export interface ExactOutputSingleParams {
  /**
 * The maximum amount of input tokens to spend
 */
amount_in_maximum: i128;
  /**
 * The desired amount of output tokens
 */
amount_out: i128;
  /**
 * Unix timestamp after which the transaction will revert
 */
deadline: u64;
  /**
 * The fee tier of the pool
 */
fee: u32;
  /**
 * Address that will receive the output tokens
 */
recipient: string;
  /**
 * Address funding the swap
 */
sender: string;
  /**
 * The Q64.96 sqrt price limit
 */
sqrt_price_limit_x96: u128;
  /**
 * The token being swapped from
 */
token_in: string;
  /**
 * The token being swapped to
 */
token_out: string;
}


/**
 * Parameters for multi-hop exact output swap
 */
export interface ExactOutputParams {
  /**
 * The maximum amount of input tokens to spend
 */
amount_in_maximum: i128;
  /**
 * The desired amount of output tokens
 */
amount_out: i128;
  /**
 * Unix timestamp after which the transaction will revert
 */
deadline: u64;
  /**
 * Fee tier for each hop
 */
fees: Array<u32>;
  /**
 * The path of tokens for the swap (executed forward)
 */
path: Array<string>;
  /**
 * Address that will receive the output tokens
 */
recipient: string;
  /**
 * Address funding the swap
 */
sender: string;
}


/**
 * Represents a single pool in a swap path
 */
export interface PoolKey {
  /**
 * Fee tier
 */
fee: u32;
  /**
 * First token address (sorted)
 */
token0: string;
  /**
 * Second token address (sorted)
 */
token1: string;
}


/**
 * Result of a swap operation
 */
export interface SwapResult {
  /**
 * Amount of tokens received/spent
 */
amount0: i128;
  /**
 * Amount of tokens received/spent
 */
amount1: i128;
  /**
 * Liquidity at the swap price
 */
liquidity: u128;
  /**
 * New sqrt price after swap
 */
sqrt_price_x96: u256;
  /**
 * Current tick after swap
 */
tick: i32;
}


/**
 * Payment details for multi-hop swaps
 */
export interface Payment {
  /**
 * Amount to pay
 */
amount: i128;
  /**
 * Payer address
 */
payer: string;
  /**
 * Token address
 */
token: string;
}

/**
 * Error codes for the periphery base contract
 */
export const Errors = {
  /**
   * Transaction has exceeded the deadline
   */
  1001: {message:"TransactionTooOld"},
  /**
   * Contract has already been initialized
   */
  1002: {message:"AlreadyInitialized"},
  /**
   * Factory address has not been initialized
   */
  1003: {message:"FactoryNotInitialized"},
  /**
   * XLM address has not been initialized
   */
  1004: {message:"XlmAddressNotInitialized"},
  /**
   * Token does not exist
   */
  1005: {message:"TokenDoesNotExist"},
  /**
   * Not the owner of the token
   */
  1006: {message:"NotTokenOwner"},
  /**
   * Unauthorized operation
   */
  1007: {message:"Unauthorized"},
  /**
   * Insufficient token balance for operation
   */
  1008: {message:"InsufficientBalance"},
  /**
   * Tick range is invalid (lower >= upper)
   */
  1009: {message:"InvalidTickRange"},
  /**
   * Tick values are not aligned to pool tick spacing
   */
  1010: {message:"TickNotAligned"},
  /**
   * Tick is out of allowable bounds
   */
  1011: {message:"TickOutOfBounds"},
  /**
   * Expected pool not found or inaccessible
   */
  1012: {message:"PoolNotFound"},
  /**
   * Mathematical operation resulted in overflow
   */
  1013: {message:"MathOverflow"},
  /**
   * Price slippage check failed (amount received below minimum)
   */
  1014: {message:"PriceSlippageCheck"},
  /**
   * No tokens to collect (both amount0_max and amount1_max are zero)
   */
  1015: {message:"NothingToCollect"},
  /**
   * Tokens Not Ordered
   */
  1016: {message:"TokensNotOrdered"},
  /**
   * Liquidity calculation failed
   */
  1017: {message:"LiquidityCalculationFailed"},
  /**
   * Pool key data is missing for the given pool ID
   */
  1018: {message:"PoolKeyMissing"},
  /**
   * Token descriptor contract address is not set
   */
  1019: {message:"TokenDescriptorNotSet"},
  /**
   * No approved address for the given token
   */
  1020: {message:"NoApprovedAddress"},
  /**
   * Position must have zero liquidity and no owed tokens before burning
   */
  1021: {message:"PositionNotCleared"}
}

/**
 * Keys under which we'll store the immutable fields
 */
export type DataKey = {tag: "Factory", values: void} | {tag: "XlmAddress", values: void};

/**
 * Q128.128 fixed-point number
 * 
 * Represents a number as: value / 2^128
 * 
 * Used exclusively for fee growth tracking in Uniswap V3 architecture.
 * For price calculations, use FixedPoint96 instead.
 */
export type FixedPoint128 = readonly [u256];

/**
 * Q64.96 fixed-point number
 * 
 * Internally stored as a U256 where the value represents:
 * `actual_value = stored_value / 2^96`
 */
export type FixedPoint96 = readonly [u256];


export interface SwapStepResult {
  amount_in: u256;
  amount_out: u256;
  fee_amount: u256;
  sqrt_ratio_next: SqrtPriceX96;
}


/**
 * 512-bit unsigned integer
 * 
 * Represented as two 256-bit components:
 * - `low`: bits 0-255
 * - `high`: bits 256-511
 * 
 * The actual value is: high * 2^256 + low
 */
export interface U512 {
  high: u256;
  low: u256;
}

export interface Client {
  /**
   * Construct and simulate a init_router transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initialize the router with factory and XLM addresses
   * Following Uniswap V3's permissionless design
   */
  init_router: ({factory, xlm}: {factory: string, xlm: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a swap_exact_input_single transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Swap exact amount of input tokens for as many output tokens as possible
   * Single hop version
   * 
   * Uses Soroban's authorization framework - no pre-approval needed!
   * The user's signature authorizes both the router call and the pool's token transfers.
   */
  swap_exact_input_single: ({params}: {params: ExactInputSingleParams}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<i128>>>

  /**
   * Construct and simulate a swap_exact_input transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Swap exact amount of input tokens for as many output tokens as possible
   * Multi-hop version (e.g., Token A → B → C in single transaction)
   * 
   * Uses Soroban's authorization framework for atomic multi-hop swaps.
   * First hop: Pool pulls from user. Subsequent hops: Pools use prefunded tokens.
   */
  swap_exact_input: ({params}: {params: ExactInputParams}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<i128>>>

  /**
   * Construct and simulate a swap_exact_output_single transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Swap as few input tokens as possible for exact amount of output tokens
   * Not implemented (requires reverse-path coordination and token custody).
   */
  swap_exact_output_single: ({params}: {params: ExactOutputSingleParams}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<i128>>>

  /**
   * Construct and simulate a swap_exact_output transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  swap_exact_output: ({params}: {params: ExactOutputParams}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<i128>>>

  /**
   * Construct and simulate a quote_exact_input transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Quote exact input multi-hop swap without execution
   * Returns the expected output amount
   */
  quote_exact_input: ({params}: {params: ExactInputParams}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<QuoteResult>>>

  /**
   * Construct and simulate a quote_exact_output transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Quote exact output multi-hop swap without execution
   * Returns the required input amount
   */
  quote_exact_output: ({params}: {params: ExactOutputParams}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<QuoteResult>>>

  /**
   * Construct and simulate a quote_exact_input_single transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Quote single exact input swap without execution
   */
  quote_exact_input_single: ({params}: {params: ExactInputSingleParams}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<QuoteResult>>>

  /**
   * Construct and simulate a quote_exact_output_single transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Quote single exact output swap without execution
   * NOTE: Not supported in this implementation
   */
  quote_exact_output_single: ({params}: {params: ExactOutputSingleParams}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<QuoteResult>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAABAAAAClDdXN0b20gZXJyb3JzIGZvciB0aGUgU3dhcFJvdXRlciBjb250cmFjdAAAAAAAAAAAAAAPU3dhcFJvdXRlckVycm9yAAAAABkAAAAjUm91dGVyIGhhcyBhbHJlYWR5IGJlZW4gaW5pdGlhbGl6ZWQAAAAAEkFscmVhZHlJbml0aWFsaXplZAAAAAAAAQAAAB9Sb3V0ZXIgaGFzIG5vdCBiZWVuIGluaXRpYWxpemVkAAAAAA5Ob3RJbml0aWFsaXplZAAAAAAAAgAAAB9UcmFuc2FjdGlvbiBkZWFkbGluZSBoYXMgcGFzc2VkAAAAAA9EZWFkbGluZUV4cGlyZWQAAAAAAwAAABpJbnN1ZmZpY2llbnQgb3V0cHV0IGFtb3VudAAAAAAAGEluc3VmZmljaWVudE91dHB1dEFtb3VudAAAAAQAAAAWRXhjZXNzaXZlIGlucHV0IGFtb3VudAAAAAAAFEV4Y2Vzc2l2ZUlucHV0QW1vdW50AAAABQAAABFJbnZhbGlkIHN3YXAgcGF0aAAAAAAAAAtJbnZhbGlkUGF0aAAAAAAGAAAAFUludmFsaWQgdG9rZW4gYWRkcmVzcwAAAAAAAAxJbnZhbGlkVG9rZW4AAAAHAAAAEEludmFsaWQgZmVlIHRpZXIAAAAKSW52YWxpZEZlZQAAAAAACAAAACFJbnZhbGlkIGFtb3VudCAoemVybyBvciBuZWdhdGl2ZSkAAAAAAAANSW52YWxpZEFtb3VudAAAAAAAAAkAAAAeSW5zdWZmaWNpZW50IGxpcXVpZGl0eSBpbiBwb29sAAAAAAAVSW5zdWZmaWNpZW50TGlxdWlkaXR5AAAAAAAACgAAABRQcmljZSBsaW1pdCBleGNlZWRlZAAAABJQcmljZUxpbWl0RXhjZWVkZWQAAAAAAAsAAAAlTm90IGF1dGhvcml6ZWQgdG8gcGVyZm9ybSB0aGlzIGFjdGlvbgAAAAAAAA1Ob3RBdXRob3JpemVkAAAAAAAADAAAABVUb2tlbiB0cmFuc2ZlciBmYWlsZWQAAAAAAAAOVHJhbnNmZXJGYWlsZWQAAAAAAA0AAAATUG9vbCBkb2VzIG5vdCBleGlzdAAAAAAMUG9vbE5vdEZvdW5kAAAADgAAABlJbnZhbGlkIHJlY2lwaWVudCBhZGRyZXNzAAAAAAAAEEludmFsaWRSZWNpcGllbnQAAAAPAAAAG1NsaXBwYWdlIHRvbGVyYW5jZSBleGNlZWRlZAAAAAAQU2xpcHBhZ2VFeGNlZWRlZAAAABAAAAAdUGF0aCB0b28gbG9uZyAodG9vIG1hbnkgaG9wcykAAAAAAAALUGF0aFRvb0xvbmcAAAAAEQAAABhJZGVudGljYWwgdG9rZW5zIGluIHN3YXAAAAAPSWRlbnRpY2FsVG9rZW5zAAAAABIAAAAUSW5zdWZmaWNpZW50IGJhbGFuY2UAAAATSW5zdWZmaWNpZW50QmFsYW5jZQAAAAATAAAAGEludmFsaWQgc3FydCBwcmljZSBsaW1pdAAAABVJbnZhbGlkU3FydFByaWNlTGltaXQAAAAAAAAUAAAAFEludmFsaWQgcG9vbCBhZGRyZXNzAAAAC0ludmFsaWRQb29sAAAAABUAAAAdSW5zdWZmaWNpZW50IG91dHB1dCBmcm9tIHN3YXAAAAAAAAASSW5zdWZmaWNpZW50T3V0cHV0AAAAAAAWAAAAIUV4Y2Vzc2l2ZSBpbnB1dCByZXF1aXJlZCBmb3Igc3dhcAAAAAAAABZFeGNlc3NpdmVJbnB1dFJlcXVpcmVkAAAAAAAXAAAAF09wZXJhdGlvbiBub3Qgc3VwcG9ydGVkAAAAAAxOb3RTdXBwb3J0ZWQAAAAYAAAAFVN3YXAgb3BlcmF0aW9uIGZhaWxlZAAAAAAAAApTd2FwRmFpbGVkAAAAAAAZ",
        "AAAABQAAABtSb3V0ZXIgaW5pdGlhbGl6YXRpb24gZXZlbnQAAAAAAAAAABBJbml0aWFsaXplZEV2ZW50AAAAAQAAAAtpbml0aWFsaXplZAAAAAABAAAAAAAAAAdmYWN0b3J5AAAAABMAAAAAAAAAAg==",
        "AAAABQAAABVTaW5nbGUtaG9wIHN3YXAgZXZlbnQAAAAAAAAAAAAACVN3YXBFdmVudAAAAAAAAAEAAAAEc3dhcAAAAAMAAAAAAAAACXJlY2lwaWVudAAAAAAAABMAAAAAAAAAAAAAAAlhbW91bnRfaW4AAAAAAAALAAAAAAAAAAAAAAAKYW1vdW50X291dAAAAAAACwAAAAAAAAAC",
        "AAAAAQAAAAAAAAAAAAAAC1F1b3RlUmVzdWx0AAAAAAIAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAAUc3FydF9wcmljZV94OTZfYWZ0ZXIAAAAM",
        "AAAAAQAAABVTd2FwIHJlc3VsdCBmcm9tIHBvb2wAAAAAAAAAAAAAClN3YXBSZXN1bHQAAAAAAAUAAAAAAAAAB2Ftb3VudDAAAAAACwAAAAAAAAAHYW1vdW50MQAAAAALAAAAAAAAAAlsaXF1aWRpdHkAAAAAAAAKAAAAAAAAAA5zcXJ0X3ByaWNlX3g5NgAAAAAADAAAAAAAAAAEdGljawAAAAU=",
        "AAAAAQAAAEhPcmFjbGUgaGludHMgZm9yIGRldGVybWluaXN0aWMgZm9vdHByaW50IChtdXN0IG1hdGNoIHBvb2wncyBPcmFjbGVIaW50cykAAAAAAAAAC09yYWNsZUhpbnRzAAAAAAIAAAAAAAAACmNoZWNrcG9pbnQAAAAAAAQAAAAAAAAABHNsb3QAAAAK",
        "AAAAAQAAACpQYXJhbWV0ZXJzIGZvciBzaW5nbGUtaG9wIGV4YWN0IGlucHV0IHN3YXAAAAAAAAAAAAAWRXhhY3RJbnB1dFNpbmdsZVBhcmFtcwAAAAAACQAAACJUaGUgYW1vdW50IG9mIGlucHV0IHRva2VucyB0byBzd2FwAAAAAAAJYW1vdW50X2luAAAAAAAACwAAAC5UaGUgbWluaW11bSBhbW91bnQgb2Ygb3V0cHV0IHRva2VucyB0byByZWNlaXZlAAAAAAASYW1vdW50X291dF9taW5pbXVtAAAAAAALAAAANlVuaXggdGltZXN0YW1wIGFmdGVyIHdoaWNoIHRoZSB0cmFuc2FjdGlvbiB3aWxsIHJldmVydAAAAAAACGRlYWRsaW5lAAAABgAAABhUaGUgZmVlIHRpZXIgb2YgdGhlIHBvb2wAAAADZmVlAAAAAAQAAAArQWRkcmVzcyB0aGF0IHdpbGwgcmVjZWl2ZSB0aGUgb3V0cHV0IHRva2VucwAAAAAJcmVjaXBpZW50AAAAAAAAEwAAABhBZGRyZXNzIGZ1bmRpbmcgdGhlIHN3YXAAAAAGc2VuZGVyAAAAAAATAAAAG1RoZSBRNjQuOTYgc3FydCBwcmljZSBsaW1pdAAAAAAUc3FydF9wcmljZV9saW1pdF94OTYAAAAKAAAAHFRoZSB0b2tlbiBiZWluZyBzd2FwcGVkIGZyb20AAAAIdG9rZW5faW4AAAATAAAAGlRoZSB0b2tlbiBiZWluZyBzd2FwcGVkIHRvAAAAAAAJdG9rZW5fb3V0AAAAAAAAEw==",
        "AAAAAQAAAClQYXJhbWV0ZXJzIGZvciBtdWx0aS1ob3AgZXhhY3QgaW5wdXQgc3dhcAAAAAAAAAAAAAAQRXhhY3RJbnB1dFBhcmFtcwAAAAcAAAAiVGhlIGFtb3VudCBvZiBpbnB1dCB0b2tlbnMgdG8gc3dhcAAAAAAACWFtb3VudF9pbgAAAAAAAAsAAAAuVGhlIG1pbmltdW0gYW1vdW50IG9mIG91dHB1dCB0b2tlbnMgdG8gcmVjZWl2ZQAAAAAAEmFtb3VudF9vdXRfbWluaW11bQAAAAAACwAAADZVbml4IHRpbWVzdGFtcCBhZnRlciB3aGljaCB0aGUgdHJhbnNhY3Rpb24gd2lsbCByZXZlcnQAAAAAAAhkZWFkbGluZQAAAAYAAAAvRmVlIHRpZXIgZm9yIGVhY2ggaG9wIChsZW5ndGggPSBwYXRoLmxlbigpIC0gMSkAAAAABGZlZXMAAAPqAAAABAAAADZPcmRlcmVkIGxpc3Qgb2YgdG9rZW5zIGZvciB0aGUgc3dhcCBwYXRoIChsZW5ndGggPj0gMikAAAAAAARwYXRoAAAD6gAAABMAAAArQWRkcmVzcyB0aGF0IHdpbGwgcmVjZWl2ZSB0aGUgb3V0cHV0IHRva2VucwAAAAAJcmVjaXBpZW50AAAAAAAAEwAAABhBZGRyZXNzIGZ1bmRpbmcgdGhlIHN3YXAAAAAGc2VuZGVyAAAAAAAT",
        "AAAAAQAAACtQYXJhbWV0ZXJzIGZvciBzaW5nbGUtaG9wIGV4YWN0IG91dHB1dCBzd2FwAAAAAAAAAAAXRXhhY3RPdXRwdXRTaW5nbGVQYXJhbXMAAAAACQAAACtUaGUgbWF4aW11bSBhbW91bnQgb2YgaW5wdXQgdG9rZW5zIHRvIHNwZW5kAAAAABFhbW91bnRfaW5fbWF4aW11bQAAAAAAAAsAAAAjVGhlIGRlc2lyZWQgYW1vdW50IG9mIG91dHB1dCB0b2tlbnMAAAAACmFtb3VudF9vdXQAAAAAAAsAAAA2VW5peCB0aW1lc3RhbXAgYWZ0ZXIgd2hpY2ggdGhlIHRyYW5zYWN0aW9uIHdpbGwgcmV2ZXJ0AAAAAAAIZGVhZGxpbmUAAAAGAAAAGFRoZSBmZWUgdGllciBvZiB0aGUgcG9vbAAAAANmZWUAAAAABAAAACtBZGRyZXNzIHRoYXQgd2lsbCByZWNlaXZlIHRoZSBvdXRwdXQgdG9rZW5zAAAAAAlyZWNpcGllbnQAAAAAAAATAAAAGEFkZHJlc3MgZnVuZGluZyB0aGUgc3dhcAAAAAZzZW5kZXIAAAAAABMAAAAbVGhlIFE2NC45NiBzcXJ0IHByaWNlIGxpbWl0AAAAABRzcXJ0X3ByaWNlX2xpbWl0X3g5NgAAAAoAAAAcVGhlIHRva2VuIGJlaW5nIHN3YXBwZWQgZnJvbQAAAAh0b2tlbl9pbgAAABMAAAAaVGhlIHRva2VuIGJlaW5nIHN3YXBwZWQgdG8AAAAAAAl0b2tlbl9vdXQAAAAAAAAT",
        "AAAAAQAAACpQYXJhbWV0ZXJzIGZvciBtdWx0aS1ob3AgZXhhY3Qgb3V0cHV0IHN3YXAAAAAAAAAAAAARRXhhY3RPdXRwdXRQYXJhbXMAAAAAAAAHAAAAK1RoZSBtYXhpbXVtIGFtb3VudCBvZiBpbnB1dCB0b2tlbnMgdG8gc3BlbmQAAAAAEWFtb3VudF9pbl9tYXhpbXVtAAAAAAAACwAAACNUaGUgZGVzaXJlZCBhbW91bnQgb2Ygb3V0cHV0IHRva2VucwAAAAAKYW1vdW50X291dAAAAAAACwAAADZVbml4IHRpbWVzdGFtcCBhZnRlciB3aGljaCB0aGUgdHJhbnNhY3Rpb24gd2lsbCByZXZlcnQAAAAAAAhkZWFkbGluZQAAAAYAAAAVRmVlIHRpZXIgZm9yIGVhY2ggaG9wAAAAAAAABGZlZXMAAAPqAAAABAAAADJUaGUgcGF0aCBvZiB0b2tlbnMgZm9yIHRoZSBzd2FwIChleGVjdXRlZCBmb3J3YXJkKQAAAAAABHBhdGgAAAPqAAAAEwAAACtBZGRyZXNzIHRoYXQgd2lsbCByZWNlaXZlIHRoZSBvdXRwdXQgdG9rZW5zAAAAAAlyZWNpcGllbnQAAAAAAAATAAAAGEFkZHJlc3MgZnVuZGluZyB0aGUgc3dhcAAAAAZzZW5kZXIAAAAAABM=",
        "AAAAAQAAACdSZXByZXNlbnRzIGEgc2luZ2xlIHBvb2wgaW4gYSBzd2FwIHBhdGgAAAAAAAAAAAdQb29sS2V5AAAAAAMAAAAIRmVlIHRpZXIAAAADZmVlAAAAAAQAAAAcRmlyc3QgdG9rZW4gYWRkcmVzcyAoc29ydGVkKQAAAAZ0b2tlbjAAAAAAABMAAAAdU2Vjb25kIHRva2VuIGFkZHJlc3MgKHNvcnRlZCkAAAAAAAAGdG9rZW4xAAAAAAAT",
        "AAAAAQAAABpSZXN1bHQgb2YgYSBzd2FwIG9wZXJhdGlvbgAAAAAAAAAAAApTd2FwUmVzdWx0AAAAAAAFAAAAH0Ftb3VudCBvZiB0b2tlbnMgcmVjZWl2ZWQvc3BlbnQAAAAAB2Ftb3VudDAAAAAACwAAAB9BbW91bnQgb2YgdG9rZW5zIHJlY2VpdmVkL3NwZW50AAAAAAdhbW91bnQxAAAAAAsAAAAbTGlxdWlkaXR5IGF0IHRoZSBzd2FwIHByaWNlAAAAAAlsaXF1aWRpdHkAAAAAAAAKAAAAGU5ldyBzcXJ0IHByaWNlIGFmdGVyIHN3YXAAAAAAAAAOc3FydF9wcmljZV94OTYAAAAAAAwAAAAXQ3VycmVudCB0aWNrIGFmdGVyIHN3YXAAAAAABHRpY2sAAAAF",
        "AAAAAQAAACNQYXltZW50IGRldGFpbHMgZm9yIG11bHRpLWhvcCBzd2FwcwAAAAAAAAAAB1BheW1lbnQAAAAAAwAAAA1BbW91bnQgdG8gcGF5AAAAAAAABmFtb3VudAAAAAAACwAAAA1QYXllciBhZGRyZXNzAAAAAAAABXBheWVyAAAAAAAAEwAAAA1Ub2tlbiBhZGRyZXNzAAAAAAAABXRva2VuAAAAAAAAEw==",
        "AAAAAAAAAGFJbml0aWFsaXplIHRoZSByb3V0ZXIgd2l0aCBmYWN0b3J5IGFuZCBYTE0gYWRkcmVzc2VzCkZvbGxvd2luZyBVbmlzd2FwIFYzJ3MgcGVybWlzc2lvbmxlc3MgZGVzaWduAAAAAAAAC2luaXRfcm91dGVyAAAAAAIAAAAAAAAAB2ZhY3RvcnkAAAAAEwAAAAAAAAADeGxtAAAAABMAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA9Td2FwUm91dGVyRXJyb3IA",
        "AAAAAAAAAPFTd2FwIGV4YWN0IGFtb3VudCBvZiBpbnB1dCB0b2tlbnMgZm9yIGFzIG1hbnkgb3V0cHV0IHRva2VucyBhcyBwb3NzaWJsZQpTaW5nbGUgaG9wIHZlcnNpb24KClVzZXMgU29yb2JhbidzIGF1dGhvcml6YXRpb24gZnJhbWV3b3JrIC0gbm8gcHJlLWFwcHJvdmFsIG5lZWRlZCEKVGhlIHVzZXIncyBzaWduYXR1cmUgYXV0aG9yaXplcyBib3RoIHRoZSByb3V0ZXIgY2FsbCBhbmQgdGhlIHBvb2wncyB0b2tlbiB0cmFuc2ZlcnMuAAAAAAAAF3N3YXBfZXhhY3RfaW5wdXRfc2luZ2xlAAAAAAEAAAAAAAAABnBhcmFtcwAAAAAH0AAAABZFeGFjdElucHV0U2luZ2xlUGFyYW1zAAAAAAABAAAD6QAAAAsAAAfQAAAAD1N3YXBSb3V0ZXJFcnJvcgA=",
        "AAAAAAAAAR1Td2FwIGV4YWN0IGFtb3VudCBvZiBpbnB1dCB0b2tlbnMgZm9yIGFzIG1hbnkgb3V0cHV0IHRva2VucyBhcyBwb3NzaWJsZQpNdWx0aS1ob3AgdmVyc2lvbiAoZS5nLiwgVG9rZW4gQSDihpIgQiDihpIgQyBpbiBzaW5nbGUgdHJhbnNhY3Rpb24pCgpVc2VzIFNvcm9iYW4ncyBhdXRob3JpemF0aW9uIGZyYW1ld29yayBmb3IgYXRvbWljIG11bHRpLWhvcCBzd2Fwcy4KRmlyc3QgaG9wOiBQb29sIHB1bGxzIGZyb20gdXNlci4gU3Vic2VxdWVudCBob3BzOiBQb29scyB1c2UgcHJlZnVuZGVkIHRva2Vucy4AAAAAAAAQc3dhcF9leGFjdF9pbnB1dAAAAAEAAAAAAAAABnBhcmFtcwAAAAAH0AAAABBFeGFjdElucHV0UGFyYW1zAAAAAQAAA+kAAAALAAAH0AAAAA9Td2FwUm91dGVyRXJyb3IA",
        "AAAAAAAAAI5Td2FwIGFzIGZldyBpbnB1dCB0b2tlbnMgYXMgcG9zc2libGUgZm9yIGV4YWN0IGFtb3VudCBvZiBvdXRwdXQgdG9rZW5zCk5vdCBpbXBsZW1lbnRlZCAocmVxdWlyZXMgcmV2ZXJzZS1wYXRoIGNvb3JkaW5hdGlvbiBhbmQgdG9rZW4gY3VzdG9keSkuAAAAAAAYc3dhcF9leGFjdF9vdXRwdXRfc2luZ2xlAAAAAQAAAAAAAAAGcGFyYW1zAAAAAAfQAAAAF0V4YWN0T3V0cHV0U2luZ2xlUGFyYW1zAAAAAAEAAAPpAAAACwAAB9AAAAAPU3dhcFJvdXRlckVycm9yAA==",
        "AAAAAAAAAAAAAAARc3dhcF9leGFjdF9vdXRwdXQAAAAAAAABAAAAAAAAAAZwYXJhbXMAAAAAB9AAAAARRXhhY3RPdXRwdXRQYXJhbXMAAAAAAAABAAAD6QAAAAsAAAfQAAAAD1N3YXBSb3V0ZXJFcnJvcgA=",
        "AAAAAAAAAFVRdW90ZSBleGFjdCBpbnB1dCBtdWx0aS1ob3Agc3dhcCB3aXRob3V0IGV4ZWN1dGlvbgpSZXR1cm5zIHRoZSBleHBlY3RlZCBvdXRwdXQgYW1vdW50AAAAAAAAEXF1b3RlX2V4YWN0X2lucHV0AAAAAAAAAQAAAAAAAAAGcGFyYW1zAAAAAAfQAAAAEEV4YWN0SW5wdXRQYXJhbXMAAAABAAAD6QAAB9AAAAALUXVvdGVSZXN1bHQAAAAH0AAAAA9Td2FwUm91dGVyRXJyb3IA",
        "AAAAAAAAAFVRdW90ZSBleGFjdCBvdXRwdXQgbXVsdGktaG9wIHN3YXAgd2l0aG91dCBleGVjdXRpb24KUmV0dXJucyB0aGUgcmVxdWlyZWQgaW5wdXQgYW1vdW50AAAAAAAAEnF1b3RlX2V4YWN0X291dHB1dAAAAAAAAQAAAAAAAAAGcGFyYW1zAAAAAAfQAAAAEUV4YWN0T3V0cHV0UGFyYW1zAAAAAAAAAQAAA+kAAAfQAAAAC1F1b3RlUmVzdWx0AAAAB9AAAAAPU3dhcFJvdXRlckVycm9yAA==",
        "AAAAAAAAAC9RdW90ZSBzaW5nbGUgZXhhY3QgaW5wdXQgc3dhcCB3aXRob3V0IGV4ZWN1dGlvbgAAAAAYcXVvdGVfZXhhY3RfaW5wdXRfc2luZ2xlAAAAAQAAAAAAAAAGcGFyYW1zAAAAAAfQAAAAFkV4YWN0SW5wdXRTaW5nbGVQYXJhbXMAAAAAAAEAAAPpAAAH0AAAAAtRdW90ZVJlc3VsdAAAAAfQAAAAD1N3YXBSb3V0ZXJFcnJvcgA=",
        "AAAAAAAAAFtRdW90ZSBzaW5nbGUgZXhhY3Qgb3V0cHV0IHN3YXAgd2l0aG91dCBleGVjdXRpb24KTk9URTogTm90IHN1cHBvcnRlZCBpbiB0aGlzIGltcGxlbWVudGF0aW9uAAAAABlxdW90ZV9leGFjdF9vdXRwdXRfc2luZ2xlAAAAAAAAAQAAAAAAAAAGcGFyYW1zAAAAAAfQAAAAF0V4YWN0T3V0cHV0U2luZ2xlUGFyYW1zAAAAAAEAAAPpAAAH0AAAAAtRdW90ZVJlc3VsdAAAAAfQAAAAD1N3YXBSb3V0ZXJFcnJvcgA=",
        "AAAABAAAACtFcnJvciBjb2RlcyBmb3IgdGhlIHBlcmlwaGVyeSBiYXNlIGNvbnRyYWN0AAAAAAAAAAAFRXJyb3IAAAAAAAAVAAAAJVRyYW5zYWN0aW9uIGhhcyBleGNlZWRlZCB0aGUgZGVhZGxpbmUAAAAAAAARVHJhbnNhY3Rpb25Ub29PbGQAAAAAAAPpAAAAJUNvbnRyYWN0IGhhcyBhbHJlYWR5IGJlZW4gaW5pdGlhbGl6ZWQAAAAAAAASQWxyZWFkeUluaXRpYWxpemVkAAAAAAPqAAAAKEZhY3RvcnkgYWRkcmVzcyBoYXMgbm90IGJlZW4gaW5pdGlhbGl6ZWQAAAAVRmFjdG9yeU5vdEluaXRpYWxpemVkAAAAAAAD6wAAACRYTE0gYWRkcmVzcyBoYXMgbm90IGJlZW4gaW5pdGlhbGl6ZWQAAAAYWGxtQWRkcmVzc05vdEluaXRpYWxpemVkAAAD7AAAABRUb2tlbiBkb2VzIG5vdCBleGlzdAAAABFUb2tlbkRvZXNOb3RFeGlzdAAAAAAAA+0AAAAaTm90IHRoZSBvd25lciBvZiB0aGUgdG9rZW4AAAAAAA1Ob3RUb2tlbk93bmVyAAAAAAAD7gAAABZVbmF1dGhvcml6ZWQgb3BlcmF0aW9uAAAAAAAMVW5hdXRob3JpemVkAAAD7wAAAChJbnN1ZmZpY2llbnQgdG9rZW4gYmFsYW5jZSBmb3Igb3BlcmF0aW9uAAAAE0luc3VmZmljaWVudEJhbGFuY2UAAAAD8AAAACZUaWNrIHJhbmdlIGlzIGludmFsaWQgKGxvd2VyID49IHVwcGVyKQAAAAAAEEludmFsaWRUaWNrUmFuZ2UAAAPxAAAAMFRpY2sgdmFsdWVzIGFyZSBub3QgYWxpZ25lZCB0byBwb29sIHRpY2sgc3BhY2luZwAAAA5UaWNrTm90QWxpZ25lZAAAAAAD8gAAAB9UaWNrIGlzIG91dCBvZiBhbGxvd2FibGUgYm91bmRzAAAAAA9UaWNrT3V0T2ZCb3VuZHMAAAAD8wAAACdFeHBlY3RlZCBwb29sIG5vdCBmb3VuZCBvciBpbmFjY2Vzc2libGUAAAAADFBvb2xOb3RGb3VuZAAAA/QAAAArTWF0aGVtYXRpY2FsIG9wZXJhdGlvbiByZXN1bHRlZCBpbiBvdmVyZmxvdwAAAAAMTWF0aE92ZXJmbG93AAAD9QAAADtQcmljZSBzbGlwcGFnZSBjaGVjayBmYWlsZWQgKGFtb3VudCByZWNlaXZlZCBiZWxvdyBtaW5pbXVtKQAAAAASUHJpY2VTbGlwcGFnZUNoZWNrAAAAAAP2AAAAQE5vIHRva2VucyB0byBjb2xsZWN0IChib3RoIGFtb3VudDBfbWF4IGFuZCBhbW91bnQxX21heCBhcmUgemVybykAAAAQTm90aGluZ1RvQ29sbGVjdAAAA/cAAAASVG9rZW5zIE5vdCBPcmRlcmVkAAAAAAAQVG9rZW5zTm90T3JkZXJlZAAAA/gAAAAcTGlxdWlkaXR5IGNhbGN1bGF0aW9uIGZhaWxlZAAAABpMaXF1aWRpdHlDYWxjdWxhdGlvbkZhaWxlZAAAAAAD+QAAAC5Qb29sIGtleSBkYXRhIGlzIG1pc3NpbmcgZm9yIHRoZSBnaXZlbiBwb29sIElEAAAAAAAOUG9vbEtleU1pc3NpbmcAAAAAA/oAAAAsVG9rZW4gZGVzY3JpcHRvciBjb250cmFjdCBhZGRyZXNzIGlzIG5vdCBzZXQAAAAVVG9rZW5EZXNjcmlwdG9yTm90U2V0AAAAAAAD+wAAACdObyBhcHByb3ZlZCBhZGRyZXNzIGZvciB0aGUgZ2l2ZW4gdG9rZW4AAAAAEU5vQXBwcm92ZWRBZGRyZXNzAAAAAAAD/AAAAENQb3NpdGlvbiBtdXN0IGhhdmUgemVybyBsaXF1aWRpdHkgYW5kIG5vIG93ZWQgdG9rZW5zIGJlZm9yZSBidXJuaW5nAAAAABJQb3NpdGlvbk5vdENsZWFyZWQAAAAAA/0=",
        "AAAAAgAAADFLZXlzIHVuZGVyIHdoaWNoIHdlJ2xsIHN0b3JlIHRoZSBpbW11dGFibGUgZmllbGRzAAAAAAAAAAAAAAdEYXRhS2V5AAAAAAIAAAAAAAAAAAAAAAdGYWN0b3J5AAAAAAAAAAAAAAAAClhsbUFkZHJlc3MAAA==",
        "AAAAAQAAALpRMTI4LjEyOCBmaXhlZC1wb2ludCBudW1iZXIKClJlcHJlc2VudHMgYSBudW1iZXIgYXM6IHZhbHVlIC8gMl4xMjgKClVzZWQgZXhjbHVzaXZlbHkgZm9yIGZlZSBncm93dGggdHJhY2tpbmcgaW4gVW5pc3dhcCBWMyBhcmNoaXRlY3R1cmUuCkZvciBwcmljZSBjYWxjdWxhdGlvbnMsIHVzZSBGaXhlZFBvaW50OTYgaW5zdGVhZC4AAAAAAAAAAAANRml4ZWRQb2ludDEyOAAAAAAAAAEAAAAAAAAAATAAAAAAAAAM",
        "AAAAAQAAAHdRNjQuOTYgZml4ZWQtcG9pbnQgbnVtYmVyCgpJbnRlcm5hbGx5IHN0b3JlZCBhcyBhIFUyNTYgd2hlcmUgdGhlIHZhbHVlIHJlcHJlc2VudHM6CmBhY3R1YWxfdmFsdWUgPSBzdG9yZWRfdmFsdWUgLyAyXjk2YAAAAAAAAAAADEZpeGVkUG9pbnQ5NgAAAAEAAAAAAAAAATAAAAAAAAAM",
        "AAAAAQAAAAAAAAAAAAAADlN3YXBTdGVwUmVzdWx0AAAAAAAEAAAAAAAAAAlhbW91bnRfaW4AAAAAAAAMAAAAAAAAAAphbW91bnRfb3V0AAAAAAAMAAAAAAAAAApmZWVfYW1vdW50AAAAAAAMAAAAAAAAAA9zcXJ0X3JhdGlvX25leHQAAAAH0AAAAAxTcXJ0UHJpY2VYOTY=",
        "AAAAAQAAAJQ1MTItYml0IHVuc2lnbmVkIGludGVnZXIKClJlcHJlc2VudGVkIGFzIHR3byAyNTYtYml0IGNvbXBvbmVudHM6Ci0gYGxvd2A6IGJpdHMgMC0yNTUKLSBgaGlnaGA6IGJpdHMgMjU2LTUxMQoKVGhlIGFjdHVhbCB2YWx1ZSBpczogaGlnaCAqIDJeMjU2ICsgbG93AAAAAAAAAARVNTEyAAAAAgAAAAAAAAAEaGlnaAAAAAwAAAAAAAAAA2xvdwAAAAAM" ]),
      options
    )
  }
  public readonly fromJSON = {
    init_router: this.txFromJSON<Result<void>>,
        swap_exact_input_single: this.txFromJSON<Result<i128>>,
        swap_exact_input: this.txFromJSON<Result<i128>>,
        swap_exact_output_single: this.txFromJSON<Result<i128>>,
        swap_exact_output: this.txFromJSON<Result<i128>>,
        quote_exact_input: this.txFromJSON<Result<QuoteResult>>,
        quote_exact_output: this.txFromJSON<Result<QuoteResult>>,
        quote_exact_input_single: this.txFromJSON<Result<QuoteResult>>,
        quote_exact_output_single: this.txFromJSON<Result<QuoteResult>>
  }
}