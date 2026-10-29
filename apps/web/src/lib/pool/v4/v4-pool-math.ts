import { SqrtPriceMath, TickMath } from 'sushi/evm'
import type { Hex } from 'viem'

export interface V4PopulatedTick {
  tick: number
  liquidityNet: bigint
}

const TICK_SPACING_OFFSET = 16n
const TICK_SPACING_MASK = 0xffffffn

/** Infinity CL packs the pool's int24 tick spacing into bits 16-39 of `parameters`. */
export function getV4TickSpacing(parameters: Hex): number {
  return Number(
    BigInt.asIntN(
      24,
      (BigInt(parameters) >> TICK_SPACING_OFFSET) & TICK_SPACING_MASK,
    ),
  )
}

/** Every tick bitmap word index a pool with `tickSpacing` can have initialized ticks in. */
export function getV4TickBitmapWords(tickSpacing: number): number[] {
  const wordOf = (tick: number) =>
    Math.floor(Math.floor(tick / tickSpacing) / 256)

  const words: number[] = []
  for (
    let word = wordOf(TickMath.MIN_TICK);
    word <= wordOf(TickMath.MAX_TICK);
    word++
  ) {
    words.push(word)
  }
  return words
}

/**
 * The pool's reserves: every open position's principal, in range or not,
 * excluding uncollected fees. Liquidity between two neighbouring initialized
 * ticks holds token0 above the current price, token1 below it, and both in
 * the range containing it.
 */
export function getV4PoolReserves({
  sqrtPriceX96,
  ticks,
}: {
  sqrtPriceX96: bigint
  ticks: readonly V4PopulatedTick[]
}): [bigint, bigint] {
  const sorted = [...ticks].sort((a, b) => a.tick - b.tick)

  let liquidity = 0n
  let reserve0 = 0n
  let reserve1 = 0n

  for (let i = 0; i < sorted.length - 1; i++) {
    liquidity += sorted[i]!.liquidityNet
    if (liquidity <= 0n) continue

    const sqrtLower = TickMath.getSqrtRatioAtTick(sorted[i]!.tick)
    const sqrtUpper = TickMath.getSqrtRatioAtTick(sorted[i + 1]!.tick)

    if (sqrtPriceX96 <= sqrtLower) {
      reserve0 += SqrtPriceMath.getAmount0Delta(
        sqrtLower,
        sqrtUpper,
        liquidity,
        false,
      )
    } else if (sqrtPriceX96 >= sqrtUpper) {
      reserve1 += SqrtPriceMath.getAmount1Delta(
        sqrtLower,
        sqrtUpper,
        liquidity,
        false,
      )
    } else {
      reserve0 += SqrtPriceMath.getAmount0Delta(
        sqrtPriceX96,
        sqrtUpper,
        liquidity,
        false,
      )
      reserve1 += SqrtPriceMath.getAmount1Delta(
        sqrtLower,
        sqrtPriceX96,
        liquidity,
        false,
      )
    }
  }

  return [reserve0, reserve1]
}
