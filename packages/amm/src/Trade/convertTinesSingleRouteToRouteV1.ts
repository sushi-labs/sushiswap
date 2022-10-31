import { Type as Currency } from '@sushiswap/currency'
import { MultiRoute } from '@sushiswap/tines'

import { Pair } from '../Pair'
import { RouteV1 } from '../Route'

export function convertTinesSingleRouteToRouteV1<TInput extends Currency, TOutput extends Currency>(
  route: MultiRoute,
  pairs: Pair[],
  input: TInput,
  output: TOutput
): RouteV1<TInput, TOutput> {
  const pairHash = new Map<string, Pair>()
  pairs.forEach((pair) => pairHash.set(pair.liquidityToken.address, pair))
  return new RouteV1(
    route.legs.map((leg) => {
      const pair = pairHash.get(leg.poolAddress)
      if (pair === undefined) {
        throw new Error('Internal Error 119')
      }
      return pair
    }),
    input,
    output
  )
}
