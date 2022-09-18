import { Amount, Currency } from '@sushiswap/currency'

// TODO: Expose on "Amount" rather than seperate function
export function toHex(currencyAmount: Amount<Currency>) {
  return `0x${currencyAmount.quotient.toString(16)}`
}
