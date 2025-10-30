/**
 * Comprehensive Soroban helpers for Stellar DEX interactions
 *
 * This module provides clean, reusable helper functions for interacting with
 * Stellar/Soroban DEX contracts including Factory, Router, QuoterV2, Pools, and Tokens.
 *
 * All helpers follow consistent patterns and include proper error handling.
 */

// Contract addresses and configurations
export * from './contract-addresses'

// DEX Factory helpers
export * from './dex-factory-helpers'

// DEX Router helpers
export {
  findBestPath,
  findPoolsBetweenTokens,
  calculateAmountOutMinimum as calculateRouterAmountOutMinimum,
  calculateAmountInMaximum as calculateRouterAmountInMaximum,
  calculateDeadline,
} from './dex-router-helpers'
export type { Route } from './dex-router-helpers'

// Pool helpers
export * from './pool-helpers'

// Token helpers
export * from './token-helpers'

// XLM helpers
export * from './xlm-helpers'

// Result handling
export * from './handle-result'
