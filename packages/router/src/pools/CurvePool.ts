import type { ConstantProductRPool, CurvePool, MultiRoute, RouteLeg } from '@sushiswap/tines'

import { HEXer } from '../HEXer'
import { LiquidityProviders } from '../liquidity-providers'
import { PoolCode } from './PoolCode'

export class CurvePoolCode extends PoolCode {
  constructor(pool: CurvePool, liquidityProvider: LiquidityProviders, providerName: string) {
    super(pool, liquidityProvider, `${providerName} ${(pool?.fee || 0) * 100}%`)
  }

  override getStartPoint(): string {
    return PoolCode.RouteProcessorAddress
  }

  getSwapCodeForRouteProcessor(): string {
    return 'CurvePool is not supported by RP1'
  }

  getSwapCodeForRouteProcessor2(): string {
    return 'CurvePool is not supported by RP2'
  }

  getSwapCodeForRouteProcessor4(leg: RouteLeg, _route: MultiRoute, to: string): string {
    // supports only 2-token pools currently
    const [fromIndex, toIndex] = leg.tokenFrom.address == this.pool.token0.address ? [0, 1] : [1, 0]
    const code = new HEXer()
      .uint8(5) // Curve pool
      .address(this.pool.address)
      .uint8(fromIndex)
      .uint8(toIndex)
      .address(to)
      .toString()
    return code
  }
}
