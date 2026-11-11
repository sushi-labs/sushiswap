import { Bound } from 'src/lib/constants'
import type { Price } from 'sushi'
import type { EvmCurrency } from 'sushi/evm'

/**
 * A range as displayed, from its ticks' prices of currency0: inverted, the
 * min is the upper tick's price inverted and the max the lower's.
 */
export function getDisplayedRange<TCurrency extends EvmCurrency>(
  pricesAtTicks: {
    [Bound.LOWER]: Price<TCurrency, TCurrency> | undefined
    [Bound.UPPER]: Price<TCurrency, TCurrency> | undefined
  },
  ticksAtLimit: { [Bound.LOWER]: boolean; [Bound.UPPER]: boolean },
  invertPrice: boolean,
): {
  minPrice: Price<TCurrency, TCurrency> | undefined
  maxPrice: Price<TCurrency, TCurrency> | undefined
  minAtLimit: boolean
  maxAtLimit: boolean
} {
  const { [Bound.LOWER]: lower, [Bound.UPPER]: upper } = pricesAtTicks
  return {
    minPrice: invertPrice ? upper?.invert() : lower,
    maxPrice: invertPrice ? lower?.invert() : upper,
    minAtLimit: Boolean(ticksAtLimit[invertPrice ? Bound.UPPER : Bound.LOWER]),
    maxAtLimit: Boolean(ticksAtLimit[invertPrice ? Bound.LOWER : Bound.UPPER]),
  }
}
