import type { MultiRoute, RouteLeg, UniV3Pool } from '../../tines/index.js'
import { HEXer } from '../HEXer.js'
import { LiquidityProviders } from '../liquidity-providers/index.js'
import { PoolCode } from './PoolCode.js'

export class UniV3PoolCode extends PoolCode {
  constructor(
    pool: UniV3Pool,
    liquidityProvider: LiquidityProviders,
    providerName: string,
  ) {
    super(pool, liquidityProvider, `${providerName} ${(pool?.fee || 0) * 100}%`)
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
      .uint8(1) // uniV3 pool
      .address(this.pool.address)
      .bool(leg.tokenFrom.address === this.pool.token0.address)
      .address(to)
      .toString()
    return code
  }
}
