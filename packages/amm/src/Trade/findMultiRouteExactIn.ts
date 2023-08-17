import { Token } from '@sushiswap/currency'
import { findMultiRouteExactIn as TinesFindMultiRouteExactIn, MultiRoute, RToken } from '@sushiswap/tines'

import { SushiSwapV2Pool } from '@sushiswap/v2-sdk'
import { Pool } from '@sushiswap/base-sdk'
import { convertPoolOrPairtoRPool } from './convertPoolOrPairtoRPool'

export function findMultiRouteExactIn(
  from: Token,
  to: Token,
  amountIn: bigint | number,
  pools: (Pool | SushiSwapV2Pool)[],
  baseToken: Token,
  gasPrice: number
): MultiRoute {
  return TinesFindMultiRouteExactIn(
    from as RToken,
    to as RToken,
    amountIn,
    pools.map((pool) => convertPoolOrPairtoRPool(pool)),
    baseToken as RToken,
    gasPrice
  )
}
