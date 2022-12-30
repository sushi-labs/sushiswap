import { BridgeUnlimited, RouteLeg } from '@sushiswap/tines'

import { HEXer } from '../HEXer'
import { PoolCode } from './PoolCode'

export class NativeWrapBridgePoolCode extends PoolCode {
  constructor(pool: BridgeUnlimited) {
    super(pool, `Wrap Native`)
  }

  getStartPoint(): string {
    return PoolCode.RouteProcessorAddress
  }

  getSwapCodeForRouteProcessor(leg: RouteLeg): string {
    if (leg.tokenFrom.tokenId == this.pool.token0.tokenId) {
      // wrap - deposit. not used normally
      const code = new HEXer().uint8(5).uint8(0).toString() // wrapAndDistributeERC20Amounts;
      return code
    } else {
      // unwrap - withdraw
      const code = new HEXer().uint8(6).toString() // unwrapNative(address receiver)
      return code
    }
  }
}
