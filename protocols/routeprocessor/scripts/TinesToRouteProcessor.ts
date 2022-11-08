
import {getBigNumber, MultiRoute, RouteLeg, RouteStatus, RToken} from "@sushiswap/tines"
import { BigNumber } from "ethers";
import { HEXer } from "./HEXer";
import { PoolCode } from "./pools/PoolCode";

function last<T>(arr: T[]):T {
  return arr[arr.length - 1]
}

enum TokenType {
  ERC20 = 'ERC20',
  'BENTO' = 'BENTO'
}

function getTokenType(token: RToken): TokenType {
  return typeof token.chainId == 'string' && token.chainId.startsWith('Bento') ? TokenType.BENTO : TokenType.ERC20
}

export class TinesToRouteProcessor {
  routeProcessorAddress: string
  pools: Map<string, PoolCode>
  tokenOutputLegs: Map<string, RouteLeg[]>

  constructor(routeProcessorAddress: string, pools: Map<string, PoolCode>) {
    this.routeProcessorAddress = routeProcessorAddress
    this.pools = pools
    this.tokenOutputLegs = new Map()
  }

  getRouteProcessorCode(
    route: MultiRoute,
    toAddress: string,
  ): string {
    // 0. Check for no route
    if (route.status == RouteStatus.NoWay || route.legs.length == 0) return ''

    this.calcTokenOutputLegs(route)
    let res = '0x'

    // 1. Initial distribution
    const [initialCode, exactAmount] = this.codeDistributeInitial(route)
    res += initialCode

    const distributedTokens = new Set([route.fromToken.tokenId])
    route.legs.forEach(l => {
      // 2. Transfer tokens from the routeProcessor contract to the pool if it is neccessary
      if (!distributedTokens.has(l.tokenFrom.tokenId)) {
        res += this.codeDistributeTokenShares(l.tokenFrom, route)
        distributedTokens.add(l.tokenFrom.tokenId)
      }

      // 3. get pool's output address
      const outAddress = this.getPoolOutputAddress(l, route, toAddress)

      // 4. Make swap
      res += this.codeSwap(l, route, outAddress, exactAmount.get(l.poolAddress))
    })

    return res;
  }

  getPoolOutputAddress(l: RouteLeg, route: MultiRoute, toAddress: string): string {
    let outAddress
    const outputDistribution = this.tokenOutputLegs.get(l.tokenTo.tokenId as string) || []
    if (outputDistribution.length == 0) {
      outAddress = toAddress
    } else if (outputDistribution.length == 1) {
      outAddress = this.getPoolCode(outputDistribution[0]).getStartPoint(l, route)
      if (outAddress == PoolCode.RouteProcessorAddress)
        outAddress = this.routeProcessorAddress
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

  codeSwap(leg: RouteLeg, route: MultiRoute, to: string, exactAmount?: BigNumber): string {
    const pc = this.getPoolCode(leg)
    return pc.getSwapCodeForRouteProcessor(leg, route, to, exactAmount)
  }

  // Distributes tokens from msg.sender to pools
  codeDistributeInitial(route: MultiRoute): [string, Map<string, BigNumber>] {
    const legs = this.tokenOutputLegs.get(route.fromToken.tokenId as string) as RouteLeg[]
    const legsAddr: [RouteLeg, string][] = legs.map(l => {
      const pc = this.getPoolCode(l)
      const startPoint = pc.getStartPoint(l, route)
      return [l, startPoint == PoolCode.RouteProcessorAddress ? this.routeProcessorAddress : startPoint]
    })

    const command =  getTokenType(route.fromToken) == TokenType.ERC20 ? 
      3     // distributeERC20Amounts
      : 24  // distributeBentoShares
      
    const hex = new HEXer()
      .uint8(command)
      .uint8(legsAddr.length)

    let inputAmountPrevious: BigNumber = BigNumber.from(0)
    const lastLeg = last(legsAddr)[0]
    const exactAmount = new Map<string, BigNumber>()
    legsAddr.forEach(([leg, poolAddress]) => {
      const amount: BigNumber = leg !== lastLeg ? 
          getBigNumber(route.amountIn * leg.absolutePortion) : route.amountInBN.sub(inputAmountPrevious)
      hex.address(poolAddress).uint(amount)
      inputAmountPrevious = inputAmountPrevious.add(amount)
      exactAmount.set(leg.poolAddress, amount)      
    })
    const code = hex.toString()
    console.assert(code.length == (2 + legsAddr.length*52)*2, "codeDistributeInitial unexpected code length")
    return [code, exactAmount]
  }

  // Distributes tokens from RP to pools
  codeDistributeTokenShares(token: RToken, route: MultiRoute): string {
    const legs = this.tokenOutputLegs.get(token.tokenId as string) as RouteLeg[]
    if (legs.length <= 1) {
      return '' // No distribution is needed
    }

    const RPStartPointsNum = legs.filter(l => {
      const pc = this.getPoolCode(l)
      const startPoint = pc.getStartPoint(l, route)
      return startPoint == PoolCode.RouteProcessorAddress
    }).length
    if (RPStartPointsNum > 1) {
      throw new Error('More than one RouteProcessor for a token is not supported')
    }

    const command = getTokenType(token) == TokenType.ERC20 ? 
      4     // distributeERC20Shares
      : 25  // distributeBentoPortions

    const hex = new HEXer()
      .uint8(command)
      .address(token.address)
      .uint8(legs.length - RPStartPointsNum)

    let unmovedPart = 0
    legs.forEach(l => {
      const pc = this.getPoolCode(l)
      const startPoint = pc.getStartPoint(l, route)
      if (startPoint == PoolCode.RouteProcessorAddress) {
        unmovedPart += l.swapPortion
      } else {
        const amount = l.swapPortion*(1-unmovedPart)
        hex.address(startPoint).share16(amount)
      }
    })
    const code = hex.toString()
    console.assert(code.length == (22 + legs.length*22)*2, "codeDistributeTokenShares unexpected code length")
    return code
  }

  calcTokenOutputLegs(route: MultiRoute) {
    const res = new Map<string, RouteLeg[]>()

    route.legs.forEach(l => {
      const tokenId = l.tokenFrom.tokenId?.toString()
      if (tokenId === undefined) {
        console.assert(0, "Unseted tokenId")
      } else {
        const legsOutput = res.get(tokenId) || []
        legsOutput.push(l)
        res.set(tokenId, legsOutput)
      }
    })

    this.tokenOutputLegs = res
  }
}

export function getRouteProcessorCode(
  route: MultiRoute, 
  routeProcessorAddress: string, 
  toAddress: string,
  pools: Map<string, PoolCode>
): string {
  const rpc = new TinesToRouteProcessor(routeProcessorAddress, pools)
  return rpc.getRouteProcessorCode(route, toAddress)
}