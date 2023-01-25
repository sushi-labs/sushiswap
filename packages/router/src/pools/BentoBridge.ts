import type { BridgeBento, MultiRoute, RouteLeg } from '@sushiswap/tines'
import type { BigNumber } from 'ethers'

import { HEXer } from '../HEXer'
import { PoolCode } from './PoolCode'

export class BentoBridgePoolCode extends PoolCode {
  bentoBoxAddress: string

  constructor(pool: BridgeBento, _providerName: string, bentoBoxAddress: string) {
    super(pool, `BentoBridge`)
    this.bentoBoxAddress = bentoBoxAddress
  }

  override getStartPoint(leg: RouteLeg): string {
    if (leg.tokenFrom.chainId == this.pool.token0.chainId) {
      // bento deposit
      return this.bentoBoxAddress
    } else {
      return 'RouteProcessor'
    }
  }

  getSwapCodeForRouteProcessor(leg: RouteLeg, route: MultiRoute, to: string, exactAmount?: BigNumber): string {
    if (leg.tokenFrom.chainId == this.pool.token0.chainId) {
      // bento deposit
      if (leg.tokenFrom.tokenId === route.fromToken.tokenId) {
        // input token with exactAmount
        if (exactAmount !== undefined) {
          const code = new HEXer()
            .uint8(20) // bentoDepositAmountFromBento
            .address(to)
            .uint(exactAmount)
            .toString()
          console.assert(code.length == 53 * 2, 'BentoBridge deposit unexpected code length')
          return code
        } else {
          throw new Error("Bento deposit from input token can't work without exact amount")
        }
      } else {
        // deposit in the middle of a route
        const code = new HEXer()
          .uint8(26) // bentoDepositAllFromBento
          .address(to)
          .address(leg.tokenFrom.address)
          .toString()
        console.assert(code.length == 41 * 2, 'BentoBridge deposit unexpected code length')
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
          console.assert(code.length == 53 * 2, 'BentoBridge withdraw unexpected code length')
          return code
        } else {
          throw new Error("Bento withdraw from input token can't work without exact amount")
        }
      } else {
        // withdraw in the middle of a route
        const code = new HEXer()
          .uint8(27) // bentoWithdrawAllFromRP
          .address(leg.tokenFrom.address)
          .address(to)
          .toString()
        console.assert(code.length == 41 * 2, 'BentoBridge deposit unexpected code length')
        return code
      }
    }
  }
}
