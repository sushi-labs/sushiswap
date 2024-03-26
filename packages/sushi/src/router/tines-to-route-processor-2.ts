import { Hex } from 'viem'
import { ChainId } from '../chain/index.js'
import { MultiRoute, RToken, RouteLeg, RouteStatus } from '../tines/index.js'
import { HEXer } from './HEXer.js'
import { PoolCode } from './pool-codes/PoolCode.js'

export enum TokenType {
  NATIVE = 'NATIVE',
  ERC20 = 'ERC20',
  BENTO = 'BENTO',
}

export interface PermitData {
  value: bigint
  deadline: bigint
  v: number
  r: string
  s: string
}

export function getTokenType(token: RToken): TokenType {
  if (token.address === '') return TokenType.NATIVE
  return typeof token.chainId === 'string' && token.chainId.startsWith('Bento')
    ? TokenType.BENTO
    : TokenType.ERC20
}

export enum RouterLiquiditySource {
  Sender = 'Sender', // msg.sender
  XSwap = 'XSwap',
}

export class TinesToRouteProcessor2 {
  routeProcessorAddress: string
  chainId: ChainId
  pools: Map<string, PoolCode>
  tokenOutputLegs: Map<string, RouteLeg[]> = new Map()
  //presendedLegs: Set<RouteLeg> = new Set()

  constructor(
    routeProcessorAddress: string,
    chainId: ChainId,
    pools: Map<string, PoolCode>,
  ) {
    this.routeProcessorAddress = routeProcessorAddress
    this.chainId = chainId
    this.pools = pools
  }

  getRouteProcessorCode(
    route: MultiRoute,
    toAddress: string,
    permits: PermitData[] = [],
    source = RouterLiquiditySource.Sender,
  ): Hex | '' {
    // 0. Check for no route
    if (route.status === RouteStatus.NoWay || route.legs.length === 0) return ''

    //this.presendedLegs = new Set()
    this.calcTokenOutputLegs(route)
    let res = '0x'

    res += this.processPermits(permits)

    const processedTokens = new Set<string | undefined>()
    route.legs.forEach((l, i) => {
      const token = l.tokenFrom
      if (processedTokens.has(token.tokenId)) return
      processedTokens.add(token.tokenId)

      if (i > 0) {
        if (token.address === '')
          throw new Error(`unexpected native inside the route: ${token.symbol}`)
        if (this.isOnePoolOptimization(token, route))
          res += this.processOnePoolCode(token, route, toAddress)
        else if (getTokenType(token) === TokenType.ERC20)
          res += this.processERC20Code(true, token, route, toAddress)
        else res += this.processBentoCode(token, route, toAddress)
      } else {
        if (token.address === '')
          res += this.processNativeCode(token, route, toAddress)
        else
          res += this.processERC20Code(
            source === RouterLiquiditySource.XSwap,
            token,
            route,
            toAddress,
          )
      }
    })

    return res as Hex
  }

  processPermits(permits: PermitData[]): string {
    const hex = new HEXer()
    permits.forEach((p) => {
      hex
        .uint8(6) // applyPermit commandCode
        .uint(p.value)
        .uint(p.deadline)
        .uint8(p.v)
        .bytes32(p.r)
        .bytes32(p.s)
    })
    return hex.toString()
  }

  processNativeCode(
    token: RToken,
    route: MultiRoute,
    toAddress: string,
  ): string {
    const outputLegs = this.tokenOutputLegs.get(token.tokenId as string)
    if (!outputLegs || outputLegs.length !== 1) {
      throw new Error(
        `Not 1 output pool for native token: ${outputLegs?.length}`,
      )
    }

    const hex = new HEXer()
      .uint8(3) // processNative commandCode
      .uint8(outputLegs.length)

    outputLegs.forEach((l) => {
      hex.share16(l.swapPortion).hexData(this.swapCode(l, route, toAddress))
    })
    return hex.toString()
  }

  processERC20Code(
    fromMe: boolean,
    token: RToken,
    route: MultiRoute,
    toAddress: string,
  ): string {
    const outputLegs = this.tokenOutputLegs.get(token.tokenId as string)
    if (!outputLegs || outputLegs.length === 0) {
      throw new Error(`No output legs for token ${token.symbol}`)
    }

    const hex = new HEXer()
      .uint8(fromMe ? 1 : 2) // processMyERC20 : processUserERC20 commandCode
      .address(token.address)
      .uint8(outputLegs.length)

    outputLegs.forEach((l) => {
      hex.share16(l.swapPortion).hexData(this.swapCode(l, route, toAddress))
    })
    return hex.toString()
  }

  processOnePoolCode(
    token: RToken,
    route: MultiRoute,
    toAddress: string,
  ): string {
    const outputLegs = this.tokenOutputLegs.get(token.tokenId as string)
    if (!outputLegs || outputLegs.length !== 1) {
      throw new Error(`1 output leg expected ${outputLegs?.length}`)
    }

    const hex = new HEXer()
      .uint8(4) // processOnePool commandCode
      .address(token.address)
      .hexData(this.swapCode(outputLegs[0]!, route, toAddress))
    return hex.toString()
  }

  processBentoCode(
    token: RToken,
    route: MultiRoute,
    toAddress: string,
  ): string {
    const outputLegs = this.tokenOutputLegs.get(token.tokenId as string)
    if (!outputLegs || outputLegs.length === 0) {
      throw new Error(`No output legs for token ${outputLegs?.length}`)
    }

    const hex = new HEXer()
      .uint8(5) // processInsideBento commandCode
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
    return pc.getSwapCodeForRouteProcessor2(leg, route, to) //, this.presendedLegs.has(leg))
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
      //else this.presendedLegs.add(outputDistribution[0])
    } else {
      outAddress = this.routeProcessorAddress
    }
    return outAddress
  }

  isOnePoolOptimization(token: RToken, route: MultiRoute) {
    const outputDistribution =
      this.tokenOutputLegs.get(token.tokenId as string) || []
    if (outputDistribution.length !== 1) return false

    const startPoint = this.getPoolCode(outputDistribution[0]!).getStartPoint(
      outputDistribution[0]!,
      route,
    )
    return startPoint === outputDistribution[0]!.poolAddress
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
  pools: Map<string, PoolCode>,
  permits: PermitData[] = [],
  source = RouterLiquiditySource.Sender,
): Hex | '' {
  const rpc = new TinesToRouteProcessor2(
    routeProcessorAddress,
    route.fromToken.chainId as ChainId,
    pools,
  )
  return rpc.getRouteProcessorCode(route, toAddress, permits, source)
}
