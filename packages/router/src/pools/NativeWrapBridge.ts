import type { BridgeUnlimited, RouteLeg } from '@sushiswap/tines'

import { HEXer } from '../HEXer'
import { LiquidityProviders } from '../liquidity-providers'
import { PoolCode } from './PoolCode'

export class NativeWrapBridgePoolCode extends PoolCode {
  constructor(pool: BridgeUnlimited, liquidityProvider: LiquidityProviders) {
    super(pool, liquidityProvider, `Wrap Native`)
  }

  override getStartPoint(): string {
    return PoolCode.RouteProcessorAddress
  }

  getSwapCodeForRouteProcessor(leg: RouteLeg): string {
    if (leg.tokenFrom.tokenId == this.pool.token0.tokenId) {
      // wrap - deposit. not used normally
      const code = new HEXer().uint8(5).address(this.pool.address).uint8(0).toString() // wrapAndDistributeERC20Amounts;
      return code
    } else {
      // unwrap - withdraw
      const code = new HEXer().uint8(6).address(this.pool.address).toString() // unwrapNative(address receiver, unwrap token)
      return code
    }
  }
}
