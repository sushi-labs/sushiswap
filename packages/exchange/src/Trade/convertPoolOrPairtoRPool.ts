import { BigNumber } from '@ethersproject/bignumber'
import { ConstantProductRPool, RPool, RToken, StableSwapRPool } from '@sushiswap/tines'

import { ConstantProductPool } from '../ConstantProductPool'
import { Fee } from '../Fee'
import { Pair } from '../Pair'
import { Pool } from '../Pool'
import { StablePool } from '../StablePool'

export function convertPoolOrPairtoRPool(pool: Pool | Pair): RPool {
  if (pool instanceof Pair) {
    return new ConstantProductRPool(
      pool.liquidityToken.address,
      pool.token0 as RToken,
      pool.token1 as RToken,
      Fee.DEFAULT / 10000,
      BigNumber.from(pool.reserve0.quotient.toString()),
      BigNumber.from(pool.reserve1.quotient.toString())
    )
  } else if (pool instanceof ConstantProductPool) {
    return new ConstantProductRPool(
      pool.liquidityToken.address,
      pool.assets[0].wrapped as RToken,
      pool.assets[1].wrapped as RToken,
      pool.fee / 10000,
      BigNumber.from(pool.reserves[0].quotient.toString()),
      BigNumber.from(pool.reserves[1].quotient.toString())
    )
  } else if (pool instanceof StablePool) {
    return new StableSwapRPool(
      pool.liquidityToken.address,
      pool.token0 as RToken,
      pool.token1 as RToken,
      pool.fee / 10000,
      BigNumber.from(pool.reserve0.quotient.toString()),
      BigNumber.from(pool.reserve1.quotient.toString()),
      pool.token0.decimals,
      pool.token1.decimals,
      // JSBI.toNumber(pool.decimals0),
      // JSBI.toNumber(pool.decimals1),

      // { elastic: BigNumber.from(pool.total0.elastic.toString()), base: BigNumber.from(pool.total0.base.toString()) },
      // { elastic: BigNumber.from(pool.total1.elastic.toString()), base: BigNumber.from(pool.total1.base.toString()) }

      { elastic: BigNumber.from(1), base: BigNumber.from(1) },
      { elastic: BigNumber.from(1), base: BigNumber.from(1) }
    )
  } else {
    throw new Error('Unsupported type of pool !!!')
  }
}
