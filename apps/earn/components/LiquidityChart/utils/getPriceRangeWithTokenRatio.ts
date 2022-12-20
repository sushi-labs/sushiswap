const MIN_SQRT_PRICE_APPROX = 2 ** -56
const MAX_SQRT_PRICE_APPROX = 2 ** 56

const getPriceLowerWithTokenRatio = (priceCurrent: number, priceUpper: number, weight0: number): number => {
  if (priceCurrent >= priceUpper) throw new Error('invalid inputs')

  const z = (1 / weight0 - 1) * priceCurrent
  const sqrtP = Math.sqrt(priceCurrent)
  const sqrtPLower = sqrtP - z * (1 / sqrtP - 1 / Math.sqrt(priceUpper))
  return Math.max(sqrtPLower, MIN_SQRT_PRICE_APPROX) ** 2
}

const getPriceUpperWithTokenRatio = (priceCurrent: number, priceLower: number, weight0: number): number => {
  if (priceLower >= priceCurrent) throw new Error('invalid inputs')

  const z = (1 / weight0 - 1) * priceCurrent
  const sqrtP = Math.sqrt(priceCurrent)
  const denom = z - (sqrtP - Math.sqrt(priceLower)) * sqrtP
  if (denom <= 0) return MAX_SQRT_PRICE_APPROX ** 2
  const sqrtUpper = (z * sqrtP) / denom
  return Math.min(sqrtUpper, MAX_SQRT_PRICE_APPROX) ** 2
}

/**
 * Given a price range, we alter the range to fit a desired token weight.
 * Note that the resulted price range has not been snapped to fit tick-spacing.
 */
export const getPriceRangeWithTokenRatio = (
  priceCurrent: number,
  priceLower: number,
  priceUpper: number,
  independentBound: 'LOWER' | 'UPPER',
  weight0: number
): [number, number] => {
  if (weight0 === 1) {
    return [Math.max(priceLower, priceCurrent), Math.max(priceUpper, priceCurrent)]
  }
  if (weight0 === 0) {
    return [Math.min(priceLower, priceCurrent), Math.min(priceUpper, priceCurrent)]
  }

  // flipped
  if (weight0 < 1 && priceLower > priceCurrent && independentBound === 'LOWER') {
    independentBound = 'UPPER'
    priceUpper = priceLower
    priceLower = NaN
  }
  if (weight0 > 0 && priceUpper < priceCurrent && independentBound === 'UPPER') {
    independentBound = 'LOWER'
    priceLower = priceUpper
    priceUpper = NaN
  }

  if (independentBound === 'LOWER') {
    return [priceLower, getPriceUpperWithTokenRatio(priceCurrent, priceLower, weight0)]
  } else {
    return [getPriceLowerWithTokenRatio(priceCurrent, priceUpper, weight0), priceUpper]
  }
}
