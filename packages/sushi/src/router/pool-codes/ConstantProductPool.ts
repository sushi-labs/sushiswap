import type {
  ConstantProductRPool,
  MultiRoute,
  RouteLeg,
} from '../../tines/index.js'
import { HEXer } from '../HEXer.js'
import { LiquidityProviders } from '../liquidity-providers/index.js'
import { PoolCode } from './PoolCode.js'

export class ConstantProductPoolCode extends PoolCode {
  constructor(
    pool: ConstantProductRPool,
    liquidityProvider: LiquidityProviders,
    providerName: string,
  ) {
    super(pool, liquidityProvider, `${providerName} ${(pool?.fee || 0) * 100}%`)
  }

  getSwapCodeForRouteProcessor(
    leg: RouteLeg,
    _route: MultiRoute,
    to: string,
  ): string {
    // swapUniswapPool = 0x20(address pool, address tokenIn, bool direction, address to)
    const code = new HEXer()
      .uint8(10) // swapUniswapPool
      .address(this.pool.address)
      .address(leg.tokenFrom.address)
      .bool(leg.tokenFrom.address === this.pool.token0.address)
      .address(to)
      .toString()
    console.assert(
      code.length === 62 * 2,
      'getSwapCodeForRouteProcessor unexpected code length',
    )
    return code
  }

  override getSwapCodeForRouteProcessor2(
    leg: RouteLeg,
    _route: MultiRoute,
    to: string,
  ): string {
    const code = new HEXer()
      .uint8(0) // uniV2 pool
      .address(this.pool.address)
      .bool(leg.tokenFrom.address === this.pool.token0.address)
      .address(to)
      //.bool(presended)
      .toString()
    return code
  }

  override getSwapCodeForRouteProcessor4(
    leg: RouteLeg,
    _route: MultiRoute,
    to: string,
  ): string {
    const code = new HEXer()
      .uint8(0) // uniV2 pool
      .address(this.pool.address)
      .bool(leg.tokenFrom.address === this.pool.token0.address)
      .address(to)
      .uint24(Math.round(leg.poolFee * 1_000_000)) // new part - before fee was always 0.3%
      .toString()
    return code
  }
}
