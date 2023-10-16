import {
  ConstantProductRPool,
  MultiRoute,
  RouteLeg,
  RPool,
  StableSwapRPool,
} from '@sushiswap/tines'
import { ethers } from 'ethers'

import { HEXer } from '../HEXer'
import { LiquidityProviders } from '../liquidity-providers'
import { PoolCode } from './PoolCode'

function getPoolTypeTicker(pool: RPool): string {
  if (pool instanceof ConstantProductRPool) return 'Classic'
  if (pool instanceof StableSwapRPool) return 'Stable'
  return ''
}

export class BentoPoolCode extends PoolCode {
  constructor(
    pool: RPool,
    liquidityProvider: LiquidityProviders,
    providerName: string,
  ) {
    super(
      pool,
      liquidityProvider,
      `${providerName} ${getPoolTypeTicker(pool)} ${(pool?.fee || 0) * 100}%`,
    )
  }

  getSwapCodeForRouteProcessor(
    leg: RouteLeg,
    _route: MultiRoute,
    to: string,
  ): string {
    const coder = new ethers.utils.AbiCoder()
    // TODO: add unwrap bento = true variant
    // address tokenIn, address recipient, bool unwrapBento
    const poolData = coder.encode(
      ['address', 'address', 'bool'],
      [leg.tokenFrom.address, to, false],
    )
    const code = new HEXer()
      .uint8(21) // swapTrident
      .address(leg.poolAddress)
      .bytes(poolData)
      .toString()

    return code
  }

  override getSwapCodeForRouteProcessor2(
    leg: RouteLeg,
    _route: MultiRoute,
    to: string,
  ): string {
    // TODO: add unwrap bento = true optimization
    const coder = new ethers.utils.AbiCoder()
    // address tokenIn, address recipient, bool unwrapBento
    const poolData = coder.encode(
      ['address', 'address', 'bool'],
      [leg.tokenFrom.address, to, false],
    )
    const code = new HEXer()
      .uint8(4) // swapTrident
      .address(leg.poolAddress)
      .bytes(poolData)
      .toString()

    return code
  }
}
