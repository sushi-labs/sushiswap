import { Native } from './Native'
import { Type } from './Type'

export const unwrapToken = (currency: Type) => {
  return currency.wrapped.address === Native.onChain(currency.chainId).wrapped.address
    ? Native.onChain(currency.chainId)
    : currency
}
