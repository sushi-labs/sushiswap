import { Hex } from 'viem'
import { ChainId } from '../chain/index.js'
import {
  MultiRoute,
  RToken,
  RouteLeg,
  RouteStatus,
  getBigInt,
} from '../tines/index.js'
import { HEXer } from './HEXer.js'
import { PoolCode } from './pool-codes/PoolCode.js'

function last<T>(arr: T[]): T {
  return arr[arr.length - 1] as T
}

enum TokenType {
  ERC20 = 'ERC20',
  BENTO = 'BENTO',
}

function getTokenType(token: RToken): TokenType {
  return typeof token.chainId === 'string' && token.chainId.startsWith('Bento')
    ? TokenType.BENTO
    : TokenType.ERC20
}

export class TinesToRouteProcessor {
  routeProcessorAddress: string
  chainId: ChainId
  pools: Map<string, PoolCode>
  tokenOutputLegs: Map<string, RouteLeg[]>

  constructor(
    routeProcessorAddress: string,
    chainId: ChainId,
    pools: Map<string, PoolCode>,
  ) {
    this.routeProcessorAddress = routeProcessorAddress
    this.chainId = chainId
    this.pools = pools
    this.tokenOutputLegs = new Map()
  }

  getRouteProcessorCode(route: MultiRoute, toAddress: string): Hex | '' {
    // 0. Check for no route
    if (route.status === RouteStatus.NoWay || route.legs.length === 0) return ''

    if (route.legs.length === 1 && route.fromToken.address === '') {
      // very special case
      return this.getRPCodeForsimpleWrapRoute(route, toAddress)
    }

    this.calcTokenOutputLegs(route)
    let res = '0x'

    // 1. Initial distribution
    const [initialCode, exactAmount] = this.codeDistributeInitial(route)
    res += initialCode

    const distributedTokens = new Set([route.fromToken.tokenId])
    route.legs.forEach((l, i) => {
      if (i === 0 && l.tokenFrom.address === '') {
        // Native - processed by codeDistributeInitial
        distributedTokens.add(l.tokenTo.tokenId)
        return
      }

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

    return res as Hex
  }

  getRPCodeForsimpleWrapRoute(route: MultiRoute, toAddress: string): Hex {
    const hex = new HEXer()
      .uint8(5) // wrapAndDistributeERC20Amounts
      .address(route.legs[0]!.poolAddress)
      .uint8(1)
      .address(toAddress)
      .uint(route.amountIn)
    return hex.toString0x()
  }

  getPoolOutputAddress(
    l: RouteLeg,
    route: MultiRoute,
    toAddress: string,
  ): string {
    let outAddress
    const outputDistribution =
      this.tokenOutputLegs.get(l.tokenTo.tokenId as string) || []
    if (outputDistribution.length === 0) {
      outAddress = toAddress
    } else if (outputDistribution.length === 1) {
      outAddress = this.getPoolCode(outputDistribution[0]!).getStartPoint(
        l,
        route,
      )
      if (outAddress === PoolCode.RouteProcessorAddress)
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

  codeSwap(
    leg: RouteLeg,
    route: MultiRoute,
    to: string,
    exactAmount?: bigint,
  ): string {
    const pc = this.getPoolCode(leg)
    return pc.getSwapCodeForRouteProcessor(leg, route, to, exactAmount)
  }

  // Distributes tokens from msg.sender to pools
  codeDistributeInitial(route: MultiRoute): [string, Map<string, bigint>] {
    let fromToken = route.fromToken
    if (fromToken.address === '') {
      // Native
      fromToken = route.legs[0]!.tokenTo // Change to wrapped Native
    }

    const legs = this.tokenOutputLegs.get(
      fromToken.tokenId as string,
    ) as RouteLeg[]
    const legsAddr: [RouteLeg, string][] = legs.map((l) => {
      const pc = this.getPoolCode(l)
      const startPoint = pc.getStartPoint(l, route)
      return [
        l,
        startPoint === PoolCode.RouteProcessorAddress
          ? this.routeProcessorAddress
          : startPoint,
      ]
    })

    const hex = new HEXer()
    if (getTokenType(fromToken) === TokenType.BENTO)
      hex.uint8(24) // distributeBentoShares
    else if (route.fromToken.address === '') {
      if (this.chainId === ChainId.CELO) {
        // Celo is very special - native coin has it's own ERC20 token
        // So, to prevent user from providing appove to RouteProcessor in case if he swaps from CELO,
        // we support payment to RP in native coin and then distribute it as ERC20 tokens
        hex.uint8(7) // distributeERC20AmountsFromRP
      } else hex.uint8(5).address(route.legs[0]!.poolAddress) // wrapAndDistributeERC20Amounts
    } else hex.uint8(3) // distributeERC20Amounts

    hex.uint8(legsAddr.length)

    let inputAmountPrevious = 0n
    const lastLeg = last(legsAddr)[0]
    const exactAmount = new Map<string, bigint>()
    legsAddr.forEach(([leg, poolAddress]) => {
      const amount: bigint =
        leg !== lastLeg
          ? getBigInt(route.amountIn * leg.absolutePortion)
          : getBigInt(route.amountIn) - inputAmountPrevious
      hex.address(poolAddress).uint(amount)
      inputAmountPrevious = inputAmountPrevious + amount
      exactAmount.set(leg.poolAddress, amount)
    })
    const code = hex.toString()
    return [code, exactAmount]
  }

  // Distributes tokens from RP to pools
  codeDistributeTokenShares(token: RToken, route: MultiRoute): string {
    const legs = this.tokenOutputLegs.get(token.tokenId as string) as RouteLeg[]
    if (legs.length <= 1) {
      return '' // No distribution is needed
    }

    const RPStartPointsNum = legs.filter((l) => {
      const pc = this.getPoolCode(l)
      const startPoint = pc.getStartPoint(l, route)
      return startPoint === PoolCode.RouteProcessorAddress
    }).length
    if (RPStartPointsNum > 1) {
      throw new Error(
        'More than one input token is not supported by RouteProcessor',
      )
    }

    const command =
      getTokenType(token) === TokenType.ERC20
        ? 4 // distributeERC20Shares
        : 25 // distributeBentoPortions

    const hex = new HEXer()
      .uint8(command)
      .address(token.address)
      .uint8(legs.length - RPStartPointsNum)

    let unmovedPart = 0
    let unmovedCounter = 0
    legs.forEach((l) => {
      const pc = this.getPoolCode(l)
      const startPoint = pc.getStartPoint(l, route)
      if (startPoint === PoolCode.RouteProcessorAddress) {
        unmovedPart += l.swapPortion
        ++unmovedCounter
      } else {
        const amount = l.swapPortion * (1 - unmovedPart)
        hex.address(startPoint).share16(amount)
      }
    })
    const code = hex.toString()
    console.assert(
      code.length === (22 + (legs.length - unmovedCounter) * 22) * 2,
      'codeDistributeTokenShares unexpected code length',
    )
    return code
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

export function getRouteProcessorCode(
  route: MultiRoute,
  routeProcessorAddress: string,
  toAddress: string,
  pools: Map<string, PoolCode>,
): string {
  const rpc = new TinesToRouteProcessor(
    routeProcessorAddress,
    route.fromToken.chainId as ChainId,
    pools,
  )
  return rpc.getRouteProcessorCode(route, toAddress)
}
