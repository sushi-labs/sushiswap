import type { ConstantProductRPool, MultiRoute, RouteLeg } from '@sushiswap/tines'

import { HEXer } from '../HEXer'
import { PoolCode } from './PoolCode'

export class ConstantProductPoolCode extends PoolCode {
  constructor(pool: ConstantProductRPool, providerName: string) {
    super(pool, `${providerName} ${pool.fee * 100}%`)
  }

  getSwapCodeForRouteProcessor(leg: RouteLeg, _route: MultiRoute, to: string): string {
    // swapUniswapPool = 0x20(address pool, address tokenIn, bool direction, address to)
    const code = new HEXer()
      .uint8(10) // swapUniswapPool
      .address(this.pool.address)
      .address(leg.tokenFrom.address)
      .bool(leg.tokenFrom.address == this.pool.token0.address)
      .address(to)
      .toString()
    console.assert(code.length == 62 * 2, 'getSwapCodeForRouteProcessor unexpected code length')
    return code
  }

  getSwapCodeForRouteProcessor2(leg: RouteLeg, _route: MultiRoute, to: string): string {
    const code = new HEXer()
      .uint8(0) // uniV2 pool
      .address(this.pool.address)
      .bool(leg.tokenFrom.address == this.pool.token0.address)
      .address(to)
      //.bool(presended)
      .toString()
    return code
  }
}
