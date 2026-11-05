import { Amount, type ChainId, type Currency, type Price } from 'sushi'
import {
  DAI,
  type EvmChainId,
  type EvmCurrency,
  EvmNative,
  EvmToken,
  type Incentive,
  type Position,
  SUSHI,
  SushiSwapV2Pool,
  USDC,
  USDT,
  WBTC,
} from 'sushi/evm'
import { Bound } from './constants'

export type SushiTokenChainId = keyof typeof SUSHI

export function isSushiTokenChainId(
  chainId: ChainId,
): chainId is SushiTokenChainId {
  return Object.hasOwn(SUSHI, chainId)
}

export function isSushiToken(currency: Currency | undefined): boolean {
  if (
    !currency ||
    currency.type === 'native' ||
    !isSushiTokenChainId(currency.chainId)
  ) {
    return false
  }

  return (
    SUSHI[currency.chainId].address.toLowerCase() ===
    currency.address.toLowerCase()
  )
}

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

interface FormatTickPriceArgs {
  price: Price<EvmCurrency, EvmCurrency> | undefined
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
