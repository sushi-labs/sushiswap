import { EvmChainId, EvmToken } from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import {
  LAUNCH_TOKEN_TOTAL_SUPPLY_RAW,
  quoteInitialBuy,
} from './initial-buy-quote'

const QUOTE_TOKEN = new EvmToken({
  chainId: EvmChainId.ROBINHOOD,
  address: '0x9999999999999999999999999999999999999999',
  decimals: 18,
  symbol: 'QUOTE',
  name: 'Quote token',
})

const FDV_TICKS = [
  -100_000, -93_000, -84_000, -80_000, -60_000, -44_000, -37_000, -14_000,
] as const

describe('quoteInitialBuy', () => {
  it.each(['STANDARD', 'MOON'] as const)(
    'returns a bounded, increasing %s quote',
    async (liquidityMode) => {
      const smallerQuote = await quoteInitialBuy({
        chainId: EvmChainId.ROBINHOOD,
        quoteToken: QUOTE_TOKEN,
        amountIn: 10n ** 18n,
        liquidityMode,
        fdvTicks: FDV_TICKS,
      })
      const largerQuote = await quoteInitialBuy({
        chainId: EvmChainId.ROBINHOOD,
        quoteToken: QUOTE_TOKEN,
        amountIn: 2n * 10n ** 18n,
        liquidityMode,
        fdvTicks: FDV_TICKS,
      })

      expect(smallerQuote).toBeDefined()
      expect(largerQuote).toBeDefined()
      if (smallerQuote === undefined || largerQuote === undefined) {
        throw new Error('Expected both launch quotes to be available')
      }
      expect(smallerQuote).toBeGreaterThan(0n)
      expect(largerQuote).toBeGreaterThan(smallerQuote)
      expect(largerQuote).toBeLessThan(LAUNCH_TOKEN_TOTAL_SUPPLY_RAW)
    },
  )

  it('returns zero without constructing a pool for a zero buy', async () => {
    await expect(
      quoteInitialBuy({
        chainId: EvmChainId.ROBINHOOD,
        quoteToken: QUOTE_TOKEN,
        amountIn: 0n,
        liquidityMode: 'MOON',
        fdvTicks: [],
      }),
    ).resolves.toBe(0n)
  })
})
