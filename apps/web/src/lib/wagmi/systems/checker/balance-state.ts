export type BalanceState = 'known' | 'loading' | 'unavailable'

export function getBalanceState(
  balances: object | undefined,
  isError: boolean,
): BalanceState {
  if (isError) return 'unavailable'
  if (!balances) return 'loading'
  return 'known'
}

export function hasSufficientBalance<TAmount>(
  amounts: readonly (TAmount | undefined)[],
  getBalance: (amount: TAmount) => TAmount | undefined,
  isLessThan: (balance: TAmount, amount: TAmount) => boolean,
): boolean {
  return amounts.every((amount) => {
    if (!amount) return true
    const balance = getBalance(amount)
    return balance !== undefined && !isLessThan(balance, amount)
  })
}
