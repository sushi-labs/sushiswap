import type { MultiRoute, RouteLeg, UniV4Pool } from '../../tines/index.js'
import { HEXer } from '../HEXer.js'
import { LiquidityProviders } from '../liquidity-providers/index.js'
import { PoolCode, RPPoolType } from './PoolCode.js'

export class UniV4PoolCode extends PoolCode {
  tickSpacing: number
  constructor(
    pool: UniV4Pool,
    tickSpacing: number,
    liquidityProvider: LiquidityProviders,
    providerName: string,
  ) {
    super(pool, liquidityProvider, `${providerName} ${(pool?.fee || 0) * 100}%`)
    this.tickSpacing = tickSpacing
  }

  override getStartPoint(): string {
    return PoolCode.RouteProcessorAddress
  }

  override getSwapCodeForRouteProcessor(): string {
    return 'unsupported'
  }
  override getSwapCodeForRouteProcessor2(): string {
    return 'unsupported'
  }
  override getSwapCodeForRouteProcessor4(): string {
    return 'unsupported'
  }

  override getSwapCodeForRouteProcessor6(
    leg: RouteLeg,
    _route: MultiRoute,
    to: string,
  ): string {
    const pool = this.pool as UniV4Pool
    const code = new HEXer()
      .uint8(RPPoolType.UniV4)
      .address(pool.address) // PoolManager
      .address(leg.tokenTo.address)
      .uint24(Math.round(pool.fee * 1_000_000)) // no dynamicFee support rn
      .uint24(this.tickSpacing)
      .address(pool.hooks)
      .bool(leg.tokenFrom.address === this.pool.token0.address)
      .bytes('') // this is a hook data. Is not supported rn
      .address(to)
      .toString()
    return code
  }
}
