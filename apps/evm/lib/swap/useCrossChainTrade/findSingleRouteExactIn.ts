import {
  MultiRoute,
  RToken,
  findSingleRouteExactIn as TinesFindSingleRouteExactIn,
} from '@sushiswap/tines'
import { SushiSwapV2Pool } from '@sushiswap/v2-sdk'
import { Token } from 'sushi/currency'
import { Pool } from 'sushi/dex'
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
