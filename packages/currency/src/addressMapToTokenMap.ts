import { AddressMap } from './AddressMap'
import { Token } from './Token'

export function addressMapToTokenMap(
  { decimals, symbol, name }: { decimals: number; symbol?: string; name?: string },
  map: AddressMap
) {
  return Object.fromEntries(
    Object.entries(map).map(([chainId, address]) => [
      chainId,
      new Token({
        chainId,
        address,
        decimals,
        symbol,
        name,
      }),
    ])
  )
}
