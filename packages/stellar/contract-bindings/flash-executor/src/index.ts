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
  futurenet: {
    networkPassphrase: "Test SDF Future Network ; October 2022",
    contractId: "CCTXWTN6XZZ2JAEWAEROT3WUTPHUP6UOPW2XMASC5Z5J2V6ADO2XVAZS",
  }
} as const


/**
 * Oracle hints for deterministic footprint bounding
 * 
 * Bundles slot and checkpoint hints to bound storage reads during oracle operations.
 * This enables strategies to perform swaps without footprint explosion.
 */
export interface OracleHints {
  /**
 * Checkpoint hint for bounding historical checkpoint reads
 */
checkpoint: u32;
  /**
 * Slot hint for bounding recent bucket reads
 */
slot: u128;
}



/**
 * Parameters passed to FlashStrategy.execute()
 */
export interface FlashStrategyParams {
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
 * Oracle hints for swap operations (from flash_begin)
 */
oracle_hints: OracleHints;
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
  /**
 * User who initiated the flash loan
 */
user: string;
}

export interface Client {
  /**
   * Construct and simulate a execute_flash_loan transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Execute flash loan with custom flash strategy
   * 
   * This is the safe entry point for all flash loans. The FlashExecutor:
   * 1. Validates the user authorized this transaction (user.require_auth)
   * 2. Calls flash_begin() as the initiator (only FlashExecutor is authorized)
   * 3. Invokes the user's FlashStrategy contract with borrowed tokens
   * 4. Always calls flash_end() to verify repayment
   * 
   * # Arguments
   * * `pool` - Pool address to borrow from
   * * `strategy` - User's strategy contract address
   * * `user` - Address of user initiating the flash loan (must sign transaction)
   * * `amount0` - Amount of token0 to borrow
   * * `amount1` - Amount of token1 to borrow
   * * `data` - Arbitrary data passed to strategy
   * 
   * # Strategy Access Control
   * Strategies receive `user` in FlashStrategyParams and can:
   * - Ignore it for permissionless execution (default)
   * - Check against allowlist for restricted access
   * - Implement custom authorization logic
   * 
   * # Returns
   * * `Ok(())` - Flash loan executed successfully
   * * `Err(Error)` - Flash loan failed (insufficient repayment, strat
   */
  execute_flash_loan: ({pool, strategy, user, amount0, amount1, data}: {pool: string, strategy: string, user: string, amount0: u128, amount1: u128, data: Buffer}, options?: {
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
      new ContractSpec([ "AAAAAQAAAMtPcmFjbGUgaGludHMgZm9yIGRldGVybWluaXN0aWMgZm9vdHByaW50IGJvdW5kaW5nCgpCdW5kbGVzIHNsb3QgYW5kIGNoZWNrcG9pbnQgaGludHMgdG8gYm91bmQgc3RvcmFnZSByZWFkcyBkdXJpbmcgb3JhY2xlIG9wZXJhdGlvbnMuClRoaXMgZW5hYmxlcyBzdHJhdGVnaWVzIHRvIHBlcmZvcm0gc3dhcHMgd2l0aG91dCBmb290cHJpbnQgZXhwbG9zaW9uLgAAAAAAAAAAC09yYWNsZUhpbnRzAAAAAAIAAAA4Q2hlY2twb2ludCBoaW50IGZvciBib3VuZGluZyBoaXN0b3JpY2FsIGNoZWNrcG9pbnQgcmVhZHMAAAAKY2hlY2twb2ludAAAAAAABAAAACpTbG90IGhpbnQgZm9yIGJvdW5kaW5nIHJlY2VudCBidWNrZXQgcmVhZHMAAAAAAARzbG90AAAACg==",
        "AAAABQAAADhFdmVudCBlbWl0dGVkIHdoZW4gYSBmbGFzaCBsb2FuIGlzIGV4ZWN1dGVkIHN1Y2Nlc3NmdWxseQAAAAAAAAASRmxhc2hFeGVjdXRlZEV2ZW50AAAAAAABAAAADmZsYXNoX2V4ZWN1dGVkAAAAAAAGAAAAAAAAAARwb29sAAAAEwAAAAAAAAAAAAAACHN0cmF0ZWd5AAAAEwAAAAAAAAAAAAAAB2Ftb3VudDAAAAAACgAAAAAAAAAAAAAAB2Ftb3VudDEAAAAACgAAAAAAAAAAAAAABGZlZTAAAAAKAAAAAAAAAAAAAAAEZmVlMQAAAAoAAAAAAAAAAg==",
        "AAAAAQAAACxQYXJhbWV0ZXJzIHBhc3NlZCB0byBGbGFzaFN0cmF0ZWd5LmV4ZWN1dGUoKQAAAAAAAAATRmxhc2hTdHJhdGVneVBhcmFtcwAAAAAKAAAAGUFtb3VudCBvZiB0b2tlbjAgYm9ycm93ZWQAAAAAAAAHYW1vdW50MAAAAAAKAAAAGUFtb3VudCBvZiB0b2tlbjEgYm9ycm93ZWQAAAAAAAAHYW1vdW50MQAAAAAKAAAAIkN1c3RvbSBkYXRhIGZvciBzdHJhdGVneSBleGVjdXRpb24AAAAAAARkYXRhAAAADgAAACFGZWUgcmVxdWlyZWQgZm9yIHRva2VuMCByZXBheW1lbnQAAAAAAAAEZmVlMAAAAAoAAAAhRmVlIHJlcXVpcmVkIGZvciB0b2tlbjEgcmVwYXltZW50AAAAAAAABGZlZTEAAAAKAAAAM09yYWNsZSBoaW50cyBmb3Igc3dhcCBvcGVyYXRpb25zIChmcm9tIGZsYXNoX2JlZ2luKQAAAAAMb3JhY2xlX2hpbnRzAAAH0AAAAAtPcmFjbGVIaW50cwAAAAAmUG9vbCBhZGRyZXNzIHRva2VucyB3ZXJlIGJvcnJvd2VkIGZyb20AAAAAAARwb29sAAAAEwAAAB1BZGRyZXNzIG9mIHRva2VuMCBpbiB0aGUgcG9vbAAAAAAAAAZ0b2tlbjAAAAAAABMAAAAdQWRkcmVzcyBvZiB0b2tlbjEgaW4gdGhlIHBvb2wAAAAAAAAGdG9rZW4xAAAAAAATAAAAIVVzZXIgd2hvIGluaXRpYXRlZCB0aGUgZmxhc2ggbG9hbgAAAAAAAAR1c2VyAAAAEw==",
        "AAAAAAAABABFeGVjdXRlIGZsYXNoIGxvYW4gd2l0aCBjdXN0b20gZmxhc2ggc3RyYXRlZ3kKClRoaXMgaXMgdGhlIHNhZmUgZW50cnkgcG9pbnQgZm9yIGFsbCBmbGFzaCBsb2Fucy4gVGhlIEZsYXNoRXhlY3V0b3I6CjEuIFZhbGlkYXRlcyB0aGUgdXNlciBhdXRob3JpemVkIHRoaXMgdHJhbnNhY3Rpb24gKHVzZXIucmVxdWlyZV9hdXRoKQoyLiBDYWxscyBmbGFzaF9iZWdpbigpIGFzIHRoZSBpbml0aWF0b3IgKG9ubHkgRmxhc2hFeGVjdXRvciBpcyBhdXRob3JpemVkKQozLiBJbnZva2VzIHRoZSB1c2VyJ3MgRmxhc2hTdHJhdGVneSBjb250cmFjdCB3aXRoIGJvcnJvd2VkIHRva2Vucwo0LiBBbHdheXMgY2FsbHMgZmxhc2hfZW5kKCkgdG8gdmVyaWZ5IHJlcGF5bWVudAoKIyBBcmd1bWVudHMKKiBgcG9vbGAgLSBQb29sIGFkZHJlc3MgdG8gYm9ycm93IGZyb20KKiBgc3RyYXRlZ3lgIC0gVXNlcidzIHN0cmF0ZWd5IGNvbnRyYWN0IGFkZHJlc3MKKiBgdXNlcmAgLSBBZGRyZXNzIG9mIHVzZXIgaW5pdGlhdGluZyB0aGUgZmxhc2ggbG9hbiAobXVzdCBzaWduIHRyYW5zYWN0aW9uKQoqIGBhbW91bnQwYCAtIEFtb3VudCBvZiB0b2tlbjAgdG8gYm9ycm93CiogYGFtb3VudDFgIC0gQW1vdW50IG9mIHRva2VuMSB0byBib3Jyb3cKKiBgZGF0YWAgLSBBcmJpdHJhcnkgZGF0YSBwYXNzZWQgdG8gc3RyYXRlZ3kKCiMgU3RyYXRlZ3kgQWNjZXNzIENvbnRyb2wKU3RyYXRlZ2llcyByZWNlaXZlIGB1c2VyYCBpbiBGbGFzaFN0cmF0ZWd5UGFyYW1zIGFuZCBjYW46Ci0gSWdub3JlIGl0IGZvciBwZXJtaXNzaW9ubGVzcyBleGVjdXRpb24gKGRlZmF1bHQpCi0gQ2hlY2sgYWdhaW5zdCBhbGxvd2xpc3QgZm9yIHJlc3RyaWN0ZWQgYWNjZXNzCi0gSW1wbGVtZW50IGN1c3RvbSBhdXRob3JpemF0aW9uIGxvZ2ljCgojIFJldHVybnMKKiBgT2soKCkpYCAtIEZsYXNoIGxvYW4gZXhlY3V0ZWQgc3VjY2Vzc2Z1bGx5CiogYEVycihFcnJvcilgIC0gRmxhc2ggbG9hbiBmYWlsZWQgKGluc3VmZmljaWVudCByZXBheW1lbnQsIHN0cmF0AAAAEmV4ZWN1dGVfZmxhc2hfbG9hbgAAAAAABgAAAAAAAAAEcG9vbAAAABMAAAAAAAAACHN0cmF0ZWd5AAAAEwAAAAAAAAAEdXNlcgAAABMAAAAAAAAAB2Ftb3VudDAAAAAACgAAAAAAAAAHYW1vdW50MQAAAAAKAAAAAAAAAARkYXRhAAAADgAAAAEAAAPpAAAD7QAAAAAAAAAD" ]),
      options
    )
  }
  public readonly fromJSON = {
    execute_flash_loan: this.txFromJSON<Result<void>>
  }
}