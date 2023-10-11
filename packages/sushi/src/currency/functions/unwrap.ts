import { Native } from '../Native.js'
import { type Type } from '../Type.js'

export const unwrapToken = (currency: Type) => {
  return currency.wrapped.address ===
    Native.onChain(currency.chainId).wrapped.address
    ? Native.onChain(currency.chainId)
    : currency
}
