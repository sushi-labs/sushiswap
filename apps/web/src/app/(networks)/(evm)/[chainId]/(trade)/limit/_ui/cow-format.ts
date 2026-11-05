import { Amount } from 'sushi'
import type { EvmCurrency } from 'sushi/evm'

export function formatCowTokenAmount(
  currency: EvmCurrency,
  amount: bigint | string,
): string {
  return `${new Amount(currency, amount).toSignificant(6)} ${currency.symbol}`
}

// CoW timestamps (`validTo`) are in seconds.
export function formatCowTimestamp(seconds: number): string {
  return new Date(seconds * 1000).toLocaleString()
}
