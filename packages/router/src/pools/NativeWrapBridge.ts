import type { BridgeUnlimited, MultiRoute, RouteLeg } from '@sushiswap/tines'

import { HEXer } from '../HEXer'
import { PoolCode } from './PoolCode'

export class NativeWrapBridgePoolCode extends PoolCode {
  constructor(pool: BridgeUnlimited) {
    super(pool, `Wrap Native`)
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

  getSwapCodeForRouteProcessor2(leg: RouteLeg, _route: MultiRoute, to: string): string {
    if (leg.tokenFrom.tokenId == this.pool.token0.tokenId) {
      // wrap - deposit
      const code = new HEXer()
        .uint8(2) // wrapNative pool type
        .uint8(1) // wrap action
        .address(to) // where to transfer native coin after unwrapping
        .address(this.pool.address) // wrap token
        .toString()
      return code
    } else {
      // unwrap - withdraw
      const code = new HEXer()
        .uint8(2) // wrapNative pool type
        .uint8(0) // unwrap action
        .address(to) // where to transfer native coin after unwrapping
        //.address(this.pool.address) - don't need because processToken knows the token
        .toString()
      return code
    }
  }
}
