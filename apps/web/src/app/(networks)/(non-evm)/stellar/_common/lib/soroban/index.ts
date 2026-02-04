/**
 * Comprehensive Soroban helpers for Stellar DEX interactions
 *
 * This module provides clean, reusable helper functions for interacting with
 * Stellar/Soroban DEX contracts including Factory, Router, QuoterV2, Pools, and Tokens.
 *
 * All helpers follow consistent patterns and include proper error handling.
 */

// Contract addresses and configurations
export * from './contracts'

// Constants and address utilities
export {
  ZERO_ADDRESS,
  DEFAULT_TIMEOUT,
  MIN_SQRT_RATIO,
  MAX_SQRT_RATIO,
  compareContractAddresses,
  isAddressLower,
  getSqrtPriceLimitForSwap,
} from './constants'

// DEX Factory helpers
export * from './dex-factory-helpers'

// Pool helpers
export * from './pool-helpers'

// Token helpers
export * from './token-helpers'

// XLM helpers
export * from './xlm-helpers'

// Result handling
export * from './handle-result'
