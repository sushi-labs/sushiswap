import { ChainId, Currency, CurrencyAmount, NATIVE, WNATIVE } from '@sushiswap/core-sdk'

export function unwrappedToken(currency: Currency): Currency {
  if (currency.isNative) return currency

  // @ts-ignore TYPE NEEDS FIXING
  if (currency.chainId in ChainId && currency.equals(WNATIVE[currency.chainId])) return NATIVE[currency.chainId]

  return currency
}

export function unwrappedCurrencyAmount(amount?: CurrencyAmount<Currency>): CurrencyAmount<Currency> | undefined {
  if (!amount) return

  const native = NATIVE[amount.currency.chainId]
  return CurrencyAmount.fromRawAmount(native, amount.quotient)
}

export const isWrappedReturnNativeSymbol = (chainId: ChainId | undefined, address: string): string => {
  if (!chainId) return address
  if (address.toLowerCase() === WNATIVE[chainId].address.toLowerCase()) {
    // @ts-ignore TYPE NEEDS FIXING
    return NATIVE[chainId].symbol
  }

  return address
}
