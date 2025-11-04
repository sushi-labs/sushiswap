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
    contractId: "CC7ZPELSGOVPIGP25TIOYWX2NWFVHCEXFZOKWN4ENF7Z2PBPHLQMKYNS",
  }
} as const


/**
 * Flash lock state for begin/end pattern
 * Stores information about an active flash loan to verify repayment
 */
export interface FlashLock {
  balance_before_0: u128;
  balance_before_1: u128;
  expected_fee_0: u128;
  expected_fee_1: u128;
  expiry_ledger: u32;
  initiator: string;
}

/**
 * Storage keys for the Oracle
 */
export type OracleDataKey = {tag: "LatestOracleObservation", values: void} | {tag: "RecentOracleObservation", values: readonly [u128]} | {tag: "HistoricalCheckpoint", values: readonly [u32]} | {tag: "Metadata", values: void};


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
  flash_executor: string;
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


export type SqrtPriceX96 = readonly [u256];

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
   * Validates that tick range is properly ordered and within bounds.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `tick_lower` - Lower tick of the range
   * * `tick_upper` - Upper tick of the range
   * 
   * # Returns
   * * `Ok(())` if ticks are valid
   * * `Err` if ticks are invalid (wrong order, out of bounds, or misaligned with tick_spacing)
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
   * Returns the current ledger timestamp.
   * 
   * # Arguments
   * * `env` - The contract environment
   * 
   * # Returns
   * Current timestamp in seconds
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
   * Initializes the pool with a starting price.
   * 
   * Must be called before any liquidity operations. Can only be called once.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `sqrt_price_x96` - Initial sqrt price in Q64.96 format
   * 
   * # Returns
   * * `Ok(())` on success
   * * `Err(AlreadyInitialized)` if pool is already initialized
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
   * Swaps tokens in the pool.
   * 
   * Transfers tokens from sender and sends output tokens to recipient.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `sender` - Address providing input tokens (requires auth)
   * * `recipient` - Address receiving output tokens
   * * `zero_for_one` - True if swapping token0 for token1, false otherwise
   * * `amount_specified` - Amount to swap (positive for exact input, negative for exact output)
   * * `sqrt_price_limit_x96` - Price limit for the swap in Q64.96 format
   * 
   * # Returns
   * * `Ok(SwapResult)` containing amounts swapped and final price
   * * `Err` if swap fails (locked, invalid price limit, etc.)
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
   * Swaps tokens using prefunded input already held by the pool.
   * 
   * Assumes input tokens have been transferred to the pool before calling.
   * Only authorized routers can call this function. Verifies sufficient
   * prefunded balance before executing the swap.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `router` - Address of the authorized router (requires auth)
   * * `recipient` - Address receiving output tokens
   * * `zero_for_one` - True if swapping token0 for token1, false otherwise
   * * `amount_specified` - Amount to swap (positive for exact input, negative for exact output)
   * * `sqrt_price_limit_x96` - Price limit for the swap in Q64.96 format
   * 
   * # Returns
   * * `Ok(SwapResult)` containing amounts swapped and final price
   * * `Err(Unauthorized)` if router is not authorized
   * * `Err` on other failures (locked, invalid price limit, insufficient balance)
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
   * Manages authorization for routers allowed to call `swap_prefunded`.
   * 
   * Only the pool's factory can call this function.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `factory` - Address of the factory (requires auth, must match pool's factory)
   * * `router` - Address of the router to authorize/unauthorize
   * * `allowed` - True to authorize, false to remove authorization
   * 
   * # Returns
   * * `Ok(())` on success
   * * `Err(Unauthorized)` if caller is not the pool's factory
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
   * Burns liquidity from a position.
   * 
   * Removes liquidity from the specified tick range and credits the owed
   * tokens to the position. Tokens must be collected separately via `collect`.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `owner` - Address owning the position (requires auth)
   * * `tick_lower` - Lower tick of the position range
   * * `tick_upper` - Upper tick of the position range
   * * `amount` - Amount of liquidity to burn
   * 
   * # Returns
   * * `Ok((amount0, amount1))` - Amounts of token0 and token1 owed to the position
   * * `Err(Locked)` if pool is currently locked
   * * `Err` on other failures (invalid ticks, position not found)
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
   * Collects fees accumulated by a liquidity position.
   * 
   * Transfers owed tokens to the recipient. Fees are computed when liquidity
   * is added or removed via mint/burn, not when collecting.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `recipient` - Address receiving the fees (requires auth, must be position owner)
   * * `tick_lower` - Lower tick of the position range
   * * `tick_upper` - Upper tick of the position range
   * * `amount0_requested` - Maximum amount of token0 to collect
   * * `amount1_requested` - Maximum amount of token1 to collect
   * 
   * # Returns
   * * `Ok((amount0, amount1))` - Actual amounts collected (min of requested vs owed)
   * * `Err(Error)` if position fee update fails
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
  }) => Promise<AssembledTransaction<Result<readonly [u128, u128]>>>

  /**
   * Construct and simulate a collect_protocol transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Collects protocol fees accumulated by the pool.
   * 
   * Only the factory owner can call this function. Keeps a minimum of 1 token
   * in the slot to save on storage gas costs.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `recipient` - Address receiving the protocol fees (requires factory owner auth)
   * * `amount0_requested` - Maximum amount of token0 to collect
   * * `amount1_requested` - Maximum amount of token1 to collect
   * 
   * # Returns
   * * `Ok((amount0, amount1))` - Actual amounts collected
   * * `Err(Error)` if pool is not initialized or params are missing
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
  }) => Promise<AssembledTransaction<Result<readonly [u128, u128]>>>

  /**
   * Construct and simulate a flash_begin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Begins a flash loan (new begin/end pattern).
   * 
   * Transfers borrowed tokens to recipient and sets a flash lock.
   * Must be followed by flash_end() in the same transaction to verify repayment.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `recipient` - Address receiving the borrowed tokens
   * * `amount0` - Amount of token0 to borrow
   * * `amount1` - Amount of token1 to borrow
   * * `initiator` - Address orchestrating the flash loan (requires factory authorization)
   * 
   * # Returns
   * * `Ok((fee0, fee1))` - Flash fees that must be repaid
   * * `Err(FlashLocked)` if another flash loan is active
   * * `Err(Unauthorized)` if initiator is not factory-authorized
   * * `Err(InsufficientLiquidity)` if pool lacks requested tokens
   */
  flash_begin: ({recipient, amount0, amount1, initiator}: {recipient: string, amount0: u128, amount1: u128, initiator: string}, options?: {
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
   * Construct and simulate a flash_end transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Ends a flash loan (new begin/end pattern).
   * 
   * Verifies repayment by checking balance deltas, accrues fees to protocol/LPs,
   * and clears the flash lock.
   * 
   * # Arguments
   * * `env` - The contract environment
   * 
   * # Returns
   * * `Ok(())` if repayment is sufficient
   * * `Err(FlashNotLocked)` if flash_begin was not called
   * * `Err(Unauthorized)` if caller is not the initiator
   * * `Err(InsufficientRepayment0/1)` if repayment < fee
   */
  flash_end: (options?: {
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
   * Construct and simulate a get_flash_lock transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get current flash lock state (read-only).
   * 
   * Returns information about an active flash loan if one exists.
   * Useful for analytics, debugging, and monitoring.
   * 
   * # Arguments
   * * `env` - The contract environment
   * 
   * # Returns
   * * `Some(FlashLock)` if a flash loan is currently active
   * * `None` if no flash loan is active
   */
  get_flash_lock: (options?: {
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
  }) => Promise<AssembledTransaction<Option<FlashLock>>>

  /**
   * Construct and simulate a force_unlock_flash transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Force unlock a stale flash lock (factory owner only).
   * 
   * Emergency recovery function that clears the flash lock.
   * Should only be used for stale locks past their expiry_ledger.
   * 
   * # Arguments
   * * `env` - The contract environment
   * 
   * # Returns
   * * `Ok(())` if lock was cleared successfully
   * * `Err(Unauthorized)` if caller is not factory owner
   * 
   * # Safety
   * This can break active flash loans if called prematurely.
   * Only use when lock has exceeded expiry_ledger.
   */
  force_unlock_flash: (options?: {
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
   * Construct and simulate a set_flash_executor transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Rotate the FlashExecutor address (factory owner only).
   * 
   * Allows safe rotation of FlashExecutor without redeploying pools.
   * Provides upgrade path while maintaining single-executor model.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `new_executor` - Address of the new FlashExecutor
   * 
   * # Returns
   * * `Ok(())` if rotation successful
   * * `Err(Unauthorized)` if caller is not factory owner
   * * `Err(Locked)` if pool has active flash loan
   * 
   * # Events
   * Emits `FlashExecutorRotatedEvent` for transparency and monitoring.
   */
  set_flash_executor: ({new_executor}: {new_executor: string}, options?: {
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
   * Construct and simulate a slot0 transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Returns the current pool state.
   * 
   * # Arguments
   * * `env` - The contract environment
   * 
   * # Returns
   * Slot0 containing current sqrt price, tick, and lock status
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
   * Returns the factory address that created this pool.
   * 
   * # Arguments
   * * `env` - The contract environment
   * 
   * # Returns
   * Address of the factory contract
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
   * Returns the address of token0 in the pair.
   * 
   * # Arguments
   * * `env` - The contract environment
   * 
   * # Returns
   * Address of token0
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
   * Returns the address of token1 in the pair.
   * 
   * # Arguments
   * * `env` - The contract environment
   * 
   * # Returns
   * Address of token1
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
   * Construct and simulate a get_tokens transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Returns both token addresses in one call (convenience for FlashExecutor).
   * 
   * # Arguments
   * * `env` - The contract environment
   * 
   * # Returns
   * Tuple of (token0, token1) addresses
   */
  get_tokens: (options?: {
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
  }) => Promise<AssembledTransaction<readonly [string, string]>>

  /**
   * Construct and simulate a fee transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Returns the pool's fee tier.
   * 
   * # Arguments
   * * `env` - The contract environment
   * 
   * # Returns
   * Fee in basis points (e.g., 3000 = 0.3%)
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
   * Returns the pool's tick spacing.
   * 
   * # Arguments
   * * `env` - The contract environment
   * 
   * # Returns
   * Tick spacing (e.g., 60 means positions must be on multiples of 60)
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
   * Construct and simulate a get_protocol_fee_0 transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Returns the protocol fee for zero_for_one swaps from the factory.
   * 
   * # Arguments
   * * `env` - The contract environment
   * 
   * # Returns
   * Protocol fee in basis points
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
   * Returns the protocol fee for one_for_zero swaps from the factory.
   * 
   * # Arguments
   * * `env` - The contract environment
   * 
   * # Returns
   * Protocol fee in basis points
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
   * Construct and simulate a get_tick_bitmap transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Returns a tick bitmap word for off-chain quoters and lens contracts.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `word_pos` - The word position in the bitmap
   * 
   * # Returns
   * 256-bit word from the tick bitmap
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
   * Returns the current active liquidity.
   * 
   * # Arguments
   * * `env` - The contract environment
   * 
   * # Returns
   * Total liquidity currently active at the current tick
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
   * Returns the global fee growth for token0.
   * 
   * # Arguments
   * * `env` - The contract environment
   * 
   * # Returns
   * Fee growth in Q128.128 format
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
   * Returns the global fee growth for token1.
   * 
   * # Arguments
   * * `env` - The contract environment
   * 
   * # Returns
   * Fee growth in Q128.128 format
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
   * Returns the accumulated protocol fees.
   * 
   * # Arguments
   * * `env` - The contract environment
   * 
   * # Returns
   * ProtocolFees struct containing amounts for both tokens
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
   * Returns information about a specific tick.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `tick` - The tick index to query
   * 
   * # Returns
   * TickInfo struct, or default (uninitialized) if tick hasn't been used
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
   * Returns cumulative values inside a tick range for a given position.
   * 
   * Used to compute time-weighted averages and liquidity-weighted time within
   * a price range for liquidity mining and other analytics.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `tick_lower` - Lower tick of the range
   * * `tick_upper` - Upper tick of the range
   * 
   * # Returns
   * * `Ok((tick_cumulative, seconds_per_liquidity_cumulative, seconds_inside))`
   * * `Err(TickNotInitialized)` if either tick hasn't been initialized
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
   * Observes oracle data for a single time point.
   * 
   * Returns tick cumulative and seconds per liquidity cumulative values
   * for computing time-weighted averages.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `seconds_ago` - How many seconds in the past to observe (0 = current)
   * 
   * # Returns
   * * `Ok((tick_cumulative, seconds_per_liquidity_cumulative_x128))`
   * * `Err` if observation doesn't exist or is too old
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
   * Observes oracle data for multiple time points.
   * 
   * Returns tick cumulative and seconds per liquidity cumulative values
   * for each requested time point, for computing time-weighted averages.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `seconds_agos` - Vector of seconds in the past to observe (0 = current)
   * 
   * # Returns
   * * `Ok((tick_cumulatives, seconds_per_liquidity_cumulatives_x128))`
   * * `Err` if any observation doesn't exist or is too old
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
   * Mints liquidity to a position.
   * 
   * Creates or adds to a liquidity position in the specified tick range.
   * Transfers the required amounts of both tokens from the recipient.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `recipient` - Address receiving the liquidity position (requires auth)
   * * `tick_lower` - Lower tick of the position range
   * * `tick_upper` - Upper tick of the position range
   * * `amount` - Amount of liquidity to mint
   * 
   * # Returns
   * * `Ok((amount0, amount1))` - Amounts of tokens deposited
   * * `Err(AmountShouldBeGreaterThanZero)` if amount is zero
   * * `Err(Locked)` if pool is currently locked
   * * `Err(InsufficientToken0/Token1)` if token transfer fails
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
   * Returns a tick bitmap word (public variant).
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `word_pos` - The word position in the bitmap
   * 
   * # Returns
   * 256-bit word from the tick bitmap, or zero if uninitialized
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
   * Quotes an exact input swap without executing it.
   * 
   * Simulates a swap to determine output amount and final price without
   * transferring tokens or modifying state.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `zero_for_one` - True if swapping token0 for token1, false otherwise
   * * `amount_in` - Exact amount of input tokens
   * * `sqrt_price_limit_x96` - Price limit for the swap in Q64.96 format
   * 
   * # Returns
   * * `Ok(SwapResult)` containing output amount and final sqrt price
   * * `Err` if swap would fail (invalid price limit, etc.)
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
   * Quotes an exact output swap without executing it.
   * 
   * Simulates a swap to determine input amount required for a desired output
   * without transferring tokens or modifying state.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `zero_for_one` - True if swapping token0 for token1, false otherwise
   * * `amount_out` - Exact amount of output tokens desired
   * * `sqrt_price_limit_x96` - Price limit for the swap in Q64.96 format
   * 
   * # Returns
   * * `Ok(SwapResult)` containing required input amount and final sqrt price
   * * `Err` if swap would fail (invalid price limit, insufficient liquidity)
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

  /**
   * Construct and simulate a positions transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Returns position data for a specific owner and tick range.
   * 
   * # Arguments
   * * `env` - The contract environment
   * * `recipient` - Address of the position owner
   * * `tick_lower` - Lower tick of the position range
   * * `tick_upper` - Upper tick of the position range
   * 
   * # Returns
   * PositionData containing liquidity, fee growth, and tokens owed
   * 
   * # Panics
   * Panics if position doesn't exist
   */
  positions: ({recipient, tick_lower, tick_upper}: {recipient: string, tick_lower: i32, tick_upper: i32}, options?: {
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
  }) => Promise<AssembledTransaction<PositionData>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        {factory, flash_executor, token0, token1, fee, tick_spacing}: {factory: string, flash_executor: string, token0: string, token1: string, fee: u32, tick_spacing: i32},
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
    return ContractClient.deploy({factory, flash_executor, token0, token1, fee, tick_spacing}, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAQAAAGhGbGFzaCBsb2NrIHN0YXRlIGZvciBiZWdpbi9lbmQgcGF0dGVybgpTdG9yZXMgaW5mb3JtYXRpb24gYWJvdXQgYW4gYWN0aXZlIGZsYXNoIGxvYW4gdG8gdmVyaWZ5IHJlcGF5bWVudAAAAAAAAAAJRmxhc2hMb2NrAAAAAAAABgAAAAAAAAAQYmFsYW5jZV9iZWZvcmVfMAAAAAoAAAAAAAAAEGJhbGFuY2VfYmVmb3JlXzEAAAAKAAAAAAAAAA5leHBlY3RlZF9mZWVfMAAAAAAACgAAAAAAAAAOZXhwZWN0ZWRfZmVlXzEAAAAAAAoAAAAAAAAADWV4cGlyeV9sZWRnZXIAAAAAAAAEAAAAAAAAAAlpbml0aWF0b3IAAAAAAAAT",
        "AAAAAgAAABtTdG9yYWdlIGtleXMgZm9yIHRoZSBPcmFjbGUAAAAAAAAAAA1PcmFjbGVEYXRhS2V5AAAAAAAABAAAAAAAAAAoTW9zdCByZWNlbnQgb2JzZXJ2YXRpb24gZm9yIHF1aWNrIGFjY2VzcwAAABdMYXRlc3RPcmFjbGVPYnNlcnZhdGlvbgAAAAABAAAAPFJlY2VudCBvYnNlcnZhdGlvbnMgc3RvcmVkIHdpdGggVFRMIChrZXk6IG9ic2VydmF0aW9uIGluZGV4KQAAABdSZWNlbnRPcmFjbGVPYnNlcnZhdGlvbgAAAAABAAAACgAAAAEAAABBSGlzdG9yaWNhbCBjaGVja3BvaW50cyBzdG9yZWQgcGVybWFuZW50bHkgKGtleTogY2hlY2twb2ludCBpbmRleCkAAAAAAAAUSGlzdG9yaWNhbENoZWNrcG9pbnQAAAABAAAABAAAAAAAAAAPT3JhY2xlIG1ldGFkYXRhAAAAAAhNZXRhZGF0YQ==",
        "AAAAAQAAACBPcmFjbGVPYnNlcnZhdGlvbiBkYXRhIHN0cnVjdHVyZQAAAAAAAAART3JhY2xlT2JzZXJ2YXRpb24AAAAAAAAGAAAALVdoZXRoZXIgdGhpcyBvYnNlcnZhdGlvbiBoYXMgYmVlbiBpbml0aWFsaXplZAAAAAAAAAtpbml0aWFsaXplZAAAAAABAAAAKUxlZGdlciBzZXF1ZW5jZSB3aGVuIG9ic2VydmF0aW9uIHdhcyBtYWRlAAAAAAAAD2xlZGdlcl9zZXF1ZW5jZQAAAAAEAAAAJ0N1bXVsYXRpdmUgc2Vjb25kcyBwZXIgbGlxdWlkaXR5IChRMTI4KQAAAAAYc2Vjb25kc19wZXJfbGlxX2N1bV94MTI4AAAH0AAAAA1GaXhlZFBvaW50MTI4AAAAAAAAKFRoZSB0aWNrIGF0IHRoZSB0aW1lIG9mIHRoaXMgb2JzZXJ2YXRpb24AAAAEdGljawAAAAUAAAAeQ3VtdWxhdGl2ZSB0aWNrICogdGltZSBlbGFwc2VkAAAAAAAPdGlja19jdW11bGF0aXZlAAAAAAcAAAAaVW5peCB0aW1lc3RhbXAgZnJvbSBsZWRnZXIAAAAAAAl0aW1lc3RhbXAAAAAAAAAG",
        "AAAAAQAAACJPcmFjbGUgbWV0YWRhdGEgZm9yIHRyYWNraW5nIHN0YXRlAAAAAAAAAAAADk9yYWNsZU1ldGFkYXRhAAAAAAADAAAAIE51bWJlciBvZiBoaXN0b3JpY2FsIGNoZWNrcG9pbnRzAAAAEGNoZWNrcG9pbnRfY291bnQAAAAEAAAAFUxhc3QgY2hlY2twb2ludCBpbmRleAAAAAAAABVsYXN0X2NoZWNrcG9pbnRfaW5kZXgAAAAAAAAEAAAAMUxhc3QgbGVkZ2VyIHNlcXVlbmNlIHdoZW4gb2JzZXJ2YXRpb24gd2FzIHdyaXR0ZW4AAAAAAAAXbGFzdF9vYnNlcnZhdGlvbl9sZWRnZXIAAAAABA==",
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
        "AAAABQAAAAAAAAAAAAAAFENvbGxlY3RQcm90b2NvbEV2ZW50AAAAAQAAAAljb2xsZWN0X3AAAAAAAAAEAAAAAAAAAAZzZW5kZXIAAAAAABMAAAAAAAAAAAAAAAlyZWNpcGllbnQAAAAAAAATAAAAAAAAAAAAAAAHYW1vdW50MAAAAAAKAAAAAAAAAAAAAAAHYW1vdW50MQAAAAAKAAAAAAAAAAI=",
        "AAAABQAAAAAAAAAAAAAAD0ZsYXNoQmVnaW5FdmVudAAAAAABAAAAC2ZsYXNoX2JlZ2luAAAAAAYAAAAAAAAACWluaXRpYXRvcgAAAAAAABMAAAAAAAAAAAAAAAlyZWNpcGllbnQAAAAAAAATAAAAAAAAAAAAAAAHYW1vdW50MAAAAAAKAAAAAAAAAAAAAAAHYW1vdW50MQAAAAAKAAAAAAAAAAAAAAAEZmVlMAAAAAoAAAAAAAAAAAAAAARmZWUxAAAACgAAAAAAAAAC",
        "AAAABQAAAAAAAAAAAAAADUZsYXNoRW5kRXZlbnQAAAAAAAABAAAACWZsYXNoX2VuZAAAAAAAAAIAAAAAAAAABXBhaWQwAAAAAAAACgAAAAAAAAAAAAAABXBhaWQxAAAAAAAACgAAAAAAAAAC",
        "AAAABQAAAAAAAAAAAAAAEkZsYXNoUmVjb3ZlcnlFdmVudAAAAAAAAQAAAA5mbGFzaF9yZWNvdmVyeQAAAAAAAwAAAAAAAAAJaW5pdGlhdG9yAAAAAAAAEwAAAAAAAAAAAAAADWV4cGlyeV9sZWRnZXIAAAAAAAAEAAAAAAAAAAAAAAAOY3VycmVudF9sZWRnZXIAAAAAAAQAAAAAAAAAAg==",
        "AAAABQAAAAAAAAAAAAAAGUZsYXNoRXhlY3V0b3JSb3RhdGVkRXZlbnQAAAAAAAABAAAAEWZsYXNoX2V4ZWNfcm90YXRlAAAAAAAAAgAAAAAAAAAMb2xkX2V4ZWN1dG9yAAAAEwAAAAAAAAAAAAAADG5ld19leGVjdXRvcgAAABMAAAAAAAAAAg==",
        "AAAAAQAAAAAAAAAAAAAABVNsb3QwAAAAAAAAAwAAAAAAAAAOc3FydF9wcmljZV94OTYAAAAAAAwAAAAAAAAABHRpY2sAAAAFAAAAAAAAAAh1bmxvY2tlZAAAAAE=",
        "AAAAAQAAAAAAAAAAAAAAClN3YXBSZXN1bHQAAAAAAAUAAAAAAAAAB2Ftb3VudDAAAAAACwAAAAAAAAAHYW1vdW50MQAAAAALAAAAAAAAAAlsaXF1aWRpdHkAAAAAAAAKAAAAAAAAAA5zcXJ0X3ByaWNlX3g5NgAAAAAADAAAAAAAAAAEdGljawAAAAU=",
        "AAAAAQAAAAAAAAAAAAAAE0ltbXV0YWJsZVBvb2xQYXJhbXMAAAAABwAAAAAAAAAHZmFjdG9yeQAAAAATAAAAAAAAAANmZWUAAAAABAAAAAAAAAAOZmxhc2hfZXhlY3V0b3IAAAAAABMAAAAAAAAAEG1heF9saXFfcGVyX3RpY2sAAAAKAAAAAAAAAAx0aWNrX3NwYWNpbmcAAAAFAAAAAAAAAAZ0b2tlbjAAAAAAABMAAAAAAAAABnRva2VuMQAAAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAADFByb3RvY29sRmVlcwAAAAIAAAAAAAAABnRva2VuMAAAAAAACgAAAAAAAAAGdG9rZW4xAAAAAAAK",
        "AAAAAQAAAAAAAAAAAAAADlBvb2xTdGF0ZUJhdGNoAAAAAAAFAAAAAAAAABNmZWVfZ3Jvd3RoX2dsb2JhbF8wAAAAB9AAAAANRml4ZWRQb2ludDEyOAAAAAAAAAAAAAATZmVlX2dyb3d0aF9nbG9iYWxfMQAAAAfQAAAADUZpeGVkUG9pbnQxMjgAAAAAAAAAAAAACWxpcXVpZGl0eQAAAAAAAAoAAAAAAAAADXByb3RvY29sX2ZlZXMAAAAAAAfQAAAADFByb3RvY29sRmVlcwAAAAAAAAAFc2xvdDAAAAAAAAfQAAAABVNsb3QwAAAA",
        "AAAAAQAAAAAAAAAAAAAAC09ic2VydmF0aW9uAAAAAAQAAAAAAAAAD2Jsb2NrX3RpbWVzdGFtcAAAAAAEAAAAAAAAAAtpbml0aWFsaXplZAAAAAABAAAAAAAAABxzZWNzX3Blcl9saXFfY3VtdWxhdGl2ZV94MTI4AAAADAAAAAAAAAAPdGlja19jdW11bGF0aXZlAAAAAAc=",
        "AAAAAQAAAAAAAAAAAAAAFE1vZGlmeVBvc2l0aW9uUGFyYW1zAAAABAAAAAAAAAAPbGlxdWlkaXR5X2RlbHRhAAAAAAsAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAKdGlja19sb3dlcgAAAAAABQAAAAAAAAAKdGlja191cHBlcgAAAAAABQ==",
        "AAAAAQAAAAAAAAAAAAAAFFVwZGF0ZVBvc2l0aW9uUGFyYW1zAAAABgAAAAAAAAAPbGlxdWlkaXR5X2RlbHRhAAAAAAsAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAMdGlja19jdXJyZW50AAAABQAAAAAAAAAKdGlja19sb3dlcgAAAAAABQAAAAAAAAAMdGlja19zcGFjaW5nAAAABQAAAAAAAAAKdGlja191cHBlcgAAAAAABQ==",
        "AAAAAQAAAAAAAAAAAAAACVN3YXBDYWNoZQAAAAAAAAYAAAAAAAAAD2Jsb2NrX3RpbWVzdGFtcAAAAAAEAAAAAAAAABtjb21wdXRlZF9sYXRlc3Rfb2JzZXJ2YXRpb24AAAAAAQAAAAAAAAAMZmVlX3Byb3RvY29sAAAABAAAAAAAAAAPbGlxdWlkaXR5X3N0YXJ0AAAAAAoAAAAAAAAAHHNlY3NfcGVyX2xpcV9jdW11bGF0aXZlX3gxMjgAAAAMAAAAAAAAAA90aWNrX2N1bXVsYXRpdmUAAAAABw==",
        "AAAAAQAAAAAAAAAAAAAACVN3YXBTdGF0ZQAAAAAAAAcAAAAAAAAAEWFtb3VudF9jYWxjdWxhdGVkAAAAAAAACwAAAAAAAAAaYW1vdW50X3NwZWNpZmllZF9yZW1haW5pbmcAAAAAAAsAAAAAAAAAFmZlZV9ncm93dGhfZ2xvYmFsX3gxMjgAAAAAAAwAAAAAAAAACWxpcXVpZGl0eQAAAAAAAAoAAAAAAAAADHByb3RvY29sX2ZlZQAAAAoAAAAAAAAADnNxcnRfcHJpY2VfeDk2AAAAAAAMAAAAAAAAAAR0aWNrAAAABQ==",
        "AAAAAQAAAAAAAAAAAAAAEFN0ZXBDb21wdXRhdGlvbnMAAAAHAAAAAAAAAAlhbW91bnRfaW4AAAAAAAAKAAAAAAAAAAphbW91bnRfb3V0AAAAAAAKAAAAAAAAAApmZWVfYW1vdW50AAAAAAAKAAAAAAAAAAtpbml0aWFsaXplZAAAAAABAAAAAAAAABNzcXJ0X3ByaWNlX25leHRfeDk2AAAAAAwAAAAAAAAAFHNxcnRfcHJpY2Vfc3RhcnRfeDk2AAAADAAAAAAAAAAJdGlja19uZXh0AAAAAAAABQ==",
        "AAAAAAAAAclDb25zdHJ1Y3RvciBjYWxsZWQgYnkgdGhlIGZhY3Rvcnkgd2hlbiBkZXBsb3lpbmcgYSBuZXcgcG9vbC4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgY29udHJhY3QgZW52aXJvbm1lbnQKKiBgZmFjdG9yeWAgLSBBZGRyZXNzIG9mIHRoZSBmYWN0b3J5IGNvbnRyYWN0IHRoYXQgY3JlYXRlZCB0aGlzIHBvb2wKKiBgZmxhc2hfZXhlY3V0b3JgIC0gQWRkcmVzcyBvZiB0aGUgYXV0aG9yaXplZCBGbGFzaEV4ZWN1dG9yIGNvbnRyYWN0CiogYHRva2VuMGAgLSBBZGRyZXNzIG9mIHRoZSBmaXJzdCB0b2tlbiBpbiB0aGUgcGFpcgoqIGB0b2tlbjFgIC0gQWRkcmVzcyBvZiB0aGUgc2Vjb25kIHRva2VuIGluIHRoZSBwYWlyCiogYGZlZWAgLSBGZWUgdGllciBmb3IgdGhpcyBwb29sIChpbiBiYXNpcyBwb2ludHMpCiogYHRpY2tfc3BhY2luZ2AgLSBNaW5pbXVtIHRpY2sgc3BhY2luZyBmb3IgdGhpcyBwb29sAAAAAAAADV9fY29uc3RydWN0b3IAAAAAAAAGAAAAAAAAAAdmYWN0b3J5AAAAABMAAAAAAAAADmZsYXNoX2V4ZWN1dG9yAAAAAAATAAAAAAAAAAZ0b2tlbjAAAAAAABMAAAAAAAAABnRva2VuMQAAAAAAEwAAAAAAAAADZmVlAAAAAAQAAAAAAAAADHRpY2tfc3BhY2luZwAAAAUAAAAA",
        "AAAAAAAAAUZWYWxpZGF0ZXMgdGhhdCB0aWNrIHJhbmdlIGlzIHByb3Blcmx5IG9yZGVyZWQgYW5kIHdpdGhpbiBib3VuZHMuCgojIEFyZ3VtZW50cwoqIGBlbnZgIC0gVGhlIGNvbnRyYWN0IGVudmlyb25tZW50CiogYHRpY2tfbG93ZXJgIC0gTG93ZXIgdGljayBvZiB0aGUgcmFuZ2UKKiBgdGlja191cHBlcmAgLSBVcHBlciB0aWNrIG9mIHRoZSByYW5nZQoKIyBSZXR1cm5zCiogYE9rKCgpKWAgaWYgdGlja3MgYXJlIHZhbGlkCiogYEVycmAgaWYgdGlja3MgYXJlIGludmFsaWQgKHdyb25nIG9yZGVyLCBvdXQgb2YgYm91bmRzLCBvciBtaXNhbGlnbmVkIHdpdGggdGlja19zcGFjaW5nKQAAAAAAC2NoZWNrX3RpY2tzAAAAAAIAAAAAAAAACnRpY2tfbG93ZXIAAAAAAAUAAAAAAAAACnRpY2tfdXBwZXIAAAAAAAUAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAH1SZXR1cm5zIHRoZSBjdXJyZW50IGxlZGdlciB0aW1lc3RhbXAuCgojIEFyZ3VtZW50cwoqIGBlbnZgIC0gVGhlIGNvbnRyYWN0IGVudmlyb25tZW50CgojIFJldHVybnMKQ3VycmVudCB0aW1lc3RhbXAgaW4gc2Vjb25kcwAAAAAAAA9ibG9ja190aW1lc3RhbXAAAAAAAAAAAAEAAAAG",
        "AAAAAAAAATpJbml0aWFsaXplcyB0aGUgcG9vbCB3aXRoIGEgc3RhcnRpbmcgcHJpY2UuCgpNdXN0IGJlIGNhbGxlZCBiZWZvcmUgYW55IGxpcXVpZGl0eSBvcGVyYXRpb25zLiBDYW4gb25seSBiZSBjYWxsZWQgb25jZS4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgY29udHJhY3QgZW52aXJvbm1lbnQKKiBgc3FydF9wcmljZV94OTZgIC0gSW5pdGlhbCBzcXJ0IHByaWNlIGluIFE2NC45NiBmb3JtYXQKCiMgUmV0dXJucwoqIGBPaygoKSlgIG9uIHN1Y2Nlc3MKKiBgRXJyKEFscmVhZHlJbml0aWFsaXplZClgIGlmIHBvb2wgaXMgYWxyZWFkeSBpbml0aWFsaXplZAAAAAAACmluaXRpYWxpemUAAAAAAAEAAAAAAAAADnNxcnRfcHJpY2VfeDk2AAAAAAAMAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAmRTd2FwcyB0b2tlbnMgaW4gdGhlIHBvb2wuCgpUcmFuc2ZlcnMgdG9rZW5zIGZyb20gc2VuZGVyIGFuZCBzZW5kcyBvdXRwdXQgdG9rZW5zIHRvIHJlY2lwaWVudC4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgY29udHJhY3QgZW52aXJvbm1lbnQKKiBgc2VuZGVyYCAtIEFkZHJlc3MgcHJvdmlkaW5nIGlucHV0IHRva2VucyAocmVxdWlyZXMgYXV0aCkKKiBgcmVjaXBpZW50YCAtIEFkZHJlc3MgcmVjZWl2aW5nIG91dHB1dCB0b2tlbnMKKiBgemVyb19mb3Jfb25lYCAtIFRydWUgaWYgc3dhcHBpbmcgdG9rZW4wIGZvciB0b2tlbjEsIGZhbHNlIG90aGVyd2lzZQoqIGBhbW91bnRfc3BlY2lmaWVkYCAtIEFtb3VudCB0byBzd2FwIChwb3NpdGl2ZSBmb3IgZXhhY3QgaW5wdXQsIG5lZ2F0aXZlIGZvciBleGFjdCBvdXRwdXQpCiogYHNxcnRfcHJpY2VfbGltaXRfeDk2YCAtIFByaWNlIGxpbWl0IGZvciB0aGUgc3dhcCBpbiBRNjQuOTYgZm9ybWF0CgojIFJldHVybnMKKiBgT2soU3dhcFJlc3VsdClgIGNvbnRhaW5pbmcgYW1vdW50cyBzd2FwcGVkIGFuZCBmaW5hbCBwcmljZQoqIGBFcnJgIGlmIHN3YXAgZmFpbHMgKGxvY2tlZCwgaW52YWxpZCBwcmljZSBsaW1pdCwgZXRjLikAAAAEc3dhcAAAAAUAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEwAAAAAAAAAMemVyb19mb3Jfb25lAAAAAQAAAAAAAAAQYW1vdW50X3NwZWNpZmllZAAAAAsAAAAAAAAAFHNxcnRfcHJpY2VfbGltaXRfeDk2AAAADAAAAAEAAAPpAAAH0AAAAApTd2FwUmVzdWx0AAAAAAAD",
        "AAAAAAAAA0RTd2FwcyB0b2tlbnMgdXNpbmcgcHJlZnVuZGVkIGlucHV0IGFscmVhZHkgaGVsZCBieSB0aGUgcG9vbC4KCkFzc3VtZXMgaW5wdXQgdG9rZW5zIGhhdmUgYmVlbiB0cmFuc2ZlcnJlZCB0byB0aGUgcG9vbCBiZWZvcmUgY2FsbGluZy4KT25seSBhdXRob3JpemVkIHJvdXRlcnMgY2FuIGNhbGwgdGhpcyBmdW5jdGlvbi4gVmVyaWZpZXMgc3VmZmljaWVudApwcmVmdW5kZWQgYmFsYW5jZSBiZWZvcmUgZXhlY3V0aW5nIHRoZSBzd2FwLgoKIyBBcmd1bWVudHMKKiBgZW52YCAtIFRoZSBjb250cmFjdCBlbnZpcm9ubWVudAoqIGByb3V0ZXJgIC0gQWRkcmVzcyBvZiB0aGUgYXV0aG9yaXplZCByb3V0ZXIgKHJlcXVpcmVzIGF1dGgpCiogYHJlY2lwaWVudGAgLSBBZGRyZXNzIHJlY2VpdmluZyBvdXRwdXQgdG9rZW5zCiogYHplcm9fZm9yX29uZWAgLSBUcnVlIGlmIHN3YXBwaW5nIHRva2VuMCBmb3IgdG9rZW4xLCBmYWxzZSBvdGhlcndpc2UKKiBgYW1vdW50X3NwZWNpZmllZGAgLSBBbW91bnQgdG8gc3dhcCAocG9zaXRpdmUgZm9yIGV4YWN0IGlucHV0LCBuZWdhdGl2ZSBmb3IgZXhhY3Qgb3V0cHV0KQoqIGBzcXJ0X3ByaWNlX2xpbWl0X3g5NmAgLSBQcmljZSBsaW1pdCBmb3IgdGhlIHN3YXAgaW4gUTY0Ljk2IGZvcm1hdAoKIyBSZXR1cm5zCiogYE9rKFN3YXBSZXN1bHQpYCBjb250YWluaW5nIGFtb3VudHMgc3dhcHBlZCBhbmQgZmluYWwgcHJpY2UKKiBgRXJyKFVuYXV0aG9yaXplZClgIGlmIHJvdXRlciBpcyBub3QgYXV0aG9yaXplZAoqIGBFcnJgIG9uIG90aGVyIGZhaWx1cmVzIChsb2NrZWQsIGludmFsaWQgcHJpY2UgbGltaXQsIGluc3VmZmljaWVudCBiYWxhbmNlKQAAAA5zd2FwX3ByZWZ1bmRlZAAAAAAABQAAAAAAAAAGcm91dGVyAAAAAAATAAAAAAAAAAlyZWNpcGllbnQAAAAAAAATAAAAAAAAAAx6ZXJvX2Zvcl9vbmUAAAABAAAAAAAAABBhbW91bnRfc3BlY2lmaWVkAAAACwAAAAAAAAAUc3FydF9wcmljZV9saW1pdF94OTYAAAAMAAAAAQAAA+kAAAfQAAAAClN3YXBSZXN1bHQAAAAAAAM=",
        "AAAAAAAAAcpNYW5hZ2VzIGF1dGhvcml6YXRpb24gZm9yIHJvdXRlcnMgYWxsb3dlZCB0byBjYWxsIGBzd2FwX3ByZWZ1bmRlZGAuCgpPbmx5IHRoZSBwb29sJ3MgZmFjdG9yeSBjYW4gY2FsbCB0aGlzIGZ1bmN0aW9uLgoKIyBBcmd1bWVudHMKKiBgZW52YCAtIFRoZSBjb250cmFjdCBlbnZpcm9ubWVudAoqIGBmYWN0b3J5YCAtIEFkZHJlc3Mgb2YgdGhlIGZhY3RvcnkgKHJlcXVpcmVzIGF1dGgsIG11c3QgbWF0Y2ggcG9vbCdzIGZhY3RvcnkpCiogYHJvdXRlcmAgLSBBZGRyZXNzIG9mIHRoZSByb3V0ZXIgdG8gYXV0aG9yaXplL3VuYXV0aG9yaXplCiogYGFsbG93ZWRgIC0gVHJ1ZSB0byBhdXRob3JpemUsIGZhbHNlIHRvIHJlbW92ZSBhdXRob3JpemF0aW9uCgojIFJldHVybnMKKiBgT2soKCkpYCBvbiBzdWNjZXNzCiogYEVycihVbmF1dGhvcml6ZWQpYCBpZiBjYWxsZXIgaXMgbm90IHRoZSBwb29sJ3MgZmFjdG9yeQAAAAAAFXNldF9yb3V0ZXJfYXV0aG9yaXplZAAAAAAAAAMAAAAAAAAAB2ZhY3RvcnkAAAAAEwAAAAAAAAAGcm91dGVyAAAAAAATAAAAAAAAAAdhbGxvd2VkAAAAAAEAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAmpCdXJucyBsaXF1aWRpdHkgZnJvbSBhIHBvc2l0aW9uLgoKUmVtb3ZlcyBsaXF1aWRpdHkgZnJvbSB0aGUgc3BlY2lmaWVkIHRpY2sgcmFuZ2UgYW5kIGNyZWRpdHMgdGhlIG93ZWQKdG9rZW5zIHRvIHRoZSBwb3NpdGlvbi4gVG9rZW5zIG11c3QgYmUgY29sbGVjdGVkIHNlcGFyYXRlbHkgdmlhIGBjb2xsZWN0YC4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgY29udHJhY3QgZW52aXJvbm1lbnQKKiBgb3duZXJgIC0gQWRkcmVzcyBvd25pbmcgdGhlIHBvc2l0aW9uIChyZXF1aXJlcyBhdXRoKQoqIGB0aWNrX2xvd2VyYCAtIExvd2VyIHRpY2sgb2YgdGhlIHBvc2l0aW9uIHJhbmdlCiogYHRpY2tfdXBwZXJgIC0gVXBwZXIgdGljayBvZiB0aGUgcG9zaXRpb24gcmFuZ2UKKiBgYW1vdW50YCAtIEFtb3VudCBvZiBsaXF1aWRpdHkgdG8gYnVybgoKIyBSZXR1cm5zCiogYE9rKChhbW91bnQwLCBhbW91bnQxKSlgIC0gQW1vdW50cyBvZiB0b2tlbjAgYW5kIHRva2VuMSBvd2VkIHRvIHRoZSBwb3NpdGlvbgoqIGBFcnIoTG9ja2VkKWAgaWYgcG9vbCBpcyBjdXJyZW50bHkgbG9ja2VkCiogYEVycmAgb24gb3RoZXIgZmFpbHVyZXMgKGludmFsaWQgdGlja3MsIHBvc2l0aW9uIG5vdCBmb3VuZCkAAAAAAARidXJuAAAABAAAAAAAAAAFb3duZXIAAAAAAAATAAAAAAAAAAp0aWNrX2xvd2VyAAAAAAAFAAAAAAAAAAp0aWNrX3VwcGVyAAAAAAAFAAAAAAAAAAZhbW91bnQAAAAAAAoAAAABAAAD6QAAA+0AAAACAAAACgAAAAoAAAAD",
        "AAAAAAAAAptDb2xsZWN0cyBmZWVzIGFjY3VtdWxhdGVkIGJ5IGEgbGlxdWlkaXR5IHBvc2l0aW9uLgoKVHJhbnNmZXJzIG93ZWQgdG9rZW5zIHRvIHRoZSByZWNpcGllbnQuIEZlZXMgYXJlIGNvbXB1dGVkIHdoZW4gbGlxdWlkaXR5CmlzIGFkZGVkIG9yIHJlbW92ZWQgdmlhIG1pbnQvYnVybiwgbm90IHdoZW4gY29sbGVjdGluZy4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgY29udHJhY3QgZW52aXJvbm1lbnQKKiBgcmVjaXBpZW50YCAtIEFkZHJlc3MgcmVjZWl2aW5nIHRoZSBmZWVzIChyZXF1aXJlcyBhdXRoLCBtdXN0IGJlIHBvc2l0aW9uIG93bmVyKQoqIGB0aWNrX2xvd2VyYCAtIExvd2VyIHRpY2sgb2YgdGhlIHBvc2l0aW9uIHJhbmdlCiogYHRpY2tfdXBwZXJgIC0gVXBwZXIgdGljayBvZiB0aGUgcG9zaXRpb24gcmFuZ2UKKiBgYW1vdW50MF9yZXF1ZXN0ZWRgIC0gTWF4aW11bSBhbW91bnQgb2YgdG9rZW4wIHRvIGNvbGxlY3QKKiBgYW1vdW50MV9yZXF1ZXN0ZWRgIC0gTWF4aW11bSBhbW91bnQgb2YgdG9rZW4xIHRvIGNvbGxlY3QKCiMgUmV0dXJucwoqIGBPaygoYW1vdW50MCwgYW1vdW50MSkpYCAtIEFjdHVhbCBhbW91bnRzIGNvbGxlY3RlZCAobWluIG9mIHJlcXVlc3RlZCB2cyBvd2VkKQoqIGBFcnIoRXJyb3IpYCBpZiBwb3NpdGlvbiBmZWUgdXBkYXRlIGZhaWxzAAAAAAdjb2xsZWN0AAAAAAUAAAAAAAAACXJlY2lwaWVudAAAAAAAABMAAAAAAAAACnRpY2tfbG93ZXIAAAAAAAUAAAAAAAAACnRpY2tfdXBwZXIAAAAAAAUAAAAAAAAAEWFtb3VudDBfcmVxdWVzdGVkAAAAAAAACgAAAAAAAAARYW1vdW50MV9yZXF1ZXN0ZWQAAAAAAAAKAAAAAQAAA+kAAAPtAAAAAgAAAAoAAAAKAAAAAw==",
        "AAAAAAAAAh9Db2xsZWN0cyBwcm90b2NvbCBmZWVzIGFjY3VtdWxhdGVkIGJ5IHRoZSBwb29sLgoKT25seSB0aGUgZmFjdG9yeSBvd25lciBjYW4gY2FsbCB0aGlzIGZ1bmN0aW9uLiBLZWVwcyBhIG1pbmltdW0gb2YgMSB0b2tlbgppbiB0aGUgc2xvdCB0byBzYXZlIG9uIHN0b3JhZ2UgZ2FzIGNvc3RzLgoKIyBBcmd1bWVudHMKKiBgZW52YCAtIFRoZSBjb250cmFjdCBlbnZpcm9ubWVudAoqIGByZWNpcGllbnRgIC0gQWRkcmVzcyByZWNlaXZpbmcgdGhlIHByb3RvY29sIGZlZXMgKHJlcXVpcmVzIGZhY3Rvcnkgb3duZXIgYXV0aCkKKiBgYW1vdW50MF9yZXF1ZXN0ZWRgIC0gTWF4aW11bSBhbW91bnQgb2YgdG9rZW4wIHRvIGNvbGxlY3QKKiBgYW1vdW50MV9yZXF1ZXN0ZWRgIC0gTWF4aW11bSBhbW91bnQgb2YgdG9rZW4xIHRvIGNvbGxlY3QKCiMgUmV0dXJucwoqIGBPaygoYW1vdW50MCwgYW1vdW50MSkpYCAtIEFjdHVhbCBhbW91bnRzIGNvbGxlY3RlZAoqIGBFcnIoRXJyb3IpYCBpZiBwb29sIGlzIG5vdCBpbml0aWFsaXplZCBvciBwYXJhbXMgYXJlIG1pc3NpbmcAAAAAEGNvbGxlY3RfcHJvdG9jb2wAAAADAAAAAAAAAAlyZWNpcGllbnQAAAAAAAATAAAAAAAAABFhbW91bnQwX3JlcXVlc3RlZAAAAAAAAAoAAAAAAAAAEWFtb3VudDFfcmVxdWVzdGVkAAAAAAAACgAAAAEAAAPpAAAD7QAAAAIAAAAKAAAACgAAAAM=",
        "AAAAAAAAArdCZWdpbnMgYSBmbGFzaCBsb2FuIChuZXcgYmVnaW4vZW5kIHBhdHRlcm4pLgoKVHJhbnNmZXJzIGJvcnJvd2VkIHRva2VucyB0byByZWNpcGllbnQgYW5kIHNldHMgYSBmbGFzaCBsb2NrLgpNdXN0IGJlIGZvbGxvd2VkIGJ5IGZsYXNoX2VuZCgpIGluIHRoZSBzYW1lIHRyYW5zYWN0aW9uIHRvIHZlcmlmeSByZXBheW1lbnQuCgojIEFyZ3VtZW50cwoqIGBlbnZgIC0gVGhlIGNvbnRyYWN0IGVudmlyb25tZW50CiogYHJlY2lwaWVudGAgLSBBZGRyZXNzIHJlY2VpdmluZyB0aGUgYm9ycm93ZWQgdG9rZW5zCiogYGFtb3VudDBgIC0gQW1vdW50IG9mIHRva2VuMCB0byBib3Jyb3cKKiBgYW1vdW50MWAgLSBBbW91bnQgb2YgdG9rZW4xIHRvIGJvcnJvdwoqIGBpbml0aWF0b3JgIC0gQWRkcmVzcyBvcmNoZXN0cmF0aW5nIHRoZSBmbGFzaCBsb2FuIChyZXF1aXJlcyBmYWN0b3J5IGF1dGhvcml6YXRpb24pCgojIFJldHVybnMKKiBgT2soKGZlZTAsIGZlZTEpKWAgLSBGbGFzaCBmZWVzIHRoYXQgbXVzdCBiZSByZXBhaWQKKiBgRXJyKEZsYXNoTG9ja2VkKWAgaWYgYW5vdGhlciBmbGFzaCBsb2FuIGlzIGFjdGl2ZQoqIGBFcnIoVW5hdXRob3JpemVkKWAgaWYgaW5pdGlhdG9yIGlzIG5vdCBmYWN0b3J5LWF1dGhvcml6ZWQKKiBgRXJyKEluc3VmZmljaWVudExpcXVpZGl0eSlgIGlmIHBvb2wgbGFja3MgcmVxdWVzdGVkIHRva2VucwAAAAALZmxhc2hfYmVnaW4AAAAABAAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEwAAAAAAAAAHYW1vdW50MAAAAAAKAAAAAAAAAAdhbW91bnQxAAAAAAoAAAAAAAAACWluaXRpYXRvcgAAAAAAABMAAAABAAAD6QAAA+0AAAACAAAACgAAAAoAAAAD",
        "AAAAAAAAAZRFbmRzIGEgZmxhc2ggbG9hbiAobmV3IGJlZ2luL2VuZCBwYXR0ZXJuKS4KClZlcmlmaWVzIHJlcGF5bWVudCBieSBjaGVja2luZyBiYWxhbmNlIGRlbHRhcywgYWNjcnVlcyBmZWVzIHRvIHByb3RvY29sL0xQcywKYW5kIGNsZWFycyB0aGUgZmxhc2ggbG9jay4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgY29udHJhY3QgZW52aXJvbm1lbnQKCiMgUmV0dXJucwoqIGBPaygoKSlgIGlmIHJlcGF5bWVudCBpcyBzdWZmaWNpZW50CiogYEVycihGbGFzaE5vdExvY2tlZClgIGlmIGZsYXNoX2JlZ2luIHdhcyBub3QgY2FsbGVkCiogYEVycihVbmF1dGhvcml6ZWQpYCBpZiBjYWxsZXIgaXMgbm90IHRoZSBpbml0aWF0b3IKKiBgRXJyKEluc3VmZmljaWVudFJlcGF5bWVudDAvMSlgIGlmIHJlcGF5bWVudCA8IGZlZQAAAAlmbGFzaF9lbmQAAAAAAAAAAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAATBHZXQgY3VycmVudCBmbGFzaCBsb2NrIHN0YXRlIChyZWFkLW9ubHkpLgoKUmV0dXJucyBpbmZvcm1hdGlvbiBhYm91dCBhbiBhY3RpdmUgZmxhc2ggbG9hbiBpZiBvbmUgZXhpc3RzLgpVc2VmdWwgZm9yIGFuYWx5dGljcywgZGVidWdnaW5nLCBhbmQgbW9uaXRvcmluZy4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgY29udHJhY3QgZW52aXJvbm1lbnQKCiMgUmV0dXJucwoqIGBTb21lKEZsYXNoTG9jaylgIGlmIGEgZmxhc2ggbG9hbiBpcyBjdXJyZW50bHkgYWN0aXZlCiogYE5vbmVgIGlmIG5vIGZsYXNoIGxvYW4gaXMgYWN0aXZlAAAADmdldF9mbGFzaF9sb2NrAAAAAAAAAAAAAQAAA+gAAAfQAAAACUZsYXNoTG9jawAAAA==",
        "AAAAAAAAAbpGb3JjZSB1bmxvY2sgYSBzdGFsZSBmbGFzaCBsb2NrIChmYWN0b3J5IG93bmVyIG9ubHkpLgoKRW1lcmdlbmN5IHJlY292ZXJ5IGZ1bmN0aW9uIHRoYXQgY2xlYXJzIHRoZSBmbGFzaCBsb2NrLgpTaG91bGQgb25seSBiZSB1c2VkIGZvciBzdGFsZSBsb2NrcyBwYXN0IHRoZWlyIGV4cGlyeV9sZWRnZXIuCgojIEFyZ3VtZW50cwoqIGBlbnZgIC0gVGhlIGNvbnRyYWN0IGVudmlyb25tZW50CgojIFJldHVybnMKKiBgT2soKCkpYCBpZiBsb2NrIHdhcyBjbGVhcmVkIHN1Y2Nlc3NmdWxseQoqIGBFcnIoVW5hdXRob3JpemVkKWAgaWYgY2FsbGVyIGlzIG5vdCBmYWN0b3J5IG93bmVyCgojIFNhZmV0eQpUaGlzIGNhbiBicmVhayBhY3RpdmUgZmxhc2ggbG9hbnMgaWYgY2FsbGVkIHByZW1hdHVyZWx5LgpPbmx5IHVzZSB3aGVuIGxvY2sgaGFzIGV4Y2VlZGVkIGV4cGlyeV9sZWRnZXIuAAAAAAASZm9yY2VfdW5sb2NrX2ZsYXNoAAAAAAAAAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAfhSb3RhdGUgdGhlIEZsYXNoRXhlY3V0b3IgYWRkcmVzcyAoZmFjdG9yeSBvd25lciBvbmx5KS4KCkFsbG93cyBzYWZlIHJvdGF0aW9uIG9mIEZsYXNoRXhlY3V0b3Igd2l0aG91dCByZWRlcGxveWluZyBwb29scy4KUHJvdmlkZXMgdXBncmFkZSBwYXRoIHdoaWxlIG1haW50YWluaW5nIHNpbmdsZS1leGVjdXRvciBtb2RlbC4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgY29udHJhY3QgZW52aXJvbm1lbnQKKiBgbmV3X2V4ZWN1dG9yYCAtIEFkZHJlc3Mgb2YgdGhlIG5ldyBGbGFzaEV4ZWN1dG9yCgojIFJldHVybnMKKiBgT2soKCkpYCBpZiByb3RhdGlvbiBzdWNjZXNzZnVsCiogYEVycihVbmF1dGhvcml6ZWQpYCBpZiBjYWxsZXIgaXMgbm90IGZhY3Rvcnkgb3duZXIKKiBgRXJyKExvY2tlZClgIGlmIHBvb2wgaGFzIGFjdGl2ZSBmbGFzaCBsb2FuCgojIEV2ZW50cwpFbWl0cyBgRmxhc2hFeGVjdXRvclJvdGF0ZWRFdmVudGAgZm9yIHRyYW5zcGFyZW5jeSBhbmQgbW9uaXRvcmluZy4AAAASc2V0X2ZsYXNoX2V4ZWN1dG9yAAAAAAABAAAAAAAAAAxuZXdfZXhlY3V0b3IAAAATAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAJVSZXR1cm5zIHRoZSBjdXJyZW50IHBvb2wgc3RhdGUuCgojIEFyZ3VtZW50cwoqIGBlbnZgIC0gVGhlIGNvbnRyYWN0IGVudmlyb25tZW50CgojIFJldHVybnMKU2xvdDAgY29udGFpbmluZyBjdXJyZW50IHNxcnQgcHJpY2UsIHRpY2ssIGFuZCBsb2NrIHN0YXR1cwAAAAAAAAVzbG90MAAAAAAAAAAAAAABAAAH0AAAAAVTbG90MAAAAA==",
        "AAAAAAAAAI5SZXR1cm5zIHRoZSBmYWN0b3J5IGFkZHJlc3MgdGhhdCBjcmVhdGVkIHRoaXMgcG9vbC4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgY29udHJhY3QgZW52aXJvbm1lbnQKCiMgUmV0dXJucwpBZGRyZXNzIG9mIHRoZSBmYWN0b3J5IGNvbnRyYWN0AAAAAAAHZmFjdG9yeQAAAAAAAAAAAQAAABM=",
        "AAAAAAAAAHdSZXR1cm5zIHRoZSBhZGRyZXNzIG9mIHRva2VuMCBpbiB0aGUgcGFpci4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgY29udHJhY3QgZW52aXJvbm1lbnQKCiMgUmV0dXJucwpBZGRyZXNzIG9mIHRva2VuMAAAAAAGdG9rZW4wAAAAAAAAAAAAAQAAABM=",
        "AAAAAAAAAHdSZXR1cm5zIHRoZSBhZGRyZXNzIG9mIHRva2VuMSBpbiB0aGUgcGFpci4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgY29udHJhY3QgZW52aXJvbm1lbnQKCiMgUmV0dXJucwpBZGRyZXNzIG9mIHRva2VuMQAAAAAGdG9rZW4xAAAAAAAAAAAAAQAAABM=",
        "AAAAAAAAAKhSZXR1cm5zIGJvdGggdG9rZW4gYWRkcmVzc2VzIGluIG9uZSBjYWxsIChjb252ZW5pZW5jZSBmb3IgRmxhc2hFeGVjdXRvcikuCgojIEFyZ3VtZW50cwoqIGBlbnZgIC0gVGhlIGNvbnRyYWN0IGVudmlyb25tZW50CgojIFJldHVybnMKVHVwbGUgb2YgKHRva2VuMCwgdG9rZW4xKSBhZGRyZXNzZXMAAAAKZ2V0X3Rva2VucwAAAAAAAAAAAAEAAAPtAAAAAgAAABMAAAAT",
        "AAAAAAAAAH9SZXR1cm5zIHRoZSBwb29sJ3MgZmVlIHRpZXIuCgojIEFyZ3VtZW50cwoqIGBlbnZgIC0gVGhlIGNvbnRyYWN0IGVudmlyb25tZW50CgojIFJldHVybnMKRmVlIGluIGJhc2lzIHBvaW50cyAoZS5nLiwgMzAwMCA9IDAuMyUpAAAAAANmZWUAAAAAAAAAAAEAAAAE",
        "AAAAAAAAAJ5SZXR1cm5zIHRoZSBwb29sJ3MgdGljayBzcGFjaW5nLgoKIyBBcmd1bWVudHMKKiBgZW52YCAtIFRoZSBjb250cmFjdCBlbnZpcm9ubWVudAoKIyBSZXR1cm5zClRpY2sgc3BhY2luZyAoZS5nLiwgNjAgbWVhbnMgcG9zaXRpb25zIG11c3QgYmUgb24gbXVsdGlwbGVzIG9mIDYwKQAAAAAADHRpY2tfc3BhY2luZwAAAAAAAAABAAAABQ==",
        "AAAAAAAAAJlSZXR1cm5zIHRoZSBwcm90b2NvbCBmZWUgZm9yIHplcm9fZm9yX29uZSBzd2FwcyBmcm9tIHRoZSBmYWN0b3J5LgoKIyBBcmd1bWVudHMKKiBgZW52YCAtIFRoZSBjb250cmFjdCBlbnZpcm9ubWVudAoKIyBSZXR1cm5zClByb3RvY29sIGZlZSBpbiBiYXNpcyBwb2ludHMAAAAAAAASZ2V0X3Byb3RvY29sX2ZlZV8wAAAAAAAAAAAAAQAAAAQ=",
        "AAAAAAAAAJlSZXR1cm5zIHRoZSBwcm90b2NvbCBmZWUgZm9yIG9uZV9mb3JfemVybyBzd2FwcyBmcm9tIHRoZSBmYWN0b3J5LgoKIyBBcmd1bWVudHMKKiBgZW52YCAtIFRoZSBjb250cmFjdCBlbnZpcm9ubWVudAoKIyBSZXR1cm5zClByb3RvY29sIGZlZSBpbiBiYXNpcyBwb2ludHMAAAAAAAASZ2V0X3Byb3RvY29sX2ZlZV8xAAAAAAAAAAAAAQAAAAQ=",
        "AAAAAAAAANBSZXR1cm5zIGEgdGljayBiaXRtYXAgd29yZCBmb3Igb2ZmLWNoYWluIHF1b3RlcnMgYW5kIGxlbnMgY29udHJhY3RzLgoKIyBBcmd1bWVudHMKKiBgZW52YCAtIFRoZSBjb250cmFjdCBlbnZpcm9ubWVudAoqIGB3b3JkX3Bvc2AgLSBUaGUgd29yZCBwb3NpdGlvbiBpbiB0aGUgYml0bWFwCgojIFJldHVybnMKMjU2LWJpdCB3b3JkIGZyb20gdGhlIHRpY2sgYml0bWFwAAAAD2dldF90aWNrX2JpdG1hcAAAAAABAAAAAAAAAAh3b3JkX3BvcwAAAAUAAAABAAAADA==",
        "AAAAAAAAAJVSZXR1cm5zIHRoZSBjdXJyZW50IGFjdGl2ZSBsaXF1aWRpdHkuCgojIEFyZ3VtZW50cwoqIGBlbnZgIC0gVGhlIGNvbnRyYWN0IGVudmlyb25tZW50CgojIFJldHVybnMKVG90YWwgbGlxdWlkaXR5IGN1cnJlbnRseSBhY3RpdmUgYXQgdGhlIGN1cnJlbnQgdGljawAAAAAAAAlsaXF1aWRpdHkAAAAAAAAAAAAAAQAAAAo=",
        "AAAAAAAAAIJSZXR1cm5zIHRoZSBnbG9iYWwgZmVlIGdyb3d0aCBmb3IgdG9rZW4wLgoKIyBBcmd1bWVudHMKKiBgZW52YCAtIFRoZSBjb250cmFjdCBlbnZpcm9ubWVudAoKIyBSZXR1cm5zCkZlZSBncm93dGggaW4gUTEyOC4xMjggZm9ybWF0AAAAAAAYZmVlX2dyb3d0aF9nbG9iYWxfMF94MTI4AAAAAAAAAAEAAAfQAAAADUZpeGVkUG9pbnQxMjgAAAA=",
        "AAAAAAAAAIJSZXR1cm5zIHRoZSBnbG9iYWwgZmVlIGdyb3d0aCBmb3IgdG9rZW4xLgoKIyBBcmd1bWVudHMKKiBgZW52YCAtIFRoZSBjb250cmFjdCBlbnZpcm9ubWVudAoKIyBSZXR1cm5zCkZlZSBncm93dGggaW4gUTEyOC4xMjggZm9ybWF0AAAAAAAYZmVlX2dyb3d0aF9nbG9iYWxfMV94MTI4AAAAAAAAAAEAAAfQAAAADUZpeGVkUG9pbnQxMjgAAAA=",
        "AAAAAAAAAJhSZXR1cm5zIHRoZSBhY2N1bXVsYXRlZCBwcm90b2NvbCBmZWVzLgoKIyBBcmd1bWVudHMKKiBgZW52YCAtIFRoZSBjb250cmFjdCBlbnZpcm9ubWVudAoKIyBSZXR1cm5zClByb3RvY29sRmVlcyBzdHJ1Y3QgY29udGFpbmluZyBhbW91bnRzIGZvciBib3RoIHRva2VucwAAAA1wcm90b2NvbF9mZWVzAAAAAAAAAAAAAAEAAAfQAAAADFByb3RvY29sRmVlcw==",
        "AAAAAAAAAM1SZXR1cm5zIGluZm9ybWF0aW9uIGFib3V0IGEgc3BlY2lmaWMgdGljay4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgY29udHJhY3QgZW52aXJvbm1lbnQKKiBgdGlja2AgLSBUaGUgdGljayBpbmRleCB0byBxdWVyeQoKIyBSZXR1cm5zClRpY2tJbmZvIHN0cnVjdCwgb3IgZGVmYXVsdCAodW5pbml0aWFsaXplZCkgaWYgdGljayBoYXNuJ3QgYmVlbiB1c2VkAAAAAAAABXRpY2tzAAAAAAAAAQAAAAAAAAAEdGljawAAAAUAAAABAAAH0AAAAAhUaWNrSW5mbw==",
        "AAAAAAAAAeJSZXR1cm5zIGN1bXVsYXRpdmUgdmFsdWVzIGluc2lkZSBhIHRpY2sgcmFuZ2UgZm9yIGEgZ2l2ZW4gcG9zaXRpb24uCgpVc2VkIHRvIGNvbXB1dGUgdGltZS13ZWlnaHRlZCBhdmVyYWdlcyBhbmQgbGlxdWlkaXR5LXdlaWdodGVkIHRpbWUgd2l0aGluCmEgcHJpY2UgcmFuZ2UgZm9yIGxpcXVpZGl0eSBtaW5pbmcgYW5kIG90aGVyIGFuYWx5dGljcy4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgY29udHJhY3QgZW52aXJvbm1lbnQKKiBgdGlja19sb3dlcmAgLSBMb3dlciB0aWNrIG9mIHRoZSByYW5nZQoqIGB0aWNrX3VwcGVyYCAtIFVwcGVyIHRpY2sgb2YgdGhlIHJhbmdlCgojIFJldHVybnMKKiBgT2soKHRpY2tfY3VtdWxhdGl2ZSwgc2Vjb25kc19wZXJfbGlxdWlkaXR5X2N1bXVsYXRpdmUsIHNlY29uZHNfaW5zaWRlKSlgCiogYEVycihUaWNrTm90SW5pdGlhbGl6ZWQpYCBpZiBlaXRoZXIgdGljayBoYXNuJ3QgYmVlbiBpbml0aWFsaXplZAAAAAAAG3NuYXBzaG90X2N1bXVsYXRpdmVzX2luc2lkZQAAAAACAAAAAAAAAAp0aWNrX2xvd2VyAAAAAAAFAAAAAAAAAAp0aWNrX3VwcGVyAAAAAAAFAAAAAQAAA+kAAAPtAAAAAwAAAAcAAAfQAAAADUZpeGVkUG9pbnQxMjgAAAAAAAAEAAAAAw==",
        "AAAAAAAAAY9PYnNlcnZlcyBvcmFjbGUgZGF0YSBmb3IgYSBzaW5nbGUgdGltZSBwb2ludC4KClJldHVybnMgdGljayBjdW11bGF0aXZlIGFuZCBzZWNvbmRzIHBlciBsaXF1aWRpdHkgY3VtdWxhdGl2ZSB2YWx1ZXMKZm9yIGNvbXB1dGluZyB0aW1lLXdlaWdodGVkIGF2ZXJhZ2VzLgoKIyBBcmd1bWVudHMKKiBgZW52YCAtIFRoZSBjb250cmFjdCBlbnZpcm9ubWVudAoqIGBzZWNvbmRzX2Fnb2AgLSBIb3cgbWFueSBzZWNvbmRzIGluIHRoZSBwYXN0IHRvIG9ic2VydmUgKDAgPSBjdXJyZW50KQoKIyBSZXR1cm5zCiogYE9rKCh0aWNrX2N1bXVsYXRpdmUsIHNlY29uZHNfcGVyX2xpcXVpZGl0eV9jdW11bGF0aXZlX3gxMjgpKWAKKiBgRXJyYCBpZiBvYnNlcnZhdGlvbiBkb2Vzbid0IGV4aXN0IG9yIGlzIHRvbyBvbGQAAAAADm9ic2VydmVfc2luZ2xlAAAAAAABAAAAAAAAAAtzZWNvbmRzX2FnbwAAAAAEAAAAAQAAA+kAAAPtAAAAAgAAAAcAAAfQAAAADUZpeGVkUG9pbnQxMjgAAAAAAAAD",
        "AAAAAAAAAbdPYnNlcnZlcyBvcmFjbGUgZGF0YSBmb3IgbXVsdGlwbGUgdGltZSBwb2ludHMuCgpSZXR1cm5zIHRpY2sgY3VtdWxhdGl2ZSBhbmQgc2Vjb25kcyBwZXIgbGlxdWlkaXR5IGN1bXVsYXRpdmUgdmFsdWVzCmZvciBlYWNoIHJlcXVlc3RlZCB0aW1lIHBvaW50LCBmb3IgY29tcHV0aW5nIHRpbWUtd2VpZ2h0ZWQgYXZlcmFnZXMuCgojIEFyZ3VtZW50cwoqIGBlbnZgIC0gVGhlIGNvbnRyYWN0IGVudmlyb25tZW50CiogYHNlY29uZHNfYWdvc2AgLSBWZWN0b3Igb2Ygc2Vjb25kcyBpbiB0aGUgcGFzdCB0byBvYnNlcnZlICgwID0gY3VycmVudCkKCiMgUmV0dXJucwoqIGBPaygodGlja19jdW11bGF0aXZlcywgc2Vjb25kc19wZXJfbGlxdWlkaXR5X2N1bXVsYXRpdmVzX3gxMjgpKWAKKiBgRXJyYCBpZiBhbnkgb2JzZXJ2YXRpb24gZG9lc24ndCBleGlzdCBvciBpcyB0b28gb2xkAAAAAAdvYnNlcnZlAAAAAAEAAAAAAAAADHNlY29uZHNfYWdvcwAAA+oAAAAEAAAAAQAAA+kAAAPtAAAAAgAAA+oAAAAHAAAD6gAAB9AAAAANRml4ZWRQb2ludDEyOAAAAAAAAAM=",
        "AAAAAAAAApBNaW50cyBsaXF1aWRpdHkgdG8gYSBwb3NpdGlvbi4KCkNyZWF0ZXMgb3IgYWRkcyB0byBhIGxpcXVpZGl0eSBwb3NpdGlvbiBpbiB0aGUgc3BlY2lmaWVkIHRpY2sgcmFuZ2UuClRyYW5zZmVycyB0aGUgcmVxdWlyZWQgYW1vdW50cyBvZiBib3RoIHRva2VucyBmcm9tIHRoZSByZWNpcGllbnQuCgojIEFyZ3VtZW50cwoqIGBlbnZgIC0gVGhlIGNvbnRyYWN0IGVudmlyb25tZW50CiogYHJlY2lwaWVudGAgLSBBZGRyZXNzIHJlY2VpdmluZyB0aGUgbGlxdWlkaXR5IHBvc2l0aW9uIChyZXF1aXJlcyBhdXRoKQoqIGB0aWNrX2xvd2VyYCAtIExvd2VyIHRpY2sgb2YgdGhlIHBvc2l0aW9uIHJhbmdlCiogYHRpY2tfdXBwZXJgIC0gVXBwZXIgdGljayBvZiB0aGUgcG9zaXRpb24gcmFuZ2UKKiBgYW1vdW50YCAtIEFtb3VudCBvZiBsaXF1aWRpdHkgdG8gbWludAoKIyBSZXR1cm5zCiogYE9rKChhbW91bnQwLCBhbW91bnQxKSlgIC0gQW1vdW50cyBvZiB0b2tlbnMgZGVwb3NpdGVkCiogYEVycihBbW91bnRTaG91bGRCZUdyZWF0ZXJUaGFuWmVybylgIGlmIGFtb3VudCBpcyB6ZXJvCiogYEVycihMb2NrZWQpYCBpZiBwb29sIGlzIGN1cnJlbnRseSBsb2NrZWQKKiBgRXJyKEluc3VmZmljaWVudFRva2VuMC9Ub2tlbjEpYCBpZiB0b2tlbiB0cmFuc2ZlciBmYWlscwAAAARtaW50AAAABAAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEwAAAAAAAAAKdGlja19sb3dlcgAAAAAABQAAAAAAAAAKdGlja191cHBlcgAAAAAABQAAAAAAAAAGYW1vdW50AAAAAAAKAAAAAQAAA+kAAAPtAAAAAgAAAAoAAAAKAAAAAw==",
        "AAAAAAAAANJSZXR1cm5zIGEgdGljayBiaXRtYXAgd29yZCAocHVibGljIHZhcmlhbnQpLgoKIyBBcmd1bWVudHMKKiBgZW52YCAtIFRoZSBjb250cmFjdCBlbnZpcm9ubWVudAoqIGB3b3JkX3Bvc2AgLSBUaGUgd29yZCBwb3NpdGlvbiBpbiB0aGUgYml0bWFwCgojIFJldHVybnMKMjU2LWJpdCB3b3JkIGZyb20gdGhlIHRpY2sgYml0bWFwLCBvciB6ZXJvIGlmIHVuaW5pdGlhbGl6ZWQAAAAAABZnZXRfdGlja19iaXRtYXBfcHVibGljAAAAAAABAAAAAAAAAAh3b3JkX3BvcwAAAAUAAAABAAAADA==",
        "AAAAAAAAAglRdW90ZXMgYW4gZXhhY3QgaW5wdXQgc3dhcCB3aXRob3V0IGV4ZWN1dGluZyBpdC4KClNpbXVsYXRlcyBhIHN3YXAgdG8gZGV0ZXJtaW5lIG91dHB1dCBhbW91bnQgYW5kIGZpbmFsIHByaWNlIHdpdGhvdXQKdHJhbnNmZXJyaW5nIHRva2VucyBvciBtb2RpZnlpbmcgc3RhdGUuCgojIEFyZ3VtZW50cwoqIGBlbnZgIC0gVGhlIGNvbnRyYWN0IGVudmlyb25tZW50CiogYHplcm9fZm9yX29uZWAgLSBUcnVlIGlmIHN3YXBwaW5nIHRva2VuMCBmb3IgdG9rZW4xLCBmYWxzZSBvdGhlcndpc2UKKiBgYW1vdW50X2luYCAtIEV4YWN0IGFtb3VudCBvZiBpbnB1dCB0b2tlbnMKKiBgc3FydF9wcmljZV9saW1pdF94OTZgIC0gUHJpY2UgbGltaXQgZm9yIHRoZSBzd2FwIGluIFE2NC45NiBmb3JtYXQKCiMgUmV0dXJucwoqIGBPayhTd2FwUmVzdWx0KWAgY29udGFpbmluZyBvdXRwdXQgYW1vdW50IGFuZCBmaW5hbCBzcXJ0IHByaWNlCiogYEVycmAgaWYgc3dhcCB3b3VsZCBmYWlsIChpbnZhbGlkIHByaWNlIGxpbWl0LCBldGMuKQAAAAAAABFxdW90ZV9leGFjdF9pbnB1dAAAAAAAAAMAAAAAAAAADHplcm9fZm9yX29uZQAAAAEAAAAAAAAACWFtb3VudF9pbgAAAAAAAAsAAAAAAAAAFHNxcnRfcHJpY2VfbGltaXRfeDk2AAAADAAAAAEAAAPpAAAH0AAAAApTd2FwUmVzdWx0AAAAAAAD",
        "AAAAAAAAAjtRdW90ZXMgYW4gZXhhY3Qgb3V0cHV0IHN3YXAgd2l0aG91dCBleGVjdXRpbmcgaXQuCgpTaW11bGF0ZXMgYSBzd2FwIHRvIGRldGVybWluZSBpbnB1dCBhbW91bnQgcmVxdWlyZWQgZm9yIGEgZGVzaXJlZCBvdXRwdXQKd2l0aG91dCB0cmFuc2ZlcnJpbmcgdG9rZW5zIG9yIG1vZGlmeWluZyBzdGF0ZS4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgY29udHJhY3QgZW52aXJvbm1lbnQKKiBgemVyb19mb3Jfb25lYCAtIFRydWUgaWYgc3dhcHBpbmcgdG9rZW4wIGZvciB0b2tlbjEsIGZhbHNlIG90aGVyd2lzZQoqIGBhbW91bnRfb3V0YCAtIEV4YWN0IGFtb3VudCBvZiBvdXRwdXQgdG9rZW5zIGRlc2lyZWQKKiBgc3FydF9wcmljZV9saW1pdF94OTZgIC0gUHJpY2UgbGltaXQgZm9yIHRoZSBzd2FwIGluIFE2NC45NiBmb3JtYXQKCiMgUmV0dXJucwoqIGBPayhTd2FwUmVzdWx0KWAgY29udGFpbmluZyByZXF1aXJlZCBpbnB1dCBhbW91bnQgYW5kIGZpbmFsIHNxcnQgcHJpY2UKKiBgRXJyYCBpZiBzd2FwIHdvdWxkIGZhaWwgKGludmFsaWQgcHJpY2UgbGltaXQsIGluc3VmZmljaWVudCBsaXF1aWRpdHkpAAAAABJxdW90ZV9leGFjdF9vdXRwdXQAAAAAAAMAAAAAAAAADHplcm9fZm9yX29uZQAAAAEAAAAAAAAACmFtb3VudF9vdXQAAAAAAAsAAAAAAAAAFHNxcnRfcHJpY2VfbGltaXRfeDk2AAAADAAAAAEAAAPpAAAH0AAAAApTd2FwUmVzdWx0AAAAAAAD",
        "AAAAAAAAAXFSZXR1cm5zIHBvc2l0aW9uIGRhdGEgZm9yIGEgc3BlY2lmaWMgb3duZXIgYW5kIHRpY2sgcmFuZ2UuCgojIEFyZ3VtZW50cwoqIGBlbnZgIC0gVGhlIGNvbnRyYWN0IGVudmlyb25tZW50CiogYHJlY2lwaWVudGAgLSBBZGRyZXNzIG9mIHRoZSBwb3NpdGlvbiBvd25lcgoqIGB0aWNrX2xvd2VyYCAtIExvd2VyIHRpY2sgb2YgdGhlIHBvc2l0aW9uIHJhbmdlCiogYHRpY2tfdXBwZXJgIC0gVXBwZXIgdGljayBvZiB0aGUgcG9zaXRpb24gcmFuZ2UKCiMgUmV0dXJucwpQb3NpdGlvbkRhdGEgY29udGFpbmluZyBsaXF1aWRpdHksIGZlZSBncm93dGgsIGFuZCB0b2tlbnMgb3dlZAoKIyBQYW5pY3MKUGFuaWNzIGlmIHBvc2l0aW9uIGRvZXNuJ3QgZXhpc3QAAAAAAAAJcG9zaXRpb25zAAAAAAAAAwAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEwAAAAAAAAAKdGlja19sb3dlcgAAAAAABQAAAAAAAAAKdGlja191cHBlcgAAAAAABQAAAAEAAAfQAAAADFBvc2l0aW9uRGF0YQ==",
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAHQAAAAAAAAAMVW5hdXRob3JpemVkAAAAAQAAAAAAAAAQSW52YWxpZFRpY2tSYW5nZQAAAAoAAAAAAAAAEEludmFsaWRMaXF1aWRpdHkAAAALAAAAAAAAAA1JbnZhbGlkQW1vdW50AAAAAAAADAAAAAAAAAAQSW52YWxpZFNxcnRQcmljZQAAAA0AAAAAAAAACkludmFsaWRGZWUAAAAAAA4AAAAAAAAAEkludmFsaWRUaWNrU3BhY2luZwAAAAAADwAAAAAAAAARSW52YWxpZFByaWNlTGltaXQAAAAAAAAQAAAAAAAAAAtPdXRPZkJvdW5kcwAAAAAUAAAAAAAAAAhPdmVyZmxvdwAAABUAAAAAAAAACVVuZGVyZmxvdwAAAAAAABYAAAAAAAAADkRpdmlzaW9uQnlaZXJvAAAAAAAXAAAAAAAAAA5Ob3RJbml0aWFsaXplZAAAAAAAKAAAAAAAAAASQWxyZWFkeUluaXRpYWxpemVkAAAAAAApAAAAAAAAABBQb3NpdGlvbk5vdEZvdW5kAAAAKgAAAAAAAAAVSW5zdWZmaWNpZW50TGlxdWlkaXR5AAAAAAAAKwAAAAAAAAASVGlja05vdEluaXRpYWxpemVkAAAAAAAyAAAAAAAAABNJbnZhbGlkVGlja1Bvc2l0aW9uAAAAADMAAAAAAAAAEkludmFsaWRPYnNlcnZhdGlvbgAAAAAAPAAAAAAAAAART2JzZXJ2YXRpb25Ub29PbGQAAAAAAAA9AAAAAAAAAAZMb2NrZWQAAAAAAEEAAAAAAAAAEkluc3VmZmljaWVudFRva2VuMAAAAAAARgAAAAAAAAASSW5zdWZmaWNpZW50VG9rZW4xAAAAAABHAAAAAAAAABZJbnN1ZmZpY2llbnRSZXBheW1lbnQwAAAAAABQAAAAAAAAABZJbnN1ZmZpY2llbnRSZXBheW1lbnQxAAAAAABRAAAAAAAAAA5GbGFzaE5vdExvY2tlZAAAAAAAUgAAAAAAAAAUTXVzdFVzZUZsYXNoRXhlY3V0b3IAAABTAAAAAAAAAA9JZGVudGljYWxUb2tlbnMAAAAAWgAAAAAAAAARUG9vbEFscmVhZHlFeGlzdHMAAAAAAABb",
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
        collect: this.txFromJSON<Result<readonly [u128, u128]>>,
        collect_protocol: this.txFromJSON<Result<readonly [u128, u128]>>,
        flash_begin: this.txFromJSON<Result<readonly [u128, u128]>>,
        flash_end: this.txFromJSON<Result<void>>,
        get_flash_lock: this.txFromJSON<Option<FlashLock>>,
        force_unlock_flash: this.txFromJSON<Result<void>>,
        set_flash_executor: this.txFromJSON<Result<void>>,
        slot0: this.txFromJSON<Slot0>,
        factory: this.txFromJSON<string>,
        token0: this.txFromJSON<string>,
        token1: this.txFromJSON<string>,
        get_tokens: this.txFromJSON<readonly [string, string]>,
        fee: this.txFromJSON<u32>,
        tick_spacing: this.txFromJSON<i32>,
        get_protocol_fee_0: this.txFromJSON<u32>,
        get_protocol_fee_1: this.txFromJSON<u32>,
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
        quote_exact_output: this.txFromJSON<Result<SwapResult>>,
        positions: this.txFromJSON<PositionData>
  }
}