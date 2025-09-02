import { Amount, Price } from 'sushi'
import {
  DAI,
  type EvmChainId,
  EvmNative,
  EvmToken,
  type Incentive,
  type Position,
  SushiSwapV2Pool,
  type SushiSwapV3FeeAmount,
  TICK_SPACINGS,
  TickMath,
  USDC,
  USDT,
  WBTC,
  encodeSqrtRatioX96,
  nearestUsableTick,
  priceToClosestTick,
  tickToPrice,
} from 'sushi/evm'
import { Bound } from './constants'
import type { useTicks } from './hooks'
import type { TickProcessed } from './pool/v3/use-concentrated-active-liquidity'

export const isSushiSwapV2Pool = (
  pool: SushiSwapV2Pool | null,
): pool is SushiSwapV2Pool => {
  return pool instanceof SushiSwapV2Pool
}

export const incentiveRewardToToken = (
  chainId: EvmChainId,
  incentive: Incentive,
): EvmToken => {
  return new EvmToken({
    chainId,
    address: incentive.rewardToken.address,
    symbol: incentive.rewardToken.symbol,
    decimals: incentive.rewardToken.decimals,
    name: incentive.rewardToken.name,
  })
}

export function getTickToPrice(
  baseToken?: EvmToken,
  quoteToken?: EvmToken,
  tick?: number,
): Price<EvmToken, EvmToken> | undefined {
  if (!baseToken || !quoteToken || typeof tick !== 'number') {
    return undefined
  }
  return tickToPrice(baseToken, quoteToken, tick)
}

export function tryParsePrice(
  baseToken?: EvmToken,
  quoteToken?: EvmToken,
  value?: string,
) {
  if (!baseToken || !quoteToken || !value) {
    return undefined
  }

  if (!value.match(/^\d*\.?\d+$/)) {
    return undefined
  }

  const [whole, fraction] = value.split('.')

  const decimals = fraction?.length ?? 0
  const withoutDecimals = BigInt((whole ?? '') + (fraction ?? ''))

  return new Price({
    base: baseToken,
    quote: quoteToken,
    numerator: withoutDecimals * BigInt(10 ** quoteToken.decimals),
    denominator: BigInt(10 ** decimals) * BigInt(10 ** baseToken.decimals),
  })
}

export function tryParseTick(
  baseToken?: EvmToken,
  quoteToken?: EvmToken,
  feeAmount?: SushiSwapV3FeeAmount,
  value?: string,
): number | undefined {
  if (!baseToken || !quoteToken || !feeAmount || !value) {
    return undefined
  }

  const price = tryParsePrice(baseToken, quoteToken, value)

  if (!price) {
    return undefined
  }

  let tick: number

  // check price is within min/max bounds, if outside return min/max
  const sqrtRatioX96 = encodeSqrtRatioX96(price.numerator, price.denominator)

  if (sqrtRatioX96 >= TickMath.MAX_SQRT_RATIO) {
    tick = TickMath.MAX_TICK
  } else if (sqrtRatioX96 <= TickMath.MIN_SQRT_RATIO) {
    tick = TickMath.MIN_TICK
  } else {
    // this function is agnostic to the base, will always return the correct tick
    tick = priceToClosestTick(price)
  }

  return nearestUsableTick(tick, TICK_SPACINGS[feeAmount])
}

export function getPriceOrderingFromPositionForUI(position?: Position): {
  priceLower?: Price<EvmToken, EvmToken>
  priceUpper?: Price<EvmToken, EvmToken>
  quote?: EvmToken
  base?: EvmToken
} {
  if (!position) {
    return {}
  }

  const token0 = position.amount0.currency
  const token1 = position.amount1.currency
  const chainId = position.amount0.currency.chainId

  // if token0 is a dollar-stable asset, set it as the quote token
  const stables = [
    DAI[chainId as keyof typeof DAI],
    USDC[chainId as keyof typeof USDC],
    USDT[chainId as keyof typeof USDT],
  ].filter(Boolean)

  if (stables.some((stable) => stable.isSame(token0))) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    }
  }

  // if token1 is an ETH-/BTC-stable asset, set it as the base token
  const bases = [
    EvmNative.fromChainId(chainId).wrap(),
    WBTC[chainId as keyof typeof WBTC],
  ].filter(Boolean)

  if (bases.some((base) => base.isSame(token1))) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    }
  }

  // if both prices are below 1, invert
  if (position.token0PriceUpper.lt(1)) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    }
  }

  // otherwise, just return the default
  return {
    priceLower: position.token0PriceLower,
    priceUpper: position.token0PriceUpper,
    quote: token1,
    base: token0,
  }
}

const PRICE_FIXED_DIGITS = 8

// Computes the numSurroundingTicks above or below the active tick.
export default function computeSurroundingTicks(
  token0: EvmToken,
  token1: EvmToken,
  activeTickProcessed: TickProcessed,
  sortedTickData: NonNullable<ReturnType<typeof useTicks>['data']>,
  pivot: number,
  ascending: boolean,
): TickProcessed[] {
  let previousTickProcessed: TickProcessed = {
    ...activeTickProcessed,
  }
  // Iterate outwards (either up or down depending on direction) from the active tick,
  // building active liquidity for every tick.
  let processedTicks: TickProcessed[] = []
  for (
    let i = pivot + (ascending ? 1 : -1);
    ascending ? i < sortedTickData.length : i >= 0;
    ascending ? i++ : i--
  ) {
    const tick = Number(sortedTickData[i].tickIdx)
    const currentTickProcessed: TickProcessed = {
      liquidityActive: previousTickProcessed.liquidityActive,
      tick,
      liquidityNet: sortedTickData[i].liquidityNet,
      price0: tickToPrice(token0, token1, tick).toString({
        fixed: PRICE_FIXED_DIGITS,
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

interface FormatTickPriceArgs {
  price: Price<EvmToken, EvmToken> | undefined
  atLimit: { [_bound in Bound]?: boolean | undefined }
  direction: Bound
  placeholder?: string
}

export function formatTickPrice({
  price,
  atLimit,
  direction,
  placeholder,
}: FormatTickPriceArgs) {
  if (atLimit[direction]) {
    return direction === Bound.LOWER ? '0' : '∞'
  }

  if (!price && placeholder !== undefined) {
    return placeholder
  }

  return price?.toSignificant(6)
}

export const rewardPerDay = ({
  start,
  end,
  amount,
  token,
}: {
  start: number
  end: number
  amount: number
  token: EvmToken
}) => {
  const days = (end - start) / 3600 / 24
  return Amount.fromHuman(token, (amount / days).toFixed(8))
}

export function parseArgs<T>(args?: Partial<T>) {
  if (!args) return ''
  return Object.entries(args)
    .sort(([key1], [key2]) => key1.localeCompare(key2))
    .reduce((acc, [key, value]) => {
      if (value === undefined || value === null) return acc
      if (Array.isArray(value) && value.length === 0) return acc
      const param = `${key}=${Array.isArray(value) ? value.join(',') : value}`
      if (acc === '?') {
        return `${acc}${param}`
      } else {
        return `${acc}&${param}`
      }
    }, '?')
}
