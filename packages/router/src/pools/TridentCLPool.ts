import type { MultiRoute, RouteLeg, UniV3Pool } from '@sushiswap/tines'

import { HEXer } from '../HEXer'
import { LiquidityProviders } from '../liquidity-providers'
import { PoolCode } from './PoolCode'

export class TridentCLPoolCode extends PoolCode {
  constructor(
    pool: UniV3Pool,
    liquidityProvider: LiquidityProviders,
    providerName: string,
  ) {
    super(pool, liquidityProvider, `${providerName} ${pool.fee * 100}%`)
  }

  override getStartPoint(): string {
    return PoolCode.RouteProcessorAddress
  }

  // eslint-disable-next-line unused-imports/no-unused-vars, no-unused-vars, @typescript-eslint/no-unused-vars
  getSwapCodeForRouteProcessor(): string {
    return 'unsupported'
  }

  override getSwapCodeForRouteProcessor2(
    leg: RouteLeg,
    _route: MultiRoute,
    to: string,
  ): string {
    const code = new HEXer()
      .uint8(5) // TridentCL pool
      .address(this.pool.address)
      .bool(leg.tokenFrom.address === this.pool.token0.address)
      .address(to)
      .toString()
    return code
  }
}
