import type {
  LaunchpadPosition,
  LaunchpadTokenRef,
} from '@sushiswap/graph-client/data-api'
import type { EvmAddress } from 'sushi/evm'
import {
  CURVE_PRESETS,
  type CurvePreset,
  generatePresetRanges,
} from './curve-presets'

interface CurveDetectionInput {
  address: EvmAddress
  pool: {
    quoteToken: Pick<LaunchpadTokenRef, 'address'>
  }
  positions: Pick<
    LaunchpadPosition,
    'positionIndex' | 'tickLower' | 'tickUpper' | 'desiredAmount'
  >[]
}

function isLaunchToken0(token: EvmAddress, quoteToken: EvmAddress): boolean {
  return token.toLowerCase() < quoteToken.toLowerCase()
}

export function detectCurvePreset(
  token: CurveDetectionInput,
): CurvePreset | null {
  if (token.positions.length === 0) return null

  const tokenIs0 = isLaunchToken0(token.address, token.pool.quoteToken.address)
  let actualRanges: {
    startTick: number
    endTick: number
    amount: bigint
  }[]
  try {
    actualRanges = [...token.positions]
      .sort((first, second) => first.positionIndex - second.positionIndex)
      .map((position) => ({
        startTick: tokenIs0 ? position.tickLower : -position.tickUpper,
        endTick: tokenIs0 ? position.tickUpper : -position.tickLower,
        amount: BigInt(position.desiredAmount),
      }))
  } catch {
    return null
  }
  const initialTick = actualRanges[0]?.startTick
  if (initialTick === undefined) return null

  const liquidityAllocation = actualRanges.reduce(
    (total, range) => total + range.amount,
    0n,
  )

  return (
    CURVE_PRESETS.find((preset) => {
      try {
        const expectedRanges = generatePresetRanges({
          preset,
          initialTick,
          liquidityAllocation,
        })
        return (
          expectedRanges.length === actualRanges.length &&
          expectedRanges.every((expected, index) => {
            const actual = actualRanges[index]
            return (
              actual !== undefined &&
              expected.startTick === actual.startTick &&
              expected.endTick === actual.endTick &&
              expected.amount === actual.amount
            )
          })
        )
      } catch {
        return false
      }
    }) ?? null
  )
}
