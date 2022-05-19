import { Type as Currency } from '@sushiswap/currency'
import { MultiRoute } from '@sushiswap/tines'

import { Pair } from '../Pair'
import { RouteV1 } from '../Route'

export function convertTinesSingleRouteToRouteV1<TInput extends Currency, TOutput extends Currency>(
  route: MultiRoute,
  allPairs: Pair[],
  input: TInput,
  output: TOutput,
): RouteV1<TInput, TOutput> {
  const pairHash = new Map<string, Pair>()
  allPairs.forEach((p) => pairHash.set(p.liquidityToken.address, p))
  const pairs = route.legs.map((l) => {
    const pair = pairHash.get(l.poolAddress)
    if (pair === undefined) {
      throw new Error('Internal Error 119')
    }
    return pair
  })
  return new RouteV1(pairs, input, output)
}
