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
    contractId: "CASHTJLV5PUO4M2KY2SK26JFCQTXQ5C32ROQJODDJET3QAQNML3HOG2P",
  }
} as const



/**
 * Parameters passed to FlashStrategy.execute()
 * 
 * Bundles all flash loan context into a single struct to:
 * - Keep function signatures clean (avoid 9-parameter functions)
 * - Make the interface easier to extend without breaking compatibility
 * - Provide complete context to strategies in one package
 */
export interface FlashCallbackParams {
  /**
 * Amount of token0 borrowed
 */
amount0: u128;
  /**
 * Amount of token1 borrowed
 */
amount1: u128;
  /**
 * Custom data for strategy execution
 */
data: Buffer;
  /**
 * Fee required for token0 repayment
 */
fee0: u128;
  /**
 * Fee required for token1 repayment
 */
fee1: u128;
  /**
 * Pool address tokens were borrowed from
 */
pool: string;
  /**
 * Address of token0 in the pool
 */
token0: string;
  /**
 * Address of token1 in the pool
 */
token1: string;
}

export interface Client {
  /**
   * Construct and simulate a execute_flash_loan transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Execute flash loan with custom flash strategy
   * 
   * This is the safe entry point for all flash loans. The FlashExecutor:
   * 1. Calls flash_begin() as the initiator (only FlashExecutor is authorized)
   * 2. Invokes the user's FlashStrategy contract with borrowed tokens
   * 3. Always calls flash_end() to verify repayment
   * 
   * # Arguments
   * * `pool` - Pool address to borrow from
   * * `strategy` - User's strategy contract address
   * * `amount0` - Amount of token0 to borrow
   * * `amount1` - Amount of token1 to borrow
   * * `data` - Arbitrary data passed to strategy
   * 
   * # Returns
   * * `Ok(())` - Flash loan executed successfully
   * * `Err(Error)` - Flash loan failed (insufficient repayment, strategy error, etc.)
   * 
   * # Events
   * * `flash_executed` - Emitted on successful execution
   * 
   * # Example
   * ```ignore
   * flash_executor.execute_flash_loan(
   * pool: pool_address,
   * strategy: my_strategy_address,
   * amount0: 10000,
   * amount1: 0,
   * data: strategy_params
   * )
   * ```
   */
  execute_flash_loan: ({pool, strategy, amount0, amount1, data}: {pool: string, strategy: string, amount0: u128, amount1: u128, data: Buffer}, options?: {
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
      new ContractSpec([ "AAAABQAAADhFdmVudCBlbWl0dGVkIHdoZW4gYSBmbGFzaCBsb2FuIGlzIGV4ZWN1dGVkIHN1Y2Nlc3NmdWxseQAAAAAAAAASRmxhc2hFeGVjdXRlZEV2ZW50AAAAAAABAAAADmZsYXNoX2V4ZWN1dGVkAAAAAAAGAAAAAAAAAARwb29sAAAAEwAAAAAAAAAAAAAACHN0cmF0ZWd5AAAAEwAAAAAAAAAAAAAAB2Ftb3VudDAAAAAACgAAAAAAAAAAAAAAB2Ftb3VudDEAAAAACgAAAAAAAAAAAAAABGZlZTAAAAAKAAAAAAAAAAAAAAAEZmVlMQAAAAoAAAAAAAAAAg==",
        "AAAAAQAAASFQYXJhbWV0ZXJzIHBhc3NlZCB0byBGbGFzaFN0cmF0ZWd5LmV4ZWN1dGUoKQoKQnVuZGxlcyBhbGwgZmxhc2ggbG9hbiBjb250ZXh0IGludG8gYSBzaW5nbGUgc3RydWN0IHRvOgotIEtlZXAgZnVuY3Rpb24gc2lnbmF0dXJlcyBjbGVhbiAoYXZvaWQgOS1wYXJhbWV0ZXIgZnVuY3Rpb25zKQotIE1ha2UgdGhlIGludGVyZmFjZSBlYXNpZXIgdG8gZXh0ZW5kIHdpdGhvdXQgYnJlYWtpbmcgY29tcGF0aWJpbGl0eQotIFByb3ZpZGUgY29tcGxldGUgY29udGV4dCB0byBzdHJhdGVnaWVzIGluIG9uZSBwYWNrYWdlAAAAAAAAAAAAABNGbGFzaENhbGxiYWNrUGFyYW1zAAAAAAgAAAAZQW1vdW50IG9mIHRva2VuMCBib3Jyb3dlZAAAAAAAAAdhbW91bnQwAAAAAAoAAAAZQW1vdW50IG9mIHRva2VuMSBib3Jyb3dlZAAAAAAAAAdhbW91bnQxAAAAAAoAAAAiQ3VzdG9tIGRhdGEgZm9yIHN0cmF0ZWd5IGV4ZWN1dGlvbgAAAAAABGRhdGEAAAAOAAAAIUZlZSByZXF1aXJlZCBmb3IgdG9rZW4wIHJlcGF5bWVudAAAAAAAAARmZWUwAAAACgAAACFGZWUgcmVxdWlyZWQgZm9yIHRva2VuMSByZXBheW1lbnQAAAAAAAAEZmVlMQAAAAoAAAAmUG9vbCBhZGRyZXNzIHRva2VucyB3ZXJlIGJvcnJvd2VkIGZyb20AAAAAAARwb29sAAAAEwAAAB1BZGRyZXNzIG9mIHRva2VuMCBpbiB0aGUgcG9vbAAAAAAAAAZ0b2tlbjAAAAAAABMAAAAdQWRkcmVzcyBvZiB0b2tlbjEgaW4gdGhlIHBvb2wAAAAAAAAGdG9rZW4xAAAAAAAT",
        "AAAAAAAAA4BFeGVjdXRlIGZsYXNoIGxvYW4gd2l0aCBjdXN0b20gZmxhc2ggc3RyYXRlZ3kKClRoaXMgaXMgdGhlIHNhZmUgZW50cnkgcG9pbnQgZm9yIGFsbCBmbGFzaCBsb2Fucy4gVGhlIEZsYXNoRXhlY3V0b3I6CjEuIENhbGxzIGZsYXNoX2JlZ2luKCkgYXMgdGhlIGluaXRpYXRvciAob25seSBGbGFzaEV4ZWN1dG9yIGlzIGF1dGhvcml6ZWQpCjIuIEludm9rZXMgdGhlIHVzZXIncyBGbGFzaFN0cmF0ZWd5IGNvbnRyYWN0IHdpdGggYm9ycm93ZWQgdG9rZW5zCjMuIEFsd2F5cyBjYWxscyBmbGFzaF9lbmQoKSB0byB2ZXJpZnkgcmVwYXltZW50CgojIEFyZ3VtZW50cwoqIGBwb29sYCAtIFBvb2wgYWRkcmVzcyB0byBib3Jyb3cgZnJvbQoqIGBzdHJhdGVneWAgLSBVc2VyJ3Mgc3RyYXRlZ3kgY29udHJhY3QgYWRkcmVzcwoqIGBhbW91bnQwYCAtIEFtb3VudCBvZiB0b2tlbjAgdG8gYm9ycm93CiogYGFtb3VudDFgIC0gQW1vdW50IG9mIHRva2VuMSB0byBib3Jyb3cKKiBgZGF0YWAgLSBBcmJpdHJhcnkgZGF0YSBwYXNzZWQgdG8gc3RyYXRlZ3kKCiMgUmV0dXJucwoqIGBPaygoKSlgIC0gRmxhc2ggbG9hbiBleGVjdXRlZCBzdWNjZXNzZnVsbHkKKiBgRXJyKEVycm9yKWAgLSBGbGFzaCBsb2FuIGZhaWxlZCAoaW5zdWZmaWNpZW50IHJlcGF5bWVudCwgc3RyYXRlZ3kgZXJyb3IsIGV0Yy4pCgojIEV2ZW50cwoqIGBmbGFzaF9leGVjdXRlZGAgLSBFbWl0dGVkIG9uIHN1Y2Nlc3NmdWwgZXhlY3V0aW9uCgojIEV4YW1wbGUKYGBgaWdub3JlCmZsYXNoX2V4ZWN1dG9yLmV4ZWN1dGVfZmxhc2hfbG9hbigKcG9vbDogcG9vbF9hZGRyZXNzLApzdHJhdGVneTogbXlfc3RyYXRlZ3lfYWRkcmVzcywKYW1vdW50MDogMTAwMDAsCmFtb3VudDE6IDAsCmRhdGE6IHN0cmF0ZWd5X3BhcmFtcwopCmBgYAAAABJleGVjdXRlX2ZsYXNoX2xvYW4AAAAAAAUAAAAAAAAABHBvb2wAAAATAAAAAAAAAAhzdHJhdGVneQAAABMAAAAAAAAAB2Ftb3VudDAAAAAACgAAAAAAAAAHYW1vdW50MQAAAAAKAAAAAAAAAARkYXRhAAAADgAAAAA=" ]),
      options
    )
  }
  public readonly fromJSON = {
    execute_flash_loan: this.txFromJSON<null>
  }
}