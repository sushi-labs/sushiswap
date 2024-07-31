import { Native } from './native.js'
import { type Type } from './type.js'

export const unwrapToken = (currency: Type) => {
  return currency.wrapped.address ===
    Native.onChain(currency.chainId).wrapped.address
    ? Native.onChain(currency.chainId)
    : currency
}
