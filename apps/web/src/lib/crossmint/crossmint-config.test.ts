import { describe, expect, it } from 'vitest'
import { getCrossmintEnvironment, getCrossmintTarget } from './crossmint-config'

const BASE_USDC = {
  address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  chainId: 8453,
  symbol: 'USDC',
} as const
const SOLANA_USDC = {
  address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  chainId: -5,
  symbol: 'USDC',
} as const
const SOLANA_MEMECOIN = {
  address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  chainId: -5,
  symbol: 'BONK',
} as const
const BASE_MEMECOIN = {
  address: '0x0000000000000000000000000000000000000001',
  chainId: 8453,
  symbol: 'MEME',
} as const

describe('Crossmint token targeting', () => {
  it('derives the environment from client and server API keys', () => {
    expect(getCrossmintEnvironment('ck_staging_example')).toBe('staging')
    expect(getCrossmintEnvironment('sk_production_example')).toBe('production')
    expect(() => getCrossmintEnvironment('invalid')).toThrow(
      'unsupported format',
    )
  })

  it('maps Base USDC to Crossmint staging onramp configuration', () => {
    expect(getCrossmintTarget(BASE_USDC, 'staging')).toMatchObject({
      asset: 'USDC',
      kind: 'stablecoin',
      linkChain: 'base-sepolia',
      network: 'Base Sepolia',
      requiresWalletLink: true,
      tokenLocator: 'base-sepolia:0x036CbD53842c5426634e7929541eC2318f3dCF7e',
      walletNamespace: 'evm',
    })
  })

  it('maps Solana USDC to Crossmint staging onramp configuration', () => {
    expect(getCrossmintTarget(SOLANA_USDC, 'staging')).toMatchObject({
      asset: 'USDC',
      kind: 'stablecoin',
      network: 'Solana Devnet',
      tokenLocator: 'solana:4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
      walletNamespace: 'svm',
    })
  })

  it('uses XMEME as the staging stand-in for a Solana memecoin', () => {
    expect(getCrossmintTarget(SOLANA_MEMECOIN, 'staging')).toMatchObject({
      asset: 'XMEME',
      kind: 'memecoin',
      requestedAsset: 'BONK',
      tokenLocator: 'solana:7EivYFyNfgGj8xbUymR7J4LuxUHLKRzpLaERHLvi7Dgu',
      walletNamespace: 'svm',
    })
  })

  it('uses the Sushi token network and address in production', () => {
    expect(getCrossmintTarget(BASE_USDC, 'production')).toMatchObject({
      asset: 'USDC',
      kind: 'stablecoin',
      linkChain: 'base',
      network: 'Base',
      tokenLocator: 'base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
      walletNamespace: 'evm',
    })

    expect(getCrossmintTarget(SOLANA_MEMECOIN, 'production')).toMatchObject({
      asset: 'BONK',
      kind: 'memecoin',
      network: 'Solana',
      tokenLocator: 'solana:DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    })
  })

  it('rejects Base memecoins in staging', () => {
    expect(() => getCrossmintTarget(BASE_MEMECOIN, 'staging')).toThrow(
      'available only on Solana Devnet',
    )
  })
})
