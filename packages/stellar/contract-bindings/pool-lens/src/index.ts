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
    contractId: "CDFGDFKEN7EVMI3DKIEQ6BKDAKEPHTEPWC6G2ZTDY7ATVCLD24AAU2IN",
  }
} as const


/**
 * Pool state data returned from the pool contract.
 * Contains all core pool information.
 */
export interface PoolState {
  /**
 * Fee tier in basis points (e.g., 3000 = 0.3%)
 */
fee: u32;
  /**
 * Total active liquidity at current tick
 */
liquidity: u128;
  /**
 * Current sqrt price in Q64.96 format
 */
sqrt_price_x96: u256;
  /**
 * Current tick
 */
tick: i32;
  /**
 * Minimum tick spacing for positions
 */
tick_spacing: i32;
  /**
 * First token in the pair (lower address)
 */
token0: string;
  /**
 * Second token in the pair (higher address)
 */
token1: string;
}


/**
 * Pool state with token balances (reserves).
 * Composes PoolState with reserve amounts for a single source of truth.
 */
export interface PoolStateWithBalances {
  /**
 * Balance of token0 held by the pool
 */
reserve0: i128;
  /**
 * Balance of token1 held by the pool
 */
reserve1: i128;
  /**
 * Core pool state (tokens, fee, price, liquidity)
 */
state: PoolState;
}

/**
 * Result of querying a pool - either initialized with state or not.
 */
export type PoolResult = {tag: "NotFound", values: void} | {tag: "Found", values: readonly [PoolState]};

/**
 * Result of querying a pool with balances.
 */
export type PoolResultWithBalances = {tag: "NotFound", values: void} | {tag: "Found", values: readonly [PoolStateWithBalances]};


/**
 * Pool data returned by the lens.
 * 
 * Contains the pool address and its state result.
 */
export interface PoolData {
  /**
 * The pool contract address
 */
pool: string;
  /**
 * Pool state result - Found(state) if initialized, NotFound otherwise
 */
result: PoolResult;
}


/**
 * Pool data with balances returned by the lens.
 * 
 * Contains the pool address and its state with reserves.
 */
export interface PoolDataWithBalances {
  /**
 * The pool contract address
 */
pool: string;
  /**
 * Pool state result with reserves
 */
result: PoolResultWithBalances;
}


/**
 * Query parameters for looking up a pool by token pair
 */
export interface TokenPairQuery {
  /**
 * Fee tier in basis points
 */
fee: u32;
  /**
 * First token address (order doesn't matter)
 */
token_a: string;
  /**
 * Second token address (order doesn't matter)
 */
token_b: string;
}


/**
 * Mirror the SwapResult structure from the pool contract
 */
export interface SwapResult {
  amount0: i128;
  amount1: i128;
  liquidity: u128;
  sqrt_price_x96: u256;
  tick: i32;
}


/**
 * Parameters for quoting a single-hop exact input swap
 */
export interface QuoteExactInputSingleParams {
  amount_in: i128;
  fee: u32;
  sqrt_price_limit_x96: u256;
  token_in: string;
  token_out: string;
}


/**
 * Parameters for quoting a single-hop exact output swap
 */
export interface QuoteExactOutputSingleParams {
  amount_out: i128;
  fee: u32;
  sqrt_price_limit_x96: u256;
  token_in: string;
  token_out: string;
}


export interface SwapResult {
  amount0: i128;
  amount1: i128;
  liquidity: u128;
  sqrt_price_x96: u256;
  tick: i32;
}


export interface Slot0 {
  sqrt_price_x96: u256;
  tick: i32;
}


/**
 * Parameters for quoting a single-hop exact input swap
 */
export interface QuoteExactInputSingleParams {
  amount_in: i128;
  fee: u32;
  sqrt_price_limit_x96: u256;
  token_in: string;
  token_out: string;
}


/**
 * Parameters for quoting a single-hop exact output swap
 */
export interface QuoteExactOutputSingleParams {
  amount: i128;
  fee: u32;
  sqrt_price_limit_x96: u256;
  token_in: string;
  token_out: string;
}


/**
 * Result for a single-hop quote
 */
export interface QuoteSingleResult {
  amount: i128;
  initialized_ticks_crossed: u32;
  sqrt_price_x96_after: u256;
  tick_after: i32;
}


/**
 * Result for a multi-hop quote
 */
export interface QuoteResult {
  amount: i128;
  initialized_ticks_crossed_list: Array<u32>;
  sqrt_price_x96_after_list: Array<u256>;
  tick_after_list: Array<i32>;
}


/**
 * Represents a populated tick with liquidity information
 */
export interface PopulatedTick {
  liquidity_gross: u128;
  liquidity_net: i128;
  tick: i32;
}


/**
 * Result of get_populated_ticks_in_range with truncation signal
 */
export interface PopulatedTicksResult {
  ticks: Array<PopulatedTick>;
  /**
 * True if results were truncated due to MAX_TICKS_BATCH limit.
 */
truncated: boolean;
}

/**
 * Error codes for the periphery libraries
 */
export const PeripheryLibraryErrors = {
  /**
   * Hex string length is insufficient for the requested conversion
   */
  2001: {message:"HexLengthInsufficient"},
  /**
   * mul_div operation failed in liquidity calculation
   */
  2002: {message:"MulDivFailed"},
  /**
   * Invalid price range (division by zero)
   */
  2003: {message:"InvalidPriceRange"},
  /**
   * U256 to u128 conversion failed (overflow)
   */
  2004: {message:"U256ToU128ConversionFailed"}
}


/**
 * Parameters required to construct a token URI (see original Solidity code for semantics)
 */
export interface ConstructTokenURIParams {
  base_token_address: string;
  base_token_decimals: u32;
  base_token_symbol: string;
  fee: u32;
  flip_ratio: boolean;
  pool_address: string;
  quote_token_address: string;
  quote_token_decimals: u32;
  quote_token_symbol: string;
  tick_current: i32;
  tick_lower: i32;
  tick_spacing: i32;
  tick_upper: i32;
  token_id: u64;
}


/**
 * Data structure for weighted tick aggregation across multiple pools
 */
export interface WeightedTickData {
  /**
 * Tick value from a pool
 */
tick: i32;
  /**
 * Weight for this tick (typically liquidity or volume)
 */
weight: u128;
}

/**
 * Error codes for the periphery base contract
 */
