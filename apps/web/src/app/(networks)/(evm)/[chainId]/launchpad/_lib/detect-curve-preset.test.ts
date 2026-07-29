import type { EvmAddress } from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import { CURVE_PRESETS, generatePresetRanges } from './curve-presets'
import { detectCurvePreset } from './detect-curve-preset'

const QUOTE_TOKEN = '0x0000000000000000000000000000000000000200' as EvmAddress
const TOKEN0 = '0x0000000000000000000000000000000000000100' as EvmAddress
const TOKEN1 = '0x0000000000000000000000000000000000000300' as EvmAddress
const LIQUIDITY_ALLOCATION = 970_000_000n * 10n ** 18n

function detectedPresetId({
  presetIndex,
  initialTick,
  launchTokenIsToken0,
}: {
  presetIndex: number
  initialTick: number
  launchTokenIsToken0: boolean
}) {
  const preset = CURVE_PRESETS[presetIndex]
  if (!preset) throw new Error('Missing test preset')

  const ranges = generatePresetRanges({
    preset,
    initialTick,
    liquidityAllocation: LIQUIDITY_ALLOCATION,
  })

  return detectCurvePreset({
    address: launchTokenIsToken0 ? TOKEN0 : TOKEN1,
    pool: { quoteToken: { address: QUOTE_TOKEN } },
    positions: ranges.map((range, positionIndex) => ({
      positionIndex,
      tickLower: launchTokenIsToken0 ? range.startTick : -range.endTick,
      tickUpper: launchTokenIsToken0 ? range.endTick : -range.startTick,
      desiredAmount: range.amount.toString(),
    })),
  })?.id
}

describe('detectCurvePreset', () => {
  it('detects every dynamic preset across initial ticks and token orderings', () => {
    for (const [presetIndex, preset] of CURVE_PRESETS.entries()) {
      expect(
        detectedPresetId({
          presetIndex,
          initialTick: -204_600,
          launchTokenIsToken0: true,
        }),
      ).toBe(preset.id)
      expect(
        detectedPresetId({
          presetIndex,
          initialTick: -197_400,
          launchTokenIsToken0: false,
        }),
      ).toBe(preset.id)
    }
  })

  it('classifies the legacy Sushi Cat truncated range as custom', () => {
    expect(
      detectCurvePreset({
        address: TOKEN1,
        pool: { quoteToken: { address: QUOTE_TOKEN } },
        positions: [
          {
            positionIndex: 0,
            tickLower: -197_400,
            tickUpper: 197_400,
            desiredAmount: LIQUIDITY_ALLOCATION.toString(),
          },
        ],
      }),
    ).toBeNull()
  })

  it('rejects ranges with non-preset allocations', () => {
    const preset = CURVE_PRESETS.find(
      (candidate) => candidate.id === 'steady-price-discovery',
    )
    if (!preset) throw new Error('Missing steady preset')

    const ranges = generatePresetRanges({
      preset,
      initialTick: -204_600,
      liquidityAllocation: LIQUIDITY_ALLOCATION,
    })
    const shiftedAmount = 10n ** 18n

    expect(
      detectCurvePreset({
        address: TOKEN0,
        pool: { quoteToken: { address: QUOTE_TOKEN } },
        positions: ranges.map((range, positionIndex) => ({
          positionIndex,
          tickLower: range.startTick,
          tickUpper: range.endTick,
          desiredAmount: (
            range.amount +
            (positionIndex === 0
              ? shiftedAmount
              : positionIndex === 1
                ? -shiftedAmount
                : 0n)
          ).toString(),
        })),
      }),
    ).toBeNull()
  })

  it('returns custom when no launch positions are available', () => {
    expect(
      detectCurvePreset({
        address: TOKEN0,
        pool: { quoteToken: { address: QUOTE_TOKEN } },
        positions: [],
      }),
    ).toBeNull()
  })

  it('returns custom for malformed indexed amounts', () => {
    expect(
      detectCurvePreset({
        address: TOKEN0,
        pool: { quoteToken: { address: QUOTE_TOKEN } },
        positions: [
          {
            positionIndex: 0,
            tickLower: -204_600,
            tickUpper: 887_200,
            desiredAmount: 'not-an-integer',
          },
        ],
      }),
    ).toBeNull()
  })
})
