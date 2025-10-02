/**
 * Contract addresses for Stellar/Soroban DEX contracts
 * Using official addresses from packages/stellar
 */

// Import official contract addresses from packages
import {
  Account,
  networks as factoryNetworks,
} from '@sushiswap/stellar/dex-factory'
import { networks as routerNetworks } from '@sushiswap/stellar/dex-router'
import { networks as poolHypeaXlmNetworks } from '@sushiswap/stellar/pools/hypea-xlm'
import { networks as poolHypebXlmNetworks } from '@sushiswap/stellar/pools/hypeb-xlm'
import { networks as tokenHypeaNetworks } from '@sushiswap/stellar/tokens/hypea'
import { networks as tokenHypebNetworks } from '@sushiswap/stellar/tokens/hypeb'
import { networks as xlmNetworks } from '@sushiswap/stellar/tokens/xlm'
import { getTokenByCode } from './token-helpers'

export const CONTRACT_ADDRESSES = {
  // Core DEX contracts
  FACTORY: factoryNetworks.testnet.contractId,
  ROUTER: routerNetworks.testnet.contractId,

  // Tokens
  TOKENS: {
    XLM: xlmNetworks.testnet.contractId, // native XLM token
    HYPEA: tokenHypeaNetworks.testnet.contractId, // HYPEa
    HYPEB: tokenHypebNetworks.testnet.contractId, // HYPEb
  },

  // Pools
  POOLS: {
    HYPEA_XLM: poolHypeaXlmNetworks.testnet.contractId, // HYPEa/XLM
    HYPEB_XLM: poolHypebXlmNetworks.testnet.contractId, // HYPEb/XLM
  },
} as const

/**
 * Pool configuration with token pairs, fees, and metadata
 * Note: Pool addresses are still from the JavaScript example as they represent deployed pools
 * Token addresses now use the official package addresses
 */
export const POOL_CONFIGS: Record<
  string,
  {
    token0: { address: string; code: string }
    token1: { address: string; code: string }
    fee: number
    description: string
  }
> = {
  [CONTRACT_ADDRESSES.POOLS.HYPEA_XLM]: {
    token0: { address: CONTRACT_ADDRESSES.TOKENS.HYPEA, code: 'HYPEa' },
    token1: { address: CONTRACT_ADDRESSES.TOKENS.XLM, code: 'XLM' },
    fee: 3000, // 0.3% fee
    description: 'HYPEa-XLM (0.3% fee)',
  },
  [CONTRACT_ADDRESSES.POOLS.HYPEB_XLM]: {
    token0: { address: CONTRACT_ADDRESSES.TOKENS.HYPEB, code: 'HYPEb' },
    token1: { address: CONTRACT_ADDRESSES.TOKENS.XLM, code: 'XLM' },
    fee: 3000, // 0.3% fee
    description: 'HYPEb-XLM (0.3% fee)',
  },
} as const

/**
 * Get pool configuration by address
 */
export function getPoolConfig(poolAddress: string) {
  const config = POOL_CONFIGS[poolAddress as keyof typeof POOL_CONFIGS]
  const token0 = getTokenByCode(config.token0.code)
  const token1 = getTokenByCode(config.token1.code)
  return {
    ...config,
    token0,
    token1,
  }
}

/**
 * Network configuration
 */
export const NETWORK_CONFIG = {
  PASSPHRASE: 'Test SDF Network ; September 2015',
  HORIZON_URL: 'https://horizon-testnet.stellar.org',
  SOROBAN_URL: 'https://soroban-testnet.stellar.org',
} as const
