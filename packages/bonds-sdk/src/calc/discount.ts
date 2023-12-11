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

  const shift = baseScale / marketScale
  const price = marketPrice * shift
  const quoteTokensPerPayoutToken = price / 10n ** 36n
  const discountedPrice =
    Number(quoteTokensPerPayoutToken) * quoteToken.priceUSD

  let discount = (discountedPrice - payoutToken.priceUSD) / payoutToken.priceUSD
  discount += 100

  return discount
}
