import { Amount, type Fraction, Price } from 'sushi'
import type { EvmCurrency } from 'sushi/evm'
import { maxUint256 } from 'viem'

export type CowLimitPrice = Price<EvmCurrency, EvmCurrency>

// `price` is a raw buy-per-sell ratio, e.g. a sushi `Price` or an order's amounts.
export function getLimitBuyAmount(sellAmount: bigint, price: Fraction): bigint {
  if (sellAmount <= 0n || price.numerator <= 0n || price.denominator <= 0n) {
    throw new Error('Enter a positive amount and limit price')
  }
  const numerator = sellAmount * price.numerator
  // Round the minimum receipt up: rounding down would weaken the user's limit.
  const buyAmount = (numerator + price.denominator - 1n) / price.denominator
  if (buyAmount > maxUint256) throw new Error('Limit amount is too large')
  return buyAmount
}

export function getOrderPrice(
  order: { sellAmount: string; buyAmount: string },
  sell: EvmCurrency,
  buy: EvmCurrency,
): CowLimitPrice {
  return new Price({
    baseAmount: new Amount(sell, order.sellAmount),
    quoteAmount: new Amount(buy, order.buyAmount),
  })
}

// USD quotes are floats; this fixed scale keeps their precision in integer math.
const USD_SCALE = 1e18

// An estimate of the market rate from two USD prices, for display and presets
// when no CoW quote is available, e.g. before an amount is entered.
export function getUsdMarketPrice(
  sell: EvmCurrency,
  buy: EvmCurrency,
  sellUsd: number | undefined,
  buyUsd: number | undefined,
): CowLimitPrice | undefined {
  if (!sellUsd || !buyUsd || !(sellUsd > 0) || !(buyUsd > 0)) return undefined
  const sellScaled = BigInt(Math.round(sellUsd * USD_SCALE))
  const buyScaled = BigInt(Math.round(buyUsd * USD_SCALE))
  if (sellScaled === 0n || buyScaled === 0n) return undefined
  // Raw buy-per-sell units: (sellUsd / buyUsd) * 10^buyDecimals / 10^sellDecimals.
  return new Price({
    base: sell,
    quote: buy,
    numerator: sellScaled * 10n ** BigInt(buy.decimals),
    denominator: buyScaled * 10n ** BigInt(sell.decimals),
  })
}

// The percentage by which `price` is above (positive) or below `market`.
export function getPriceDifference(
  price: CowLimitPrice,
  market: CowLimitPrice,
): Fraction {
  return price.div(market).sub(1).mul(100)
}

// e.g. "+5%" or "-1.25%"
export function formatPriceDifference(difference: Fraction): string {
  return `${difference.lt(0) ? '' : '+'}${difference.toString({ maxFixed: 2 })}%`
}

export function getRemainingSellAmount(order: {
  sellAmount: string
  executedSellAmountBeforeFees: string
}): bigint {
  const remaining =
    BigInt(order.sellAmount) - BigInt(order.executedSellAmountBeforeFees)
  return remaining > 0n ? remaining : 0n
}
