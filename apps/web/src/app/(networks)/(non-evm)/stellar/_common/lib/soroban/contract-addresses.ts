/**
 * Contract addresses for Stellar/Soroban DEX contracts
 * Using deployed contract addresses from stellar-auth-test
 */

// Deployed contract addresses (Updated: Oct 16, 2025)
export const CONTRACT_ADDRESSES = {
  // Core DEX contracts
  FACTORY: 'CB6WRZ2TJM6JXS65YR6V2EC6TBAWPWDPRTCQH3TYEMXPGIMJJ55JR6JN',
  ROUTER: 'CDL45PH44PCOK4BUS7TR5MFOW2K7MWJMVZUBEWYIRRWMBHWJHBD6P7PF',
  // Using the newest Position Manager with get_user_positions_with_fees support
  POSITION_MANAGER: 'CAQKVCPBEN3FHJ3U7ENIBC6GQGOKV7RGQVIQJRNEHL4HHL7I5PY6FSGY',
  TOKEN_DESCRIPTOR: 'CDJI4LOSGS7UIWG4SDEEZW5TI266LN65EO72SA6SCCJT3SPRKDDVXKZQ',
  FLASH_EXECUTOR: 'CBQ2H3Z6BIDL4Y6V4IWLC2F74OO5VYLBRLCZLN2G5TUVRMKPSJ6ROYGZ',
  POOL_WASM_HASH:
    '3910707aa159c94b9db126c37be7df870d3f8fedba5ad1ecb2a59c86a89bad62',

  // Tokens
  TOKENS: {
    XLM: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC', // native XLM token
    HYPEA: 'CCUYO46LKVYRQL63LIIMGWVURVBQVETKO26G5OK5XVB5S4GKMGPKXNYJ', // HYPEa
    HYPEB: 'CBQMJZL4U4MAQNHKNZZ2CAAKOJEDKL4J4C6AVFQL4CSKNLZU6H3PD5O7', // HYPEb
    HYPEC: 'CCSG4CCSKDAZ2UWZZNFK2FLJJQ3T443SUIAPAJR436WNOSFXPYOT47C2', // HYPEc
  },

  // Pools
  POOLS: {
    HYPEA_XLM: 'CCYJJ2A2BAQHKKSNJ3NHRV66GA6XCHHBLROFBBR7J33YIYMWDL57XOUL', // HYPEa/XLM (old)
    HYPEB_XLM: 'CDLPBPLMZGQHVRDMZAOMOQXWUUBGP5PWSLIAPTJVXC3WTAK6FAR3FQSQ', // HYPEb/XLM (old)
    HYPEB_XLM_NEW: 'CC5HZRB5LK3L2KVHLXDAJNQLGRQ3O6OEV5UXPWFST5AJDKK65O2SNCNR', // HYPEb/XLM (new factory)
    HYPEC_XLM: 'CA67FTSW23KKE3PINCLLOTQDK4UDVYXQWVBGMYT672QEHY26R3JFLXRP', // HYPEc/XLM
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
  [CONTRACT_ADDRESSES.POOLS.HYPEB_XLM_NEW]: {
    token0: { address: CONTRACT_ADDRESSES.TOKENS.HYPEB, code: 'HYPEb' },
    token1: { address: CONTRACT_ADDRESSES.TOKENS.XLM, code: 'XLM' },
    fee: 3000, // 0.3% fee
    description: 'HYPEb-XLM (0.3% fee - New Factory)',
  },
  [CONTRACT_ADDRESSES.POOLS.HYPEC_XLM]: {
    token0: { address: CONTRACT_ADDRESSES.TOKENS.HYPEC, code: 'HYPEc' },
    token1: { address: CONTRACT_ADDRESSES.TOKENS.XLM, code: 'XLM' },
    fee: 3000, // 0.3% fee
    description: 'HYPEc-XLM (0.3% fee)',
  },
} as const

/**
 * Get pool configuration by address
 * Returns null if not found (dynamic pools will be queried from contract)
 */
export function getPoolConfig(poolAddress: string) {
  const config = POOL_CONFIGS[poolAddress as keyof typeof POOL_CONFIGS]

  if (!config) {
    // This is expected for dynamically discovered pools
    // pool-helpers will query the contract directly
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
