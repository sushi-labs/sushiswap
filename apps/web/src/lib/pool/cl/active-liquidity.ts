import { type EvmCurrency, sushiSwapV4TickToPrice } from 'sushi/evm'

// Significant, not fixed, digits: prices of any magnitude keep their precision
const PRICE_SIGNIFICANT_DIGITS = 8

interface InitializedTick {
  tickIdx: number
  liquidityNet: bigint
}

export interface TickProcessed {
  tick: number
  liquidityActive: bigint
  liquidityNet: bigint
  price0: string
}

/**
 * Active liquidity at every initialized tick, walking outwards from the
 * active tick. `ticks` must be sorted by `tickIdx` ascending. Pass the
 * currencies as the pool holds them: wrapped for V3, native as-is for V4.
 * V4's tick pricing equals V3's for tokens, so it serves both.
 */
export function processActiveLiquidity({
  token0,
  token1,
  activeTick,
  liquidity,
  ticks,
}: {
  token0: EvmCurrency
  token1: EvmCurrency
  activeTick: number
  liquidity: bigint
  ticks: InitializedTick[]
}): TickProcessed[] | undefined {
  if (ticks.length === 0) return undefined

  // find where the active tick would be to partition the array
  // if the active tick is initialized, the pivot will be an element
  // if not, take the previous tick as pivot (-1 below the first tick,
  // the last tick when above every initialized tick)
  const nextTickIndex = ticks.findIndex(({ tickIdx }) => tickIdx > activeTick)
  const pivot = (nextTickIndex === -1 ? ticks.length : nextTickIndex) - 1

  const activeTickProcessed: TickProcessed = {
    liquidityActive: liquidity,
    tick: activeTick,
    liquidityNet:
      pivot >= 0 && Number(ticks[pivot].tickIdx) === activeTick
        ? ticks[pivot].liquidityNet
        : 0n,
    price0: sushiSwapV4TickToPrice(token0, token1, activeTick).toString({
      significant: PRICE_SIGNIFICANT_DIGITS,
    }),
  }

  const subsequentTicks = computeSurroundingTicks(
    token0,
    token1,
    activeTickProcessed,
    ticks,
    pivot,
    true,
  )
  const previousTicks = computeSurroundingTicks(
    token0,
    token1,
    activeTickProcessed,
    ticks,
    pivot,
    false,
  )

  return previousTicks.concat(activeTickProcessed).concat(subsequentTicks)
}

// Computes the numSurroundingTicks above or below the active tick.
export function computeSurroundingTicks(
  token0: EvmCurrency,
  token1: EvmCurrency,
  activeTickProcessed: TickProcessed,
  sortedTickData: InitializedTick[],
  pivot: number,
  ascending: boolean,
): TickProcessed[] {
  let previousTickProcessed: TickProcessed = {
    ...activeTickProcessed,
  }
  // Iterate outwards (either up or down depending on direction) from the active tick,
  // building active liquidity for every tick.
  let processedTicks: TickProcessed[] = []
  // The pivot is -1 when the active tick sits below every initialized tick
  const pivotIsActiveTick =
    pivot >= 0 &&
    Number(sortedTickData[pivot].tickIdx) === activeTickProcessed.tick
  const startIndex = ascending ? pivot + 1 : pivot - (pivotIsActiveTick ? 1 : 0)

  for (
    let i = startIndex;
    ascending ? i < sortedTickData.length : i >= 0;
    ascending ? i++ : i--
  ) {
    const tick = Number(sortedTickData[i].tickIdx)
    const currentTickProcessed: TickProcessed = {
      liquidityActive: previousTickProcessed.liquidityActive,
      tick,
      liquidityNet: sortedTickData[i].liquidityNet,
      // Orders native as the pool does; equals V3's tickToPrice for tokens
      price0: sushiSwapV4TickToPrice(token0, token1, tick).toString({
        significant: PRICE_SIGNIFICANT_DIGITS,
      }),
    }

    // Update the active liquidity.
    // If we are iterating ascending and we found an initialized tick we immediately apply
    // it to the current processed tick we are building.
    // If we are iterating descending, we don't want to apply the net liquidity until the following tick.
    if (ascending) {
      currentTickProcessed.liquidityActive =
        previousTickProcessed.liquidityActive + sortedTickData[i].liquidityNet
    } else if (!ascending && previousTickProcessed.liquidityNet !== 0n) {
      // We are iterating descending, so look at the previous tick and apply any net liquidity.
      currentTickProcessed.liquidityActive =
        previousTickProcessed.liquidityActive -
        previousTickProcessed.liquidityNet
    }

    processedTicks.push(currentTickProcessed)
    previousTickProcessed = currentTickProcessed
  }

  if (!ascending) {
    processedTicks = processedTicks.reverse()
  }

  return processedTicks
}
