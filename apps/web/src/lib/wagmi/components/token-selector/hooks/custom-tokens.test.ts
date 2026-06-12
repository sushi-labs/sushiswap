import {
  hydrateCustomToken,
  hydrateCustomTokenMap,
  serializeCustomToken,
} from '@sushiswap/hooks'
import { EvmChainId, EvmToken } from 'sushi/evm'
import { StellarChainId, StellarToken } from 'sushi/stellar'
import { describe, expect, it } from 'vitest'

describe('generic custom token storage', () => {
  it('round-trips Stellar issuer and domain metadata', () => {
    const token = new StellarToken({
      chainId: StellarChainId.STELLAR,
      address: 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
      issuer: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
      symbol: 'USDC',
      name: 'USDC',
      decimals: 7,
      metadata: {
        approved: false,
        domain: 'circle.com',
      },
    })

    const hydrated = hydrateCustomToken(serializeCustomToken(token))

    expect(hydrated).toBeInstanceOf(StellarToken)
    expect(hydrated?.address).toBe(token.address)
    expect((hydrated as StellarToken | undefined)?.issuer).toBe(token.issuer)
    expect(hydrated?.metadata).toEqual({
      approved: false,
      domain: 'circle.com',
    })
  })

  it('hydrates legacy flat entries written before the serialized-token format', () => {
    const legacy = {
      chainId: EvmChainId.ETHEREUM,
      id: '1:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      decimals: 6,
      name: 'USD Coin',
      symbol: 'USDC',
      logoUrl: 'https://example.com/usdc.png',
    }

    const hydrated = hydrateCustomToken(legacy)

    expect(hydrated).toBeInstanceOf(EvmToken)
    expect(hydrated?.metadata).toEqual({
      approved: false,
      logoUrl: 'https://example.com/usdc.png',
    })
  })

  it('filters shared storage by chain and ignores malformed entries', () => {
    const evmToken = new EvmToken({
      chainId: EvmChainId.ETHEREUM,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      symbol: 'USDC',
      name: 'USDC',
      decimals: 6,
      metadata: {
        approved: false,
      },
    })
    const stellarToken = new StellarToken({
      chainId: StellarChainId.STELLAR,
      address: 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
      issuer: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
      symbol: 'USDC',
      name: 'USDC',
      decimals: 7,
      metadata: {
        approved: false,
      },
    })
    const evmKey = `${evmToken.chainId}:${evmToken.address}`
    const stellarKey = `${stellarToken.chainId}:${stellarToken.address}`
    const storage = {
      [evmKey]: serializeCustomToken(evmToken),
      [stellarKey]: serializeCustomToken(stellarToken),
      malformed: {
        chainId: StellarChainId.STELLAR,
        id: 'malformed',
        address: 'not-a-contract-address',
        decimals: '7',
        name: 'Malformed',
        symbol: 'BAD',
      },
    }

    const stellarTokens = hydrateCustomTokenMap(storage, {
      chainId: StellarChainId.STELLAR,
    })
    const defaultTokens = hydrateCustomTokenMap(storage)

    expect(Object.keys(stellarTokens)).toEqual([stellarKey])
    expect(stellarTokens[stellarKey]).toBeInstanceOf(StellarToken)
    expect(Object.keys(defaultTokens)).toEqual([evmKey])
    expect(defaultTokens[evmKey]).toBeInstanceOf(EvmToken)
  })
})
