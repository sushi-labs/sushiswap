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
    contractId: "CAEMKWO4YHQWHREVS7QFIFCAVB4Q5D5CCTS2HWX2GFNVBCD6ZI5D52S2",
  }
} as const

export type StorageKey = {tag: "Owner", values: void} | {tag: "FeeAmtTickSpacing", values: readonly [u32]} | {tag: "GetPool", values: readonly [string, string, u32]} | {tag: "WasmHash", values: void} | {tag: "ProtocolFee0", values: void} | {tag: "ProtocolFee1", values: void} | {tag: "DefaultRouter", values: void};




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
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAClN0b3JhZ2VLZXkAAAAAAAcAAAAAAAAAAAAAAAVPd25lcgAAAAAAAAEAAAAAAAAAEUZlZUFtdFRpY2tTcGFjaW5nAAAAAAAAAQAAAAQAAAABAAAAAAAAAAdHZXRQb29sAAAAAAMAAAATAAAAEwAAAAQAAAAAAAAAAAAAAAhXYXNtSGFzaAAAAAAAAAAAAAAADFByb3RvY29sRmVlMAAAAAAAAAAAAAAADFByb3RvY29sRmVlMQAAAAAAAAAAAAAADURlZmF1bHRSb3V0ZXIAAAA=",
        "AAAABQAAAAAAAAAAAAAAFUZlZUFtb3VudEVuYWJsZWRFdmVudAAAAAAAAAEAAAASZmVlX2Ftb3VudF9lbmFibGVkAAAAAAACAAAAAAAAAANmZWUAAAAABAAAAAAAAAAAAAAADHRpY2tfc3BhY2luZwAAAAUAAAAAAAAAAg==",
        "AAAABQAAAAAAAAAAAAAAEFBvb2xDcmVhdGVkRXZlbnQAAAABAAAADHBvb2xfY3JlYXRlZAAAAAYAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAAAAAAABnRva2VuMAAAAAAAEwAAAAAAAAAAAAAABnRva2VuMQAAAAAAEwAAAAAAAAAAAAAAA2ZlZQAAAAAEAAAAAAAAAAAAAAAMdGlja19zcGFjaW5nAAAABQAAAAAAAAAAAAAADHBvb2xfYWRkcmVzcwAAABMAAAAAAAAAAg==",
        "AAAABQAAAAAAAAAAAAAAE1NldFByb3RvY29sRmVlRXZlbnQAAAAAAQAAABBzZXRfcHJvdG9jb2xfZmVlAAAABAAAAAAAAAARZmVlX3Byb3RvY29sMF9vbGQAAAAAAAAEAAAAAAAAAAAAAAARZmVlX3Byb3RvY29sMV9vbGQAAAAAAAAEAAAAAAAAAAAAAAARZmVlX3Byb3RvY29sMF9uZXcAAAAAAAAEAAAAAAAAAAAAAAARZmVlX3Byb3RvY29sMV9uZXcAAAAAAAAEAAAAAAAAAAI=",
        "AAAAAAAAAeVJbml0aWFsaXplcyB0aGUgZmFjdG9yeSB3aXRoIGFuIGFkbWluaXN0cmF0b3IgYW5kIHBvb2wgV0FTTSBoYXNoLgoKU2V0cyB1cCB0aGUgZmFjdG9yeSB3aXRoIGRlZmF1bHQgZmVlIHRpZXJzIG1hdGNoaW5nIFVuaXN3YXAgVjM6Ci0gMC4wNSUgKDUwMCBicHMpIHdpdGggdGljayBzcGFjaW5nIDEwIChmb3Igc3RhYmxlY29pbiBwYWlycykKLSAwLjMlICgzMDAwIGJwcykgd2l0aCB0aWNrIHNwYWNpbmcgNjAgKGZvciBtb3N0IHBhaXJzKQotIDElICgxMDAwMCBicHMpIHdpdGggdGljayBzcGFjaW5nIDIwMCAoZm9yIGV4b3RpYyBwYWlycykKCkluaXRpYWxpemVzIHByb3RvY29sIGZlZXMgdG8gMC4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgY29udHJhY3QgZW52aXJvbm1lbnQKKiBgYWRtaW5gIC0gQWRkcmVzcyBvZiB0aGUgZmFjdG9yeSBvd25lcgoqIGB3YXNtX2hhc2hgIC0gV0FTTSBoYXNoIG9mIHRoZSBwb29sIGNvbnRyYWN0IHRvIGRlcGxveQAAAAAAAA1fX2NvbnN0cnVjdG9yAAAAAAAAAgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAl3YXNtX2hhc2gAAAAAAAPuAAAAIAAAAAA=",
        "AAAAAAAAALFUcmFuc2ZlcnMgZmFjdG9yeSBvd25lcnNoaXAgdG8gYSBuZXcgYWRtaW5pc3RyYXRvci4KCiMgQXJndW1lbnRzCiogYGVgIC0gVGhlIGNvbnRyYWN0IGVudmlyb25tZW50CiogYG5ld19hZG1pbmAgLSBBZGRyZXNzIG9mIHRoZSBuZXcgb3duZXIgKHJlcXVpcmVzIGN1cnJlbnQgb3duZXIgYXV0aG9yaXphdGlvbikAAAAAAAAJc2V0X293bmVyAAAAAAAAAQAAAAAAAAAJbmV3X2FkbWluAAAAAAAAEwAAAAA=",
        "AAAAAAAAAIdSZXR1cm5zIHRoZSBjdXJyZW50IGZhY3Rvcnkgb3duZXIgYWRkcmVzcy4KCiMgQXJndW1lbnRzCiogYGVgIC0gVGhlIGNvbnRyYWN0IGVudmlyb25tZW50CgojIFJldHVybnMKKiBgQWRkcmVzc2AgLSBDdXJyZW50IGZhY3Rvcnkgb3duZXIAAAAACWdldF9vd25lcgAAAAAAAAAAAAABAAAAEw==",
        "AAAAAAAAAVVTZXRzIHRoZSBnbG9iYWwgcHJvdG9jb2wgZmVlIGRlbm9taW5hdG9ycyBmb3IgYWxsIHBvb2xzLgoKIyBBcmd1bWVudHMKKiBgZW52YCAtIFRoZSBjb250cmFjdCBlbnZpcm9ubWVudAoqIGBmZWVfcHJvdG9jb2wwYCAtIFByb3RvY29sIGZlZSBkZW5vbWluYXRvciBmb3IgdG9rZW4wICgwIG9yIDQtMTApCiogYGZlZV9wcm90b2NvbDFgIC0gUHJvdG9jb2wgZmVlIGRlbm9taW5hdG9yIGZvciB0b2tlbjEgKDAgb3IgNC0xMCkKCiMgUmV0dXJucwoqIGBPaygoKSlgIG9uIHN1Y2Nlc3MKKiBgRXJyKEludmFsaWRGZWVQcm90b2NvbClgIGlmIGVpdGhlciBmZWUgaXMgbm90IDAgb3IgaW4gcmFuZ2UgNC0xMAAAAAAAABBzZXRfcHJvdG9jb2xfZmVlAAAAAgAAAAAAAAANZmVlX3Byb3RvY29sMAAAAAAAAAQAAAAAAAAADWZlZV9wcm90b2NvbDEAAAAAAAAEAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAALJSZXR1cm5zIHRoZSBwcm90b2NvbCBmZWUgZGVub21pbmF0b3IgZm9yIHRva2VuMC4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgY29udHJhY3QgZW52aXJvbm1lbnQKCiMgUmV0dXJucwoqIGB1MzJgIC0gUHJvdG9jb2wgZmVlIGRlbm9taW5hdG9yIGZvciB0b2tlbjAgKDAgaWYgZGlzYWJsZWQsIG9yIDQtMTApAAAAAAASZ2V0X3Byb3RvY29sX2ZlZV8wAAAAAAAAAAAAAQAAAAQ=",
        "AAAAAAAAALJSZXR1cm5zIHRoZSBwcm90b2NvbCBmZWUgZGVub21pbmF0b3IgZm9yIHRva2VuMS4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgY29udHJhY3QgZW52aXJvbm1lbnQKCiMgUmV0dXJucwoqIGB1MzJgIC0gUHJvdG9jb2wgZmVlIGRlbm9taW5hdG9yIGZvciB0b2tlbjEgKDAgaWYgZGlzYWJsZWQsIG9yIDQtMTApAAAAAAASZ2V0X3Byb3RvY29sX2ZlZV8xAAAAAAAAAAAAAQAAAAQ=",
        "AAAAAAAAAVtDcmVhdGVzIGEgbmV3IHBvb2wgZm9yIHRoZSBnaXZlbiB0b2tlbiBwYWlyIGFuZCBmZWUgdGllci4KCiMgQXJndW1lbnRzCiogYGVgIC0gVGhlIGNvbnRyYWN0IGVudmlyb25tZW50CiogYHRva2VuX2FgIC0gRmlyc3QgdG9rZW4gYWRkcmVzcwoqIGB0b2tlbl9iYCAtIFNlY29uZCB0b2tlbiBhZGRyZXNzCiogYGZlZWAgLSBGZWUgdGllciBpbiBiYXNpcyBwb2ludHMKCiMgUmV0dXJucwoqIGBPayhBZGRyZXNzKWAgLSBBZGRyZXNzIG9mIHRoZSBuZXdseSBjcmVhdGVkIHBvb2wKKiBgRXJyKEVycm9yKWAgLSBJZiB2YWxpZGF0aW9uIGZhaWxzIChzZWUgcG9vbDo6Y3JlYXRlX3Bvb2wgZm9yIGVycm9yIGNvZGVzKQAAAAALY3JlYXRlX3Bvb2wAAAAAAwAAAAAAAAAHdG9rZW5fYQAAAAATAAAAAAAAAAd0b2tlbl9iAAAAABMAAAAAAAAAA2ZlZQAAAAAEAAAAAQAAA+kAAAATAAAAAw==",
        "AAAAAAAAAUdSZXR1cm5zIHRoZSBwb29sIGFkZHJlc3MgZm9yIGEgZ2l2ZW4gdG9rZW4gcGFpciBhbmQgZmVlIHRpZXIuCgojIEFyZ3VtZW50cwoqIGBlbnZgIC0gVGhlIGNvbnRyYWN0IGVudmlyb25tZW50CiogYHRva2VuX2FgIC0gRmlyc3QgdG9rZW4gYWRkcmVzcwoqIGB0b2tlbl9iYCAtIFNlY29uZCB0b2tlbiBhZGRyZXNzCiogYGZlZWAgLSBGZWUgdGllciBpbiBiYXNpcyBwb2ludHMKCiMgUmV0dXJucwoqIGBTb21lKEFkZHJlc3MpYCAtIFBvb2wgYWRkcmVzcyBpZiBpdCBleGlzdHMKKiBgTm9uZWAgLSBJZiBubyBwb29sIGV4aXN0cyBmb3IgdGhpcyB0b2tlbiBwYWlyIGFuZCBmZWUAAAAACGdldF9wb29sAAAAAwAAAAAAAAAHdG9rZW5fYQAAAAATAAAAAAAAAAd0b2tlbl9iAAAAABMAAAAAAAAAA2ZlZQAAAAAEAAAAAQAAA+gAAAAT",
        "AAAAAAAAAKRTZXRzIGEgZGVmYXVsdCByb3V0ZXIgdG8gYmUgYXV0by1hdXRob3JpemVkIG9uIG5ldyBwb29scy4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgY29udHJhY3QgZW52aXJvbm1lbnQKKiBgcm91dGVyYCAtIFJvdXRlciBhZGRyZXNzIHRvIGF1dG8tYXV0aG9yaXplIG9uIG5ldyBwb29scwAAABJzZXRfZGVmYXVsdF9yb3V0ZXIAAAAAAAEAAAAAAAAABnJvdXRlcgAAAAAAEwAAAAA=",
        "AAAAAAAAAFJDbGVhcnMgdGhlIGRlZmF1bHQgcm91dGVyIHNldHRpbmcuCgojIEFyZ3VtZW50cwoqIGBlbnZgIC0gVGhlIGNvbnRyYWN0IGVudmlyb25tZW50AAAAAAAUY2xlYXJfZGVmYXVsdF9yb3V0ZXIAAAAAAAAAAA==",
        "AAAAAAAAAPNBdXRob3JpemVzIG9yIHJldm9rZXMgYSByb3V0ZXIgZm9yIGEgc3BlY2lmaWMgcG9vbC4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgY29udHJhY3QgZW52aXJvbm1lbnQKKiBgcG9vbGAgLSBQb29sIGFkZHJlc3MgdG8gY29uZmlndXJlCiogYHJvdXRlcmAgLSBSb3V0ZXIgYWRkcmVzcyB0byBhdXRob3JpemUvcmV2b2tlCiogYGFsbG93ZWRgIC0gVHJ1ZSB0byBncmFudCBhdXRob3JpemF0aW9uLCBmYWxzZSB0byByZXZva2UAAAAAGnNldF9wb29sX3JvdXRlcl9hdXRob3JpemVkAAAAAAADAAAAAAAAAARwb29sAAAAEwAAAAAAAAAGcm91dGVyAAAAAAATAAAAAAAAAAdhbGxvd2VkAAAAAAEAAAAA",
        "AAAAAAAAAV5FbmFibGVzIGEgbmV3IGZlZSB0aWVyIHdpdGggYXNzb2NpYXRlZCB0aWNrIHNwYWNpbmcuCgojIEFyZ3VtZW50cwoqIGBlbnZgIC0gVGhlIGNvbnRyYWN0IGVudmlyb25tZW50CiogYGZlZWAgLSBGZWUgdGllciBpbiBiYXNpcyBwb2ludHMgKG11c3QgYmUgPCAxLDAwMCwwMDApCiogYHRpY2tfc3BhY2luZ2AgLSBUaWNrIHNwYWNpbmcgZm9yIHRoaXMgZmVlIHRpZXIgKG11c3QgYmUgPiAwIGFuZCA8IDE2LDM4NCkKCiMgUmV0dXJucwoqIGBPaygoKSlgIG9uIHN1Y2Nlc3MKKiBgRXJyKEVycm9yKWAgLSBJZiB2YWxpZGF0aW9uIGZhaWxzIChzZWUgZmVlczo6ZW5hYmxlX2ZlZV9hbW91bnQgZm9yIGVycm9yIGNvZGVzKQAAAAAACWVfZmVlX2FtdAAAAAAAAAIAAAAAAAAAA2ZlZQAAAAAEAAAAAAAAAAx0aWNrX3NwYWNpbmcAAAAFAAAAAQAAA+kAAAPtAAAAAAAAAAM=" ]),
      options
    )
  }
  public readonly fromJSON = {
    set_owner: this.txFromJSON<null>,
        get_owner: this.txFromJSON<string>,
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