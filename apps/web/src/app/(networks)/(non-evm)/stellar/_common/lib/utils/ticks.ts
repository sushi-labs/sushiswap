import { TickMath } from 'sushi/evm'

export const FEE_TIERS = [
  { value: 500, label: '0.05%', description: 'Best for very stable pairs' },
  { value: 3000, label: '0.3%', description: 'Best for most pairs' },
  { value: 10000, label: '1%', description: 'Best for volatile pairs' },
] as const

export type FeeTier = (typeof FEE_TIERS)[number]['value']

export const DEFAULT_FEE_TIER: FeeTier = 3000

export function isFeeTier(value: number): value is FeeTier {
  return FEE_TIERS.some((tier) => tier.value === value)
}

export const TICK_SPACINGS: Record<FeeTier, number> = {
  500: 10,
  3000: 60,
  10000: 200,
}

export const DEFAULT_TICK_RANGE = {
  lower: -60000,
  upper: 60000,
}

export const MAX_TICK_RANGE = {
  lower: TickMath.MIN_TICK,
  upper: TickMath.MAX_TICK,
}

export function alignTick(tick: number, spacing: number): number {
  if (spacing <= 0) {
    throw new Error('Tick spacing must be greater than 0')
  }
  const clamped = Math.max(
    Math.min(tick, MAX_TICK_RANGE.upper),
    MAX_TICK_RANGE.lower,
  )
  const rounded = Math.round(clamped / spacing) * spacing
  if (rounded < MAX_TICK_RANGE.lower) return rounded + spacing
  if (rounded > MAX_TICK_RANGE.upper) return rounded - spacing
  return rounded
}

export function isTickAligned(tick: number, spacing: number): boolean {
  if (spacing <= 0) {
    throw new Error('Tick spacing must be greater than 0')
  }
  return tick % spacing === 0
}

export function clampTickRange(
  tickLower: number,
  tickUpper: number,
  spacing: number,
): { lower: number; upper: number } {
  if (spacing <= 0) {
    throw new Error('Tick spacing must be greater than 0')
  }

  const alignedLower = alignTick(tickLower, spacing)
  const alignedUpper = alignTick(tickUpper, spacing)
  const [orderedAlignedLower, orderedAlignedUpper] =
    alignedLower < alignedUpper
      ? [alignedLower, alignedUpper]
      : [alignedUpper, alignedLower]

  if (orderedAlignedLower === orderedAlignedUpper) {
    if (orderedAlignedLower >= 0) {
      return {
        lower: orderedAlignedLower - spacing,
        upper: orderedAlignedUpper,
      }
    } else {
      return {
        lower: orderedAlignedLower,
        upper: orderedAlignedUpper + spacing,
      }
    }
  } else {
    return { lower: orderedAlignedLower, upper: orderedAlignedUpper }
  }
}

// The deployed pool and manager use the pre-July-2026 negative-tick rounding.
// Reuse SDK arithmetic, adjusting only that difference; MIN_TICK is special-cased
// in the contracts. See docs/stellar-contract-compatibility.md for live evidence.
export function getSqrtRatioAtTick(tick: number): bigint {
  const sqrt = TickMath.getSqrtRatioAtTick(tick)
  return tick < 0 && tick !== TickMath.MIN_TICK ? sqrt - 1n : sqrt
}

export function getTickAtSqrtRatio(sqrtPriceX96: bigint): number {
  const tick = TickMath.getTickAtSqrtRatio(sqrtPriceX96)
  // A legacy negative boundary is one unit below the corresponding SDK boundary.
  return tick < -1 && sqrtPriceX96 === getSqrtRatioAtTick(tick + 1)
    ? tick + 1
    : tick
}
