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

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CDYKIAPBABV5U3FK2WY7PINXHYAYQEKIO7LEZJMUBB6MD64S34EOGRQK",
  }
} as const

export type StorageKey = {tag: "Owner", values: void} | {tag: "FlashExecutor", values: void} | {tag: "FeeAmtTickSpacing", values: readonly [u32]} | {tag: "GetPool", values: readonly [string, string, u32]} | {tag: "WasmHash", values: void} | {tag: "ProtocolFee0", values: void} | {tag: "ProtocolFee1", values: void} | {tag: "DefaultRouter", values: void};





export const Errors = {
  1: {message:"Unauthorized"},
  10: {message:"InvalidTickRange"},
  11: {message:"InvalidLiquidity"},
  12: {message:"InvalidAmount"},
  13: {message:"InvalidSqrtPrice"},
  14: {message:"InvalidFee"},
  15: {message:"InvalidTickSpacing"},
  16: {message:"InvalidPriceLimit"},
  20: {message:"OutOfBounds"},
  21: {message:"Overflow"},
  22: {message:"Underflow"},
  23: {message:"DivisionByZero"},
  40: {message:"NotInitialized"},
  41: {message:"AlreadyInitialized"},
  42: {message:"PositionNotFound"},
  43: {message:"InsufficientLiquidity"},
  50: {message:"TickNotInitialized"},
  51: {message:"InvalidTickPosition"},
  60: {message:"InvalidObservation"},
  61: {message:"ObservationTooOld"},
  65: {message:"Locked"},
  70: {message:"InsufficientToken0"},
  71: {message:"InsufficientToken1"},
  80: {message:"InsufficientRepayment0"},
  81: {message:"InsufficientRepayment1"},
  82: {message:"FlashNotLocked"},
  83: {message:"MustUseFlashExecutor"},
  90: {message:"IdenticalTokens"},
  91: {message:"PoolAlreadyExists"}
}

