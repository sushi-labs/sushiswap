import type {
  PortfolioWallet,
  PortfolioWalletToken,
} from '@sushiswap/graph-client/data-api'

export function getPortfolioTokenTotals(
  tokens: readonly Pick<
    PortfolioWalletToken,
    'amountUSD' | 'amountUSD24Change'
  >[],
): Pick<
  PortfolioWallet,
  'totalUSD' | 'amountUSD24Change' | 'percentageChange24h'
> {
  let totalUSD = 0
  let amountUSD24Change = 0
  let hasAnyChangeData = false

  // Match the API: aggregate available values without requiring every row.
  for (const token of tokens) {
    totalUSD += token.amountUSD ?? 0
    if (token.amountUSD24Change !== null) {
      hasAnyChangeData = true
      amountUSD24Change += token.amountUSD24Change
    }
  }

  const previousTotalUSD = totalUSD - amountUSD24Change

  return {
    totalUSD,
    amountUSD24Change: hasAnyChangeData ? amountUSD24Change : null,
    percentageChange24h:
      hasAnyChangeData && previousTotalUSD !== 0
        ? amountUSD24Change / previousTotalUSD
        : null,
  }
}
