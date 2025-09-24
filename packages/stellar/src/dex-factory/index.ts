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
    contractId: "CAE3VXI2NFYEP4AFBH6XYDM2OD5OMSRHA2G53DRWRJFMB56P4QU7H4IW",
  }
} as const

export type StorageKey = {tag: "Owner", values: void} | {tag: "FeeAmtTickSpacing", values: readonly [u32]} | {tag: "GetPool", values: readonly [string, string, u32]} | {tag: "WasmHash", values: void};

export interface Client {
  /**
   * Construct and simulate a set_owner transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
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
   * Construct and simulate a create_pool transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
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
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a get_pool transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
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
   * Construct and simulate a e_fee_amt transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
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
  }) => Promise<AssembledTransaction<null>>

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
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAClN0b3JhZ2VLZXkAAAAAAAQAAAAAAAAAAAAAAAVPd25lcgAAAAAAAAEAAAAAAAAAEUZlZUFtdFRpY2tTcGFjaW5nAAAAAAAAAQAAAAQAAAABAAAAAAAAAAdHZXRQb29sAAAAAAMAAAATAAAAEwAAAAQAAAAAAAAAAAAAAAhXYXNtSGFzaA==",
        "AAAABQAAAAAAAAAAAAAAFUZlZUFtb3VudEVuYWJsZWRFdmVudAAAAAAAAAEAAAAYZmVlX2Ftb3VudF9lbmFibGVkX2V2ZW50AAAAAgAAAAAAAAADZmVlAAAAAAQAAAAAAAAAAAAAAAx0aWNrX3NwYWNpbmcAAAAFAAAAAAAAAAI=",
        "AAAABQAAAAAAAAAAAAAAEFBvb2xDcmVhdGVkRXZlbnQAAAABAAAAEnBvb2xfY3JlYXRlZF9ldmVudAAAAAAABgAAAAAAAAAGc2VuZGVyAAAAAAATAAAAAAAAAAAAAAAGdG9rZW4wAAAAAAATAAAAAAAAAAAAAAAGdG9rZW4xAAAAAAATAAAAAAAAAAAAAAADZmVlAAAAAAQAAAAAAAAAAAAAAAx0aWNrX3NwYWNpbmcAAAAFAAAAAAAAAAAAAAAMcG9vbF9hZGRyZXNzAAAAEwAAAAAAAAAC",
        "AAAAAgAAAAAAAAAAAAAAClN0b3JhZ2VLZXkAAAAAAAQAAAAAAAAAAAAAAAVPd25lcgAAAAAAAAEAAAAAAAAAEUZlZUFtdFRpY2tTcGFjaW5nAAAAAAAAAQAAAAQAAAABAAAAAAAAAAdHZXRQb29sAAAAAAMAAAATAAAAEwAAAAQAAAAAAAAAAAAAAAhXYXNtSGFzaA==",
        "AAAAAAAAADVDb25zdHJ1Y3QgdGhlIGRlcGxveWVyIHdpdGggYSBwcm92aWRlZCBhZG1pbmlzdHJhdG9yLgAAAAAAAA1fX2NvbnN0cnVjdG9yAAAAAAAAAgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAl3YXNtX2hhc2gAAAAAAAPuAAAAIAAAAAA=",
        "AAAAAAAAAAAAAAAJc2V0X293bmVyAAAAAAAAAQAAAAAAAAAJbmV3X2FkbWluAAAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAJZ2V0X293bmVyAAAAAAAAAAAAAAEAAAAT",
        "AAAAAAAAAAAAAAALY3JlYXRlX3Bvb2wAAAAAAwAAAAAAAAAHdG9rZW5fYQAAAAATAAAAAAAAAAd0b2tlbl9iAAAAABMAAAAAAAAAA2ZlZQAAAAAEAAAAAQAAABM=",
        "AAAAAAAAAAAAAAAIZ2V0X3Bvb2wAAAADAAAAAAAAAAd0b2tlbl9hAAAAABMAAAAAAAAAB3Rva2VuX2IAAAAAEwAAAAAAAAADZmVlAAAAAAQAAAABAAAD6AAAABM=",
        "AAAAAAAAAAAAAAAJZV9mZWVfYW10AAAAAAAAAgAAAAAAAAADZmVlAAAAAAQAAAAAAAAADHRpY2tfc3BhY2luZwAAAAUAAAAA" ]),
      options
    )
  }
  public readonly fromJSON = {
    set_owner: this.txFromJSON<null>,
        get_owner: this.txFromJSON<string>,
        create_pool: this.txFromJSON<string>,
        get_pool: this.txFromJSON<Option<string>>,
        e_fee_amt: this.txFromJSON<null>
  }
}