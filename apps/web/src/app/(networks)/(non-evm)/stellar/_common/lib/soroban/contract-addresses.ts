/**
 * Contract addresses for Stellar/Soroban DEX contracts
 * Using deployed contract addresses from stellar-auth-test
 */

// Deployed contract addresses (from stellar-auth-test app.js)
export const CONTRACT_ADDRESSES = {
  // Core DEX contracts
  FACTORY: 'CBZHXZBNABBQRFBNQXYXMJ3NKETUKDIBSILNQUWHVV3RXMRP3AZYLK66',
  ROUTER: 'CAVSGXMRXOCASPTKMLCFCPEKOLNMSQRFTLTLHYIBXBP22K2GUEIN5IN7',

  // Tokens
  TOKENS: {
    XLM: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC', // native XLM token
    HYPEA: 'CCUYO46LKVYRQL63LIIMGWVURVBQVETKO26G5OK5XVB5S4GKMGPKXNYJ', // HYPEa
    HYPEB: 'CBQMJZL4U4MAQNHKNZZ2CAAKOJEDKL4J4C6AVFQL4CSKNLZU6H3PD5O7', // HYPEb
  },

  // Pools
  POOLS: {
    HYPEA_XLM: 'CCYJJ2A2BAQHKKSNJ3NHRV66GA6XCHHBLROFBBR7J33YIYMWDL57XOUL', // HYPEa/XLM
    HYPEB_XLM: 'CDLPBPLMZGQHVRDMZAOMOQXWUUBGP5PWSLIAPTJVXC3WTAK6FAR3FQSQ', // HYPEb/XLM
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

  if (!config) {
    console.error('No pool configuration found for address:', poolAddress)
    return null
  }

  // Return the config with address and code, token objects will be resolved by the caller
  return config
}

/**
 * Network configuration
 */
export const NETWORK_CONFIG = {
  PASSPHRASE: 'Test SDF Network ; September 2015',
  HORIZON_URL: 'https://horizon-testnet.stellar.org',
  SOROBAN_URL: 'https://soroban-testnet.stellar.org',
} as const
