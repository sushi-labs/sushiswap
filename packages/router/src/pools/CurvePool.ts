import type { CurvePool, MultiRoute, RouteLeg } from '@sushiswap/tines'
import { ChainId } from 'sushi/chain'

import { HEXer } from '../HEXer'
import {
  CURVE_NON_FACTORY_POOLS,
  CurvePoolType,
  LiquidityProviders,
} from '../liquidity-providers'
import { PoolCode } from './PoolCode'

export class CurvePoolCode extends PoolCode {
  constructor(
    pool: CurvePool,
    liquidityProvider: LiquidityProviders,
    providerName: string,
  ) {
    super(pool, liquidityProvider, `${providerName} ${(pool?.fee || 0) * 100}%`)
  }

  override getStartPoint(): string {
    return PoolCode.RouteProcessorAddress
  }

  getSwapCodeForRouteProcessor(): string {
    return 'CurvePool is not supported by RP1'
  }

  override getSwapCodeForRouteProcessor2(): string {
    return 'CurvePool is not supported by RP2'
  }

  override getSwapCodeForRouteProcessor4(
    leg: RouteLeg,
    _: MultiRoute,
    to: string,
  ): string {
    // supports only 2-token pools currently

    let poolType = 0
    if (leg.tokenFrom.chainId !== undefined) {
      const index = CURVE_NON_FACTORY_POOLS[
        leg.tokenFrom.chainId as ChainId
      ].findIndex(([addr]) => addr == this.pool.address)
      if (
        index >= 0 &&
        CURVE_NON_FACTORY_POOLS[leg.tokenFrom.chainId as ChainId][index][1] !==
          CurvePoolType.Legacy
      )
        poolType = 1
    }

    const [fromIndex, toIndex] =
      leg.tokenFrom.tokenId == this.pool.token0.tokenId ? [0, 1] : [1, 0]
    const code = new HEXer()
      .uint8(5) // Curve pool
      .address(this.pool.address)
      .uint8(poolType)
      .uint8(fromIndex)
      .uint8(toIndex)
      .address(to)
      .address(
        leg.tokenTo.address || '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      )
      .toString()

    return code
  }
}
