import type { BridgeBento, MultiRoute, RouteLeg } from '../../tines/index.js'
import { HEXer } from '../HEXer.js'
import { LiquidityProviders } from '../liquidity-providers/index.js'
import { Bridge } from './Bridge.js'
import { PoolCode } from './PoolCode.js'

export class BentoBridgePoolCode extends PoolCode {
  bentoBoxAddress: string

  constructor(
    pool: BridgeBento,
    liquidityProvider: LiquidityProviders,
    _providerName: string,
    bentoBoxAddress: `0x${string}`,
  ) {
    super(pool, liquidityProvider, Bridge.BentoBox)
    this.bentoBoxAddress = bentoBoxAddress
  }

  override getStartPoint(leg: RouteLeg): string {
    if (leg.tokenFrom.chainId === this.pool.token0.chainId) {
      // bento deposit
      return this.bentoBoxAddress
    } else {
      return 'RouteProcessor'
    }
  }

  getSwapCodeForRouteProcessor(
    leg: RouteLeg,
    route: MultiRoute,
    to: string,
    exactAmount?: bigint,
  ): string {
    if (leg.tokenFrom.chainId === this.pool.token0.chainId) {
      // bento deposit
      if (leg.tokenFrom.tokenId === route.fromToken.tokenId) {
        // input token with exactAmount
        if (exactAmount !== undefined) {
          const code = new HEXer()
            .uint8(20) // bentoDepositAmountFromBento
            .address(to)
            .uint(exactAmount)
            .toString()
          console.assert(
            code.length === 53 * 2,
            'BentoBridge deposit unexpected code length',
          )
          return code
        } else {
          throw new Error(
            "Bento deposit from input token can't work without exact amount",
          )
        }
      } else {
        // deposit in the middle of a route
        const code = new HEXer()
          .uint8(26) // bentoDepositAllFromBento
          .address(to)
          .address(leg.tokenFrom.address)
          .toString()
        console.assert(
          code.length === 41 * 2,
          'BentoBridge deposit unexpected code length',
        )
        return code
      }
    } else {
      // bento withdraw
      if (leg.tokenFrom.tokenId === route.fromToken.tokenId) {
        // input token with exactAmount
        if (exactAmount !== undefined) {
          const code = new HEXer()
            .uint8(23) // bentoWithdrawShareFromRP
            .address(to)
            .uint(exactAmount)
            .toString()
          console.assert(
            code.length === 53 * 2,
            'BentoBridge withdraw unexpected code length',
          )
          return code
        } else {
          throw new Error(
            "Bento withdraw from input token can't work without exact amount",
          )
        }
      } else {
        // withdraw in the middle of a route
        const code = new HEXer()
          .uint8(27) // bentoWithdrawAllFromRP
          .address(leg.tokenFrom.address)
          .address(to)
          .toString()
        console.assert(
          code.length === 41 * 2,
          'BentoBridge deposit unexpected code length',
        )
        return code
      }
    }
  }

  override getSwapCodeForRouteProcessor2(
    leg: RouteLeg,
    _route: MultiRoute,
    to: string,
  ): string {
    const code = new HEXer()
      .uint8(3) // bentoBridge
      .uint8(leg.tokenFrom.chainId === this.pool.token0.chainId ? 1 : 0) // direction = deposit/withdraw
      .address(to)
      .toString()
    return code
  }
}
