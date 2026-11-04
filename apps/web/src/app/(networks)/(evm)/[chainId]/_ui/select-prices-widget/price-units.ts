import { Fraction, withoutScientificNotation } from 'sushi'

export interface PriceDisplayUnits {
  inverted: boolean
  usdPrice?: number
}

export function isUsableUsdPrice(price: number | undefined): price is number {
  return typeof price === 'number' && Number.isFinite(price) && price > 0
}

function parsePositiveDecimal(value: string): Fraction | undefined {
  // Bound untrusted input before constructing big integers. Do not pass NaN,
  // infinity, negative values, or exponent syntax into the mint provider.
  if (value.length > 400 || !/^(?:\d+\.?\d*|\.\d+)$/.test(value)) {
    return undefined
  }
  const [integer, decimal = ''] = value.split('.')
  const numerator = BigInt(`${integer || '0'}${decimal}`)
  if (numerator === 0n) return undefined
  return new Fraction({ numerator, denominator: 10n ** BigInt(decimal.length) })
}

function usdFraction(price: number | undefined): Fraction | undefined {
  return isUsableUsdPrice(price)
    ? parsePositiveDecimal(withoutScientificNotation(String(price)) ?? '')
    : undefined
}

// Pair values always remain in the original form's token1-per-token0 units.
// Conversions are only committed when the user edits a field.
export function toDisplayPrice(
  value: string,
  { inverted, usdPrice }: PriceDisplayUnits,
): string {
  const parsed = parsePositiveDecimal(value)
  if (!parsed) return ''
  const rate = usdFraction(usdPrice)
  if (usdPrice !== undefined && !rate) return ''
  const price = inverted ? parsed.invert() : parsed
  return (rate ? price.mul(rate) : price).toString({ significant: 8 })
}

export function toPairPrice(
  value: string,
  { inverted, usdPrice }: PriceDisplayUnits,
): string {
  const parsed = parsePositiveDecimal(value)
  if (!parsed) return ''
  const rate = usdFraction(usdPrice)
  if (usdPrice !== undefined && !rate) return ''
  const price = rate ? parsed.div(rate) : parsed
  const result = (inverted ? price.invert() : price).toString({
    significant: 24,
  })
  // The existing tick parser scales by 10 ** decimalPlaces. Keep conversions
  // outside its finite numeric range from reaching it (including underflow).
  const decimalPlaces = result.split('.')[1]?.length ?? 0
  return decimalPlaces <= 308 &&
    Number.isFinite(Number(result)) &&
    Number(result) > 0
    ? result
    : ''
}
