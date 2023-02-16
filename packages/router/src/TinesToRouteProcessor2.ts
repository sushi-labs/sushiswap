import { ChainId } from '@sushiswap/chain'
import { Type, WNATIVE, WNATIVE_ADDRESS } from '@sushiswap/currency'
import { getBigNumber, MultiRoute, RouteLeg, RouteStatus, RToken } from '@sushiswap/tines'
import { BigNumber } from 'ethers'

import { HEXer } from './HEXer'
import { PoolCode } from './pools/PoolCode'

function last<T>(arr: T[]): T {
  return arr[arr.length - 1]
}

enum TokenType {
  ERC20 = 'ERC20',
  'BENTO' = 'BENTO',
}

function getTokenType(token: RToken): TokenType {
  return typeof token.chainId == 'string' && token.chainId.startsWith('Bento') ? TokenType.BENTO : TokenType.ERC20
}

class TinesToRouteProcessor2 {
  routeProcessorAddress: string
  chainId: ChainId
  pools: Map<string, PoolCode>
  tokenOutputLegs: Map<string, RouteLeg[]> = new Map()
  presendedLegs: Set<RouteLeg> = new Set()

  constructor(routeProcessorAddress: string, chainId: ChainId, pools: Map<string, PoolCode>) {
    this.routeProcessorAddress = routeProcessorAddress
    this.chainId = chainId
    this.pools = pools
  }

  getRouteProcessorCode(route: MultiRoute, toAddress: string): string {
    // 0. Check for no route
    if (route.status == RouteStatus.NoWay || route.legs.length == 0) return ''

    this.presendedLegs = new Set()
    this.calcTokenOutputLegs(route)
    let res = '0x'

    const processedTokens = new Set<string | undefined>()
    route.legs.forEach((l, i) => {
      const token = l.tokenFrom
      if (processedTokens.has(token.tokenId)) return
      processedTokens.add(token.tokenId)

      if (i > 0) {
        if (token.address === '') throw new Error('unexpected native inside the route: ' + token.symbol)
        res += this.processERC20Code(true, token, route, toAddress)
      } else {
        if (token.address == '') {
          if (this.chainId == ChainId.CELO) res += this.processERC20Code(true, token, route, toAddress)
          else res += this.processNativeCode(token, route, toAddress)
        } else res += this.processERC20Code(false, token, route, toAddress)
      }
    })

    return res
  }

  processNativeCode(token: RToken, route: MultiRoute, toAddress: string): string {
    const outputLegs = this.tokenOutputLegs.get(token.tokenId as string)
    if (!outputLegs || outputLegs.length !== 1) {
      throw new Error('Not 1 output pool for native token: ' + outputLegs?.length)
    }

    const hex = new HEXer()
      .uint8(3) // processNative commandCode
      .uint8(outputLegs.length)

    outputLegs.forEach((l) => {
      hex.share16(l.swapPortion).hexData(this.swapCode(l, route, toAddress))
    })
    return hex.toString()
  }

  processERC20Code(fromMy: boolean, token: RToken, route: MultiRoute, toAddress: string): string {
    const outputLegs = this.tokenOutputLegs.get(token.tokenId as string)
    if (!outputLegs || outputLegs.length == 0) {
      throw new Error('No output legs for token ' + token.symbol)
    }

    const hex = new HEXer()
      .uint8(fromMy ? 1 : 2) // processMyERC20 : processUserERC20 commandCode
      .address(token.address)
      .uint8(outputLegs.length)

    outputLegs.forEach((l) => {
      hex.share16(l.swapPortion).hexData(this.swapCode(l, route, toAddress))
    })
    return hex.toString()
  }

  swapCode(leg: RouteLeg, route: MultiRoute, toAddress: string): string {
    const pc = this.getPoolCode(leg)
    const to = this.getPoolOutputAddress(leg, route, toAddress)
    return pc.getSwapCodeForRouteProcessor2(leg, route, to, this.presendedLegs.has(leg))
  }

  getPoolOutputAddress(l: RouteLeg, route: MultiRoute, toAddress: string): string {
    let outAddress
    const outputDistribution = this.tokenOutputLegs.get(l.tokenTo.tokenId as string) || []
    if (outputDistribution.length == 0) {
      outAddress = toAddress
    } else if (outputDistribution.length == 1) {
      outAddress = this.getPoolCode(outputDistribution[0]).getStartPoint(l, route)
      if (outAddress == PoolCode.RouteProcessorAddress) outAddress = this.routeProcessorAddress
      else this.presendedLegs.add(l)
    } else {
      outAddress = this.routeProcessorAddress
    }
    return outAddress
  }

  getPoolCode(l: RouteLeg): PoolCode {
    const pc = this.pools.get(l.poolAddress)
    if (pc === undefined) {
      throw new Error(`unknown pool: ${l.poolAddress}`)
    }
    return pc
  }

  calcTokenOutputLegs(route: MultiRoute) {
    const res = new Map<string, RouteLeg[]>()

    route.legs.forEach((l) => {
      const tokenId = l.tokenFrom.tokenId?.toString()
      if (tokenId === undefined) {
        console.assert(0, 'Unseted tokenId')
      } else {
        const legsOutput = res.get(tokenId) || []
        legsOutput.push(l)
        res.set(tokenId, legsOutput)
      }
    })

    this.tokenOutputLegs = res
  }
}

export function getRouteProcessor2Code(
  route: MultiRoute,
  routeProcessorAddress: string,
  toAddress: string,
  pools: Map<string, PoolCode>
): string {
  const rpc = new TinesToRouteProcessor2(routeProcessorAddress, route.fromToken.chainId as ChainId, pools)
  return rpc.getRouteProcessorCode(route, toAddress)
}
