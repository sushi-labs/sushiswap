import { BigNumber } from '@ethersproject/bignumber'
import { Token } from '@sushiswap/currency'
import { findMultiRouteExactIn as TinesFindMultiRouteExactIn, MultiRoute, RToken } from '@sushiswap/tines'

import { Pair } from '../Pair'
import { Pool } from '../Pool'
import { convertPoolOrPairtoRPool } from './convertPoolOrPairtoRPool'

export function findMultiRouteExactIn(
  from: Token,
  to: Token,
  amountIn: BigNumber | number,
  pools: (Pool | Pair)[],
  baseToken: Token,
  gasPrice: number
): MultiRoute {
  return TinesFindMultiRouteExactIn(
    from as RToken,
    to as RToken,
    amountIn,
    pools.map(pool => convertPoolOrPairtoRPool(pool)),
    baseToken as RToken,
    gasPrice
  )
}
