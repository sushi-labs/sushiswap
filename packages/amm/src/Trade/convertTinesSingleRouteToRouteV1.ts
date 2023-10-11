import { Type as Currency } from 'sushi/currency'
import { MultiRoute } from '@sushiswap/tines'

import { SushiSwapV2Pool } from '@sushiswap/v2-sdk'
import { RouteV1 } from '../Route'

export function convertTinesSingleRouteToRouteV1<
  TInput extends Currency,
  TOutput extends Currency,
>(
  route: MultiRoute,
  pairs: SushiSwapV2Pool[],
  input: TInput,
  output: TOutput,
): RouteV1<TInput, TOutput> {
  const pairHash = new Map<string, SushiSwapV2Pool>()
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
    output,
  )
}
