interface GetBondDiscount {
  marketPrice: bigint
  marketScale: bigint
  payoutToken: {
    decimals: number
    priceUSD: number
  }
  quoteToken: {
    decimals: number
    priceUSD: number
  }
}

/**
 * @see https://dev.bondprotocol.finance/developers/market-calculations
 */
export function getBondDiscount({
  payoutToken,
  quoteToken,
  marketScale,
  marketPrice,
}: GetBondDiscount) {
  const baseScale =
    10n ** BigInt(36 + payoutToken.decimals - quoteToken.decimals)

  console.log(baseScale)

  const shift = Number(baseScale) / Number(marketScale)
  console.log(shift)
  const price = Number(marketPrice) * shift
  console.log(price)
  const quoteTokensPerPayoutToken = price / 10 ** 36
  console.log(quoteTokensPerPayoutToken)
  const discountedPrice = quoteTokensPerPayoutToken * quoteToken.priceUSD
  console.log('discountedPrice', discountedPrice)

  const discount = discountedPrice / payoutToken.priceUSD
  console.log('discount', discount)

  return discount
}
