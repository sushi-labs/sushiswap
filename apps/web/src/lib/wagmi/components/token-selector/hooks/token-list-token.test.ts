import { EvmChainId, type EvmToken } from 'sushi/evm'
import { StellarChainId, type StellarToken } from 'sushi/stellar'
import { describe, expect, it } from 'vitest'
import { createTokenListToken } from './token-list-token'

describe('createTokenListToken', () => {
  it('hydrates EVM approval metadata', () => {
    const token = createTokenListToken(EvmChainId.ETHEREUM, {
      chainId: EvmChainId.ETHEREUM,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      symbol: 'USDC',
      name: 'USDC',
      decimals: 6,
      approved: false,
    }) as EvmToken<{ approved: boolean }>

    expect(token.metadata).toEqual({ approved: false })
  })

  it('hydrates Stellar issued token issuer and domain metadata', () => {
    const token = createTokenListToken(StellarChainId.STELLAR, {
      chainId: StellarChainId.STELLAR,
      address: 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
      symbol: 'USDC',
      name: 'USDC',
      decimals: 7,
      approved: true,
      stellarMetadata: {
        issuer: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
        domain: 'circle.com',
      },
    }) as StellarToken<{ approved: boolean; domain?: string }>

    expect(token.issuer).toBe(
      'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
    )
    expect(token.metadata).toEqual({ approved: true, domain: 'circle.com' })
  })

  it('hydrates native XLM without issuer metadata', () => {
    const token = createTokenListToken(StellarChainId.STELLAR, {
      chainId: StellarChainId.STELLAR,
      address: 'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA',
      symbol: 'XLM',
      name: 'XLM',
      decimals: 7,
      approved: true,
      stellarMetadata: null,
    }) as StellarToken<{ approved: boolean; domain?: string }>

    expect(token.symbol).toBe('XLM')
    expect(token.issuer).toBeUndefined()
    expect(token.metadata).toEqual({ approved: true })
  })
})
