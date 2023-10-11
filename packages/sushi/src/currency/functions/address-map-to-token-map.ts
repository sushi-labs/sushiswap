import { Token } from '../Token.js'

export function addressMapToTokenMap(
  {
    decimals,
    symbol,
    name,
  }: {
    decimals: number | string
    symbol?: string | undefined
    name?: string | undefined
  },
  map: Record<number | string, string>,
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
    ]),
  )
}
