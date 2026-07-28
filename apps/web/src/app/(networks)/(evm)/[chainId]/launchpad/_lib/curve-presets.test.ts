import { describe, expect, it } from 'vitest'
import {
  CURVE_PRESETS,
  MAX_USABLE_TICK,
  TOKEN_TOTAL_SUPPLY_RAW,
  alignInitialTick,
  generatePresetRanges,
  liquidityAllocationForReserve,
  quoteRawToUsdRaw,
  realizedInitialFdvQuoteRaw,
  usdFdvToQuoteRaw,
} from './curve-presets'

const USD = 10n ** 18n

describe('launchpad curve presets', () => {
  it('matches the canonical v1 curve definitions', () => {
    expect(
      CURVE_PRESETS.map(({ id, ranges }) => ({ id, ranges })),
    ).toStrictEqual([
      {
        id: 'classic',
        ranges: [{ startOffset: 0, endOffset: null, allocationBps: 10_000 }],
      },
      {
        id: 'steady-price-discovery',
        ranges: [
          { startOffset: 0, endOffset: 13_800, allocationBps: 6_000 },
          { startOffset: 13_800, endOffset: 27_600, allocationBps: 2_500 },
          { startOffset: 27_600, endOffset: 46_000, allocationBps: 1_000 },
          { startOffset: 46_000, endOffset: null, allocationBps: 500 },
        ],
      },
      {
        id: 'fast-price-discovery',
        ranges: [
          { startOffset: 0, endOffset: 13_800, allocationBps: 2_500 },
          { startOffset: 13_800, endOffset: 27_600, allocationBps: 2_500 },
          { startOffset: 27_600, endOffset: 46_000, allocationBps: 2_500 },
          { startOffset: 46_000, endOffset: null, allocationBps: 2_500 },
        ],
      },
    ])
  })

  it('converts a USD FDV to quote-token units across token decimals', () => {
    expect(
      usdFdvToQuoteRaw({
        initialFdvUsdRaw: 3_900n * USD,
        quotePriceUsdRaw: 3_000n * USD,
        quoteDecimals: 18,
      }),
    ).toBe(1_300_000_000_000_000_000n)

    expect(
      usdFdvToQuoteRaw({
        initialFdvUsdRaw: 3_900n * USD,
        quotePriceUsdRaw: USD,
        quoteDecimals: 6,
      }),
    ).toBe(3_900_000_000n)
  })

  it('rounds quote-token conversion upward', () => {
    expect(
      usdFdvToQuoteRaw({
        initialFdvUsdRaw: USD,
        quotePriceUsdRaw: 3n * USD,
        quoteDecimals: 6,
      }),
    ).toBe(333_334n)
  })

  it('derives an aligned initial tick and realized valuation', () => {
    const quoteFdv = usdFdvToQuoteRaw({
      initialFdvUsdRaw: 3_900n * USD,
      quotePriceUsdRaw: 3_000n * USD,
      quoteDecimals: 18,
    })
    const initialTick = alignInitialTick({ initialFdvQuoteRaw: quoteFdv })
    const realizedQuoteFdv = realizedInitialFdvQuoteRaw(initialTick)

    expect(initialTick).toBe(-204_600)
    expect(realizedQuoteFdv).toBe(1_302_504_264_530_229_671n)
    expect(
      quoteRawToUsdRaw({
        quoteAmountRaw: realizedQuoteFdv,
        quotePriceUsdRaw: 3_000n * USD,
        quoteDecimals: 18,
      }),
    ).toBe(3_907_512_793_590_689_013_000n)
  })

  it('derives the same USD target through a six-decimal stablecoin', () => {
    const quoteFdv = usdFdvToQuoteRaw({
      initialFdvUsdRaw: 4_000n * USD,
      quotePriceUsdRaw: USD,
      quoteDecimals: 6,
    })
    const initialTick = alignInitialTick({ initialFdvQuoteRaw: quoteFdv })

    expect(quoteFdv).toBe(4_000_000_000n)
    expect(initialTick).toBe(-400_600)
    expect(realizedInitialFdvQuoteRaw(initialTick)).toBe(4_008_970_761n)
  })

  it('builds every preset from the USD-derived tick and active reserve', () => {
    const liquidityAllocation = liquidityAllocationForReserve(300)

    expect(liquidityAllocation).toBe(970_000_000n * 10n ** 18n)

    for (const preset of CURVE_PRESETS) {
      const ranges = generatePresetRanges({
        preset,
        initialTick: -204_600,
        liquidityAllocation,
      })

      expect(ranges[0]?.startTick).toBe(-204_600)
      expect(ranges.at(-1)?.endTick).toBe(MAX_USABLE_TICK)
      expect(ranges.reduce((sum, range) => sum + range.amount, 0n)).toBe(
        liquidityAllocation,
      )
      expect(ranges.every((range) => range.amount > 0n)).toBe(true)
    }
  })

  it('keeps the fixed one-billion-token supply in raw units', () => {
    expect(TOKEN_TOTAL_SUPPLY_RAW).toBe(1_000_000_000n * 10n ** 18n)
  })
})
