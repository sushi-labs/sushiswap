import { BridgeBento, BridgeUnlimited, MultiRoute, RouteLeg } from '@sushiswap/tines'
import { BigNumber } from 'ethers'
import { HEXer } from '../HEXer'
import { PoolCode } from './PoolCode'

export class NativeWrapBridgePoolCode extends PoolCode {
  constructor(pool: BridgeUnlimited) {
    super(pool, `NativeWrapBridge`)
  }

  getStartPoint(_leg: RouteLeg, _route: MultiRoute): string {
    return PoolCode.RouteProcessorAddress
  }

  getSwapCodeForRouteProcessor(leg: RouteLeg, route: MultiRoute, to: string): string {
    if (leg.tokenFrom.tokenId == this.pool.token0.tokenId) {
      // wrap - deposit
      const code = new HEXer().uint8(28).toString() // wrapNative();
      return code
    } else {
      // unwrap - withdraw
      const code = new HEXer().uint8(29).toString() // unwrapNative(address receiver)
      return code
    }
  }
}
