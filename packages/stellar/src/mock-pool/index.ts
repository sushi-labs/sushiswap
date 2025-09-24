import { Buffer } from 'buffer'
import { Address } from '@stellar/stellar-sdk'
import {
  type AssembledTransaction,
  Client as ContractClient,
  type ClientOptions as ContractClientOptions,
  Spec as ContractSpec,
  type MethodOptions,
  type Result,
} from '@stellar/stellar-sdk/contract'
import type {
  Duration,
  Option,
  Typepoint,
  i32,
  i64,
  i128,
  i256,
  u32,
  u64,
  u128,
  u256,
} from '@stellar/stellar-sdk/contract'
import { SqrtPriceX96 } from '../common-types.js'
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer
}

export const networks = {
  testnet: {
    networkPassphrase: 'Test SDF Network ; September 2015',
    contractId: 'CCJ7AVZAUWITM2F4O3LGIVYA3RNADGO4NKDLGDCMTKHYEYQDCV3CAQU6',
  },
} as const

export interface PoolState {
  fee: u32
  liquidity: u128
  sqrt_price_x96: u256
  tick: i32
}

export const Errors = {
  1: { message: 'Unauthorized' },
  10: { message: 'InvalidTickRange' },
  11: { message: 'InvalidLiquidity' },
  12: { message: 'InvalidAmount' },
  13: { message: 'InvalidSqrtPrice' },
  14: { message: 'InvalidFee' },
  15: { message: 'InvalidTickSpacing' },
  20: { message: 'TickOutOfBounds' },
  21: { message: 'PriceOutOfBounds' },
  22: { message: 'LiquidityOverflow' },
  23: { message: 'LiquidityUnderflow' },
  24: { message: 'DivisionByZero' },
  25: { message: 'MulDivOverflow' },
  30: { message: 'U128Overflow' },
  31: { message: 'I128Overflow' },
  32: { message: 'U64Overflow' },
  33: { message: 'U32Overflow' },
  40: { message: 'PoolNotInitialized' },
  41: { message: 'PoolAlreadyInitialized' },
  42: { message: 'PositionNotFound' },
  43: { message: 'InsufficientLiquidity' },
  50: { message: 'TickNotInitialized' },
  51: { message: 'InvalidWordPosition' },
  52: { message: 'TickNotSpacedCorrectly' },
  60: { message: 'OracleNotInitialized' },
  61: { message: 'InvalidObservation' },
  62: { message: 'ObservationTooOld' },
  63: { message: 'NotInitialized' },
  64: { message: 'AlreadyInitialized' },
  65: { message: 'TickLowerNotLessThanUpper' },
  66: { message: 'TickLowerTooLow' },
  67: { message: 'TickUpperTooHigh' },
  68: { message: 'Locked' },
  69: { message: 'InvalidPriceLimit' },
}

/**
 * Q128.128 fixed-point number
 *
 * Represents a number as: value / 2^128
 *
 * Used exclusively for fee growth tracking in Uniswap V3 architecture.
 * For price calculations, use FixedPoint96 instead.
 */
export type FixedPoint128 = readonly [u256]

/**
 * Q64.96 fixed-point number
 *
 * Internally stored as a U256 where the value represents:
 * `actual_value = stored_value / 2^96`
 */
export type FixedPoint96 = readonly [u256]

