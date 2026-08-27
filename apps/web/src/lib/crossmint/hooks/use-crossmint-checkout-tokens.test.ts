import { ChainId } from 'sushi'
import { describe, expect, it } from 'vitest'
import { chainIdsToCrossmintName } from './use-crossmint-checkout-tokens'

describe('chainIdsToCrossmintName', () => {
  it('uses Crossmint labels when Sushi display names differ', () => {
    expect(
      chainIdsToCrossmintName([
        ChainId.ARBITRUM,
        ChainId.BSC,
        ChainId.MODE,
        ChainId.OPTIMISM,
        ChainId.ROBINHOOD,
      ]),
    ).toEqual(['arbitrum', 'bsc', 'mode', 'optimism', 'robinhood-chain'])
  })

  it('uses lowercase Sushi display names when they match Crossmint', () => {
    expect(
      chainIdsToCrossmintName([
        ChainId.BASE,
        ChainId.POLYGON,
        ChainId.SOLANA,
        ChainId.STELLAR,
      ]),
    ).toEqual(['base', 'polygon', 'solana', 'stellar'])
  })
})
