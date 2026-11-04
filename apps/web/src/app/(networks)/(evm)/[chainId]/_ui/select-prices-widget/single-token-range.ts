import { Bound } from 'src/lib/constants'
import {
  type EvmCurrency,
  type SushiSwapV3Pool,
  TICK_SPACINGS,
  TickMath,
  nearestUsableTick,
  tickToPrice,
} from 'sushi/evm'

interface SingleTokenRange {
  bound: Bound
  value: string
}

export function getSingleTokenRange({
  pool,
  token0,
  token1,
  depositToken,
}: {
  pool: SushiSwapV3Pool | undefined
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  depositToken: EvmCurrency | undefined
}): SingleTokenRange | undefined {
  if (!pool || !token0 || !token1 || !depositToken) return undefined

  const base = token0.wrap()
  const quote = token1.wrap()
  const deposit = depositToken.wrap()
  const depositIsToken0 = deposit.isSame(pool.token0)
  if (!depositIsToken0 && !deposit.isSame(pool.token1)) return undefined

  const spacing = TICK_SPACINGS[pool.fee]
  const minTick = nearestUsableTick(TickMath.MIN_TICK, spacing)
  const maxTick = nearestUsableTick(TickMath.MAX_TICK, spacing)
  let tick = depositIsToken0
    ? Math.ceil(pool.tickCurrent / spacing) * spacing
    : Math.floor(pool.tickCurrent / spacing) * spacing

  // A pool can be partway through an aligned tick. Compare sqrt prices so a
  // token0-only range never accidentally requires a small token1 deposit.
  if (
    depositIsToken0 &&
    tick <= maxTick &&
    pool.sqrtRatioX96 > TickMath.getSqrtRatioAtTick(tick)
  ) {
    tick += spacing
  }
  if (
    tick < minTick ||
    tick > maxTick ||
    (depositIsToken0 ? tick === maxTick : tick === minTick)
  ) {
    return undefined
  }

  // Use a price inside this tick's interval. Formatting the exact boundary can
  // round it into an adjacent tick, especially for inverted prices/spacing 1.
  // The existing mint provider still performs the final tick conversion.
  const price = tickToPrice(base, quote, tick)
  const nextPrice = tickToPrice(base, quote, tick + 1)
  const value = price.asFraction
    .add(nextPrice.asFraction)
    .div(2n)
    .mul(price.scalar)
    .toString({ significant: 24 })

  return {
    bound: deposit.isSame(base) ? Bound.LOWER : Bound.UPPER,
    value,
  }
}
