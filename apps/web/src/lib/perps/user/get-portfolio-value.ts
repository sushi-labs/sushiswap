interface GetPortfolioValueArgs {
  isUnifiedAccount: boolean
  perpsEquity: number
  spotEquity: number
}

export function getPortfolioValue({
  isUnifiedAccount,
  perpsEquity,
  spotEquity,
}: GetPortfolioValueArgs): number {
  return isUnifiedAccount ? spotEquity : perpsEquity + spotEquity
}
