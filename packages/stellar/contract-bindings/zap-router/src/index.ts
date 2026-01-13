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
    contractId: "CCX4AQRO73LLBDCKPGCHTQVFGRYOJUNC6JQRYAL7PJJCY6W5XRCNYD64",
  }
} as const

/**
 * Custom errors for the ZapRouter contract
 */
export const ZapError = {
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
  10: {message:"DeadlineExpired"},
  /**
   * Invalid swap path provided
   */
  11: {message:"InvalidPath"},
  /**
   * Invalid amount (zero or negative)
   */
  12: {message:"InvalidAmount"},
  /**
   * Invalid tick range
   */
  13: {message:"InvalidTickRange"},
  /**
   * Zero amount provided
   */
  14: {message:"ZeroAmount"},
  /**
   * Path too long (exceeds max hops)
   */
  15: {message:"PathTooLong"},
  /**
   * Empty fee vector for required swap
   */
  16: {message:"EmptyFeeVector"},
  /**
   * Not authorized to perform this action
   */
  20: {message:"NotAuthorized"},
  /**
   * Not owner or approved operator of position
   */
  21: {message:"NotOwnerOrApproved"},
  /**
   * Insufficient liquidity minted
   */
  30: {message:"InsufficientLiquidity"},
  /**
   * Insufficient output amount
   */
  31: {message:"InsufficientOutput"},
  /**
   * Excessive price impact
   */
  32: {message:"ExcessivePriceImpact"},
  /**
   * Amount0 below minimum
   */
  33: {message:"Amount0BelowMin"},
  /**
   * Amount1 below minimum
   */
  34: {message:"Amount1BelowMin"},
  /**
   * Slippage tolerance exceeded
   */
  35: {message:"SlippageExceeded"},
  /**
   * Swap operation failed
   */
  40: {message:"SwapFailed"},
  /**
   * Mint operation failed
   */
  41: {message:"MintFailed"},
  /**
   * Collect operation failed
   */
  43: {message:"CollectFailed"},
  /**
   * Token transfer failed
   */
  44: {message:"TransferFailed"},
  /**
   * Math overflow
   */
  50: {message:"MathOverflow"},
  /**
   * Invalid pool state
   */
  51: {message:"InvalidPoolState"},
  /**
   * Pool not found
   */
  52: {message:"PoolNotFound"}
}




/**
 * Storage keys for zap-router specific data
 */
export type DataKey = {tag: "Factory", values: void} | {tag: "XlmAddress", values: void} | {tag: "PositionManager", values: void} | {tag: "SwapRouter", values: void};


/**
 * Mirror of Pool's Slot0 return type for cross-contract decoding
 */
