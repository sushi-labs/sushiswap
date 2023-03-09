import { Amount, Currency } from '@sushiswap/currency'

export function toHex(currencyAmount: Amount<Currency>) {
  return `0x${currencyAmount.quotient.toString(16)}`
}