export interface Client {
  /**
   * Construct and simulate a set_owner transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Transfers factory ownership to a new administrator.
   * 
   * # Arguments
   * * `e` - The contract environment
   * * `new_admin` - Address of the new owner (requires current owner authorization)
   */
  set_owner: ({new_admin}: {new_admin: string}, options?: {
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
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_owner transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Returns the current factory owner address.
   * 
   * # Arguments
   * * `e` - The contract environment
   * 
   * # Returns
   * * `Address` - Current factory owner
   */
  get_owner: (options?: {
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
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a set_flash_executor transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Sets the global FlashExecutor address for all new pools.
   * 
   * The FlashExecutor is the only contract authorized to initiate flash loans.
   * This guarantees flash_end() is always called, preventing pool lock griefing.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `flash_executor` - Address of the FlashExecutor contract (requires owner authorization)
   * 
   * # Events
   * * `SetFlashExecutorEvent` - Emitted with old and new flash executor addresses
   */
  set_flash_executor: ({flash_executor}: {flash_executor: string}, options?: {
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
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_flash_executor transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Returns the global FlashExecutor address.
   * 
   * # Arguments
   * * `env` - The contract environment
   * 
   * # Returns
   * * `Address` - FlashExecutor contract address
   */
  get_flash_executor: (options?: {
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
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a set_protocol_fee transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Sets the global protocol fee denominators for all pools.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `fee_protocol0` - Protocol fee denominator for token0 (0 or 4-10)
   * * `fee_protocol1` - Protocol fee denominator for token1 (0 or 4-10)
   * 
   * # Returns
   * * `Ok(())` on success
   * * `Err(InvalidFeeProtocol)` if either fee is not 0 or in range 4-10
   */
  set_protocol_fee: ({fee_protocol0, fee_protocol1}: {fee_protocol0: u32, fee_protocol1: u32}, options?: {
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
   * Construct and simulate a get_protocol_fee_0 transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Returns the protocol fee denominator for token0.
   * 
   * # Arguments
   * * `env` - The contract environment
   * 
   * # Returns
   * * `u32` - Protocol fee denominator for token0 (0 if disabled, or 4-10)
   */
  get_protocol_fee_0: (options?: {
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
  }) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a get_protocol_fee_1 transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Returns the protocol fee denominator for token1.
   * 
   * # Arguments
   * * `env` - The contract environment
   * 
   * # Returns
   * * `u32` - Protocol fee denominator for token1 (0 if disabled, or 4-10)
   */
  get_protocol_fee_1: (options?: {
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
  }) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a create_pool transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Creates a new pool for the given token pair and fee tier.
   * 
   * # Arguments
   * * `e` - The contract environment
   * * `token_a` - First token address
   * * `token_b` - Second token address
   * * `fee` - Fee tier in basis points
   * 
   * # Returns
   * * `Ok(Address)` - Address of the newly created pool
   * * `Err(Error)` - If validation fails (see pool::create_pool for error codes)
   */
  create_pool: ({token_a, token_b, fee}: {token_a: string, token_b: string, fee: u32}, options?: {
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
  }) => Promise<AssembledTransaction<Result<string>>>

  /**
   * Construct and simulate a get_pool transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Returns the pool address for a given token pair and fee tier.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `token_a` - First token address
   * * `token_b` - Second token address
   * * `fee` - Fee tier in basis points
   * 
   * # Returns
   * * `Some(Address)` - Pool address if it exists
   * * `None` - If no pool exists for this token pair and fee
   */
  get_pool: ({token_a, token_b, fee}: {token_a: string, token_b: string, fee: u32}, options?: {
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
  }) => Promise<AssembledTransaction<Option<string>>>

  /**
   * Construct and simulate a set_default_router transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Sets a default router to be auto-authorized on new pools.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `router` - Router address to auto-authorize on new pools
   */
  set_default_router: ({router}: {router: string}, options?: {
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
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a clear_default_router transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Clears the default router setting.
   * 
   * # Arguments
   * * `env` - The contract environment
   */
  clear_default_router: (options?: {
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
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_pool_router_authorized transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Authorizes or revokes a router for a specific pool.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `pool` - Pool address to configure
   * * `router` - Router address to authorize/revoke
   * * `allowed` - True to grant authorization, false to revoke
   */
  set_pool_router_authorized: ({pool, router, allowed}: {pool: string, router: string, allowed: boolean}, options?: {
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
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a e_fee_amt transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Enables a new fee tier with associated tick spacing.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `fee` - Fee tier in basis points (must be < 1,000,000)
   * * `tick_spacing` - Tick spacing for this fee tier (must be > 0 and < 16,384)
   * 
   * # Returns
   * * `Ok(())` on success
   * * `Err(Error)` - If validation fails (see fees::enable_fee_amount for error codes)
   */
  e_fee_amt: ({fee, tick_spacing}: {fee: u32, tick_spacing: i32}, options?: {
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

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        {admin, wasm_hash}: {admin: string, wasm_hash: Buffer},
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
    return ContractClient.deploy({admin, wasm_hash}, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAClN0b3JhZ2VLZXkAAAAAAAgAAAAAAAAAAAAAAAVPd25lcgAAAAAAAAAAAAAAAAAADUZsYXNoRXhlY3V0b3IAAAAAAAABAAAAAAAAABFGZWVBbXRUaWNrU3BhY2luZwAAAAAAAAEAAAAEAAAAAQAAAAAAAAAHR2V0UG9vbAAAAAADAAAAEwAAABMAAAAEAAAAAAAAAAAAAAAIV2FzbUhhc2gAAAAAAAAAAAAAAAxQcm90b2NvbEZlZTAAAAAAAAAAAAAAAAxQcm90b2NvbEZlZTEAAAAAAAAAAAAAAA1EZWZhdWx0Um91dGVyAAAA",
        "AAAABQAAAAAAAAAAAAAAFUZlZUFtb3VudEVuYWJsZWRFdmVudAAAAAAAAAEAAAAYZmVlX2Ftb3VudF9lbmFibGVkX2V2ZW50AAAAAgAAAAAAAAADZmVlAAAAAAQAAAAAAAAAAAAAAAx0aWNrX3NwYWNpbmcAAAAFAAAAAAAAAAI=",
        "AAAABQAAAAAAAAAAAAAAEFBvb2xDcmVhdGVkRXZlbnQAAAABAAAAEnBvb2xfY3JlYXRlZF9ldmVudAAAAAAABgAAAAAAAAAGc2VuZGVyAAAAAAATAAAAAAAAAAAAAAAGdG9rZW4wAAAAAAATAAAAAAAAAAAAAAAGdG9rZW4xAAAAAAATAAAAAAAAAAAAAAADZmVlAAAAAAQAAAAAAAAAAAAAAAx0aWNrX3NwYWNpbmcAAAAFAAAAAAAAAAAAAAAMcG9vbF9hZGRyZXNzAAAAEwAAAAAAAAAC",
        "AAAABQAAAAAAAAAAAAAAE1NldFByb3RvY29sRmVlRXZlbnQAAAAAAQAAABZzZXRfcHJvdG9jb2xfZmVlX2V2ZW50AAAAAAAEAAAAAAAAABFmZWVfcHJvdG9jb2wwX29sZAAAAAAAAAQAAAAAAAAAAAAAABFmZWVfcHJvdG9jb2wxX29sZAAAAAAAAAQAAAAAAAAAAAAAABFmZWVfcHJvdG9jb2wwX25ldwAAAAAAAAQAAAAAAAAAAAAAABFmZWVfcHJvdG9jb2wxX25ldwAAAAAAAAQAAAAAAAAAAg==",
        "AAAABQAAAAAAAAAAAAAAFVNldEZsYXNoRXhlY3V0b3JFdmVudAAAAAAAAAEAAAAYc2V0X2ZsYXNoX2V4ZWN1dG9yX2V2ZW50AAAAAgAAAAAAAAASb2xkX2ZsYXNoX2V4ZWN1dG9yAAAAAAPoAAAAEwAAAAAAAAAAAAAAEm5ld19mbGFzaF9leGVjdXRvcgAAAAAAEwAAAAAAAAAC",
        "AAAAAAAAAZVJbml0aWFsaXplcyB0aGUgZmFjdG9yeSB3aXRoIGFuIGFkbWluaXN0cmF0b3IgYW5kIHBvb2wgV0FTTSBoYXNoLgoKU2V0cyB1cCB0aGUgZmFjdG9yeSB3aXRoIGRlZmF1bHQgZmVlIHRpZXJzICgwLjA1JSwgMC4zJSwgMSUpIGFuZCB0aGVpcgpjb3JyZXNwb25kaW5nIHRpY2sgc3BhY2luZ3MuIEluaXRpYWxpemVzIHByb3RvY29sIGZlZXMgdG8gMC4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgY29udHJhY3QgZW52aXJvbm1lbnQKKiBgYWRtaW5gIC0gQWRkcmVzcyBvZiB0aGUgZmFjdG9yeSBvd25lcgoqIGB3YXNtX2hhc2hgIC0gV0FTTSBoYXNoIG9mIHRoZSBwb29sIGNvbnRyYWN0IHRvIGRlcGxveQpUT0RPOiBEZXRlcm1pbmUgZXhhY3QgZmVlIHRpZXJzIGFuZCB0aWNrIHNwYWNpbmdzIHRvIHN1cHBvcnQAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAIAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAJd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAAAAAAALFUcmFuc2ZlcnMgZmFjdG9yeSBvd25lcnNoaXAgdG8gYSBuZXcgYWRtaW5pc3RyYXRvci4KCiMgQXJndW1lbnRzCiogYGVgIC0gVGhlIGNvbnRyYWN0IGVudmlyb25tZW50CiogYG5ld19hZG1pbmAgLSBBZGRyZXNzIG9mIHRoZSBuZXcgb3duZXIgKHJlcXVpcmVzIGN1cnJlbnQgb3duZXIgYXV0aG9yaXphdGlvbikAAAAAAAAJc2V0X293bmVyAAAAAAAAAQAAAAAAAAAJbmV3X2FkbWluAAAAAAAAEwAAAAA=",
        "AAAAAAAAAIdSZXR1cm5zIHRoZSBjdXJyZW50IGZhY3Rvcnkgb3duZXIgYWRkcmVzcy4KCiMgQXJndW1lbnRzCiogYGVgIC0gVGhlIGNvbnRyYWN0IGVudmlyb25tZW50CgojIFJldHVybnMKKiBgQWRkcmVzc2AgLSBDdXJyZW50IGZhY3Rvcnkgb3duZXIAAAAACWdldF9vd25lcgAAAAAAAAAAAAABAAAAEw==",
        "AAAAAAAAAbNTZXRzIHRoZSBnbG9iYWwgRmxhc2hFeGVjdXRvciBhZGRyZXNzIGZvciBhbGwgbmV3IHBvb2xzLgoKVGhlIEZsYXNoRXhlY3V0b3IgaXMgdGhlIG9ubHkgY29udHJhY3QgYXV0aG9yaXplZCB0byBpbml0aWF0ZSBmbGFzaCBsb2Fucy4KVGhpcyBndWFyYW50ZWVzIGZsYXNoX2VuZCgpIGlzIGFsd2F5cyBjYWxsZWQsIHByZXZlbnRpbmcgcG9vbCBsb2NrIGdyaWVmaW5nLgoKIyBBcmd1bWVudHMKKiBgZW52YCAtIFRoZSBjb250cmFjdCBlbnZpcm9ubWVudAoqIGBmbGFzaF9leGVjdXRvcmAgLSBBZGRyZXNzIG9mIHRoZSBGbGFzaEV4ZWN1dG9yIGNvbnRyYWN0IChyZXF1aXJlcyBvd25lciBhdXRob3JpemF0aW9uKQoKIyBFdmVudHMKKiBgU2V0Rmxhc2hFeGVjdXRvckV2ZW50YCAtIEVtaXR0ZWQgd2l0aCBvbGQgYW5kIG5ldyBmbGFzaCBleGVjdXRvciBhZGRyZXNzZXMAAAAAEnNldF9mbGFzaF9leGVjdXRvcgAAAAAAAQAAAAAAAAAOZmxhc2hfZXhlY3V0b3IAAAAAABMAAAAA",
        "AAAAAAAAAJFSZXR1cm5zIHRoZSBnbG9iYWwgRmxhc2hFeGVjdXRvciBhZGRyZXNzLgoKIyBBcmd1bWVudHMKKiBgZW52YCAtIFRoZSBjb250cmFjdCBlbnZpcm9ubWVudAoKIyBSZXR1cm5zCiogYEFkZHJlc3NgIC0gRmxhc2hFeGVjdXRvciBjb250cmFjdCBhZGRyZXNzAAAAAAAAEmdldF9mbGFzaF9leGVjdXRvcgAAAAAAAAAAAAEAAAAT",
        "AAAAAAAAAVVTZXRzIHRoZSBnbG9iYWwgcHJvdG9jb2wgZmVlIGRlbm9taW5hdG9ycyBmb3IgYWxsIHBvb2xzLgoKIyBBcmd1bWVudHMKKiBgZW52YCAtIFRoZSBjb250cmFjdCBlbnZpcm9ubWVudAoqIGBmZWVfcHJvdG9jb2wwYCAtIFByb3RvY29sIGZlZSBkZW5vbWluYXRvciBmb3IgdG9rZW4wICgwIG9yIDQtMTApCiogYGZlZV9wcm90b2NvbDFgIC0gUHJvdG9jb2wgZmVlIGRlbm9taW5hdG9yIGZvciB0b2tlbjEgKDAgb3IgNC0xMCkKCiMgUmV0dXJucwoqIGBPaygoKSlgIG9uIHN1Y2Nlc3MKKiBgRXJyKEludmFsaWRGZWVQcm90b2NvbClgIGlmIGVpdGhlciBmZWUgaXMgbm90IDAgb3IgaW4gcmFuZ2UgNC0xMAAAAAAAABBzZXRfcHJvdG9jb2xfZmVlAAAAAgAAAAAAAAANZmVlX3Byb3RvY29sMAAAAAAAAAQAAAAAAAAADWZlZV9wcm90b2NvbDEAAAAAAAAEAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAALJSZXR1cm5zIHRoZSBwcm90b2NvbCBmZWUgZGVub21pbmF0b3IgZm9yIHRva2VuMC4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgY29udHJhY3QgZW52aXJvbm1lbnQKCiMgUmV0dXJucwoqIGB1MzJgIC0gUHJvdG9jb2wgZmVlIGRlbm9taW5hdG9yIGZvciB0b2tlbjAgKDAgaWYgZGlzYWJsZWQsIG9yIDQtMTApAAAAAAASZ2V0X3Byb3RvY29sX2ZlZV8wAAAAAAAAAAAAAQAAAAQ=",
        "AAAAAAAAALJSZXR1cm5zIHRoZSBwcm90b2NvbCBmZWUgZGVub21pbmF0b3IgZm9yIHRva2VuMS4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgY29udHJhY3QgZW52aXJvbm1lbnQKCiMgUmV0dXJucwoqIGB1MzJgIC0gUHJvdG9jb2wgZmVlIGRlbm9taW5hdG9yIGZvciB0b2tlbjEgKDAgaWYgZGlzYWJsZWQsIG9yIDQtMTApAAAAAAASZ2V0X3Byb3RvY29sX2ZlZV8xAAAAAAAAAAAAAQAAAAQ=",
        "AAAAAAAAAVtDcmVhdGVzIGEgbmV3IHBvb2wgZm9yIHRoZSBnaXZlbiB0b2tlbiBwYWlyIGFuZCBmZWUgdGllci4KCiMgQXJndW1lbnRzCiogYGVgIC0gVGhlIGNvbnRyYWN0IGVudmlyb25tZW50CiogYHRva2VuX2FgIC0gRmlyc3QgdG9rZW4gYWRkcmVzcwoqIGB0b2tlbl9iYCAtIFNlY29uZCB0b2tlbiBhZGRyZXNzCiogYGZlZWAgLSBGZWUgdGllciBpbiBiYXNpcyBwb2ludHMKCiMgUmV0dXJucwoqIGBPayhBZGRyZXNzKWAgLSBBZGRyZXNzIG9mIHRoZSBuZXdseSBjcmVhdGVkIHBvb2wKKiBgRXJyKEVycm9yKWAgLSBJZiB2YWxpZGF0aW9uIGZhaWxzIChzZWUgcG9vbDo6Y3JlYXRlX3Bvb2wgZm9yIGVycm9yIGNvZGVzKQAAAAALY3JlYXRlX3Bvb2wAAAAAAwAAAAAAAAAHdG9rZW5fYQAAAAATAAAAAAAAAAd0b2tlbl9iAAAAABMAAAAAAAAAA2ZlZQAAAAAEAAAAAQAAA+kAAAATAAAAAw==",
        "AAAAAAAAAUdSZXR1cm5zIHRoZSBwb29sIGFkZHJlc3MgZm9yIGEgZ2l2ZW4gdG9rZW4gcGFpciBhbmQgZmVlIHRpZXIuCgojIEFyZ3VtZW50cwoqIGBlbnZgIC0gVGhlIGNvbnRyYWN0IGVudmlyb25tZW50CiogYHRva2VuX2FgIC0gRmlyc3QgdG9rZW4gYWRkcmVzcwoqIGB0b2tlbl9iYCAtIFNlY29uZCB0b2tlbiBhZGRyZXNzCiogYGZlZWAgLSBGZWUgdGllciBpbiBiYXNpcyBwb2ludHMKCiMgUmV0dXJucwoqIGBTb21lKEFkZHJlc3MpYCAtIFBvb2wgYWRkcmVzcyBpZiBpdCBleGlzdHMKKiBgTm9uZWAgLSBJZiBubyBwb29sIGV4aXN0cyBmb3IgdGhpcyB0b2tlbiBwYWlyIGFuZCBmZWUAAAAACGdldF9wb29sAAAAAwAAAAAAAAAHdG9rZW5fYQAAAAATAAAAAAAAAAd0b2tlbl9iAAAAABMAAAAAAAAAA2ZlZQAAAAAEAAAAAQAAA+gAAAAT",
        "AAAAAAAAAKRTZXRzIGEgZGVmYXVsdCByb3V0ZXIgdG8gYmUgYXV0by1hdXRob3JpemVkIG9uIG5ldyBwb29scy4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgY29udHJhY3QgZW52aXJvbm1lbnQKKiBgcm91dGVyYCAtIFJvdXRlciBhZGRyZXNzIHRvIGF1dG8tYXV0aG9yaXplIG9uIG5ldyBwb29scwAAABJzZXRfZGVmYXVsdF9yb3V0ZXIAAAAAAAEAAAAAAAAABnJvdXRlcgAAAAAAEwAAAAA=",
        "AAAAAAAAAFJDbGVhcnMgdGhlIGRlZmF1bHQgcm91dGVyIHNldHRpbmcuCgojIEFyZ3VtZW50cwoqIGBlbnZgIC0gVGhlIGNvbnRyYWN0IGVudmlyb25tZW50AAAAAAAUY2xlYXJfZGVmYXVsdF9yb3V0ZXIAAAAAAAAAAA==",
        "AAAAAAAAAPNBdXRob3JpemVzIG9yIHJldm9rZXMgYSByb3V0ZXIgZm9yIGEgc3BlY2lmaWMgcG9vbC4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgY29udHJhY3QgZW52aXJvbm1lbnQKKiBgcG9vbGAgLSBQb29sIGFkZHJlc3MgdG8gY29uZmlndXJlCiogYHJvdXRlcmAgLSBSb3V0ZXIgYWRkcmVzcyB0byBhdXRob3JpemUvcmV2b2tlCiogYGFsbG93ZWRgIC0gVHJ1ZSB0byBncmFudCBhdXRob3JpemF0aW9uLCBmYWxzZSB0byByZXZva2UAAAAAGnNldF9wb29sX3JvdXRlcl9hdXRob3JpemVkAAAAAAADAAAAAAAAAARwb29sAAAAEwAAAAAAAAAGcm91dGVyAAAAAAATAAAAAAAAAAdhbGxvd2VkAAAAAAEAAAAA",
        "AAAAAAAAAV5FbmFibGVzIGEgbmV3IGZlZSB0aWVyIHdpdGggYXNzb2NpYXRlZCB0aWNrIHNwYWNpbmcuCgojIEFyZ3VtZW50cwoqIGBlbnZgIC0gVGhlIGNvbnRyYWN0IGVudmlyb25tZW50CiogYGZlZWAgLSBGZWUgdGllciBpbiBiYXNpcyBwb2ludHMgKG11c3QgYmUgPCAxLDAwMCwwMDApCiogYHRpY2tfc3BhY2luZ2AgLSBUaWNrIHNwYWNpbmcgZm9yIHRoaXMgZmVlIHRpZXIgKG11c3QgYmUgPiAwIGFuZCA8IDE2LDM4NCkKCiMgUmV0dXJucwoqIGBPaygoKSlgIG9uIHN1Y2Nlc3MKKiBgRXJyKEVycm9yKWAgLSBJZiB2YWxpZGF0aW9uIGZhaWxzIChzZWUgZmVlczo6ZW5hYmxlX2ZlZV9hbW91bnQgZm9yIGVycm9yIGNvZGVzKQAAAAAACWVfZmVlX2FtdAAAAAAAAAIAAAAAAAAAA2ZlZQAAAAAEAAAAAAAAAAx0aWNrX3NwYWNpbmcAAAAFAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAHQAAAAAAAAAMVW5hdXRob3JpemVkAAAAAQAAAAAAAAAQSW52YWxpZFRpY2tSYW5nZQAAAAoAAAAAAAAAEEludmFsaWRMaXF1aWRpdHkAAAALAAAAAAAAAA1JbnZhbGlkQW1vdW50AAAAAAAADAAAAAAAAAAQSW52YWxpZFNxcnRQcmljZQAAAA0AAAAAAAAACkludmFsaWRGZWUAAAAAAA4AAAAAAAAAEkludmFsaWRUaWNrU3BhY2luZwAAAAAADwAAAAAAAAARSW52YWxpZFByaWNlTGltaXQAAAAAAAAQAAAAAAAAAAtPdXRPZkJvdW5kcwAAAAAUAAAAAAAAAAhPdmVyZmxvdwAAABUAAAAAAAAACVVuZGVyZmxvdwAAAAAAABYAAAAAAAAADkRpdmlzaW9uQnlaZXJvAAAAAAAXAAAAAAAAAA5Ob3RJbml0aWFsaXplZAAAAAAAKAAAAAAAAAASQWxyZWFkeUluaXRpYWxpemVkAAAAAAApAAAAAAAAABBQb3NpdGlvbk5vdEZvdW5kAAAAKgAAAAAAAAAVSW5zdWZmaWNpZW50TGlxdWlkaXR5AAAAAAAAKwAAAAAAAAASVGlja05vdEluaXRpYWxpemVkAAAAAAAyAAAAAAAAABNJbnZhbGlkVGlja1Bvc2l0aW9uAAAAADMAAAAAAAAAEkludmFsaWRPYnNlcnZhdGlvbgAAAAAAPAAAAAAAAAART2JzZXJ2YXRpb25Ub29PbGQAAAAAAAA9AAAAAAAAAAZMb2NrZWQAAAAAAEEAAAAAAAAAEkluc3VmZmljaWVudFRva2VuMAAAAAAARgAAAAAAAAASSW5zdWZmaWNpZW50VG9rZW4xAAAAAABHAAAAAAAAABZJbnN1ZmZpY2llbnRSZXBheW1lbnQwAAAAAABQAAAAAAAAABZJbnN1ZmZpY2llbnRSZXBheW1lbnQxAAAAAABRAAAAAAAAAA5GbGFzaE5vdExvY2tlZAAAAAAAUgAAAAAAAAAUTXVzdFVzZUZsYXNoRXhlY3V0b3IAAABTAAAAAAAAAA9JZGVudGljYWxUb2tlbnMAAAAAWgAAAAAAAAARUG9vbEFscmVhZHlFeGlzdHMAAAAAAABb" ]),
      options
    )
  }
  public readonly fromJSON = {
    set_owner: this.txFromJSON<null>,
        get_owner: this.txFromJSON<string>,
        set_flash_executor: this.txFromJSON<null>,
        get_flash_executor: this.txFromJSON<string>,
        set_protocol_fee: this.txFromJSON<Result<void>>,
        get_protocol_fee_0: this.txFromJSON<u32>,
        get_protocol_fee_1: this.txFromJSON<u32>,
        create_pool: this.txFromJSON<Result<string>>,
        get_pool: this.txFromJSON<Option<string>>,
        set_default_router: this.txFromJSON<null>,
        clear_default_router: this.txFromJSON<null>,
        set_pool_router_authorized: this.txFromJSON<null>,
        e_fee_amt: this.txFromJSON<Result<void>>
  }
}