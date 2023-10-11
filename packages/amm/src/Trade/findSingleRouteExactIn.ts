import { Token } from 'sushi/currency'
import {
  findSingleRouteExactIn as TinesFindSingleRouteExactIn,
  MultiRoute,
  RToken,
} from '@sushiswap/tines'

import { SushiSwapV2Pool } from '@sushiswap/v2-sdk'
import { Pool } from '@sushiswap/base-sdk'
import { convertPoolOrPairtoRPool } from './convertPoolOrPairtoRPool'

export function findSingleRouteExactIn(
  from: Token,
  to: Token,
  amountIn: bigint | number,
  pools: (Pool | SushiSwapV2Pool)[],
  baseToken: Token,
  gasPrice: number,
): MultiRoute {
  return TinesFindSingleRouteExactIn(
    from as RToken,
    to as RToken,
    amountIn,
    pools.map((pool) => convertPoolOrPairtoRPool(pool)),
    baseToken as RToken,
    gasPrice,
  )
}
