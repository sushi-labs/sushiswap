import { Fraction, withoutScientificNotation } from 'sushi'

/** The preset ranges of the concentrated liquidity range selectors. */
export enum PriceRange {
  FULL_RANGE = 0,
  BPS_20000 = 1,
  BPS_12000 = 2,
  BPS_10100 = 3,
  LEFT_SIDE = 4,
  RIGHT_SIDE = 5,
}

/** The ×÷ presets, each a range of the current price ÷ and × a multiplier. */
export const PRICE_RANGE_MULTIPLIERS = [
  {
    label: '×÷2',
    value: PriceRange.BPS_20000,
    multiplier: new Fraction({ numerator: 20000, denominator: 10000 }),
  },
  {
    label: '×÷1.2',
    value: PriceRange.BPS_12000,
    multiplier: new Fraction({ numerator: 12000, denominator: 10000 }),
  },
  {
    label: '×÷1.01',
    value: PriceRange.BPS_10100,
    multiplier: new Fraction({ numerator: 10100, denominator: 10000 }),
  },
] as const

// Enough digits to land within a tick of the intended price at any magnitude
const TYPED_PRICE_SIGNIFICANT_DIGITS = 8
// Far below the precision a pool's sqrt price keeps
const START_PRICE_SIGNIFICANT_DIGITS = 18

/** A start price for its typed input, with no meaningful precision lost. */
export function formatStartPrice(price: Fraction): string {
  return price.toSignificant(START_PRICE_SIGNIFICANT_DIGITS)
}

/** A price as a number, such as a chart's, for a typed input: a plain decimal. */
export function formatTypedPriceNumber(value: number): string {
  const rounded = value.toPrecision(TYPED_PRICE_SIGNIFICANT_DIGITS)
  return withoutScientificNotation(rounded) ?? rounded
}
