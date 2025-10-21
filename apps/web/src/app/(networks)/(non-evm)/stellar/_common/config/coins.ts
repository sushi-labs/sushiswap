import type { NETWORK_NAME } from '../lib/constants'
import type { Token } from '../lib/types/token.type'

// XLM is the native token on Stellar
export const XLM: Record<typeof NETWORK_NAME, Token> = {
  testnet: {
    name: 'Stellar Lumens',
    code: 'XLM',
    decimals: 7,
    contract: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
    issuer: 'native',
    org: 'Stellar',
    domain: 'stellar.org',
  },
  mainnet: {
    name: 'Stellar Lumens',
    code: 'XLM',
    decimals: 7,
    contract: 'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA', // Mainnet XLM contract
    issuer: 'native',
    org: 'Stellar',
    domain: 'stellar.org',
  },
}

// USDC on Stellar networks
export const USDC: Record<typeof NETWORK_NAME, Token> = {
  testnet: {
    name: 'USDC',
    code: 'USDC',
    decimals: 7,
    contract: 'CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA',
    issuer: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    org: 'Centre',
    domain: 'centre.io',
  },
  mainnet: {
    name: 'USDC',
    code: 'USDC',
    decimals: 7,
    contract: 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
    issuer: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
    org: 'Centre',
    domain: 'centre.io',
  },
}

// HYPEa - Using as fake stablecoin for testnet until XLM/USDC pool exists
export const HYPE: Record<typeof NETWORK_NAME, Token> = {
  testnet: {
    name: 'HYPE',
    code: 'HYPE',
    decimals: 7,
    contract: 'CCKYIGXKXH7PBIUQ4D54OIB3ZB4QKCJEAG3M7PW3KDKT5RTGMXNK2PUT',
    issuer: '',
    org: 'hypotenuselabs',
    domain: '',
  },
  mainnet: {
    name: 'HYPE',
    code: 'HYPE',
    decimals: 7,
    contract: '',
    issuer: '',
    org: '',
    domain: '',
  },
}

// Stablecoins available on each network
export const STABLECOINS: Record<typeof NETWORK_NAME, Token[]> = {
  // TODO: Replace HYPEa with USDC once XLM/USDC pool is created
  // Currently using HYPEa as fake stable since HYPEa/XLM pool exists on testnet
  testnet: [HYPE.testnet],
  mainnet: [USDC.mainnet],
}