export interface Slot0Return {
  sqrt_price_x96: u256;
  /**
 * Current tick (received from pool but not currently used)
 */
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
 * Pool state returned by get_full_pool_state() (must match dex-pool's PoolState)
 */
export interface PoolState {
  fee: u32;
  liquidity: u128;
  sqrt_price_x96: u256;
  tick: i32;
  tick_spacing: i32;
  token0: string;
  token1: string;
}


/**
 * Result of a swap operation (must match dex-pool's SwapResult)
 */
export interface SwapResult {
  amount0: i128;
  amount1: i128;
  liquidity: u128;
  sqrt_price_x96: u256;
  tick: i32;
}


/**
 * SwapResult for quote operations (mirrors pool's SwapResult)
 */
export interface QuoteSwapResult {
  amount0: i128;
  amount1: i128;
  liquidity: u128;
  sqrt_price_x96: u256;
  tick: i32;
}


/**
 * Parameters for zap in operation
 */
export interface ZapInParams {
  /**
 * Minimum amount of token0 to use in mint
 */
amount0_min: u128;
  /**
 * Minimum amount of token1 to use in mint
 */
amount1_min: u128;
  /**
 * Amount of token_in to zap
 */
amount_in: i128;
  /**
 * Transaction deadline (ledger timestamp)
 */
deadline: u64;
  /**
 * Fee tiers for each hop to token0 (len = path_to_token0.len() - 1)
 */
fees_to_token0: Array<u32>;
  /**
 * Fee tiers for each hop to token1 (len = path_to_token1.len() - 1)
 */
fees_to_token1: Array<u32>;
  /**
 * Minimum liquidity to receive
 */
min_liquidity: u128;
  /**
 * Full path from token_in to token0: [token_in, intermediate..., token0]
 * Empty if token_in == token0 (no swap needed for token0 side)
 */
path_to_token0: Array<string>;
  /**
 * Full path from token_in to token1: [token_in, intermediate..., token1]
 * Empty if token_in == token1 (no swap needed for token1 side)
 */
path_to_token1: Array<string>;
  /**
 * Target liquidity pool address
 */
pool: string;
  /**
 * Address to receive the NFT position
 */
recipient: string;
  /**
 * Address providing the input tokens (must authorize)
 */
sender: string;
  /**
 * Optional client-computed swap amount hint
 * If None: contract calculates optimal split on-chain
 * If Some: contract uses this value (still validates with slippage)
 */
swap_amount_hint: Option<i128>;
  /**
 * Minimum output from swap to token0 (per-swap slippage protection)
 * Set to 0 to skip this check
 */
swap_to_token0_min_out: i128;
  /**
 * Minimum output from swap to token1 (per-swap slippage protection)
 * Set to 0 to skip this check
 */
swap_to_token1_min_out: i128;
  /**
 * Lower tick boundary for position
 */
tick_lower: i32;
  /**
 * Upper tick boundary for position
 */
tick_upper: i32;
  /**
 * Input token address (can be ANY token)
 */
token_in: string;
}


/**
 * Parameters for zap out operation
 */
export interface ZapOutParams {
  /**
 * Minimum amounts from liquidity removal
 */
amount0_min: u128;
  amount1_min: u128;
  /**
 * Minimum final output amount after all swaps
 */
amount_out_min: i128;
  /**
 * Transaction deadline (ledger timestamp)
 */
deadline: u64;
  /**
 * Fee tiers for each hop from token0 (len = path_from_token0.len() - 1)
 */
fees_from_token0: Array<u32>;
  /**
 * Fee tiers for each hop from token1 (len = path_from_token1.len() - 1)
 */
fees_from_token1: Array<u32>;
  /**
 * Amount of liquidity to remove (use position's full liquidity for complete exit)
 */
liquidity: u128;
  /**
 * Full path from token0 to token_out: [token0, intermediate..., token_out]
 * Empty if token_out == token0 (no swap needed)
 */
path_from_token0: Array<string>;
  /**
 * Full path from token1 to token_out: [token1, intermediate..., token_out]
 * Empty if token_out == token1 (no swap needed)
 */
path_from_token1: Array<string>;
  /**
 * Address to receive output tokens
 */
recipient: string;
  /**
 * Position owner or approved operator (must authorize)
 */
sender: string;
  /**
 * NFT position token ID
 */
token_id: u32;
  /**
 * Desired output token (can be ANY token)
 */
token_out: string;
}


/**
 * Result of a zap in operation
 */
export interface ZapInResult {
  /**
 * Amount of token0 used
 */
amount0: u128;
  /**
 * Amount of token1 used
 */
amount1: u128;
  /**
 * Liquidity minted
 */
liquidity: u128;
  /**
 * Amount of token_in refunded as dust
 */
refund_amount: i128;
  /**
 * NFT position token ID
 */
token_id: u32;
}


/**
 * Result of a zap out operation
 */
export interface ZapOutResult {
  /**
 * Amount of token0 from liquidity removal
 */
amount0: u128;
  /**
 * Amount of token1 from liquidity removal
 */
amount1: u128;
  /**
 * Total amount of token_out received
 */
amount_out: i128;
  /**
 * Fees collected (token0)
 */
fees0: u128;
  /**
 * Fees collected (token1)
 */
fees1: u128;
}


/**
 * Parameters for quoting a zap in
 */
export interface QuoteZapInParams {
  /**
 * Amount of token_in
 */
amount_in: i128;
  /**
 * Fees for path to token0
 */
fees_to_token0: Array<u32>;
  /**
 * Fees for path to token1
 */
fees_to_token1: Array<u32>;
  /**
 * Path to token0 (if needed)
 */
path_to_token0: Array<string>;
  /**
 * Path to token1 (if needed)
 */
path_to_token1: Array<string>;
  /**
 * Target pool address
 */
pool: string;
  /**
 * Lower tick
 */
tick_lower: i32;
  /**
 * Upper tick
 */
tick_upper: i32;
  /**
 * Input token address
 */
token_in: string;
}


/**
 * Result of quoting a zap in
 */
export interface QuoteZapInResult {
  /**
 * Estimated amount0 used
 */
amount0: u128;
  /**
 * Estimated amount1 used
 */
amount1: u128;
  /**
 * Estimated liquidity
 */
liquidity: u128;
  /**
 * Estimated refund
 */
refund_amount: i128;
  /**
 * Optimal amount to swap (if token_in is a pool token)
 */
swap_amount: i128;
}


/**
 * Parameters for quoting a zap out
 */
export interface QuoteZapOutParams {
  /**
 * Fees for path from token0
 */
fees_from_token0: Array<u32>;
  /**
 * Fees for path from token1
 */
fees_from_token1: Array<u32>;
  /**
 * Liquidity to remove
 */
liquidity: u128;
  /**
 * Path from token0 (if needed)
 */
path_from_token0: Array<string>;
  /**
 * Path from token1 (if needed)
 */
path_from_token1: Array<string>;
  /**
 * Position token ID
 */
token_id: u32;
  /**
 * Desired output token
 */
token_out: string;
}


/**
 * Result of quoting a zap out
 */
export interface QuoteZapOutResult {
  /**
 * Estimated amount0 from position
 */
amount0: u128;
  /**
 * Estimated amount1 from position
 */
amount1: u128;
  /**
 * Estimated total output amount
 */
amount_out: i128;
  /**
 * Estimated fees0
 */
fees0: u128;
  /**
 * Estimated fees1
 */
fees1: u128;
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
 * Keys under which we'll store the immutable fields (Position Manager)
 */
export type PositionManagerDataKey = {tag: "Factory", values: void} | {tag: "XlmAddress", values: void};

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

/**
 * Q64.96 fixed-point number representing a sqrt price
 * Same as FixedPoint96, used specifically for sqrt price values
 */
export type SqrtPriceX96 = FixedPoint96;


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
   * Construct and simulate a init transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initialize the Zap Router
   * 
   * # Arguments
   * * `factory` - DEX factory address (for pool lookups and token ordering)
   * * `xlm` - Native XLM token address (for gas refunds)
   * * `position_manager` - NonFungiblePositionManager address (for NFT minting)
   * * `swap_router` - SwapRouter address (for ALL swaps - single and multi-hop)
   * 
   * # Note on Router Architecture
   * Zap uses the existing swap-router for ALL swap operations.
   * This means:
   * - swap-router remains the authorized router (no changes needed)
   * - Zap does NOT need to be authorized as a router
   * - No duplication of swap/multi-hop logic
   */
  init: ({factory, xlm, position_manager, swap_router}: {factory: string, xlm: string, position_manager: string, swap_router: string}, options?: {
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
   * Construct and simulate a zap_in transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Zap in with a single token to receive an NFT LP position
   * 
   * # Flow
   * 1. Transfer token_in from sender to zap contract
   * 2. Calculate optimal split (or use hint)
   * 3. Execute swaps to acquire pool tokens
   * 4. Mint NFT position via position manager
   * 5. Refund any dust to sender
   * 
   * # Returns
   * * `token_id` - NFT position ID
   * * `liquidity` - Liquidity minted
   * * `amount0` - Amount of token0 used
   * * `amount1` - Amount of token1 used
   */
  zap_in: ({params}: {params: ZapInParams}, options?: {
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
  }) => Promise<AssembledTransaction<Result<ZapInResult>>>

  /**
   * Construct and simulate a zap_out transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Zap out from an NFT LP position to a single token
   * 
   * # Flow
   * 1. Decrease liquidity on position
   * 2. Collect tokens + accrued fees
   * 3. Swap all to desired output token
   * 4. Transfer to recipient
   * 
   * # Note
   * NFT burning is NOT supported via zap_out. To burn an NFT after a full exit,
   * call `position_manager.burn(token_id)` directly.
   * 
   * # Returns
   * * `amount_out` - Total amount of token_out received
   */
  zap_out: ({params}: {params: ZapOutParams}, options?: {
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
  }) => Promise<AssembledTransaction<Result<ZapOutResult>>>

  /**
   * Construct and simulate a quote_zap_in transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Quote a zap in operation (no state changes)
   * 
   * # Returns
   * Estimated liquidity, amounts, and optimal swap split
   */
  quote_zap_in: ({params}: {params: QuoteZapInParams}, options?: {
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
  }) => Promise<AssembledTransaction<Result<QuoteZapInResult>>>

  /**
   * Construct and simulate a quote_zap_out transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Quote a zap out operation (no state changes)
   * 
   * # Returns
   * Estimated output amount after swaps
   */
  quote_zap_out: ({params}: {params: QuoteZapOutParams}, options?: {
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
  }) => Promise<AssembledTransaction<Result<QuoteZapOutResult>>>

  /**
   * Construct and simulate a get_factory transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get the factory address
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
  }) => Promise<AssembledTransaction<Result<string>>>

  /**
   * Construct and simulate a get_xlm_address transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get the XLM address
   */
  get_xlm_address: (options?: {
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
   * Construct and simulate a get_position_manager transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get the position manager address
   */
  get_position_manager: (options?: {
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
   * Construct and simulate a get_swap_router transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get the swap router address
   */
  get_swap_router: (options?: {
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
   * Construct and simulate a is_initialized transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Check if the contract is initialized
   */
  is_initialized: (options?: {
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
  }) => Promise<AssembledTransaction<boolean>>

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
      new ContractSpec([ "AAAABAAAAChDdXN0b20gZXJyb3JzIGZvciB0aGUgWmFwUm91dGVyIGNvbnRyYWN0AAAAAAAAAAhaYXBFcnJvcgAAABgAAAAjUm91dGVyIGhhcyBhbHJlYWR5IGJlZW4gaW5pdGlhbGl6ZWQAAAAAEkFscmVhZHlJbml0aWFsaXplZAAAAAAAAQAAAB9Sb3V0ZXIgaGFzIG5vdCBiZWVuIGluaXRpYWxpemVkAAAAAA5Ob3RJbml0aWFsaXplZAAAAAAAAgAAAB9UcmFuc2FjdGlvbiBkZWFkbGluZSBoYXMgcGFzc2VkAAAAAA9EZWFkbGluZUV4cGlyZWQAAAAACgAAABpJbnZhbGlkIHN3YXAgcGF0aCBwcm92aWRlZAAAAAAAC0ludmFsaWRQYXRoAAAAAAsAAAAhSW52YWxpZCBhbW91bnQgKHplcm8gb3IgbmVnYXRpdmUpAAAAAAAADUludmFsaWRBbW91bnQAAAAAAAAMAAAAEkludmFsaWQgdGljayByYW5nZQAAAAAAEEludmFsaWRUaWNrUmFuZ2UAAAANAAAAFFplcm8gYW1vdW50IHByb3ZpZGVkAAAAClplcm9BbW91bnQAAAAAAA4AAAAgUGF0aCB0b28gbG9uZyAoZXhjZWVkcyBtYXggaG9wcykAAAALUGF0aFRvb0xvbmcAAAAADwAAACJFbXB0eSBmZWUgdmVjdG9yIGZvciByZXF1aXJlZCBzd2FwAAAAAAAORW1wdHlGZWVWZWN0b3IAAAAAABAAAAAlTm90IGF1dGhvcml6ZWQgdG8gcGVyZm9ybSB0aGlzIGFjdGlvbgAAAAAAAA1Ob3RBdXRob3JpemVkAAAAAAAAFAAAACpOb3Qgb3duZXIgb3IgYXBwcm92ZWQgb3BlcmF0b3Igb2YgcG9zaXRpb24AAAAAABJOb3RPd25lck9yQXBwcm92ZWQAAAAAABUAAAAdSW5zdWZmaWNpZW50IGxpcXVpZGl0eSBtaW50ZWQAAAAAAAAVSW5zdWZmaWNpZW50TGlxdWlkaXR5AAAAAAAAHgAAABpJbnN1ZmZpY2llbnQgb3V0cHV0IGFtb3VudAAAAAAAEkluc3VmZmljaWVudE91dHB1dAAAAAAAHwAAABZFeGNlc3NpdmUgcHJpY2UgaW1wYWN0AAAAAAAURXhjZXNzaXZlUHJpY2VJbXBhY3QAAAAgAAAAFUFtb3VudDAgYmVsb3cgbWluaW11bQAAAAAAAA9BbW91bnQwQmVsb3dNaW4AAAAAIQAAABVBbW91bnQxIGJlbG93IG1pbmltdW0AAAAAAAAPQW1vdW50MUJlbG93TWluAAAAACIAAAAbU2xpcHBhZ2UgdG9sZXJhbmNlIGV4Y2VlZGVkAAAAABBTbGlwcGFnZUV4Y2VlZGVkAAAAIwAAABVTd2FwIG9wZXJhdGlvbiBmYWlsZWQAAAAAAAAKU3dhcEZhaWxlZAAAAAAAKAAAABVNaW50IG9wZXJhdGlvbiBmYWlsZWQAAAAAAAAKTWludEZhaWxlZAAAAAAAKQAAABhDb2xsZWN0IG9wZXJhdGlvbiBmYWlsZWQAAAANQ29sbGVjdEZhaWxlZAAAAAAAACsAAAAVVG9rZW4gdHJhbnNmZXIgZmFpbGVkAAAAAAAADlRyYW5zZmVyRmFpbGVkAAAAAAAsAAAADU1hdGggb3ZlcmZsb3cAAAAAAAAMTWF0aE92ZXJmbG93AAAAMgAAABJJbnZhbGlkIHBvb2wgc3RhdGUAAAAAABBJbnZhbGlkUG9vbFN0YXRlAAAAMwAAAA5Qb29sIG5vdCBmb3VuZAAAAAAADFBvb2xOb3RGb3VuZAAAADQ=",
        "AAAABQAAAB9aYXAgcm91dGVyIGluaXRpYWxpemF0aW9uIGV2ZW50AAAAAAAAAAATWmFwSW5pdGlhbGl6ZWRFdmVudAAAAAABAAAAFXphcF9pbml0aWFsaXplZF9ldmVudAAAAAAAAAMAAAAAAAAAB2ZhY3RvcnkAAAAAEwAAAAAAAAAAAAAAEHBvc2l0aW9uX21hbmFnZXIAAAATAAAAAAAAAAAAAAALc3dhcF9yb3V0ZXIAAAAAEwAAAAAAAAAC",
        "AAAABQAAABZaYXAgaW4gY29tcGxldGVkIGV2ZW50AAAAAAAAAAAAClphcEluRXZlbnQAAAAAAAEAAAAMemFwX2luX2V2ZW50AAAACQAAAAAAAAAGc2VuZGVyAAAAAAATAAAAAAAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEwAAAAAAAAAAAAAACHRva2VuX2lkAAAABAAAAAAAAAAAAAAACHRva2VuX2luAAAAEwAAAAAAAAAAAAAACWFtb3VudF9pbgAAAAAAAAsAAAAAAAAAAAAAAAlsaXF1aWRpdHkAAAAAAAAKAAAAAAAAAAAAAAAHYW1vdW50MAAAAAAKAAAAAAAAAAAAAAAHYW1vdW50MQAAAAAKAAAAAAAAAAAAAAAGcmVmdW5kAAAAAAALAAAAAAAAAAI=",
        "AAAABQAAABdaYXAgb3V0IGNvbXBsZXRlZCBldmVudAAAAAAAAAAAC1phcE91dEV2ZW50AAAAAAEAAAANemFwX291dF9ldmVudAAAAAAAAAkAAAAAAAAABnNlbmRlcgAAAAAAEwAAAAAAAAAAAAAACXJlY2lwaWVudAAAAAAAABMAAAAAAAAAAAAAAAh0b2tlbl9pZAAAAAQAAAAAAAAAAAAAAAl0b2tlbl9vdXQAAAAAAAATAAAAAAAAAAAAAAAKYW1vdW50X291dAAAAAAACwAAAAAAAAAAAAAAB2Ftb3VudDAAAAAACgAAAAAAAAAAAAAAB2Ftb3VudDEAAAAACgAAAAAAAAAAAAAABWZlZXMwAAAAAAAACgAAAAAAAAAAAAAABWZlZXMxAAAAAAAACgAAAAAAAAAC",
        "AAAAAgAAAClTdG9yYWdlIGtleXMgZm9yIHphcC1yb3V0ZXIgc3BlY2lmaWMgZGF0YQAAAAAAAAAAAAAHRGF0YUtleQAAAAAEAAAAAAAAAAAAAAAHRmFjdG9yeQAAAAAAAAAAAAAAAApYbG1BZGRyZXNzAAAAAAAAAAAAAAAAAA9Qb3NpdGlvbk1hbmFnZXIAAAAAAAAAAAAAAAAKU3dhcFJvdXRlcgAA",
        "AAAAAQAAAD5NaXJyb3Igb2YgUG9vbCdzIFNsb3QwIHJldHVybiB0eXBlIGZvciBjcm9zcy1jb250cmFjdCBkZWNvZGluZwAAAAAAAAAAAAtTbG90MFJldHVybgAAAAACAAAAAAAAAA5zcXJ0X3ByaWNlX3g5NgAAAAAADAAAADhDdXJyZW50IHRpY2sgKHJlY2VpdmVkIGZyb20gcG9vbCBidXQgbm90IGN1cnJlbnRseSB1c2VkKQAAAAR0aWNrAAAABQ==",
        "AAAAAQAAAEhPcmFjbGUgaGludHMgZm9yIGRldGVybWluaXN0aWMgZm9vdHByaW50IChtdXN0IG1hdGNoIHBvb2wncyBPcmFjbGVIaW50cykAAAAAAAAAC09yYWNsZUhpbnRzAAAAAAIAAAAAAAAACmNoZWNrcG9pbnQAAAAAAAQAAAAAAAAABHNsb3QAAAAK",
        "AAAAAQAAAE5Qb29sIHN0YXRlIHJldHVybmVkIGJ5IGdldF9mdWxsX3Bvb2xfc3RhdGUoKSAobXVzdCBtYXRjaCBkZXgtcG9vbCdzIFBvb2xTdGF0ZSkAAAAAAAAAAAAJUG9vbFN0YXRlAAAAAAAABwAAAAAAAAADZmVlAAAAAAQAAAAAAAAACWxpcXVpZGl0eQAAAAAAAAoAAAAAAAAADnNxcnRfcHJpY2VfeDk2AAAAAAAMAAAAAAAAAAR0aWNrAAAABQAAAAAAAAAMdGlja19zcGFjaW5nAAAABQAAAAAAAAAGdG9rZW4wAAAAAAATAAAAAAAAAAZ0b2tlbjEAAAAAABM=",
        "AAAAAQAAAD1SZXN1bHQgb2YgYSBzd2FwIG9wZXJhdGlvbiAobXVzdCBtYXRjaCBkZXgtcG9vbCdzIFN3YXBSZXN1bHQpAAAAAAAAAAAAAApTd2FwUmVzdWx0AAAAAAAFAAAAAAAAAAdhbW91bnQwAAAAAAsAAAAAAAAAB2Ftb3VudDEAAAAACwAAAAAAAAAJbGlxdWlkaXR5AAAAAAAACgAAAAAAAAAOc3FydF9wcmljZV94OTYAAAAAAAwAAAAAAAAABHRpY2sAAAAF",
        "AAAAAQAAADtTd2FwUmVzdWx0IGZvciBxdW90ZSBvcGVyYXRpb25zIChtaXJyb3JzIHBvb2wncyBTd2FwUmVzdWx0KQAAAAAAAAAAD1F1b3RlU3dhcFJlc3VsdAAAAAAFAAAAAAAAAAdhbW91bnQwAAAAAAsAAAAAAAAAB2Ftb3VudDEAAAAACwAAAAAAAAAJbGlxdWlkaXR5AAAAAAAACgAAAAAAAAAOc3FydF9wcmljZV94OTYAAAAAAAwAAAAAAAAABHRpY2sAAAAF",
        "AAAAAQAAAB9QYXJhbWV0ZXJzIGZvciB6YXAgaW4gb3BlcmF0aW9uAAAAAAAAAAALWmFwSW5QYXJhbXMAAAAAEgAAACdNaW5pbXVtIGFtb3VudCBvZiB0b2tlbjAgdG8gdXNlIGluIG1pbnQAAAAAC2Ftb3VudDBfbWluAAAAAAoAAAAnTWluaW11bSBhbW91bnQgb2YgdG9rZW4xIHRvIHVzZSBpbiBtaW50AAAAAAthbW91bnQxX21pbgAAAAAKAAAAGUFtb3VudCBvZiB0b2tlbl9pbiB0byB6YXAAAAAAAAAJYW1vdW50X2luAAAAAAAACwAAACdUcmFuc2FjdGlvbiBkZWFkbGluZSAobGVkZ2VyIHRpbWVzdGFtcCkAAAAACGRlYWRsaW5lAAAABgAAAEFGZWUgdGllcnMgZm9yIGVhY2ggaG9wIHRvIHRva2VuMCAobGVuID0gcGF0aF90b190b2tlbjAubGVuKCkgLSAxKQAAAAAAAA5mZWVzX3RvX3Rva2VuMAAAAAAD6gAAAAQAAABBRmVlIHRpZXJzIGZvciBlYWNoIGhvcCB0byB0b2tlbjEgKGxlbiA9IHBhdGhfdG9fdG9rZW4xLmxlbigpIC0gMSkAAAAAAAAOZmVlc190b190b2tlbjEAAAAAA+oAAAAEAAAAHE1pbmltdW0gbGlxdWlkaXR5IHRvIHJlY2VpdmUAAAANbWluX2xpcXVpZGl0eQAAAAAAAAoAAACDRnVsbCBwYXRoIGZyb20gdG9rZW5faW4gdG8gdG9rZW4wOiBbdG9rZW5faW4sIGludGVybWVkaWF0ZS4uLiwgdG9rZW4wXQpFbXB0eSBpZiB0b2tlbl9pbiA9PSB0b2tlbjAgKG5vIHN3YXAgbmVlZGVkIGZvciB0b2tlbjAgc2lkZSkAAAAADnBhdGhfdG9fdG9rZW4wAAAAAAPqAAAAEwAAAINGdWxsIHBhdGggZnJvbSB0b2tlbl9pbiB0byB0b2tlbjE6IFt0b2tlbl9pbiwgaW50ZXJtZWRpYXRlLi4uLCB0b2tlbjFdCkVtcHR5IGlmIHRva2VuX2luID09IHRva2VuMSAobm8gc3dhcCBuZWVkZWQgZm9yIHRva2VuMSBzaWRlKQAAAAAOcGF0aF90b190b2tlbjEAAAAAA+oAAAATAAAAHVRhcmdldCBsaXF1aWRpdHkgcG9vbCBhZGRyZXNzAAAAAAAABHBvb2wAAAATAAAAI0FkZHJlc3MgdG8gcmVjZWl2ZSB0aGUgTkZUIHBvc2l0aW9uAAAAAAlyZWNpcGllbnQAAAAAAAATAAAAM0FkZHJlc3MgcHJvdmlkaW5nIHRoZSBpbnB1dCB0b2tlbnMgKG11c3QgYXV0aG9yaXplKQAAAAAGc2VuZGVyAAAAAAATAAAAn09wdGlvbmFsIGNsaWVudC1jb21wdXRlZCBzd2FwIGFtb3VudCBoaW50CklmIE5vbmU6IGNvbnRyYWN0IGNhbGN1bGF0ZXMgb3B0aW1hbCBzcGxpdCBvbi1jaGFpbgpJZiBTb21lOiBjb250cmFjdCB1c2VzIHRoaXMgdmFsdWUgKHN0aWxsIHZhbGlkYXRlcyB3aXRoIHNsaXBwYWdlKQAAAAAQc3dhcF9hbW91bnRfaGludAAAA+gAAAALAAAAXU1pbmltdW0gb3V0cHV0IGZyb20gc3dhcCB0byB0b2tlbjAgKHBlci1zd2FwIHNsaXBwYWdlIHByb3RlY3Rpb24pClNldCB0byAwIHRvIHNraXAgdGhpcyBjaGVjawAAAAAAABZzd2FwX3RvX3Rva2VuMF9taW5fb3V0AAAAAAALAAAAXU1pbmltdW0gb3V0cHV0IGZyb20gc3dhcCB0byB0b2tlbjEgKHBlci1zd2FwIHNsaXBwYWdlIHByb3RlY3Rpb24pClNldCB0byAwIHRvIHNraXAgdGhpcyBjaGVjawAAAAAAABZzd2FwX3RvX3Rva2VuMV9taW5fb3V0AAAAAAALAAAAIExvd2VyIHRpY2sgYm91bmRhcnkgZm9yIHBvc2l0aW9uAAAACnRpY2tfbG93ZXIAAAAAAAUAAAAgVXBwZXIgdGljayBib3VuZGFyeSBmb3IgcG9zaXRpb24AAAAKdGlja191cHBlcgAAAAAABQAAACZJbnB1dCB0b2tlbiBhZGRyZXNzIChjYW4gYmUgQU5ZIHRva2VuKQAAAAAACHRva2VuX2luAAAAEw==",
        "AAAAAQAAACBQYXJhbWV0ZXJzIGZvciB6YXAgb3V0IG9wZXJhdGlvbgAAAAAAAAAMWmFwT3V0UGFyYW1zAAAADQAAACZNaW5pbXVtIGFtb3VudHMgZnJvbSBsaXF1aWRpdHkgcmVtb3ZhbAAAAAAAC2Ftb3VudDBfbWluAAAAAAoAAAAAAAAAC2Ftb3VudDFfbWluAAAAAAoAAAArTWluaW11bSBmaW5hbCBvdXRwdXQgYW1vdW50IGFmdGVyIGFsbCBzd2FwcwAAAAAOYW1vdW50X291dF9taW4AAAAAAAsAAAAnVHJhbnNhY3Rpb24gZGVhZGxpbmUgKGxlZGdlciB0aW1lc3RhbXApAAAAAAhkZWFkbGluZQAAAAYAAABFRmVlIHRpZXJzIGZvciBlYWNoIGhvcCBmcm9tIHRva2VuMCAobGVuID0gcGF0aF9mcm9tX3Rva2VuMC5sZW4oKSAtIDEpAAAAAAAAEGZlZXNfZnJvbV90b2tlbjAAAAPqAAAABAAAAEVGZWUgdGllcnMgZm9yIGVhY2ggaG9wIGZyb20gdG9rZW4xIChsZW4gPSBwYXRoX2Zyb21fdG9rZW4xLmxlbigpIC0gMSkAAAAAAAAQZmVlc19mcm9tX3Rva2VuMQAAA+oAAAAEAAAAT0Ftb3VudCBvZiBsaXF1aWRpdHkgdG8gcmVtb3ZlICh1c2UgcG9zaXRpb24ncyBmdWxsIGxpcXVpZGl0eSBmb3IgY29tcGxldGUgZXhpdCkAAAAACWxpcXVpZGl0eQAAAAAAAAoAAAB2RnVsbCBwYXRoIGZyb20gdG9rZW4wIHRvIHRva2VuX291dDogW3Rva2VuMCwgaW50ZXJtZWRpYXRlLi4uLCB0b2tlbl9vdXRdCkVtcHR5IGlmIHRva2VuX291dCA9PSB0b2tlbjAgKG5vIHN3YXAgbmVlZGVkKQAAAAAAEHBhdGhfZnJvbV90b2tlbjAAAAPqAAAAEwAAAHZGdWxsIHBhdGggZnJvbSB0b2tlbjEgdG8gdG9rZW5fb3V0OiBbdG9rZW4xLCBpbnRlcm1lZGlhdGUuLi4sIHRva2VuX291dF0KRW1wdHkgaWYgdG9rZW5fb3V0ID09IHRva2VuMSAobm8gc3dhcCBuZWVkZWQpAAAAAAAQcGF0aF9mcm9tX3Rva2VuMQAAA+oAAAATAAAAIEFkZHJlc3MgdG8gcmVjZWl2ZSBvdXRwdXQgdG9rZW5zAAAACXJlY2lwaWVudAAAAAAAABMAAAA0UG9zaXRpb24gb3duZXIgb3IgYXBwcm92ZWQgb3BlcmF0b3IgKG11c3QgYXV0aG9yaXplKQAAAAZzZW5kZXIAAAAAABMAAAAVTkZUIHBvc2l0aW9uIHRva2VuIElEAAAAAAAACHRva2VuX2lkAAAABAAAACdEZXNpcmVkIG91dHB1dCB0b2tlbiAoY2FuIGJlIEFOWSB0b2tlbikAAAAACXRva2VuX291dAAAAAAAABM=",
        "AAAAAQAAABxSZXN1bHQgb2YgYSB6YXAgaW4gb3BlcmF0aW9uAAAAAAAAAAtaYXBJblJlc3VsdAAAAAAFAAAAFUFtb3VudCBvZiB0b2tlbjAgdXNlZAAAAAAAAAdhbW91bnQwAAAAAAoAAAAVQW1vdW50IG9mIHRva2VuMSB1c2VkAAAAAAAAB2Ftb3VudDEAAAAACgAAABBMaXF1aWRpdHkgbWludGVkAAAACWxpcXVpZGl0eQAAAAAAAAoAAAAjQW1vdW50IG9mIHRva2VuX2luIHJlZnVuZGVkIGFzIGR1c3QAAAAADXJlZnVuZF9hbW91bnQAAAAAAAALAAAAFU5GVCBwb3NpdGlvbiB0b2tlbiBJRAAAAAAAAAh0b2tlbl9pZAAAAAQ=",
        "AAAAAQAAAB1SZXN1bHQgb2YgYSB6YXAgb3V0IG9wZXJhdGlvbgAAAAAAAAAAAAAMWmFwT3V0UmVzdWx0AAAABQAAACdBbW91bnQgb2YgdG9rZW4wIGZyb20gbGlxdWlkaXR5IHJlbW92YWwAAAAAB2Ftb3VudDAAAAAACgAAACdBbW91bnQgb2YgdG9rZW4xIGZyb20gbGlxdWlkaXR5IHJlbW92YWwAAAAAB2Ftb3VudDEAAAAACgAAACJUb3RhbCBhbW91bnQgb2YgdG9rZW5fb3V0IHJlY2VpdmVkAAAAAAAKYW1vdW50X291dAAAAAAACwAAABdGZWVzIGNvbGxlY3RlZCAodG9rZW4wKQAAAAAFZmVlczAAAAAAAAAKAAAAF0ZlZXMgY29sbGVjdGVkICh0b2tlbjEpAAAAAAVmZWVzMQAAAAAAAAo=",
        "AAAAAQAAAB9QYXJhbWV0ZXJzIGZvciBxdW90aW5nIGEgemFwIGluAAAAAAAAAAAQUXVvdGVaYXBJblBhcmFtcwAAAAkAAAASQW1vdW50IG9mIHRva2VuX2luAAAAAAAJYW1vdW50X2luAAAAAAAACwAAABdGZWVzIGZvciBwYXRoIHRvIHRva2VuMAAAAAAOZmVlc190b190b2tlbjAAAAAAA+oAAAAEAAAAF0ZlZXMgZm9yIHBhdGggdG8gdG9rZW4xAAAAAA5mZWVzX3RvX3Rva2VuMQAAAAAD6gAAAAQAAAAaUGF0aCB0byB0b2tlbjAgKGlmIG5lZWRlZCkAAAAAAA5wYXRoX3RvX3Rva2VuMAAAAAAD6gAAABMAAAAaUGF0aCB0byB0b2tlbjEgKGlmIG5lZWRlZCkAAAAAAA5wYXRoX3RvX3Rva2VuMQAAAAAD6gAAABMAAAATVGFyZ2V0IHBvb2wgYWRkcmVzcwAAAAAEcG9vbAAAABMAAAAKTG93ZXIgdGljawAAAAAACnRpY2tfbG93ZXIAAAAAAAUAAAAKVXBwZXIgdGljawAAAAAACnRpY2tfdXBwZXIAAAAAAAUAAAATSW5wdXQgdG9rZW4gYWRkcmVzcwAAAAAIdG9rZW5faW4AAAAT",
        "AAAAAQAAABpSZXN1bHQgb2YgcXVvdGluZyBhIHphcCBpbgAAAAAAAAAAABBRdW90ZVphcEluUmVzdWx0AAAABQAAABZFc3RpbWF0ZWQgYW1vdW50MCB1c2VkAAAAAAAHYW1vdW50MAAAAAAKAAAAFkVzdGltYXRlZCBhbW91bnQxIHVzZWQAAAAAAAdhbW91bnQxAAAAAAoAAAATRXN0aW1hdGVkIGxpcXVpZGl0eQAAAAAJbGlxdWlkaXR5AAAAAAAACgAAABBFc3RpbWF0ZWQgcmVmdW5kAAAADXJlZnVuZF9hbW91bnQAAAAAAAALAAAANE9wdGltYWwgYW1vdW50IHRvIHN3YXAgKGlmIHRva2VuX2luIGlzIGEgcG9vbCB0b2tlbikAAAALc3dhcF9hbW91bnQAAAAACw==",
        "AAAAAQAAACBQYXJhbWV0ZXJzIGZvciBxdW90aW5nIGEgemFwIG91dAAAAAAAAAARUXVvdGVaYXBPdXRQYXJhbXMAAAAAAAAHAAAAGUZlZXMgZm9yIHBhdGggZnJvbSB0b2tlbjAAAAAAAAAQZmVlc19mcm9tX3Rva2VuMAAAA+oAAAAEAAAAGUZlZXMgZm9yIHBhdGggZnJvbSB0b2tlbjEAAAAAAAAQZmVlc19mcm9tX3Rva2VuMQAAA+oAAAAEAAAAE0xpcXVpZGl0eSB0byByZW1vdmUAAAAACWxpcXVpZGl0eQAAAAAAAAoAAAAcUGF0aCBmcm9tIHRva2VuMCAoaWYgbmVlZGVkKQAAABBwYXRoX2Zyb21fdG9rZW4wAAAD6gAAABMAAAAcUGF0aCBmcm9tIHRva2VuMSAoaWYgbmVlZGVkKQAAABBwYXRoX2Zyb21fdG9rZW4xAAAD6gAAABMAAAARUG9zaXRpb24gdG9rZW4gSUQAAAAAAAAIdG9rZW5faWQAAAAEAAAAFERlc2lyZWQgb3V0cHV0IHRva2VuAAAACXRva2VuX291dAAAAAAAABM=",
        "AAAAAQAAABtSZXN1bHQgb2YgcXVvdGluZyBhIHphcCBvdXQAAAAAAAAAABFRdW90ZVphcE91dFJlc3VsdAAAAAAAAAUAAAAfRXN0aW1hdGVkIGFtb3VudDAgZnJvbSBwb3NpdGlvbgAAAAAHYW1vdW50MAAAAAAKAAAAH0VzdGltYXRlZCBhbW91bnQxIGZyb20gcG9zaXRpb24AAAAAB2Ftb3VudDEAAAAACgAAAB1Fc3RpbWF0ZWQgdG90YWwgb3V0cHV0IGFtb3VudAAAAAAAAAphbW91bnRfb3V0AAAAAAALAAAAD0VzdGltYXRlZCBmZWVzMAAAAAAFZmVlczAAAAAAAAAKAAAAD0VzdGltYXRlZCBmZWVzMQAAAAAFZmVlczEAAAAAAAAK",
        "AAAAAAAAAjtJbml0aWFsaXplIHRoZSBaYXAgUm91dGVyCgojIEFyZ3VtZW50cwoqIGBmYWN0b3J5YCAtIERFWCBmYWN0b3J5IGFkZHJlc3MgKGZvciBwb29sIGxvb2t1cHMgYW5kIHRva2VuIG9yZGVyaW5nKQoqIGB4bG1gIC0gTmF0aXZlIFhMTSB0b2tlbiBhZGRyZXNzIChmb3IgZ2FzIHJlZnVuZHMpCiogYHBvc2l0aW9uX21hbmFnZXJgIC0gTm9uRnVuZ2libGVQb3NpdGlvbk1hbmFnZXIgYWRkcmVzcyAoZm9yIE5GVCBtaW50aW5nKQoqIGBzd2FwX3JvdXRlcmAgLSBTd2FwUm91dGVyIGFkZHJlc3MgKGZvciBBTEwgc3dhcHMgLSBzaW5nbGUgYW5kIG11bHRpLWhvcCkKCiMgTm90ZSBvbiBSb3V0ZXIgQXJjaGl0ZWN0dXJlClphcCB1c2VzIHRoZSBleGlzdGluZyBzd2FwLXJvdXRlciBmb3IgQUxMIHN3YXAgb3BlcmF0aW9ucy4KVGhpcyBtZWFuczoKLSBzd2FwLXJvdXRlciByZW1haW5zIHRoZSBhdXRob3JpemVkIHJvdXRlciAobm8gY2hhbmdlcyBuZWVkZWQpCi0gWmFwIGRvZXMgTk9UIG5lZWQgdG8gYmUgYXV0aG9yaXplZCBhcyBhIHJvdXRlcgotIE5vIGR1cGxpY2F0aW9uIG9mIHN3YXAvbXVsdGktaG9wIGxvZ2ljAAAAAARpbml0AAAABAAAAAAAAAAHZmFjdG9yeQAAAAATAAAAAAAAAAN4bG0AAAAAEwAAAAAAAAAQcG9zaXRpb25fbWFuYWdlcgAAABMAAAAAAAAAC3N3YXBfcm91dGVyAAAAABMAAAABAAAD6QAAA+0AAAAAAAAH0AAAAAhaYXBFcnJvcg==",
        "AAAAAAAAAZxaYXAgaW4gd2l0aCBhIHNpbmdsZSB0b2tlbiB0byByZWNlaXZlIGFuIE5GVCBMUCBwb3NpdGlvbgoKIyBGbG93CjEuIFRyYW5zZmVyIHRva2VuX2luIGZyb20gc2VuZGVyIHRvIHphcCBjb250cmFjdAoyLiBDYWxjdWxhdGUgb3B0aW1hbCBzcGxpdCAob3IgdXNlIGhpbnQpCjMuIEV4ZWN1dGUgc3dhcHMgdG8gYWNxdWlyZSBwb29sIHRva2Vucwo0LiBNaW50IE5GVCBwb3NpdGlvbiB2aWEgcG9zaXRpb24gbWFuYWdlcgo1LiBSZWZ1bmQgYW55IGR1c3QgdG8gc2VuZGVyCgojIFJldHVybnMKKiBgdG9rZW5faWRgIC0gTkZUIHBvc2l0aW9uIElECiogYGxpcXVpZGl0eWAgLSBMaXF1aWRpdHkgbWludGVkCiogYGFtb3VudDBgIC0gQW1vdW50IG9mIHRva2VuMCB1c2VkCiogYGFtb3VudDFgIC0gQW1vdW50IG9mIHRva2VuMSB1c2VkAAAABnphcF9pbgAAAAAAAQAAAAAAAAAGcGFyYW1zAAAAAAfQAAAAC1phcEluUGFyYW1zAAAAAAEAAAPpAAAH0AAAAAtaYXBJblJlc3VsdAAAAAfQAAAACFphcEVycm9y",
        "AAAAAAAAAX1aYXAgb3V0IGZyb20gYW4gTkZUIExQIHBvc2l0aW9uIHRvIGEgc2luZ2xlIHRva2VuCgojIEZsb3cKMS4gRGVjcmVhc2UgbGlxdWlkaXR5IG9uIHBvc2l0aW9uCjIuIENvbGxlY3QgdG9rZW5zICsgYWNjcnVlZCBmZWVzCjMuIFN3YXAgYWxsIHRvIGRlc2lyZWQgb3V0cHV0IHRva2VuCjQuIFRyYW5zZmVyIHRvIHJlY2lwaWVudAoKIyBOb3RlCk5GVCBidXJuaW5nIGlzIE5PVCBzdXBwb3J0ZWQgdmlhIHphcF9vdXQuIFRvIGJ1cm4gYW4gTkZUIGFmdGVyIGEgZnVsbCBleGl0LApjYWxsIGBwb3NpdGlvbl9tYW5hZ2VyLmJ1cm4odG9rZW5faWQpYCBkaXJlY3RseS4KCiMgUmV0dXJucwoqIGBhbW91bnRfb3V0YCAtIFRvdGFsIGFtb3VudCBvZiB0b2tlbl9vdXQgcmVjZWl2ZWQAAAAAAAAHemFwX291dAAAAAABAAAAAAAAAAZwYXJhbXMAAAAAB9AAAAAMWmFwT3V0UGFyYW1zAAAAAQAAA+kAAAfQAAAADFphcE91dFJlc3VsdAAAB9AAAAAIWmFwRXJyb3I=",
        "AAAAAAAAAGtRdW90ZSBhIHphcCBpbiBvcGVyYXRpb24gKG5vIHN0YXRlIGNoYW5nZXMpCgojIFJldHVybnMKRXN0aW1hdGVkIGxpcXVpZGl0eSwgYW1vdW50cywgYW5kIG9wdGltYWwgc3dhcCBzcGxpdAAAAAAMcXVvdGVfemFwX2luAAAAAQAAAAAAAAAGcGFyYW1zAAAAAAfQAAAAEFF1b3RlWmFwSW5QYXJhbXMAAAABAAAD6QAAB9AAAAAQUXVvdGVaYXBJblJlc3VsdAAAB9AAAAAIWmFwRXJyb3I=",
        "AAAAAAAAAFtRdW90ZSBhIHphcCBvdXQgb3BlcmF0aW9uIChubyBzdGF0ZSBjaGFuZ2VzKQoKIyBSZXR1cm5zCkVzdGltYXRlZCBvdXRwdXQgYW1vdW50IGFmdGVyIHN3YXBzAAAAAA1xdW90ZV96YXBfb3V0AAAAAAAAAQAAAAAAAAAGcGFyYW1zAAAAAAfQAAAAEVF1b3RlWmFwT3V0UGFyYW1zAAAAAAAAAQAAA+kAAAfQAAAAEVF1b3RlWmFwT3V0UmVzdWx0AAAAAAAH0AAAAAhaYXBFcnJvcg==",
        "AAAAAAAAABdHZXQgdGhlIGZhY3RvcnkgYWRkcmVzcwAAAAALZ2V0X2ZhY3RvcnkAAAAAAAAAAAEAAAPpAAAAEwAAB9AAAAAIWmFwRXJyb3I=",
        "AAAAAAAAABNHZXQgdGhlIFhMTSBhZGRyZXNzAAAAAA9nZXRfeGxtX2FkZHJlc3MAAAAAAAAAAAEAAAPpAAAAEwAAB9AAAAAIWmFwRXJyb3I=",
        "AAAAAAAAACBHZXQgdGhlIHBvc2l0aW9uIG1hbmFnZXIgYWRkcmVzcwAAABRnZXRfcG9zaXRpb25fbWFuYWdlcgAAAAAAAAABAAAD6QAAABMAAAfQAAAACFphcEVycm9y",
        "AAAAAAAAABtHZXQgdGhlIHN3YXAgcm91dGVyIGFkZHJlc3MAAAAAD2dldF9zd2FwX3JvdXRlcgAAAAAAAAAAAQAAA+kAAAATAAAH0AAAAAhaYXBFcnJvcg==",
        "AAAAAAAAACRDaGVjayBpZiB0aGUgY29udHJhY3QgaXMgaW5pdGlhbGl6ZWQAAAAOaXNfaW5pdGlhbGl6ZWQAAAAAAAAAAAABAAAAAQ==",
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
    init: this.txFromJSON<Result<void>>,
        zap_in: this.txFromJSON<Result<ZapInResult>>,
        zap_out: this.txFromJSON<Result<ZapOutResult>>,
        quote_zap_in: this.txFromJSON<Result<QuoteZapInResult>>,
        quote_zap_out: this.txFromJSON<Result<QuoteZapOutResult>>,
        get_factory: this.txFromJSON<Result<string>>,
        get_xlm_address: this.txFromJSON<Result<string>>,
        get_position_manager: this.txFromJSON<Result<string>>,
        get_swap_router: this.txFromJSON<Result<string>>,
        is_initialized: this.txFromJSON<boolean>
  }
}