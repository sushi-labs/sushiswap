import { ChainId } from '../../chain/index.js'
import type {
  BridgeUnlimited,
  MultiRoute,
  RouteLeg,
} from '../../tines/index.js'
import { HEXer } from '../HEXer.js'
import { LiquidityProviders } from '../liquidity-providers/index.js'
import { PoolCode } from './PoolCode.js'

export class NativeWrapBridgePoolCode extends PoolCode {
  constructor(pool: BridgeUnlimited, liquidityProvider: LiquidityProviders) {
    super(pool, liquidityProvider, 'Wrap')
  }

  override getStartPoint(): string {
    return PoolCode.RouteProcessorAddress
  }

  getSwapCodeForRouteProcessor(leg: RouteLeg): string {
    if (leg.tokenFrom.tokenId === this.pool.token0.tokenId) {
      // wrap - deposit. not used normally
      const code = new HEXer()
        .uint8(5)
        .address(this.pool.address)
        .uint8(0)
        .toString() // wrapAndDistributeERC20Amounts;
      return code
    } else {
      // unwrap - withdraw
      const code = new HEXer().uint8(6).address(this.pool.address).toString() // unwrapNative(address receiver, unwrap token)
      return code
    }
  }

  override getSwapCodeForRouteProcessor2(
    leg: RouteLeg,
    _route: MultiRoute,
    to: string,
  ): string {
    const fake = leg.tokenFrom.chainId === ChainId.CELO ? 2 : 0 // no real wrap at celo - fake wrap code is generated
    if (leg.tokenFrom.tokenId === this.pool.token0.tokenId) {
      // wrap - deposit
      const code = new HEXer()
        .uint8(2) // wrapNative pool type
        .uint8(1 + fake) // wrap action
        .address(to) // where to transfer native coin after unwrapping
        .address(this.pool.address) // wrap token
        .toString()
      return code
    } else {
      // unwrap - withdraw
      const code = new HEXer()
        .uint8(2) // wrapNative pool type
        .uint8(0 + fake) // unwrap action
        .address(to) // where to transfer native coin after unwrapping
        //.address(this.pool.address) - don't need because processToken knows the token
        .toString()
      return code
    }
  }
}