export interface SwapStepResult {
  amount_in: u256
  amount_out: u256
  fee_amount: u256
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
  high: u256
  low: u256
}

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initialize pool with demo liquidity at 1:1 price
   */
  initialize: (
    { fee }: { fee: u32 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean
    },
  ) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a quote_exact_input transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Quote exact input swap (what QuoterV2 will call)
   * Returns the amount of output tokens for a given input
   */
  quote_exact_input: (
    { zero_for_one, amount_in }: { zero_for_one: boolean; amount_in: i128 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean
    },
  ) => Promise<AssembledTransaction<Result<i128>>>

  /**
   * Construct and simulate a quote_exact_output transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Quote exact output swap (get required input for desired output)
   */
  quote_exact_output: (
    { zero_for_one, amount_out }: { zero_for_one: boolean; amount_out: i128 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean
    },
  ) => Promise<AssembledTransaction<Result<i128>>>

  /**
   * Construct and simulate a swap transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Mock swap function for QuoterV2 compatibility
   * This doesn't actually transfer tokens, just calculates the swap
   */
  swap: (
    {
      _sender,
      _recipient,
      zero_for_one,
      amount_specified,
      sqrt_price_limit_x96,
    }: {
      _sender: string
      _recipient: string
      zero_for_one: boolean
      amount_specified: i128
      sqrt_price_limit_x96: u256
    },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean
    },
  ) => Promise<AssembledTransaction<Result<readonly [i128, i128]>>>

  /**
   * Construct and simulate a get_state transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get current pool state (for display/debugging)
   */
  get_state: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean
  }) => Promise<AssembledTransaction<Result<PoolState>>>

  /**
   * Construct and simulate a set_fee transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Update pool settings (for demo purposes)
   */
  set_fee: (
    { new_fee }: { new_fee: u32 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean
    },
  ) => Promise<AssembledTransaction<Result<void>>>
}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, 'contractId'> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: 'hex' | 'base64'
      },
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        'AAAAAQAAAAAAAAAAAAAACVBvb2xTdGF0ZQAAAAAAAAQAAAAAAAAAA2ZlZQAAAAAEAAAAAAAAAAlsaXF1aWRpdHkAAAAAAAAKAAAAAAAAAA5zcXJ0X3ByaWNlX3g5NgAAAAAADAAAAAAAAAAEdGljawAAAAU=',
        'AAAAAAAAADBJbml0aWFsaXplIHBvb2wgd2l0aCBkZW1vIGxpcXVpZGl0eSBhdCAxOjEgcHJpY2UAAAAKaW5pdGlhbGl6ZQAAAAAAAQAAAAAAAAADZmVlAAAAAAQAAAABAAAD6QAAA+0AAAAAAAAAAw==',
        'AAAAAAAAAGZRdW90ZSBleGFjdCBpbnB1dCBzd2FwICh3aGF0IFF1b3RlclYyIHdpbGwgY2FsbCkKUmV0dXJucyB0aGUgYW1vdW50IG9mIG91dHB1dCB0b2tlbnMgZm9yIGEgZ2l2ZW4gaW5wdXQAAAAAABFxdW90ZV9leGFjdF9pbnB1dAAAAAAAAAIAAAAAAAAADHplcm9fZm9yX29uZQAAAAEAAAAAAAAACWFtb3VudF9pbgAAAAAAAAsAAAABAAAD6QAAAAsAAAAD',
        'AAAAAAAAAD9RdW90ZSBleGFjdCBvdXRwdXQgc3dhcCAoZ2V0IHJlcXVpcmVkIGlucHV0IGZvciBkZXNpcmVkIG91dHB1dCkAAAAAEnF1b3RlX2V4YWN0X291dHB1dAAAAAAAAgAAAAAAAAAMemVyb19mb3Jfb25lAAAAAQAAAAAAAAAKYW1vdW50X291dAAAAAAACwAAAAEAAAPpAAAACwAAAAM=',
        'AAAAAAAAAG1Nb2NrIHN3YXAgZnVuY3Rpb24gZm9yIFF1b3RlclYyIGNvbXBhdGliaWxpdHkKVGhpcyBkb2Vzbid0IGFjdHVhbGx5IHRyYW5zZmVyIHRva2VucywganVzdCBjYWxjdWxhdGVzIHRoZSBzd2FwAAAAAAAABHN3YXAAAAAFAAAAAAAAAAdfc2VuZGVyAAAAABMAAAAAAAAACl9yZWNpcGllbnQAAAAAABMAAAAAAAAADHplcm9fZm9yX29uZQAAAAEAAAAAAAAAEGFtb3VudF9zcGVjaWZpZWQAAAALAAAAAAAAABRzcXJ0X3ByaWNlX2xpbWl0X3g5NgAAAAwAAAABAAAD6QAAA+0AAAACAAAACwAAAAsAAAAD',
        'AAAAAAAAAC5HZXQgY3VycmVudCBwb29sIHN0YXRlIChmb3IgZGlzcGxheS9kZWJ1Z2dpbmcpAAAAAAAJZ2V0X3N0YXRlAAAAAAAAAAAAAAEAAAPpAAAH0AAAAAlQb29sU3RhdGUAAAAAAAAD',
        'AAAAAAAAAChVcGRhdGUgcG9vbCBzZXR0aW5ncyAoZm9yIGRlbW8gcHVycG9zZXMpAAAAB3NldF9mZWUAAAAAAQAAAAAAAAAHbmV3X2ZlZQAAAAAEAAAAAQAAA+kAAAPtAAAAAAAAAAM=',
        'AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAIgAAAAAAAAAMVW5hdXRob3JpemVkAAAAAQAAAAAAAAAQSW52YWxpZFRpY2tSYW5nZQAAAAoAAAAAAAAAEEludmFsaWRMaXF1aWRpdHkAAAALAAAAAAAAAA1JbnZhbGlkQW1vdW50AAAAAAAADAAAAAAAAAAQSW52YWxpZFNxcnRQcmljZQAAAA0AAAAAAAAACkludmFsaWRGZWUAAAAAAA4AAAAAAAAAEkludmFsaWRUaWNrU3BhY2luZwAAAAAADwAAAAAAAAAPVGlja091dE9mQm91bmRzAAAAABQAAAAAAAAAEFByaWNlT3V0T2ZCb3VuZHMAAAAVAAAAAAAAABFMaXF1aWRpdHlPdmVyZmxvdwAAAAAAABYAAAAAAAAAEkxpcXVpZGl0eVVuZGVyZmxvdwAAAAAAFwAAAAAAAAAORGl2aXNpb25CeVplcm8AAAAAABgAAAAAAAAADk11bERpdk92ZXJmbG93AAAAAAAZAAAAAAAAAAxVMTI4T3ZlcmZsb3cAAAAeAAAAAAAAAAxJMTI4T3ZlcmZsb3cAAAAfAAAAAAAAAAtVNjRPdmVyZmxvdwAAAAAgAAAAAAAAAAtVMzJPdmVyZmxvdwAAAAAhAAAAAAAAABJQb29sTm90SW5pdGlhbGl6ZWQAAAAAACgAAAAAAAAAFlBvb2xBbHJlYWR5SW5pdGlhbGl6ZWQAAAAAACkAAAAAAAAAEFBvc2l0aW9uTm90Rm91bmQAAAAqAAAAAAAAABVJbnN1ZmZpY2llbnRMaXF1aWRpdHkAAAAAAAArAAAAAAAAABJUaWNrTm90SW5pdGlhbGl6ZWQAAAAAADIAAAAAAAAAE0ludmFsaWRXb3JkUG9zaXRpb24AAAAAMwAAAAAAAAAWVGlja05vdFNwYWNlZENvcnJlY3RseQAAAAAANAAAAAAAAAAUT3JhY2xlTm90SW5pdGlhbGl6ZWQAAAA8AAAAAAAAABJJbnZhbGlkT2JzZXJ2YXRpb24AAAAAAD0AAAAAAAAAEU9ic2VydmF0aW9uVG9vT2xkAAAAAAAAPgAAAAAAAAAOTm90SW5pdGlhbGl6ZWQAAAAAAD8AAAAAAAAAEkFscmVhZHlJbml0aWFsaXplZAAAAAAAQAAAAAAAAAAZVGlja0xvd2VyTm90TGVzc1RoYW5VcHBlcgAAAAAAAEEAAAAAAAAAD1RpY2tMb3dlclRvb0xvdwAAAABCAAAAAAAAABBUaWNrVXBwZXJUb29IaWdoAAAAQwAAAAAAAAAGTG9ja2VkAAAAAABEAAAAAAAAABFJbnZhbGlkUHJpY2VMaW1pdAAAAAAAAEU=',
        'AAAAAQAAALpRMTI4LjEyOCBmaXhlZC1wb2ludCBudW1iZXIKClJlcHJlc2VudHMgYSBudW1iZXIgYXM6IHZhbHVlIC8gMl4xMjgKClVzZWQgZXhjbHVzaXZlbHkgZm9yIGZlZSBncm93dGggdHJhY2tpbmcgaW4gVW5pc3dhcCBWMyBhcmNoaXRlY3R1cmUuCkZvciBwcmljZSBjYWxjdWxhdGlvbnMsIHVzZSBGaXhlZFBvaW50OTYgaW5zdGVhZC4AAAAAAAAAAAANRml4ZWRQb2ludDEyOAAAAAAAAAEAAAAAAAAAATAAAAAAAAAM',
        'AAAAAQAAAHdRNjQuOTYgZml4ZWQtcG9pbnQgbnVtYmVyCgpJbnRlcm5hbGx5IHN0b3JlZCBhcyBhIFUyNTYgd2hlcmUgdGhlIHZhbHVlIHJlcHJlc2VudHM6CmBhY3R1YWxfdmFsdWUgPSBzdG9yZWRfdmFsdWUgLyAyXjk2YAAAAAAAAAAADEZpeGVkUG9pbnQ5NgAAAAEAAAAAAAAAATAAAAAAAAAM',
        'AAAAAQAAAAAAAAAAAAAADlN3YXBTdGVwUmVzdWx0AAAAAAAEAAAAAAAAAAlhbW91bnRfaW4AAAAAAAAMAAAAAAAAAAphbW91bnRfb3V0AAAAAAAMAAAAAAAAAApmZWVfYW1vdW50AAAAAAAMAAAAAAAAAA9zcXJ0X3JhdGlvX25leHQAAAAH0AAAAAxTcXJ0UHJpY2VYOTY=',
        'AAAAAQAAAJQ1MTItYml0IHVuc2lnbmVkIGludGVnZXIKClJlcHJlc2VudGVkIGFzIHR3byAyNTYtYml0IGNvbXBvbmVudHM6Ci0gYGxvd2A6IGJpdHMgMC0yNTUKLSBgaGlnaGA6IGJpdHMgMjU2LTUxMQoKVGhlIGFjdHVhbCB2YWx1ZSBpczogaGlnaCAqIDJeMjU2ICsgbG93AAAAAAAAAARVNTEyAAAAAgAAAAAAAAAEaGlnaAAAAAwAAAAAAAAAA2xvdwAAAAAM',
      ]),
      options,
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<Result<void>>,
    quote_exact_input: this.txFromJSON<Result<i128>>,
    quote_exact_output: this.txFromJSON<Result<i128>>,
    swap: this.txFromJSON<Result<readonly [i128, i128]>>,
    get_state: this.txFromJSON<Result<PoolState>>,
    set_fee: this.txFromJSON<Result<void>>,
  }
}
