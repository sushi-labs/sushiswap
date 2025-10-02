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
import { SqrtPriceX96 } from '../../common-types.js';
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
    contractId: "CDLPBPLMZGQHVRDMZAOMOQXWUUBGP5PWSLIAPTJVXC3WTAK6FAR3FQSQ",
  }
} as const

/**
 * Storage keys for the Oracle
 */
export type OracleDataKey = {tag: "LatestOracleObservation", values: void} | {tag: "RecentOracleObservation", values: readonly [u32]} | {tag: "HistoricalCheckpoint", values: readonly [u32]} | {tag: "Metadata", values: void};


/**
 * OracleObservation data structure
 */
export interface OracleObservation {
  /**
 * Whether this observation has been initialized
 */
initialized: boolean;
  /**
 * Ledger sequence when observation was made
 */
ledger_sequence: u32;
  /**
 * Cumulative seconds per liquidity (Q128)
 */
seconds_per_liq_cum_x128: FixedPoint128;
  /**
 * The tick at the time of this observation
 */
tick: i32;
  /**
 * Cumulative tick * time elapsed
 */
tick_cumulative: i64;
  /**
 * Unix timestamp from ledger
 */
timestamp: u64;
}


/**
 * Oracle metadata for tracking state
 */
export interface OracleMetadata {
  /**
 * Number of historical checkpoints
 */
checkpoint_count: u32;
  /**
 * Last checkpoint index
 */
last_checkpoint_index: u32;
  /**
 * Last ledger sequence when observation was written
 */
last_observation_ledger: u32;
  /**
 * Counter for recent observation indices (increments indefinitely)
 */
recent_observation_index: u32;
}

export type PositionKey = {tag: "Position", values: readonly [Buffer]};


export interface PositionData {
  fee_growth_inside_0_last_x128: FixedPoint128;
  fee_growth_inside_1_last_x128: FixedPoint128;
  liquidity: u128;
  tokens_owed_0: u128;
  tokens_owed_1: u128;
}

export type TickKey = {tag: "Tick", values: readonly [i32]};


export interface TickInfo {
  fee_growth_outside_0_x128: FixedPoint128;
  fee_growth_outside_1_x128: FixedPoint128;
  initialized: boolean;
  liquidity_gross: u128;
  liquidity_net: i128;
  sec_per_liquidity_outside_x128: FixedPoint128;
  seconds_outside: u32;
  tick_cumulative_outside: i64;
}

export type TickBitMapKey = {tag: "TickBitmap", values: readonly [i32]};









export interface Slot0 {
  fee_protocol: u32;
  sqrt_price_x96: u256;
  tick: i32;
  unlocked: boolean;
}


export interface SwapResult {
  amount0: i128;
  amount1: i128;
  liquidity: u128;
  sqrt_price_x96: u256;
  tick: i32;
}


export interface ImmutablePoolParams {
  factory: string;
  fee: u32;
  max_liq_per_tick: u128;
  tick_spacing: i32;
  token0: string;
  token1: string;
}


export interface ProtocolFees {
  token0: u128;
  token1: u128;
}


export interface PoolStateBatch {
  fee_growth_global_0: FixedPoint128;
  fee_growth_global_1: FixedPoint128;
  liquidity: u128;
  protocol_fees: ProtocolFees;
  slot0: Slot0;
}


export interface Observation {
  block_timestamp: u32;
  initialized: boolean;
  secs_per_liq_cumulative_x128: u256;
  tick_cumulative: i64;
}


export interface ModifyPositionParams {
  liquidity_delta: i128;
  owner: string;
  tick_lower: i32;
  tick_upper: i32;
}


export interface UpdatePositionParams {
  liquidity_delta: i128;
  owner: string;
  tick_current: i32;
  tick_lower: i32;
  tick_spacing: i32;
  tick_upper: i32;
}


export interface SwapCache {
  block_timestamp: u32;
  computed_latest_observation: boolean;
  fee_protocol: u32;
  liquidity_start: u128;
  secs_per_liq_cumulative_x128: u256;
  tick_cumulative: i64;
}


export interface SwapState {
  amount_calculated: i128;
  amount_specified_remaining: i128;
  fee_growth_global_x128: u256;
  liquidity: u128;
  protocol_fee: u128;
  sqrt_price_x96: u256;
  tick: i32;
}


