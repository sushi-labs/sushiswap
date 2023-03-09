import { Token } from './Token'

export function addressMapToTokenMap(
  { decimals, symbol, name }: { decimals: number; symbol?: string; name?: string },
  map: Record<number | string, string>
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