export const PeripheryBaseErrors = {
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
 * Combined error codes for backwards compatibility
 */
export const Errors = {
  ...PeripheryLibraryErrors,
  ...PeripheryBaseErrors,
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
   * Construct and simulate a get_factory transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get the stored factory address
   * 
   * # Returns
   * The factory contract address
   */
  get_factory: (options?: {
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
   * Construct and simulate a get_pools_data transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Fetch pool data for multiple pools by their addresses
   * 
   * This is the most efficient method when you already know the pool addresses.
   * Uses a single cross-contract call per pool.
   * 
   * # Arguments
   * * `env` - The Soroban environment
   * * `pools` - Vector of pool contract addresses to query
   * 
   * # Returns
   * Vector of PoolData structs in the same order as input.
   * Each PoolData contains `result: Found(state)` if initialized, `NotFound` otherwise.
   */
  get_pools_data: ({pools}: {pools: Array<string>}, options?: {
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
  }) => Promise<AssembledTransaction<Array<PoolData>>>

  /**
   * Construct and simulate a get_pools_by_pairs transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Fetch pool data for multiple pools by token pairs
   * 
   * Looks up pool addresses from the factory, then fetches their data.
   * Useful when you have token pairs but not pool addresses.
   * 
   * # Arguments
   * * `env` - The Soroban environment
   * * `pairs` - Vector of token pair queries (token_a, token_b, fee)
   * 
   * # Returns
   * Vector of PoolData structs in the same order as input.
   * Each PoolData contains `result: Found(state)` if initialized, `NotFound` otherwise.
   * Token order in the query doesn't matter - tokens are sorted internally.
   */
  get_pools_by_pairs: ({pairs}: {pairs: Array<TokenPairQuery>}, options?: {
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
  }) => Promise<AssembledTransaction<Array<PoolData>>>

  /**
   * Construct and simulate a get_pool_data transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Fetch data for a single pool
   * 
   * # Arguments
   * * `env` - The Soroban environment
   * * `pool` - The pool contract address
   * 
   * # Returns
   * PoolData struct with all pool information
   */
  get_pool_data: ({pool}: {pool: string}, options?: {
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
  }) => Promise<AssembledTransaction<PoolData>>

  /**
   * Construct and simulate a get_pools_data_with_bal transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Fetch pool data with balances for multiple pools by their addresses.
   * 
   * Same as `get_pools_data` but includes token reserves (balances).
   * Costs ~1M extra CPU per pool due to balance lookups.
   * 
   * # Arguments
   * * `env` - The Soroban environment
   * * `pools` - Vector of pool contract addresses to query
   * 
   * # Returns
   * Vector of PoolDataWithBalances structs in the same order as input.
   */
  get_pools_data_with_bal: ({pools}: {pools: Array<string>}, options?: {
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
  }) => Promise<AssembledTransaction<Array<PoolDataWithBalances>>>

  /**
   * Construct and simulate a get_pool_data_with_bal transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Fetch data with balances for a single pool
   * 
   * # Arguments
   * * `env` - The Soroban environment
   * * `pool` - The pool contract address
   * 
   * # Returns
   * PoolDataWithBalances struct with pool state and reserves
   */
  get_pool_data_with_bal: ({pool}: {pool: string}, options?: {
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
  }) => Promise<AssembledTransaction<PoolDataWithBalances>>

  /**
   * Construct and simulate a init transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initialize the quoter with factory and WETH9 addresses
   * @param factory The address of the pool factory contract
   * @param xlm The address of the wrapped XLM token
   * 
   * Note: Panics on initialization failure (e.g., if already initialized).
   * This is intentional - a contract that fails to initialize should not be usable.
   */
  init: ({factory, xlm}: {factory: string, xlm: string}, options?: {
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
   * Construct and simulate a quote_exact_input_single transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Returns the amount out received for a given exact input swap without executing the swap
   * @param token_in The token being swapped in
   * @param token_out The token being swapped out
   * @param fee The fee tier of the pool
   * @param amount_in The amount of input tokens
   * @param sqrt_price_limit_x96 The price limit; 0 for no limit
   * @return amount_out The amount of output tokens that would be received
   */
  quote_exact_input_single: ({token_in, token_out, fee, amount_in, sqrt_price_limit_x96}: {token_in: string, token_out: string, fee: u32, amount_in: i128, sqrt_price_limit_x96: u256}, options?: {
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
   * Returns the amount out received for a given exact input swap without executing the swap
   * @param path The path of tokens to swap through, encoded as (token0, fee, token1, fee, token2, ...)
   * @param amount_in The amount of the first token to swap
   * @return amount_out The amount of the last token that would be received
   */
  quote_exact_input: ({path, amount_in}: {path: Buffer, amount_in: i128}, options?: {
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
   * Construct and simulate a quote_exact_output_single transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Returns the amount in required for a given exact output swap without executing the swap
   * @param token_in The token being swapped in
   * @param token_out The token being swapped out
   * @param fee The fee tier of the pool
   * @param amount_out The amount of output tokens desired
   * @param sqrt_price_limit_x96 The price limit; 0 for no limit
   * @return amount_in The amount of input tokens required
   */
  quote_exact_output_single: ({token_in, token_out, fee, amount_out, sqrt_price_limit_x96}: {token_in: string, token_out: string, fee: u32, amount_out: i128, sqrt_price_limit_x96: u256}, options?: {
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
   * Construct and simulate a quote_exact_output transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Returns the amount in required to receive the given exact output amount but for a swap of multiple pools
   * @param path The path of tokens to swap through, encoded in REVERSE order (tokenOut, fee, tokenIn, ...)
   * Note: For exact output, the path must be reversed from exact input
   * @param amount_out The amount of the last token to receive
   * @return amount_in The amount of the first token required
   */
  quote_exact_output: ({path, amount_out}: {path: Buffer, amount_out: i128}, options?: {
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
   * Construct and simulate a init_v2 transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initialize the quoter with factory and XLM addresses
   * 
   * Note: Panics on initialization failure (e.g., if already initialized).
   * This is intentional - a contract that fails to initialize should not be usable.
   */
  init_v2: ({factory, xlm}: {factory: string, xlm: string}, options?: {
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
   * Construct and simulate a quote_exact_input_v2 transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  quote_exact_input_v2: ({path, amount_in}: {path: Buffer, amount_in: i128}, options?: {
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
   * Construct and simulate a quote_exact_output_v2 transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  quote_exact_output_v2: ({path, amount_out}: {path: Buffer, amount_out: i128}, options?: {
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
   * Construct and simulate a quote_exact_input_single_v2 transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  quote_exact_input_single_v2: ({params}: {params: QuoteExactInputSingleParams}, options?: {
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
  }) => Promise<AssembledTransaction<Result<QuoteSingleResult>>>

  /**
   * Construct and simulate a quote_exact_output_single_v2 transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  quote_exact_output_single_v2: ({params}: {params: QuoteExactOutputSingleParams}, options?: {
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
  }) => Promise<AssembledTransaction<Result<QuoteSingleResult>>>

  /**
   * Construct and simulate a get_populated_ticks_in_word transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Gets all populated ticks in a specific word of the tick bitmap
   * 
   * # Arguments
   * * `env` - The Soroban environment
   * * `pool` - The address of the pool contract
   * * `tick_bitmap_index` - The index of the tick bitmap word to query (i32)
   * 
   * # Returns
   * A vector of PopulatedTick structs containing tick index, liquidity_net, and liquidity_gross
   * 
   * # Note
   * This function mirrors the behavior of Uniswap V3's TickLens.getPopulatedTicksInWord:
   * 1. Fetches the bitmap for the specified word (256 bits)
   * 2. Counts populated ticks (bits set to 1)
   * 3. For each populated bit, calculates the actual tick and fetches its data
   * 4. Returns results in reverse order (matching Solidity's behavior)
   */
  get_populated_ticks_in_word: ({pool, tick_bitmap_index}: {pool: string, tick_bitmap_index: i32}, options?: {
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
  }) => Promise<AssembledTransaction<Array<PopulatedTick>>>

  /**
   * Construct and simulate a get_populated_ticks_in_range transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Gets all populated ticks across a range of bitmap words.
   * 
   * This function batches multiple bitmap word queries into a single call,
   * reducing cross-contract call overhead for operations like liquidity charts.
   * 
   * # Arguments
   * * `env` - The Soroban environment
   * * `pool` - The address of the pool contract
   * * `start_word` - The first bitmap word index (can be negative)
   * * `count` - Number of consecutive words to scan (capped at MAX_RANGE_COUNT)
   * 
   * # Returns
   * A `PopulatedTicksResult` containing:
   * - `ticks`: Vector of PopulatedTick structs in **ascending order** by tick index
   * - `truncated`: True if results are incomplete for any reason
   * 
   * # Ordering
   * NOTE: This function returns ticks in ASCENDING order (lowest tick first),
   * which differs from `get_populated_ticks_in_word` that returns REVERSE order
   * (matching Uniswap V3 Solidity behavior).
   * 
   * # Limits & Truncation
   * The `truncated` flag is set to true if:
   * - `count` exceeded MAX_RANGE_COUNT (256 words)
   * - `start_word` was near i32::MAX causing range reduction
   * - More than MAX_TICKS_BATCH (2
   */
  get_populated_ticks_in_range: ({pool, start_word, count}: {pool: string, start_word: i32, count: u32}, options?: {
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
  }) => Promise<AssembledTransaction<PopulatedTicksResult>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        {factory}: {factory: string},
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
    return ContractClient.deploy({factory}, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAQAAAFRQb29sIHN0YXRlIGRhdGEgcmV0dXJuZWQgZnJvbSB0aGUgcG9vbCBjb250cmFjdC4KQ29udGFpbnMgYWxsIGNvcmUgcG9vbCBpbmZvcm1hdGlvbi4AAAAAAAAACVBvb2xTdGF0ZQAAAAAAAAcAAAAsRmVlIHRpZXIgaW4gYmFzaXMgcG9pbnRzIChlLmcuLCAzMDAwID0gMC4zJSkAAAADZmVlAAAAAAQAAAAmVG90YWwgYWN0aXZlIGxpcXVpZGl0eSBhdCBjdXJyZW50IHRpY2sAAAAAAAlsaXF1aWRpdHkAAAAAAAAKAAAAI0N1cnJlbnQgc3FydCBwcmljZSBpbiBRNjQuOTYgZm9ybWF0AAAAAA5zcXJ0X3ByaWNlX3g5NgAAAAAADAAAAAxDdXJyZW50IHRpY2sAAAAEdGljawAAAAUAAAAiTWluaW11bSB0aWNrIHNwYWNpbmcgZm9yIHBvc2l0aW9ucwAAAAAADHRpY2tfc3BhY2luZwAAAAUAAAAnRmlyc3QgdG9rZW4gaW4gdGhlIHBhaXIgKGxvd2VyIGFkZHJlc3MpAAAAAAZ0b2tlbjAAAAAAABMAAAApU2Vjb25kIHRva2VuIGluIHRoZSBwYWlyIChoaWdoZXIgYWRkcmVzcykAAAAAAAAGdG9rZW4xAAAAAAAT",
        "AAAAAQAAAHBQb29sIHN0YXRlIHdpdGggdG9rZW4gYmFsYW5jZXMgKHJlc2VydmVzKS4KQ29tcG9zZXMgUG9vbFN0YXRlIHdpdGggcmVzZXJ2ZSBhbW91bnRzIGZvciBhIHNpbmdsZSBzb3VyY2Ugb2YgdHJ1dGguAAAAAAAAABVQb29sU3RhdGVXaXRoQmFsYW5jZXMAAAAAAAADAAAAIkJhbGFuY2Ugb2YgdG9rZW4wIGhlbGQgYnkgdGhlIHBvb2wAAAAAAAhyZXNlcnZlMAAAAAsAAAAiQmFsYW5jZSBvZiB0b2tlbjEgaGVsZCBieSB0aGUgcG9vbAAAAAAACHJlc2VydmUxAAAACwAAAC9Db3JlIHBvb2wgc3RhdGUgKHRva2VucywgZmVlLCBwcmljZSwgbGlxdWlkaXR5KQAAAAAFc3RhdGUAAAAAAAfQAAAACVBvb2xTdGF0ZQAAAA==",
        "AAAAAgAAAEFSZXN1bHQgb2YgcXVlcnlpbmcgYSBwb29sIC0gZWl0aGVyIGluaXRpYWxpemVkIHdpdGggc3RhdGUgb3Igbm90LgAAAAAAAAAAAAAKUG9vbFJlc3VsdAAAAAAAAgAAAAAAAAAoUG9vbCBpcyBub3QgaW5pdGlhbGl6ZWQgb3IgZG9lc24ndCBleGlzdAAAAAhOb3RGb3VuZAAAAAEAAAAeUG9vbCBleGlzdHMgYW5kIGlzIGluaXRpYWxpemVkAAAAAAAFRm91bmQAAAAAAAABAAAH0AAAAAlQb29sU3RhdGUAAAA=",
        "AAAAAgAAAChSZXN1bHQgb2YgcXVlcnlpbmcgYSBwb29sIHdpdGggYmFsYW5jZXMuAAAAAAAAABZQb29sUmVzdWx0V2l0aEJhbGFuY2VzAAAAAAACAAAAAAAAAChQb29sIGlzIG5vdCBpbml0aWFsaXplZCBvciBkb2Vzbid0IGV4aXN0AAAACE5vdEZvdW5kAAAAAQAAADJQb29sIGV4aXN0cyBhbmQgaXMgaW5pdGlhbGl6ZWQgKGluY2x1ZGVzIHJlc2VydmVzKQAAAAAABUZvdW5kAAAAAAAAAQAAB9AAAAAVUG9vbFN0YXRlV2l0aEJhbGFuY2VzAAAA",
        "AAAAAQAAAFBQb29sIGRhdGEgcmV0dXJuZWQgYnkgdGhlIGxlbnMuCgpDb250YWlucyB0aGUgcG9vbCBhZGRyZXNzIGFuZCBpdHMgc3RhdGUgcmVzdWx0LgAAAAAAAAAIUG9vbERhdGEAAAACAAAAGVRoZSBwb29sIGNvbnRyYWN0IGFkZHJlc3MAAAAAAAAEcG9vbAAAABMAAABDUG9vbCBzdGF0ZSByZXN1bHQgLSBGb3VuZChzdGF0ZSkgaWYgaW5pdGlhbGl6ZWQsIE5vdEZvdW5kIG90aGVyd2lzZQAAAAAGcmVzdWx0AAAAAAfQAAAAClBvb2xSZXN1bHQAAA==",
        "AAAAAQAAAGVQb29sIGRhdGEgd2l0aCBiYWxhbmNlcyByZXR1cm5lZCBieSB0aGUgbGVucy4KCkNvbnRhaW5zIHRoZSBwb29sIGFkZHJlc3MgYW5kIGl0cyBzdGF0ZSB3aXRoIHJlc2VydmVzLgAAAAAAAAAAAAAUUG9vbERhdGFXaXRoQmFsYW5jZXMAAAACAAAAGVRoZSBwb29sIGNvbnRyYWN0IGFkZHJlc3MAAAAAAAAEcG9vbAAAABMAAAAfUG9vbCBzdGF0ZSByZXN1bHQgd2l0aCByZXNlcnZlcwAAAAAGcmVzdWx0AAAAAAfQAAAAFlBvb2xSZXN1bHRXaXRoQmFsYW5jZXMAAA==",
        "AAAAAQAAADRRdWVyeSBwYXJhbWV0ZXJzIGZvciBsb29raW5nIHVwIGEgcG9vbCBieSB0b2tlbiBwYWlyAAAAAAAAAA5Ub2tlblBhaXJRdWVyeQAAAAAAAwAAABhGZWUgdGllciBpbiBiYXNpcyBwb2ludHMAAAADZmVlAAAAAAQAAAAqRmlyc3QgdG9rZW4gYWRkcmVzcyAob3JkZXIgZG9lc24ndCBtYXR0ZXIpAAAAAAAHdG9rZW5fYQAAAAATAAAAK1NlY29uZCB0b2tlbiBhZGRyZXNzIChvcmRlciBkb2Vzbid0IG1hdHRlcikAAAAAB3Rva2VuX2IAAAAAEw==",
        "AAAAAAAAAI5Jbml0aWFsaXplIHRoZSBQb29sTGVucyB3aXRoIHRoZSBmYWN0b3J5IGFkZHJlc3MKCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgU29yb2JhbiBlbnZpcm9ubWVudAoqIGBmYWN0b3J5YCAtIFRoZSBERVggZmFjdG9yeSBjb250cmFjdCBhZGRyZXNzAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAEAAAAAAAAAB2ZhY3RvcnkAAAAAEwAAAAA=",
        "AAAAAAAAAEZHZXQgdGhlIHN0b3JlZCBmYWN0b3J5IGFkZHJlc3MKCiMgUmV0dXJucwpUaGUgZmFjdG9yeSBjb250cmFjdCBhZGRyZXNzAAAAAAALZ2V0X2ZhY3RvcnkAAAAAAAAAAAEAAAAT",
        "AAAAAAAAAapGZXRjaCBwb29sIGRhdGEgZm9yIG11bHRpcGxlIHBvb2xzIGJ5IHRoZWlyIGFkZHJlc3NlcwoKVGhpcyBpcyB0aGUgbW9zdCBlZmZpY2llbnQgbWV0aG9kIHdoZW4geW91IGFscmVhZHkga25vdyB0aGUgcG9vbCBhZGRyZXNzZXMuClVzZXMgYSBzaW5nbGUgY3Jvc3MtY29udHJhY3QgY2FsbCBwZXIgcG9vbC4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgU29yb2JhbiBlbnZpcm9ubWVudAoqIGBwb29sc2AgLSBWZWN0b3Igb2YgcG9vbCBjb250cmFjdCBhZGRyZXNzZXMgdG8gcXVlcnkKCiMgUmV0dXJucwpWZWN0b3Igb2YgUG9vbERhdGEgc3RydWN0cyBpbiB0aGUgc2FtZSBvcmRlciBhcyBpbnB1dC4KRWFjaCBQb29sRGF0YSBjb250YWlucyBgcmVzdWx0OiBGb3VuZChzdGF0ZSlgIGlmIGluaXRpYWxpemVkLCBgTm90Rm91bmRgIG90aGVyd2lzZS4AAAAAAA5nZXRfcG9vbHNfZGF0YQAAAAAAAQAAAAAAAAAFcG9vbHMAAAAAAAPqAAAAEwAAAAEAAAPqAAAH0AAAAAhQb29sRGF0YQ==",
        "AAAAAAAAAfxGZXRjaCBwb29sIGRhdGEgZm9yIG11bHRpcGxlIHBvb2xzIGJ5IHRva2VuIHBhaXJzCgpMb29rcyB1cCBwb29sIGFkZHJlc3NlcyBmcm9tIHRoZSBmYWN0b3J5LCB0aGVuIGZldGNoZXMgdGhlaXIgZGF0YS4KVXNlZnVsIHdoZW4geW91IGhhdmUgdG9rZW4gcGFpcnMgYnV0IG5vdCBwb29sIGFkZHJlc3Nlcy4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgU29yb2JhbiBlbnZpcm9ubWVudAoqIGBwYWlyc2AgLSBWZWN0b3Igb2YgdG9rZW4gcGFpciBxdWVyaWVzICh0b2tlbl9hLCB0b2tlbl9iLCBmZWUpCgojIFJldHVybnMKVmVjdG9yIG9mIFBvb2xEYXRhIHN0cnVjdHMgaW4gdGhlIHNhbWUgb3JkZXIgYXMgaW5wdXQuCkVhY2ggUG9vbERhdGEgY29udGFpbnMgYHJlc3VsdDogRm91bmQoc3RhdGUpYCBpZiBpbml0aWFsaXplZCwgYE5vdEZvdW5kYCBvdGhlcndpc2UuClRva2VuIG9yZGVyIGluIHRoZSBxdWVyeSBkb2Vzbid0IG1hdHRlciAtIHRva2VucyBhcmUgc29ydGVkIGludGVybmFsbHkuAAAAEmdldF9wb29sc19ieV9wYWlycwAAAAAAAQAAAAAAAAAFcGFpcnMAAAAAAAPqAAAH0AAAAA5Ub2tlblBhaXJRdWVyeQAAAAAAAQAAA+oAAAfQAAAACFBvb2xEYXRh",
        "AAAAAAAAAKVGZXRjaCBkYXRhIGZvciBhIHNpbmdsZSBwb29sCgojIEFyZ3VtZW50cwoqIGBlbnZgIC0gVGhlIFNvcm9iYW4gZW52aXJvbm1lbnQKKiBgcG9vbGAgLSBUaGUgcG9vbCBjb250cmFjdCBhZGRyZXNzCgojIFJldHVybnMKUG9vbERhdGEgc3RydWN0IHdpdGggYWxsIHBvb2wgaW5mb3JtYXRpb24AAAAAAAANZ2V0X3Bvb2xfZGF0YQAAAAAAAAEAAAAAAAAABHBvb2wAAAATAAAAAQAAB9AAAAAIUG9vbERhdGE=",
        "AAAAAAAAAW9GZXRjaCBwb29sIGRhdGEgd2l0aCBiYWxhbmNlcyBmb3IgbXVsdGlwbGUgcG9vbHMgYnkgdGhlaXIgYWRkcmVzc2VzLgoKU2FtZSBhcyBgZ2V0X3Bvb2xzX2RhdGFgIGJ1dCBpbmNsdWRlcyB0b2tlbiByZXNlcnZlcyAoYmFsYW5jZXMpLgpDb3N0cyB+MU0gZXh0cmEgQ1BVIHBlciBwb29sIGR1ZSB0byBiYWxhbmNlIGxvb2t1cHMuCgojIEFyZ3VtZW50cwoqIGBlbnZgIC0gVGhlIFNvcm9iYW4gZW52aXJvbm1lbnQKKiBgcG9vbHNgIC0gVmVjdG9yIG9mIHBvb2wgY29udHJhY3QgYWRkcmVzc2VzIHRvIHF1ZXJ5CgojIFJldHVybnMKVmVjdG9yIG9mIFBvb2xEYXRhV2l0aEJhbGFuY2VzIHN0cnVjdHMgaW4gdGhlIHNhbWUgb3JkZXIgYXMgaW5wdXQuAAAAABdnZXRfcG9vbHNfZGF0YV93aXRoX2JhbAAAAAABAAAAAAAAAAVwb29scwAAAAAAA+oAAAATAAAAAQAAA+oAAAfQAAAAFFBvb2xEYXRhV2l0aEJhbGFuY2Vz",
        "AAAAAAAAAMJGZXRjaCBkYXRhIHdpdGggYmFsYW5jZXMgZm9yIGEgc2luZ2xlIHBvb2wKCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgU29yb2JhbiBlbnZpcm9ubWVudAoqIGBwb29sYCAtIFRoZSBwb29sIGNvbnRyYWN0IGFkZHJlc3MKCiMgUmV0dXJucwpQb29sRGF0YVdpdGhCYWxhbmNlcyBzdHJ1Y3Qgd2l0aCBwb29sIHN0YXRlIGFuZCByZXNlcnZlcwAAAAAAFmdldF9wb29sX2RhdGFfd2l0aF9iYWwAAAAAAAEAAAAAAAAABHBvb2wAAAATAAAAAQAAB9AAAAAUUG9vbERhdGFXaXRoQmFsYW5jZXM=",
        "AAAAAQAAADZNaXJyb3IgdGhlIFN3YXBSZXN1bHQgc3RydWN0dXJlIGZyb20gdGhlIHBvb2wgY29udHJhY3QAAAAAAAAAAAAKU3dhcFJlc3VsdAAAAAAABQAAAAAAAAAHYW1vdW50MAAAAAALAAAAAAAAAAdhbW91bnQxAAAAAAsAAAAAAAAACWxpcXVpZGl0eQAAAAAAAAoAAAAAAAAADnNxcnRfcHJpY2VfeDk2AAAAAAAMAAAAAAAAAAR0aWNrAAAABQ==",
        "AAAAAQAAADRQYXJhbWV0ZXJzIGZvciBxdW90aW5nIGEgc2luZ2xlLWhvcCBleGFjdCBpbnB1dCBzd2FwAAAAAAAAABtRdW90ZUV4YWN0SW5wdXRTaW5nbGVQYXJhbXMAAAAABQAAAAAAAAAJYW1vdW50X2luAAAAAAAACwAAAAAAAAADZmVlAAAAAAQAAAAAAAAAFHNxcnRfcHJpY2VfbGltaXRfeDk2AAAADAAAAAAAAAAIdG9rZW5faW4AAAATAAAAAAAAAAl0b2tlbl9vdXQAAAAAAAAT",
        "AAAAAQAAADVQYXJhbWV0ZXJzIGZvciBxdW90aW5nIGEgc2luZ2xlLWhvcCBleGFjdCBvdXRwdXQgc3dhcAAAAAAAAAAAAAAcUXVvdGVFeGFjdE91dHB1dFNpbmdsZVBhcmFtcwAAAAUAAAAAAAAACmFtb3VudF9vdXQAAAAAAAsAAAAAAAAAA2ZlZQAAAAAEAAAAAAAAABRzcXJ0X3ByaWNlX2xpbWl0X3g5NgAAAAwAAAAAAAAACHRva2VuX2luAAAAEwAAAAAAAAAJdG9rZW5fb3V0AAAAAAAAEw==",
        "AAAAAAAAATZJbml0aWFsaXplIHRoZSBxdW90ZXIgd2l0aCBmYWN0b3J5IGFuZCBXRVRIOSBhZGRyZXNzZXMKQHBhcmFtIGZhY3RvcnkgVGhlIGFkZHJlc3Mgb2YgdGhlIHBvb2wgZmFjdG9yeSBjb250cmFjdApAcGFyYW0geGxtIFRoZSBhZGRyZXNzIG9mIHRoZSB3cmFwcGVkIFhMTSB0b2tlbgoKTm90ZTogUGFuaWNzIG9uIGluaXRpYWxpemF0aW9uIGZhaWx1cmUgKGUuZy4sIGlmIGFscmVhZHkgaW5pdGlhbGl6ZWQpLgpUaGlzIGlzIGludGVudGlvbmFsIC0gYSBjb250cmFjdCB0aGF0IGZhaWxzIHRvIGluaXRpYWxpemUgc2hvdWxkIG5vdCBiZSB1c2FibGUuAAAAAAAEaW5pdAAAAAIAAAAAAAAAB2ZhY3RvcnkAAAAAEwAAAAAAAAADeGxtAAAAABMAAAAA",
        "AAAAAAAAAYFSZXR1cm5zIHRoZSBhbW91bnQgb3V0IHJlY2VpdmVkIGZvciBhIGdpdmVuIGV4YWN0IGlucHV0IHN3YXAgd2l0aG91dCBleGVjdXRpbmcgdGhlIHN3YXAKQHBhcmFtIHRva2VuX2luIFRoZSB0b2tlbiBiZWluZyBzd2FwcGVkIGluCkBwYXJhbSB0b2tlbl9vdXQgVGhlIHRva2VuIGJlaW5nIHN3YXBwZWQgb3V0CkBwYXJhbSBmZWUgVGhlIGZlZSB0aWVyIG9mIHRoZSBwb29sCkBwYXJhbSBhbW91bnRfaW4gVGhlIGFtb3VudCBvZiBpbnB1dCB0b2tlbnMKQHBhcmFtIHNxcnRfcHJpY2VfbGltaXRfeDk2IFRoZSBwcmljZSBsaW1pdDsgMCBmb3Igbm8gbGltaXQKQHJldHVybiBhbW91bnRfb3V0IFRoZSBhbW91bnQgb2Ygb3V0cHV0IHRva2VucyB0aGF0IHdvdWxkIGJlIHJlY2VpdmVkAAAAAAAAGHF1b3RlX2V4YWN0X2lucHV0X3NpbmdsZQAAAAUAAAAAAAAACHRva2VuX2luAAAAEwAAAAAAAAAJdG9rZW5fb3V0AAAAAAAAEwAAAAAAAAADZmVlAAAAAAQAAAAAAAAACWFtb3VudF9pbgAAAAAAAAsAAAAAAAAAFHNxcnRfcHJpY2VfbGltaXRfeDk2AAAADAAAAAEAAAPpAAAACwAAAAM=",
        "AAAAAAAAAThSZXR1cm5zIHRoZSBhbW91bnQgb3V0IHJlY2VpdmVkIGZvciBhIGdpdmVuIGV4YWN0IGlucHV0IHN3YXAgd2l0aG91dCBleGVjdXRpbmcgdGhlIHN3YXAKQHBhcmFtIHBhdGggVGhlIHBhdGggb2YgdG9rZW5zIHRvIHN3YXAgdGhyb3VnaCwgZW5jb2RlZCBhcyAodG9rZW4wLCBmZWUsIHRva2VuMSwgZmVlLCB0b2tlbjIsIC4uLikKQHBhcmFtIGFtb3VudF9pbiBUaGUgYW1vdW50IG9mIHRoZSBmaXJzdCB0b2tlbiB0byBzd2FwCkByZXR1cm4gYW1vdW50X291dCBUaGUgYW1vdW50IG9mIHRoZSBsYXN0IHRva2VuIHRoYXQgd291bGQgYmUgcmVjZWl2ZWQAAAARcXVvdGVfZXhhY3RfaW5wdXQAAAAAAAACAAAAAAAAAARwYXRoAAAADgAAAAAAAAAJYW1vdW50X2luAAAAAAAACwAAAAEAAAPpAAAACwAAAAM=",
        "AAAAAAAAAXtSZXR1cm5zIHRoZSBhbW91bnQgaW4gcmVxdWlyZWQgZm9yIGEgZ2l2ZW4gZXhhY3Qgb3V0cHV0IHN3YXAgd2l0aG91dCBleGVjdXRpbmcgdGhlIHN3YXAKQHBhcmFtIHRva2VuX2luIFRoZSB0b2tlbiBiZWluZyBzd2FwcGVkIGluCkBwYXJhbSB0b2tlbl9vdXQgVGhlIHRva2VuIGJlaW5nIHN3YXBwZWQgb3V0CkBwYXJhbSBmZWUgVGhlIGZlZSB0aWVyIG9mIHRoZSBwb29sCkBwYXJhbSBhbW91bnRfb3V0IFRoZSBhbW91bnQgb2Ygb3V0cHV0IHRva2VucyBkZXNpcmVkCkBwYXJhbSBzcXJ0X3ByaWNlX2xpbWl0X3g5NiBUaGUgcHJpY2UgbGltaXQ7IDAgZm9yIG5vIGxpbWl0CkByZXR1cm4gYW1vdW50X2luIFRoZSBhbW91bnQgb2YgaW5wdXQgdG9rZW5zIHJlcXVpcmVkAAAAABlxdW90ZV9leGFjdF9vdXRwdXRfc2luZ2xlAAAAAAAABQAAAAAAAAAIdG9rZW5faW4AAAATAAAAAAAAAAl0b2tlbl9vdXQAAAAAAAATAAAAAAAAAANmZWUAAAAABAAAAAAAAAAKYW1vdW50X291dAAAAAAACwAAAAAAAAAUc3FydF9wcmljZV9saW1pdF94OTYAAAAMAAAAAQAAA+kAAAALAAAAAw==",
        "AAAAAAAAAYVSZXR1cm5zIHRoZSBhbW91bnQgaW4gcmVxdWlyZWQgdG8gcmVjZWl2ZSB0aGUgZ2l2ZW4gZXhhY3Qgb3V0cHV0IGFtb3VudCBidXQgZm9yIGEgc3dhcCBvZiBtdWx0aXBsZSBwb29scwpAcGFyYW0gcGF0aCBUaGUgcGF0aCBvZiB0b2tlbnMgdG8gc3dhcCB0aHJvdWdoLCBlbmNvZGVkIGluIFJFVkVSU0Ugb3JkZXIgKHRva2VuT3V0LCBmZWUsIHRva2VuSW4sIC4uLikKTm90ZTogRm9yIGV4YWN0IG91dHB1dCwgdGhlIHBhdGggbXVzdCBiZSByZXZlcnNlZCBmcm9tIGV4YWN0IGlucHV0CkBwYXJhbSBhbW91bnRfb3V0IFRoZSBhbW91bnQgb2YgdGhlIGxhc3QgdG9rZW4gdG8gcmVjZWl2ZQpAcmV0dXJuIGFtb3VudF9pbiBUaGUgYW1vdW50IG9mIHRoZSBmaXJzdCB0b2tlbiByZXF1aXJlZAAAAAAAABJxdW90ZV9leGFjdF9vdXRwdXQAAAAAAAIAAAAAAAAABHBhdGgAAAAOAAAAAAAAAAphbW91bnRfb3V0AAAAAAALAAAAAQAAA+kAAAALAAAAAw==",
        "AAAAAQAAAAAAAAAAAAAAClN3YXBSZXN1bHQAAAAAAAUAAAAAAAAAB2Ftb3VudDAAAAAACwAAAAAAAAAHYW1vdW50MQAAAAALAAAAAAAAAAlsaXF1aWRpdHkAAAAAAAAKAAAAAAAAAA5zcXJ0X3ByaWNlX3g5NgAAAAAADAAAAAAAAAAEdGljawAAAAU=",
        "AAAAAQAAAAAAAAAAAAAABVNsb3QwAAAAAAAAAgAAAAAAAAAOc3FydF9wcmljZV94OTYAAAAAAAwAAAAAAAAABHRpY2sAAAAF",
        "AAAAAQAAADRQYXJhbWV0ZXJzIGZvciBxdW90aW5nIGEgc2luZ2xlLWhvcCBleGFjdCBpbnB1dCBzd2FwAAAAAAAAABtRdW90ZUV4YWN0SW5wdXRTaW5nbGVQYXJhbXMAAAAABQAAAAAAAAAJYW1vdW50X2luAAAAAAAACwAAAAAAAAADZmVlAAAAAAQAAAAAAAAAFHNxcnRfcHJpY2VfbGltaXRfeDk2AAAADAAAAAAAAAAIdG9rZW5faW4AAAATAAAAAAAAAAl0b2tlbl9vdXQAAAAAAAAT",
        "AAAAAQAAADVQYXJhbWV0ZXJzIGZvciBxdW90aW5nIGEgc2luZ2xlLWhvcCBleGFjdCBvdXRwdXQgc3dhcAAAAAAAAAAAAAAcUXVvdGVFeGFjdE91dHB1dFNpbmdsZVBhcmFtcwAAAAUAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAADZmVlAAAAAAQAAAAAAAAAFHNxcnRfcHJpY2VfbGltaXRfeDk2AAAADAAAAAAAAAAIdG9rZW5faW4AAAATAAAAAAAAAAl0b2tlbl9vdXQAAAAAAAAT",
        "AAAAAQAAAB1SZXN1bHQgZm9yIGEgc2luZ2xlLWhvcCBxdW90ZQAAAAAAAAAAAAARUXVvdGVTaW5nbGVSZXN1bHQAAAAAAAAEAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAGWluaXRpYWxpemVkX3RpY2tzX2Nyb3NzZWQAAAAAAAAEAAAAAAAAABRzcXJ0X3ByaWNlX3g5Nl9hZnRlcgAAAAwAAAAAAAAACnRpY2tfYWZ0ZXIAAAAAAAU=",
        "AAAAAQAAABxSZXN1bHQgZm9yIGEgbXVsdGktaG9wIHF1b3RlAAAAAAAAAAtRdW90ZVJlc3VsdAAAAAAEAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAHmluaXRpYWxpemVkX3RpY2tzX2Nyb3NzZWRfbGlzdAAAAAAD6gAAAAQAAAAAAAAAGXNxcnRfcHJpY2VfeDk2X2FmdGVyX2xpc3QAAAAAAAPqAAAADAAAAAAAAAAPdGlja19hZnRlcl9saXN0AAAAA+oAAAAF",
        "AAAAAAAAAMxJbml0aWFsaXplIHRoZSBxdW90ZXIgd2l0aCBmYWN0b3J5IGFuZCBYTE0gYWRkcmVzc2VzCgpOb3RlOiBQYW5pY3Mgb24gaW5pdGlhbGl6YXRpb24gZmFpbHVyZSAoZS5nLiwgaWYgYWxyZWFkeSBpbml0aWFsaXplZCkuClRoaXMgaXMgaW50ZW50aW9uYWwgLSBhIGNvbnRyYWN0IHRoYXQgZmFpbHMgdG8gaW5pdGlhbGl6ZSBzaG91bGQgbm90IGJlIHVzYWJsZS4AAAAHaW5pdF92MgAAAAACAAAAAAAAAAdmYWN0b3J5AAAAABMAAAAAAAAAA3hsbQAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAUcXVvdGVfZXhhY3RfaW5wdXRfdjIAAAACAAAAAAAAAARwYXRoAAAADgAAAAAAAAAJYW1vdW50X2luAAAAAAAACwAAAAEAAAPpAAAH0AAAAAtRdW90ZVJlc3VsdAAAAAAD",
        "AAAAAAAAAAAAAAAVcXVvdGVfZXhhY3Rfb3V0cHV0X3YyAAAAAAAAAgAAAAAAAAAEcGF0aAAAAA4AAAAAAAAACmFtb3VudF9vdXQAAAAAAAsAAAABAAAD6QAAB9AAAAALUXVvdGVSZXN1bHQAAAAAAw==",
        "AAAAAAAAAAAAAAAbcXVvdGVfZXhhY3RfaW5wdXRfc2luZ2xlX3YyAAAAAAEAAAAAAAAABnBhcmFtcwAAAAAH0AAAABtRdW90ZUV4YWN0SW5wdXRTaW5nbGVQYXJhbXMAAAAAAQAAA+kAAAfQAAAAEVF1b3RlU2luZ2xlUmVzdWx0AAAAAAAAAw==",
        "AAAAAAAAAAAAAAAccXVvdGVfZXhhY3Rfb3V0cHV0X3NpbmdsZV92MgAAAAEAAAAAAAAABnBhcmFtcwAAAAAH0AAAABxRdW90ZUV4YWN0T3V0cHV0U2luZ2xlUGFyYW1zAAAAAQAAA+kAAAfQAAAAEVF1b3RlU2luZ2xlUmVzdWx0AAAAAAAAAw==",
        "AAAAAQAAADZSZXByZXNlbnRzIGEgcG9wdWxhdGVkIHRpY2sgd2l0aCBsaXF1aWRpdHkgaW5mb3JtYXRpb24AAAAAAAAAAAANUG9wdWxhdGVkVGljawAAAAAAAAMAAAAAAAAAD2xpcXVpZGl0eV9ncm9zcwAAAAAKAAAAAAAAAA1saXF1aWRpdHlfbmV0AAAAAAAACwAAAAAAAAAEdGljawAAAAU=",
        "AAAAAQAAAD1SZXN1bHQgb2YgZ2V0X3BvcHVsYXRlZF90aWNrc19pbl9yYW5nZSB3aXRoIHRydW5jYXRpb24gc2lnbmFsAAAAAAAAAAAAABRQb3B1bGF0ZWRUaWNrc1Jlc3VsdAAAAAIAAAAAAAAABXRpY2tzAAAAAAAD6gAAB9AAAAANUG9wdWxhdGVkVGljawAAAAAAADxUcnVlIGlmIHJlc3VsdHMgd2VyZSB0cnVuY2F0ZWQgZHVlIHRvIE1BWF9USUNLU19CQVRDSCBsaW1pdC4AAAAJdHJ1bmNhdGVkAAAAAAAAAQ==",
        "AAAAAAAAApZHZXRzIGFsbCBwb3B1bGF0ZWQgdGlja3MgaW4gYSBzcGVjaWZpYyB3b3JkIG9mIHRoZSB0aWNrIGJpdG1hcAoKIyBBcmd1bWVudHMKKiBgZW52YCAtIFRoZSBTb3JvYmFuIGVudmlyb25tZW50CiogYHBvb2xgIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIHBvb2wgY29udHJhY3QKKiBgdGlja19iaXRtYXBfaW5kZXhgIC0gVGhlIGluZGV4IG9mIHRoZSB0aWNrIGJpdG1hcCB3b3JkIHRvIHF1ZXJ5IChpMzIpCgojIFJldHVybnMKQSB2ZWN0b3Igb2YgUG9wdWxhdGVkVGljayBzdHJ1Y3RzIGNvbnRhaW5pbmcgdGljayBpbmRleCwgbGlxdWlkaXR5X25ldCwgYW5kIGxpcXVpZGl0eV9ncm9zcwoKIyBOb3RlClRoaXMgZnVuY3Rpb24gbWlycm9ycyB0aGUgYmVoYXZpb3Igb2YgVW5pc3dhcCBWMydzIFRpY2tMZW5zLmdldFBvcHVsYXRlZFRpY2tzSW5Xb3JkOgoxLiBGZXRjaGVzIHRoZSBiaXRtYXAgZm9yIHRoZSBzcGVjaWZpZWQgd29yZCAoMjU2IGJpdHMpCjIuIENvdW50cyBwb3B1bGF0ZWQgdGlja3MgKGJpdHMgc2V0IHRvIDEpCjMuIEZvciBlYWNoIHBvcHVsYXRlZCBiaXQsIGNhbGN1bGF0ZXMgdGhlIGFjdHVhbCB0aWNrIGFuZCBmZXRjaGVzIGl0cyBkYXRhCjQuIFJldHVybnMgcmVzdWx0cyBpbiByZXZlcnNlIG9yZGVyIChtYXRjaGluZyBTb2xpZGl0eSdzIGJlaGF2aW9yKQAAAAAAG2dldF9wb3B1bGF0ZWRfdGlja3NfaW5fd29yZAAAAAACAAAAAAAAAARwb29sAAAAEwAAAAAAAAARdGlja19iaXRtYXBfaW5kZXgAAAAAAAAFAAAAAQAAA+oAAAfQAAAADVBvcHVsYXRlZFRpY2sAAAA=",
        "AAAAAAAABABHZXRzIGFsbCBwb3B1bGF0ZWQgdGlja3MgYWNyb3NzIGEgcmFuZ2Ugb2YgYml0bWFwIHdvcmRzLgoKVGhpcyBmdW5jdGlvbiBiYXRjaGVzIG11bHRpcGxlIGJpdG1hcCB3b3JkIHF1ZXJpZXMgaW50byBhIHNpbmdsZSBjYWxsLApyZWR1Y2luZyBjcm9zcy1jb250cmFjdCBjYWxsIG92ZXJoZWFkIGZvciBvcGVyYXRpb25zIGxpa2UgbGlxdWlkaXR5IGNoYXJ0cy4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgU29yb2JhbiBlbnZpcm9ubWVudAoqIGBwb29sYCAtIFRoZSBhZGRyZXNzIG9mIHRoZSBwb29sIGNvbnRyYWN0CiogYHN0YXJ0X3dvcmRgIC0gVGhlIGZpcnN0IGJpdG1hcCB3b3JkIGluZGV4IChjYW4gYmUgbmVnYXRpdmUpCiogYGNvdW50YCAtIE51bWJlciBvZiBjb25zZWN1dGl2ZSB3b3JkcyB0byBzY2FuIChjYXBwZWQgYXQgTUFYX1JBTkdFX0NPVU5UKQoKIyBSZXR1cm5zCkEgYFBvcHVsYXRlZFRpY2tzUmVzdWx0YCBjb250YWluaW5nOgotIGB0aWNrc2A6IFZlY3RvciBvZiBQb3B1bGF0ZWRUaWNrIHN0cnVjdHMgaW4gKiphc2NlbmRpbmcgb3JkZXIqKiBieSB0aWNrIGluZGV4Ci0gYHRydW5jYXRlZGA6IFRydWUgaWYgcmVzdWx0cyBhcmUgaW5jb21wbGV0ZSBmb3IgYW55IHJlYXNvbgoKIyBPcmRlcmluZwpOT1RFOiBUaGlzIGZ1bmN0aW9uIHJldHVybnMgdGlja3MgaW4gQVNDRU5ESU5HIG9yZGVyIChsb3dlc3QgdGljayBmaXJzdCksCndoaWNoIGRpZmZlcnMgZnJvbSBgZ2V0X3BvcHVsYXRlZF90aWNrc19pbl93b3JkYCB0aGF0IHJldHVybnMgUkVWRVJTRSBvcmRlcgoobWF0Y2hpbmcgVW5pc3dhcCBWMyBTb2xpZGl0eSBiZWhhdmlvcikuCgojIExpbWl0cyAmIFRydW5jYXRpb24KVGhlIGB0cnVuY2F0ZWRgIGZsYWcgaXMgc2V0IHRvIHRydWUgaWY6Ci0gYGNvdW50YCBleGNlZWRlZCBNQVhfUkFOR0VfQ09VTlQgKDI1NiB3b3JkcykKLSBgc3RhcnRfd29yZGAgd2FzIG5lYXIgaTMyOjpNQVggY2F1c2luZyByYW5nZSByZWR1Y3Rpb24KLSBNb3JlIHRoYW4gTUFYX1RJQ0tTX0JBVENIICgyAAAAHGdldF9wb3B1bGF0ZWRfdGlja3NfaW5fcmFuZ2UAAAADAAAAAAAAAARwb29sAAAAEwAAAAAAAAAKc3RhcnRfd29yZAAAAAAABQAAAAAAAAAFY291bnQAAAAAAAAEAAAAAQAAB9AAAAAUUG9wdWxhdGVkVGlja3NSZXN1bHQ=",
        "AAAABAAAACdFcnJvciBjb2RlcyBmb3IgdGhlIHBlcmlwaGVyeSBsaWJyYXJpZXMAAAAAAAAAAAVFcnJvcgAAAAAAAAQAAAA+SGV4IHN0cmluZyBsZW5ndGggaXMgaW5zdWZmaWNpZW50IGZvciB0aGUgcmVxdWVzdGVkIGNvbnZlcnNpb24AAAAAABVIZXhMZW5ndGhJbnN1ZmZpY2llbnQAAAAAAAfRAAAAMW11bF9kaXYgb3BlcmF0aW9uIGZhaWxlZCBpbiBsaXF1aWRpdHkgY2FsY3VsYXRpb24AAAAAAAAMTXVsRGl2RmFpbGVkAAAH0gAAACZJbnZhbGlkIHByaWNlIHJhbmdlIChkaXZpc2lvbiBieSB6ZXJvKQAAAAAAEUludmFsaWRQcmljZVJhbmdlAAAAAAAH0wAAAClVMjU2IHRvIHUxMjggY29udmVyc2lvbiBmYWlsZWQgKG92ZXJmbG93KQAAAAAAABpVMjU2VG9VMTI4Q29udmVyc2lvbkZhaWxlZAAAAAAH1A==",
        "AAAAAQAAAFdQYXJhbWV0ZXJzIHJlcXVpcmVkIHRvIGNvbnN0cnVjdCBhIHRva2VuIFVSSSAoc2VlIG9yaWdpbmFsIFNvbGlkaXR5IGNvZGUgZm9yIHNlbWFudGljcykAAAAAAAAAABdDb25zdHJ1Y3RUb2tlblVSSVBhcmFtcwAAAAAOAAAAAAAAABJiYXNlX3Rva2VuX2FkZHJlc3MAAAAAABMAAAAAAAAAE2Jhc2VfdG9rZW5fZGVjaW1hbHMAAAAABAAAAAAAAAARYmFzZV90b2tlbl9zeW1ib2wAAAAAAAAQAAAAAAAAAANmZWUAAAAABAAAAAAAAAAKZmxpcF9yYXRpbwAAAAAAAQAAAAAAAAAMcG9vbF9hZGRyZXNzAAAAEwAAAAAAAAATcXVvdGVfdG9rZW5fYWRkcmVzcwAAAAATAAAAAAAAABRxdW90ZV90b2tlbl9kZWNpbWFscwAAAAQAAAAAAAAAEnF1b3RlX3Rva2VuX3N5bWJvbAAAAAAAEAAAAAAAAAAMdGlja19jdXJyZW50AAAABQAAAAAAAAAKdGlja19sb3dlcgAAAAAABQAAAAAAAAAMdGlja19zcGFjaW5nAAAABQAAAAAAAAAKdGlja191cHBlcgAAAAAABQAAAAAAAAAIdG9rZW5faWQAAAAG",
        "AAAAAQAAAEJEYXRhIHN0cnVjdHVyZSBmb3Igd2VpZ2h0ZWQgdGljayBhZ2dyZWdhdGlvbiBhY3Jvc3MgbXVsdGlwbGUgcG9vbHMAAAAAAAAAAAAQV2VpZ2h0ZWRUaWNrRGF0YQAAAAIAAAAWVGljayB2YWx1ZSBmcm9tIGEgcG9vbAAAAAAABHRpY2sAAAAFAAAANFdlaWdodCBmb3IgdGhpcyB0aWNrICh0eXBpY2FsbHkgbGlxdWlkaXR5IG9yIHZvbHVtZSkAAAAGd2VpZ2h0AAAAAAAK",
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
    get_factory: this.txFromJSON<string>,
        get_pools_data: this.txFromJSON<Array<PoolData>>,
        get_pools_by_pairs: this.txFromJSON<Array<PoolData>>,
        get_pool_data: this.txFromJSON<PoolData>,
        get_pools_data_with_bal: this.txFromJSON<Array<PoolDataWithBalances>>,
        get_pool_data_with_bal: this.txFromJSON<PoolDataWithBalances>,
        init: this.txFromJSON<null>,
        quote_exact_input_single: this.txFromJSON<Result<i128>>,
        quote_exact_input: this.txFromJSON<Result<i128>>,
        quote_exact_output_single: this.txFromJSON<Result<i128>>,
        quote_exact_output: this.txFromJSON<Result<i128>>,
        init_v2: this.txFromJSON<null>,
        quote_exact_input_v2: this.txFromJSON<Result<QuoteResult>>,
        quote_exact_output_v2: this.txFromJSON<Result<QuoteResult>>,
        quote_exact_input_single_v2: this.txFromJSON<Result<QuoteSingleResult>>,
        quote_exact_output_single_v2: this.txFromJSON<Result<QuoteSingleResult>>,
        get_populated_ticks_in_word: this.txFromJSON<Array<PopulatedTick>>,
        get_populated_ticks_in_range: this.txFromJSON<PopulatedTicksResult>
  }
}