export interface StepComputations {
  amount_in: u128;
  amount_out: u128;
  fee_amount: u128;
  initialized: boolean;
  sqrt_price_next_x96: u256;
  sqrt_price_start_x96: u256;
  tick_next: i32;
}

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
   * Construct and simulate a check_ticks transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  check_ticks: ({tick_lower, tick_upper}: {tick_lower: i32, tick_upper: i32}, options?: {
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
   * Construct and simulate a block_timestamp transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  block_timestamp: (options?: {
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
  }) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initialize the pool with initial sqrt price
   */
  initialize: ({sqrt_price_x96}: {sqrt_price_x96: u256}, options?: {
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
   * Construct and simulate a swap transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Swap tokens
   */
  swap: ({sender, recipient, zero_for_one, amount_specified, sqrt_price_limit_x96}: {sender: string, recipient: string, zero_for_one: boolean, amount_specified: i128, sqrt_price_limit_x96: u256}, options?: {
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
  }) => Promise<AssembledTransaction<Result<SwapResult>>>

  /**
   * Construct and simulate a swap_prefunded transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Swap using prefunded input already held by the pool.
   *
   * This variant assumes the input tokens have been transferred to the pool
   * before calling. It performs no incoming transfer and only sends output
   * tokens to the recipient, after verifying sufficient prefunded balance.
   */
  swap_prefunded: ({router, recipient, zero_for_one, amount_specified, sqrt_price_limit_x96}: {router: string, recipient: string, zero_for_one: boolean, amount_specified: i128, sqrt_price_limit_x96: u256}, options?: {
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
  }) => Promise<AssembledTransaction<Result<SwapResult>>>

  /**
   * Construct and simulate a set_router_authorized transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Manage authorization for routers allowed to call `swap_prefunded`.
   * Only the pool's factory may call this.
   */
  set_router_authorized: ({factory, router, allowed}: {factory: string, router: string, allowed: boolean}, options?: {
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
   * Construct and simulate a burn transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  burn: ({owner, tick_lower, tick_upper, amount}: {owner: string, tick_lower: i32, tick_upper: i32, amount: u128}, options?: {
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
  }) => Promise<AssembledTransaction<Result<readonly [u128, u128]>>>

  /**
   * Construct and simulate a collect transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Collect fees accumulated by a liquidity position
   *
   * Does not recompute fees earned - fees must be computed via mint or burn.
   * Matches Uniswap V3's collect function behavior.
   */
  collect: ({recipient, tick_lower, tick_upper, amount0_requested, amount1_requested}: {recipient: string, tick_lower: i32, tick_upper: i32, amount0_requested: u128, amount1_requested: u128}, options?: {
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
  }) => Promise<AssembledTransaction<readonly [u128, u128]>>

  /**
   * Construct and simulate a set_fee_protocol transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_fee_protocol: ({fee_protocol0, fee_protocol1}: {fee_protocol0: u32, fee_protocol1: u32}, options?: {
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
   * Construct and simulate a collect_protocol transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  collect_protocol: ({recipient, amount0_requested, amount1_requested}: {recipient: string, amount0_requested: u128, amount1_requested: u128}, options?: {
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
  }) => Promise<AssembledTransaction<readonly [u128, u128]>>

  /**
   * Construct and simulate a slot0 transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get the current pool state
   */
  slot0: (options?: {
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
  }) => Promise<AssembledTransaction<Slot0>>

  /**
   * Construct and simulate a factory transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get the factory address
   */
  factory: (options?: {
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
   * Construct and simulate a token0 transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get token0 address
   */
  token0: (options?: {
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
   * Construct and simulate a token1 transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get token1 address
   */
  token1: (options?: {
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
   * Construct and simulate a fee transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get the pool fee
   */
  fee: (options?: {
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
   * Construct and simulate a tick_spacing transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get tick spacing
   */
  tick_spacing: (options?: {
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
  }) => Promise<AssembledTransaction<i32>>

  /**
   * Construct and simulate a get_tick_bitmap transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Expose tick bitmap word for external callers (e.g., lens/quoter)
   */
  get_tick_bitmap: ({word_pos}: {word_pos: i32}, options?: {
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
  }) => Promise<AssembledTransaction<u256>>

  /**
   * Construct and simulate a liquidity transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get current liquidity
   */
  liquidity: (options?: {
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
  }) => Promise<AssembledTransaction<u128>>

  /**
   * Construct and simulate a fee_growth_global_0_x128 transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get fee growth for token0
   */
  fee_growth_global_0_x128: (options?: {
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
  }) => Promise<AssembledTransaction<FixedPoint128>>

  /**
   * Construct and simulate a fee_growth_global_1_x128 transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get fee growth for token1
   */
  fee_growth_global_1_x128: (options?: {
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
  }) => Promise<AssembledTransaction<FixedPoint128>>

  /**
   * Construct and simulate a protocol_fees transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get protocol fees
   */
  protocol_fees: (options?: {
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
  }) => Promise<AssembledTransaction<ProtocolFees>>

  /**
   * Construct and simulate a ticks transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get protocol fees
   */
  ticks: ({tick}: {tick: i32}, options?: {
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
  }) => Promise<AssembledTransaction<TickInfo>>

  /**
   * Construct and simulate a snapshot_cumulatives_inside transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  snapshot_cumulatives_inside: ({tick_lower, tick_upper}: {tick_lower: i32, tick_upper: i32}, options?: {
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
  }) => Promise<AssembledTransaction<Result<readonly [i64, FixedPoint128, u32]>>>

  /**
   * Construct and simulate a observe_single transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Observe a single time point
   */
  observe_single: ({seconds_ago}: {seconds_ago: u32}, options?: {
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
  }) => Promise<AssembledTransaction<Result<readonly [i64, FixedPoint128]>>>

  /**
   * Construct and simulate a observe transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Observe multiple time points
   */
  observe: ({seconds_agos}: {seconds_agos: Array<u32>}, options?: {
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
  }) => Promise<AssembledTransaction<Result<readonly [Array<i64>, Array<FixedPoint128>]>>>

  /**
   * Construct and simulate a mint transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  mint: ({recipient, tick_lower, tick_upper, amount}: {recipient: string, tick_lower: i32, tick_upper: i32, amount: u128}, options?: {
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
  }) => Promise<AssembledTransaction<Result<readonly [u128, u128]>>>

  /**
   * Construct and simulate a get_tick_bitmap_public transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_tick_bitmap_public: ({word_pos}: {word_pos: i32}, options?: {
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
  }) => Promise<AssembledTransaction<u256>>

  /**
   * Construct and simulate a quote_exact_input transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Quote exact input swap without executing transfers
   * Returns the amount of output tokens and final pool state
   */
  quote_exact_input: ({zero_for_one, amount_in, sqrt_price_limit_x96}: {zero_for_one: boolean, amount_in: i128, sqrt_price_limit_x96: u256}, options?: {
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
  }) => Promise<AssembledTransaction<Result<SwapResult>>>

  /**
   * Construct and simulate a quote_exact_output transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Quote exact output swap without executing transfers
   * Returns the amount of input tokens required and final pool state
   */
  quote_exact_output: ({zero_for_one, amount_out, sqrt_price_limit_x96}: {zero_for_one: boolean, amount_out: i128, sqrt_price_limit_x96: u256}, options?: {
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
  }) => Promise<AssembledTransaction<Result<SwapResult>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        {factory, token0, token1, fee, tick_spacing}: {factory: string, token0: string, token1: string, fee: u32, tick_spacing: i32},
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
    return ContractClient.deploy({factory, token0, token1, fee, tick_spacing}, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAABtTdG9yYWdlIGtleXMgZm9yIHRoZSBPcmFjbGUAAAAAAAAAAA1PcmFjbGVEYXRhS2V5AAAAAAAABAAAAAAAAAAoTW9zdCByZWNlbnQgb2JzZXJ2YXRpb24gZm9yIHF1aWNrIGFjY2VzcwAAABdMYXRlc3RPcmFjbGVPYnNlcnZhdGlvbgAAAAABAAAAOlJlY2VudCBvYnNlcnZhdGlvbnMgc3RvcmVkIHdpdGggVFRMIChrZXk6IGxlZGdlciBzZXF1ZW5jZSkAAAAAABdSZWNlbnRPcmFjbGVPYnNlcnZhdGlvbgAAAAABAAAABAAAAAEAAABBSGlzdG9yaWNhbCBjaGVja3BvaW50cyBzdG9yZWQgcGVybWFuZW50bHkgKGtleTogY2hlY2twb2ludCBpbmRleCkAAAAAAAAUSGlzdG9yaWNhbENoZWNrcG9pbnQAAAABAAAABAAAAAAAAAAPT3JhY2xlIG1ldGFkYXRhAAAAAAhNZXRhZGF0YQ==",
        "AAAAAQAAACBPcmFjbGVPYnNlcnZhdGlvbiBkYXRhIHN0cnVjdHVyZQAAAAAAAAART3JhY2xlT2JzZXJ2YXRpb24AAAAAAAAGAAAALVdoZXRoZXIgdGhpcyBvYnNlcnZhdGlvbiBoYXMgYmVlbiBpbml0aWFsaXplZAAAAAAAAAtpbml0aWFsaXplZAAAAAABAAAAKUxlZGdlciBzZXF1ZW5jZSB3aGVuIG9ic2VydmF0aW9uIHdhcyBtYWRlAAAAAAAAD2xlZGdlcl9zZXF1ZW5jZQAAAAAEAAAAJ0N1bXVsYXRpdmUgc2Vjb25kcyBwZXIgbGlxdWlkaXR5IChRMTI4KQAAAAAYc2Vjb25kc19wZXJfbGlxX2N1bV94MTI4AAAH0AAAAA1GaXhlZFBvaW50MTI4AAAAAAAAKFRoZSB0aWNrIGF0IHRoZSB0aW1lIG9mIHRoaXMgb2JzZXJ2YXRpb24AAAAEdGljawAAAAUAAAAeQ3VtdWxhdGl2ZSB0aWNrICogdGltZSBlbGFwc2VkAAAAAAAPdGlja19jdW11bGF0aXZlAAAAAAcAAAAaVW5peCB0aW1lc3RhbXAgZnJvbSBsZWRnZXIAAAAAAAl0aW1lc3RhbXAAAAAAAAAG",
        "AAAAAQAAACJPcmFjbGUgbWV0YWRhdGEgZm9yIHRyYWNraW5nIHN0YXRlAAAAAAAAAAAADk9yYWNsZU1ldGFkYXRhAAAAAAAEAAAAIE51bWJlciBvZiBoaXN0b3JpY2FsIGNoZWNrcG9pbnRzAAAAEGNoZWNrcG9pbnRfY291bnQAAAAEAAAAFUxhc3QgY2hlY2twb2ludCBpbmRleAAAAAAAABVsYXN0X2NoZWNrcG9pbnRfaW5kZXgAAAAAAAAEAAAAMUxhc3QgbGVkZ2VyIHNlcXVlbmNlIHdoZW4gb2JzZXJ2YXRpb24gd2FzIHdyaXR0ZW4AAAAAAAAXbGFzdF9vYnNlcnZhdGlvbl9sZWRnZXIAAAAABAAAAEBDb3VudGVyIGZvciByZWNlbnQgb2JzZXJ2YXRpb24gaW5kaWNlcyAoaW5jcmVtZW50cyBpbmRlZmluaXRlbHkpAAAAGHJlY2VudF9vYnNlcnZhdGlvbl9pbmRleAAAAAQ=",
        "AAAAAgAAAAAAAAAAAAAAC1Bvc2l0aW9uS2V5AAAAAAEAAAABAAAAAAAAAAhQb3NpdGlvbgAAAAEAAAPuAAAAIA==",
        "AAAAAQAAAAAAAAAAAAAADFBvc2l0aW9uRGF0YQAAAAUAAAAAAAAAHWZlZV9ncm93dGhfaW5zaWRlXzBfbGFzdF94MTI4AAAAAAAH0AAAAA1GaXhlZFBvaW50MTI4AAAAAAAAAAAAAB1mZWVfZ3Jvd3RoX2luc2lkZV8xX2xhc3RfeDEyOAAAAAAAB9AAAAANRml4ZWRQb2ludDEyOAAAAAAAAAAAAAAJbGlxdWlkaXR5AAAAAAAACgAAAAAAAAANdG9rZW5zX293ZWRfMAAAAAAAAAoAAAAAAAAADXRva2Vuc19vd2VkXzEAAAAAAAAK",
        "AAAAAgAAAAAAAAAAAAAAB1RpY2tLZXkAAAAAAQAAAAEAAAAAAAAABFRpY2sAAAABAAAABQ==",
        "AAAAAQAAAAAAAAAAAAAACFRpY2tJbmZvAAAACAAAAAAAAAAZZmVlX2dyb3d0aF9vdXRzaWRlXzBfeDEyOAAAAAAAB9AAAAANRml4ZWRQb2ludDEyOAAAAAAAAAAAAAAZZmVlX2dyb3d0aF9vdXRzaWRlXzFfeDEyOAAAAAAAB9AAAAANRml4ZWRQb2ludDEyOAAAAAAAAAAAAAALaW5pdGlhbGl6ZWQAAAAAAQAAAAAAAAAPbGlxdWlkaXR5X2dyb3NzAAAAAAoAAAAAAAAADWxpcXVpZGl0eV9uZXQAAAAAAAALAAAAAAAAAB5zZWNfcGVyX2xpcXVpZGl0eV9vdXRzaWRlX3gxMjgAAAAAB9AAAAANRml4ZWRQb2ludDEyOAAAAAAAAAAAAAAPc2Vjb25kc19vdXRzaWRlAAAAAAQAAAAAAAAAF3RpY2tfY3VtdWxhdGl2ZV9vdXRzaWRlAAAAAAc=",
        "AAAAAgAAAAAAAAAAAAAADVRpY2tCaXRNYXBLZXkAAAAAAAABAAAAAQAAAAAAAAAKVGlja0JpdG1hcAAAAAAAAQAAAAU=",
        "AAAABQAAAAAAAAAAAAAAD0luaXRpYWxpemVFdmVudAAAAAABAAAABGluaXQAAAACAAAAAAAAAA5zcXJ0X3ByaWNlX3g5NgAAAAAADAAAAAAAAAAAAAAABHRpY2sAAAAFAAAAAAAAAAI=",
        "AAAABQAAAAAAAAAAAAAACVN3YXBFdmVudAAAAAAAAAEAAAAEc3dhcAAAAAcAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAAAAAAACXJlY2lwaWVudAAAAAAAABMAAAAAAAAAAAAAAAdhbW91bnQwAAAAAAsAAAAAAAAAAAAAAAdhbW91bnQxAAAAAAsAAAAAAAAAAAAAAA5zcXJ0X3ByaWNlX3g5NgAAAAAADAAAAAAAAAAAAAAACWxpcXVpZGl0eQAAAAAAAAoAAAAAAAAAAAAAAAR0aWNrAAAABQAAAAAAAAAC",
        "AAAABQAAAAAAAAAAAAAACU1pbnRFdmVudAAAAAAAAAEAAAAEbWludAAAAAcAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAAAAAACnRpY2tfbG93ZXIAAAAAAAUAAAAAAAAAAAAAAAp0aWNrX3VwcGVyAAAAAAAFAAAAAAAAAAAAAAAGYW1vdW50AAAAAAAKAAAAAAAAAAAAAAAHYW1vdW50MAAAAAAKAAAAAAAAAAAAAAAHYW1vdW50MQAAAAAKAAAAAAAAAAI=",
        "AAAABQAAAAAAAAAAAAAACUJ1cm5FdmVudAAAAAAAAAEAAAAEYnVybgAAAAYAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAAAAAACnRpY2tfbG93ZXIAAAAAAAUAAAAAAAAAAAAAAAp0aWNrX3VwcGVyAAAAAAAFAAAAAAAAAAAAAAAGYW1vdW50AAAAAAAKAAAAAAAAAAAAAAAHYW1vdW50MAAAAAAKAAAAAAAAAAAAAAAHYW1vdW50MQAAAAAKAAAAAAAAAAI=",
        "AAAABQAAAAAAAAAAAAAADENvbGxlY3RFdmVudAAAAAEAAAAHY29sbGVjdAAAAAAGAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAAAAAAAAlyZWNpcGllbnQAAAAAAAATAAAAAAAAAAAAAAAKdGlja19sb3dlcgAAAAAABQAAAAAAAAAAAAAACnRpY2tfdXBwZXIAAAAAAAUAAAAAAAAAAAAAAAdhbW91bnQwAAAAAAoAAAAAAAAAAAAAAAdhbW91bnQxAAAAAAoAAAAAAAAAAg==",
        "AAAABQAAAAAAAAAAAAAAE1NldEZlZVByb3RvY29sRXZlbnQAAAAAAQAAAAlzZXRfZmVlX3AAAAAAAAAEAAAAAAAAABFmZWVfcHJvdG9jb2wwX29sZAAAAAAAAAQAAAAAAAAAAAAAABFmZWVfcHJvdG9jb2wxX29sZAAAAAAAAAQAAAAAAAAAAAAAABFmZWVfcHJvdG9jb2wwX25ldwAAAAAAAAQAAAAAAAAAAAAAABFmZWVfcHJvdG9jb2wxX25ldwAAAAAAAAQAAAAAAAAAAg==",
        "AAAABQAAAAAAAAAAAAAAFENvbGxlY3RQcm90b2NvbEV2ZW50AAAAAQAAAAljb2xsZWN0X3AAAAAAAAAEAAAAAAAAAAZzZW5kZXIAAAAAABMAAAAAAAAAAAAAAAlyZWNpcGllbnQAAAAAAAATAAAAAAAAAAAAAAAHYW1vdW50MAAAAAAKAAAAAAAAAAAAAAAHYW1vdW50MQAAAAAKAAAAAAAAAAI=",
        "AAAAAQAAAAAAAAAAAAAABVNsb3QwAAAAAAAABAAAAAAAAAAMZmVlX3Byb3RvY29sAAAABAAAAAAAAAAOc3FydF9wcmljZV94OTYAAAAAAAwAAAAAAAAABHRpY2sAAAAFAAAAAAAAAAh1bmxvY2tlZAAAAAE=",
        "AAAAAQAAAAAAAAAAAAAAClN3YXBSZXN1bHQAAAAAAAUAAAAAAAAAB2Ftb3VudDAAAAAACwAAAAAAAAAHYW1vdW50MQAAAAALAAAAAAAAAAlsaXF1aWRpdHkAAAAAAAAKAAAAAAAAAA5zcXJ0X3ByaWNlX3g5NgAAAAAADAAAAAAAAAAEdGljawAAAAU=",
        "AAAAAQAAAAAAAAAAAAAAE0ltbXV0YWJsZVBvb2xQYXJhbXMAAAAABgAAAAAAAAAHZmFjdG9yeQAAAAATAAAAAAAAAANmZWUAAAAABAAAAAAAAAAQbWF4X2xpcV9wZXJfdGljawAAAAoAAAAAAAAADHRpY2tfc3BhY2luZwAAAAUAAAAAAAAABnRva2VuMAAAAAAAEwAAAAAAAAAGdG9rZW4xAAAAAAAT",
        "AAAAAQAAAAAAAAAAAAAADFByb3RvY29sRmVlcwAAAAIAAAAAAAAABnRva2VuMAAAAAAACgAAAAAAAAAGdG9rZW4xAAAAAAAK",
        "AAAAAQAAAAAAAAAAAAAADlBvb2xTdGF0ZUJhdGNoAAAAAAAFAAAAAAAAABNmZWVfZ3Jvd3RoX2dsb2JhbF8wAAAAB9AAAAANRml4ZWRQb2ludDEyOAAAAAAAAAAAAAATZmVlX2dyb3d0aF9nbG9iYWxfMQAAAAfQAAAADUZpeGVkUG9pbnQxMjgAAAAAAAAAAAAACWxpcXVpZGl0eQAAAAAAAAoAAAAAAAAADXByb3RvY29sX2ZlZXMAAAAAAAfQAAAADFByb3RvY29sRmVlcwAAAAAAAAAFc2xvdDAAAAAAAAfQAAAABVNsb3QwAAAA",
        "AAAAAQAAAAAAAAAAAAAAC09ic2VydmF0aW9uAAAAAAQAAAAAAAAAD2Jsb2NrX3RpbWVzdGFtcAAAAAAEAAAAAAAAAAtpbml0aWFsaXplZAAAAAABAAAAAAAAABxzZWNzX3Blcl9saXFfY3VtdWxhdGl2ZV94MTI4AAAADAAAAAAAAAAPdGlja19jdW11bGF0aXZlAAAAAAc=",
        "AAAAAQAAAAAAAAAAAAAAFE1vZGlmeVBvc2l0aW9uUGFyYW1zAAAABAAAAAAAAAAPbGlxdWlkaXR5X2RlbHRhAAAAAAsAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAKdGlja19sb3dlcgAAAAAABQAAAAAAAAAKdGlja191cHBlcgAAAAAABQ==",
        "AAAAAQAAAAAAAAAAAAAAFFVwZGF0ZVBvc2l0aW9uUGFyYW1zAAAABgAAAAAAAAAPbGlxdWlkaXR5X2RlbHRhAAAAAAsAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAMdGlja19jdXJyZW50AAAABQAAAAAAAAAKdGlja19sb3dlcgAAAAAABQAAAAAAAAAMdGlja19zcGFjaW5nAAAABQAAAAAAAAAKdGlja191cHBlcgAAAAAABQ==",
        "AAAAAQAAAAAAAAAAAAAACVN3YXBDYWNoZQAAAAAAAAYAAAAAAAAAD2Jsb2NrX3RpbWVzdGFtcAAAAAAEAAAAAAAAABtjb21wdXRlZF9sYXRlc3Rfb2JzZXJ2YXRpb24AAAAAAQAAAAAAAAAMZmVlX3Byb3RvY29sAAAABAAAAAAAAAAPbGlxdWlkaXR5X3N0YXJ0AAAAAAoAAAAAAAAAHHNlY3NfcGVyX2xpcV9jdW11bGF0aXZlX3gxMjgAAAAMAAAAAAAAAA90aWNrX2N1bXVsYXRpdmUAAAAABw==",
        "AAAAAQAAAAAAAAAAAAAACVN3YXBTdGF0ZQAAAAAAAAcAAAAAAAAAEWFtb3VudF9jYWxjdWxhdGVkAAAAAAAACwAAAAAAAAAaYW1vdW50X3NwZWNpZmllZF9yZW1haW5pbmcAAAAAAAsAAAAAAAAAFmZlZV9ncm93dGhfZ2xvYmFsX3gxMjgAAAAAAAwAAAAAAAAACWxpcXVpZGl0eQAAAAAAAAoAAAAAAAAADHByb3RvY29sX2ZlZQAAAAoAAAAAAAAADnNxcnRfcHJpY2VfeDk2AAAAAAAMAAAAAAAAAAR0aWNrAAAABQ==",
        "AAAAAQAAAAAAAAAAAAAAEFN0ZXBDb21wdXRhdGlvbnMAAAAHAAAAAAAAAAlhbW91bnRfaW4AAAAAAAAKAAAAAAAAAAphbW91bnRfb3V0AAAAAAAKAAAAAAAAAApmZWVfYW1vdW50AAAAAAAKAAAAAAAAAAtpbml0aWFsaXplZAAAAAABAAAAAAAAABNzcXJ0X3ByaWNlX25leHRfeDk2AAAAAAwAAAAAAAAAFHNxcnRfcHJpY2Vfc3RhcnRfeDk2AAAADAAAAAAAAAAJdGlja19uZXh0AAAAAAAABQ==",
        "AAAAAAAAADtDb25zdHJ1Y3RvciBjYWxsZWQgYnkgdGhlIGZhY3Rvcnkgd2hlbiBkZXBsb3lpbmcgYSBuZXcgcG9vbAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAUAAAAAAAAAB2ZhY3RvcnkAAAAAEwAAAAAAAAAGdG9rZW4wAAAAAAATAAAAAAAAAAZ0b2tlbjEAAAAAABMAAAAAAAAAA2ZlZQAAAAAEAAAAAAAAAAx0aWNrX3NwYWNpbmcAAAAFAAAAAA==",
        "AAAAAAAAAAAAAAALY2hlY2tfdGlja3MAAAAAAgAAAAAAAAAKdGlja19sb3dlcgAAAAAABQAAAAAAAAAKdGlja191cHBlcgAAAAAABQAAAAEAAAPpAAAD7QAAAAAAAAAD",
        "AAAAAAAAAAAAAAAPYmxvY2tfdGltZXN0YW1wAAAAAAAAAAABAAAABg==",
        "AAAAAAAAACtJbml0aWFsaXplIHRoZSBwb29sIHdpdGggaW5pdGlhbCBzcXJ0IHByaWNlAAAAAAppbml0aWFsaXplAAAAAAABAAAAAAAAAA5zcXJ0X3ByaWNlX3g5NgAAAAAADAAAAAEAAAPpAAAD7QAAAAAAAAAD",
        "AAAAAAAAAAtTd2FwIHRva2VucwAAAAAEc3dhcAAAAAUAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEwAAAAAAAAAMemVyb19mb3Jfb25lAAAAAQAAAAAAAAAQYW1vdW50X3NwZWNpZmllZAAAAAsAAAAAAAAAFHNxcnRfcHJpY2VfbGltaXRfeDk2AAAADAAAAAEAAAPpAAAH0AAAAApTd2FwUmVzdWx0AAAAAAAD",
        "AAAAAAAAAQtTd2FwIHVzaW5nIHByZWZ1bmRlZCBpbnB1dCBhbHJlYWR5IGhlbGQgYnkgdGhlIHBvb2wuCgpUaGlzIHZhcmlhbnQgYXNzdW1lcyB0aGUgaW5wdXQgdG9rZW5zIGhhdmUgYmVlbiB0cmFuc2ZlcnJlZCB0byB0aGUgcG9vbApiZWZvcmUgY2FsbGluZy4gSXQgcGVyZm9ybXMgbm8gaW5jb21pbmcgdHJhbnNmZXIgYW5kIG9ubHkgc2VuZHMgb3V0cHV0CnRva2VucyB0byB0aGUgcmVjaXBpZW50LCBhZnRlciB2ZXJpZnlpbmcgc3VmZmljaWVudCBwcmVmdW5kZWQgYmFsYW5jZS4AAAAADnN3YXBfcHJlZnVuZGVkAAAAAAAFAAAAAAAAAAZyb3V0ZXIAAAAAABMAAAAAAAAACXJlY2lwaWVudAAAAAAAABMAAAAAAAAADHplcm9fZm9yX29uZQAAAAEAAAAAAAAAEGFtb3VudF9zcGVjaWZpZWQAAAALAAAAAAAAABRzcXJ0X3ByaWNlX2xpbWl0X3g5NgAAAAwAAAABAAAD6QAAB9AAAAAKU3dhcFJlc3VsdAAAAAAAAw==",
        "AAAAAAAAAGlNYW5hZ2UgYXV0aG9yaXphdGlvbiBmb3Igcm91dGVycyBhbGxvd2VkIHRvIGNhbGwgYHN3YXBfcHJlZnVuZGVkYC4KT25seSB0aGUgcG9vbCdzIGZhY3RvcnkgbWF5IGNhbGwgdGhpcy4AAAAAAAAVc2V0X3JvdXRlcl9hdXRob3JpemVkAAAAAAAAAwAAAAAAAAAHZmFjdG9yeQAAAAATAAAAAAAAAAZyb3V0ZXIAAAAAABMAAAAAAAAAB2FsbG93ZWQAAAAAAQAAAAEAAAPpAAAD7QAAAAAAAAAD",
        "AAAAAAAAAAAAAAAEYnVybgAAAAQAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAKdGlja19sb3dlcgAAAAAABQAAAAAAAAAKdGlja191cHBlcgAAAAAABQAAAAAAAAAGYW1vdW50AAAAAAAKAAAAAQAAA+kAAAPtAAAAAgAAAAoAAAAKAAAAAw==",
        "AAAAAAAAAKpDb2xsZWN0IGZlZXMgYWNjdW11bGF0ZWQgYnkgYSBsaXF1aWRpdHkgcG9zaXRpb24KCkRvZXMgbm90IHJlY29tcHV0ZSBmZWVzIGVhcm5lZCAtIGZlZXMgbXVzdCBiZSBjb21wdXRlZCB2aWEgbWludCBvciBidXJuLgpNYXRjaGVzIFVuaXN3YXAgVjMncyBjb2xsZWN0IGZ1bmN0aW9uIGJlaGF2aW9yLgAAAAAAB2NvbGxlY3QAAAAABQAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEwAAAAAAAAAKdGlja19sb3dlcgAAAAAABQAAAAAAAAAKdGlja191cHBlcgAAAAAABQAAAAAAAAARYW1vdW50MF9yZXF1ZXN0ZWQAAAAAAAAKAAAAAAAAABFhbW91bnQxX3JlcXVlc3RlZAAAAAAAAAoAAAABAAAD7QAAAAIAAAAKAAAACg==",
        "AAAAAAAAAAAAAAAQc2V0X2ZlZV9wcm90b2NvbAAAAAIAAAAAAAAADWZlZV9wcm90b2NvbDAAAAAAAAAEAAAAAAAAAA1mZWVfcHJvdG9jb2wxAAAAAAAABAAAAAEAAAPpAAAD7QAAAAAAAAAD",
        "AAAAAAAAAAAAAAAQY29sbGVjdF9wcm90b2NvbAAAAAMAAAAAAAAACXJlY2lwaWVudAAAAAAAABMAAAAAAAAAEWFtb3VudDBfcmVxdWVzdGVkAAAAAAAACgAAAAAAAAARYW1vdW50MV9yZXF1ZXN0ZWQAAAAAAAAKAAAAAQAAA+0AAAACAAAACgAAAAo=",
        "AAAAAAAAABpHZXQgdGhlIGN1cnJlbnQgcG9vbCBzdGF0ZQAAAAAABXNsb3QwAAAAAAAAAAAAAAEAAAfQAAAABVNsb3QwAAAA",
        "AAAAAAAAABdHZXQgdGhlIGZhY3RvcnkgYWRkcmVzcwAAAAAHZmFjdG9yeQAAAAAAAAAAAQAAABM=",
        "AAAAAAAAABJHZXQgdG9rZW4wIGFkZHJlc3MAAAAAAAZ0b2tlbjAAAAAAAAAAAAABAAAAEw==",
        "AAAAAAAAABJHZXQgdG9rZW4xIGFkZHJlc3MAAAAAAAZ0b2tlbjEAAAAAAAAAAAABAAAAEw==",
        "AAAAAAAAABBHZXQgdGhlIHBvb2wgZmVlAAAAA2ZlZQAAAAAAAAAAAQAAAAQ=",
        "AAAAAAAAABBHZXQgdGljayBzcGFjaW5nAAAADHRpY2tfc3BhY2luZwAAAAAAAAABAAAABQ==",
        "AAAAAAAAAEBFeHBvc2UgdGljayBiaXRtYXAgd29yZCBmb3IgZXh0ZXJuYWwgY2FsbGVycyAoZS5nLiwgbGVucy9xdW90ZXIpAAAAD2dldF90aWNrX2JpdG1hcAAAAAABAAAAAAAAAAh3b3JkX3BvcwAAAAUAAAABAAAADA==",
        "AAAAAAAAABVHZXQgY3VycmVudCBsaXF1aWRpdHkAAAAAAAAJbGlxdWlkaXR5AAAAAAAAAAAAAAEAAAAK",
        "AAAAAAAAABlHZXQgZmVlIGdyb3d0aCBmb3IgdG9rZW4wAAAAAAAAGGZlZV9ncm93dGhfZ2xvYmFsXzBfeDEyOAAAAAAAAAABAAAH0AAAAA1GaXhlZFBvaW50MTI4AAAA",
        "AAAAAAAAABlHZXQgZmVlIGdyb3d0aCBmb3IgdG9rZW4xAAAAAAAAGGZlZV9ncm93dGhfZ2xvYmFsXzFfeDEyOAAAAAAAAAABAAAH0AAAAA1GaXhlZFBvaW50MTI4AAAA",
        "AAAAAAAAABFHZXQgcHJvdG9jb2wgZmVlcwAAAAAAAA1wcm90b2NvbF9mZWVzAAAAAAAAAAAAAAEAAAfQAAAADFByb3RvY29sRmVlcw==",
        "AAAAAAAAABFHZXQgcHJvdG9jb2wgZmVlcwAAAAAAAAV0aWNrcwAAAAAAAAEAAAAAAAAABHRpY2sAAAAFAAAAAQAAB9AAAAAIVGlja0luZm8=",
        "AAAAAAAAAAAAAAAbc25hcHNob3RfY3VtdWxhdGl2ZXNfaW5zaWRlAAAAAAIAAAAAAAAACnRpY2tfbG93ZXIAAAAAAAUAAAAAAAAACnRpY2tfdXBwZXIAAAAAAAUAAAABAAAD6QAAA+0AAAADAAAABwAAB9AAAAANRml4ZWRQb2ludDEyOAAAAAAAAAQAAAAD",
        "AAAAAAAAABtPYnNlcnZlIGEgc2luZ2xlIHRpbWUgcG9pbnQAAAAADm9ic2VydmVfc2luZ2xlAAAAAAABAAAAAAAAAAtzZWNvbmRzX2FnbwAAAAAEAAAAAQAAA+kAAAPtAAAAAgAAAAcAAAfQAAAADUZpeGVkUG9pbnQxMjgAAAAAAAAD",
        "AAAAAAAAABxPYnNlcnZlIG11bHRpcGxlIHRpbWUgcG9pbnRzAAAAB29ic2VydmUAAAAAAQAAAAAAAAAMc2Vjb25kc19hZ29zAAAD6gAAAAQAAAABAAAD6QAAA+0AAAACAAAD6gAAAAcAAAPqAAAH0AAAAA1GaXhlZFBvaW50MTI4AAAAAAAAAw==",
        "AAAAAAAAAAAAAAAEbWludAAAAAQAAAAAAAAACXJlY2lwaWVudAAAAAAAABMAAAAAAAAACnRpY2tfbG93ZXIAAAAAAAUAAAAAAAAACnRpY2tfdXBwZXIAAAAAAAUAAAAAAAAABmFtb3VudAAAAAAACgAAAAEAAAPpAAAD7QAAAAIAAAAKAAAACgAAAAM=",
        "AAAAAAAAAAAAAAAWZ2V0X3RpY2tfYml0bWFwX3B1YmxpYwAAAAAAAQAAAAAAAAAId29yZF9wb3MAAAAFAAAAAQAAAAw=",
        "AAAAAAAAAGtRdW90ZSBleGFjdCBpbnB1dCBzd2FwIHdpdGhvdXQgZXhlY3V0aW5nIHRyYW5zZmVycwpSZXR1cm5zIHRoZSBhbW91bnQgb2Ygb3V0cHV0IHRva2VucyBhbmQgZmluYWwgcG9vbCBzdGF0ZQAAAAARcXVvdGVfZXhhY3RfaW5wdXQAAAAAAAADAAAAAAAAAAx6ZXJvX2Zvcl9vbmUAAAABAAAAAAAAAAlhbW91bnRfaW4AAAAAAAALAAAAAAAAABRzcXJ0X3ByaWNlX2xpbWl0X3g5NgAAAAwAAAABAAAD6QAAB9AAAAAKU3dhcFJlc3VsdAAAAAAAAw==",
        "AAAAAAAAAHRRdW90ZSBleGFjdCBvdXRwdXQgc3dhcCB3aXRob3V0IGV4ZWN1dGluZyB0cmFuc2ZlcnMKUmV0dXJucyB0aGUgYW1vdW50IG9mIGlucHV0IHRva2VucyByZXF1aXJlZCBhbmQgZmluYWwgcG9vbCBzdGF0ZQAAABJxdW90ZV9leGFjdF9vdXRwdXQAAAAAAAMAAAAAAAAADHplcm9fZm9yX29uZQAAAAEAAAAAAAAACmFtb3VudF9vdXQAAAAAAAsAAAAAAAAAFHNxcnRfcHJpY2VfbGltaXRfeDk2AAAADAAAAAEAAAPpAAAH0AAAAApTd2FwUmVzdWx0AAAAAAAD",
        "AAAAAQAAALpRMTI4LjEyOCBmaXhlZC1wb2ludCBudW1iZXIKClJlcHJlc2VudHMgYSBudW1iZXIgYXM6IHZhbHVlIC8gMl4xMjgKClVzZWQgZXhjbHVzaXZlbHkgZm9yIGZlZSBncm93dGggdHJhY2tpbmcgaW4gVW5pc3dhcCBWMyBhcmNoaXRlY3R1cmUuCkZvciBwcmljZSBjYWxjdWxhdGlvbnMsIHVzZSBGaXhlZFBvaW50OTYgaW5zdGVhZC4AAAAAAAAAAAANRml4ZWRQb2ludDEyOAAAAAAAAAEAAAAAAAAAATAAAAAAAAAM",
        "AAAAAQAAAHdRNjQuOTYgZml4ZWQtcG9pbnQgbnVtYmVyCgpJbnRlcm5hbGx5IHN0b3JlZCBhcyBhIFUyNTYgd2hlcmUgdGhlIHZhbHVlIHJlcHJlc2VudHM6CmBhY3R1YWxfdmFsdWUgPSBzdG9yZWRfdmFsdWUgLyAyXjk2YAAAAAAAAAAADEZpeGVkUG9pbnQ5NgAAAAEAAAAAAAAAATAAAAAAAAAM",
        "AAAAAQAAAAAAAAAAAAAADlN3YXBTdGVwUmVzdWx0AAAAAAAEAAAAAAAAAAlhbW91bnRfaW4AAAAAAAAMAAAAAAAAAAphbW91bnRfb3V0AAAAAAAMAAAAAAAAAApmZWVfYW1vdW50AAAAAAAMAAAAAAAAAA9zcXJ0X3JhdGlvX25leHQAAAAH0AAAAAxTcXJ0UHJpY2VYOTY=",
        "AAAAAQAAAJQ1MTItYml0IHVuc2lnbmVkIGludGVnZXIKClJlcHJlc2VudGVkIGFzIHR3byAyNTYtYml0IGNvbXBvbmVudHM6Ci0gYGxvd2A6IGJpdHMgMC0yNTUKLSBgaGlnaGA6IGJpdHMgMjU2LTUxMQoKVGhlIGFjdHVhbCB2YWx1ZSBpczogaGlnaCAqIDJeMjU2ICsgbG93AAAAAAAAAARVNTEyAAAAAgAAAAAAAAAEaGlnaAAAAAwAAAAAAAAAA2xvdwAAAAAM" ]),
      options
    )
  }
  public readonly fromJSON = {
    check_ticks: this.txFromJSON<Result<void>>,
        block_timestamp: this.txFromJSON<u64>,
        initialize: this.txFromJSON<Result<void>>,
        swap: this.txFromJSON<Result<SwapResult>>,
        swap_prefunded: this.txFromJSON<Result<SwapResult>>,
        set_router_authorized: this.txFromJSON<Result<void>>,
        burn: this.txFromJSON<Result<readonly [u128, u128]>>,
        collect: this.txFromJSON<readonly [u128, u128]>,
        set_fee_protocol: this.txFromJSON<Result<void>>,
        collect_protocol: this.txFromJSON<readonly [u128, u128]>,
        slot0: this.txFromJSON<Slot0>,
        factory: this.txFromJSON<string>,
        token0: this.txFromJSON<string>,
        token1: this.txFromJSON<string>,
        fee: this.txFromJSON<u32>,
        tick_spacing: this.txFromJSON<i32>,
        get_tick_bitmap: this.txFromJSON<u256>,
        liquidity: this.txFromJSON<u128>,
        fee_growth_global_0_x128: this.txFromJSON<FixedPoint128>,
        fee_growth_global_1_x128: this.txFromJSON<FixedPoint128>,
        protocol_fees: this.txFromJSON<ProtocolFees>,
        ticks: this.txFromJSON<TickInfo>,
        snapshot_cumulatives_inside: this.txFromJSON<Result<readonly [i64, FixedPoint128, u32]>>,
        observe_single: this.txFromJSON<Result<readonly [i64, FixedPoint128]>>,
        observe: this.txFromJSON<Result<readonly [Array<i64>, Array<FixedPoint128>]>>,
        mint: this.txFromJSON<Result<readonly [u128, u128]>>,
        get_tick_bitmap_public: this.txFromJSON<u256>,
        quote_exact_input: this.txFromJSON<Result<SwapResult>>,
        quote_exact_output: this.txFromJSON<Result<SwapResult>>
  }
}