import { EvmChainId, EvmToken } from 'sushi/evm'
import { StellarChainId, StellarToken } from 'sushi/stellar'
import { describe, expect, it } from 'vitest'
import { getCoinGeckoTokenInfoUrl } from './useCoinGeckoTokenInfo'

describe('getCoinGeckoTokenInfoUrl', () => {
  it('builds Stellar contract URL', () => {
    const token = new StellarToken({
      chainId: StellarChainId.STELLAR,
      address: 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
      symbol: 'USDC',
      name: 'USDC',
      decimals: 7,
    })

    expect(getCoinGeckoTokenInfoUrl(token)).toBe(
      'https://api.coingecko.com/api/v3/coins/stellar/contract/CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
    )
  })

  it('keeps EVM contract URL behavior', () => {
    const token = new EvmToken({
      chainId: EvmChainId.ETHEREUM,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      symbol: 'USDC',
      name: 'USDC',
      decimals: 6,
    })

    expect(getCoinGeckoTokenInfoUrl(token)).toBe(
      'https://api.coingecko.com/api/v3/coins/eth/contract/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    )
  })
})
