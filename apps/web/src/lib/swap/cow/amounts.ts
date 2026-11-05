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

export function formatLimitPrice(price: CowLimitPrice): string {
  return price.toString({ maxFixed: 24 })
}

export function getRemainingSellAmount(order: {
  sellAmount: string
  executedSellAmountBeforeFees: string
}): bigint {
  const remaining =
    BigInt(order.sellAmount) - BigInt(order.executedSellAmountBeforeFees)
  return remaining > 0n ? remaining : 0n
}
