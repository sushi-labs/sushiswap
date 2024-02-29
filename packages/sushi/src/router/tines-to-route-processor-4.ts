import { Hex } from 'viem'
import { ChainId } from '../chain/index.js'
import { MultiRoute, RToken, RouteLeg, RouteStatus } from '../tines/index.js'
import { PoolCode } from './pool-codes/PoolCode.js'
import {
  PermitData,
  RouterLiquiditySource,
  TinesToRouteProcessor2,
  TokenType,
  getTokenType,
} from './tines-to-route-processor-2.js'

class TinesToRouteProcessor4 extends TinesToRouteProcessor2 {
  // constructor(
  //   routeProcessorAddress: string,
  //   chainId: ChainId,
  //   pools: Map<string, PoolCode>,
  // ) {
  //   super(routeProcessorAddress, chainId, pools)
  // }

  override getPoolCode(l: RouteLeg): PoolCode {
    const pc = this.pools.get(l.uniqueId)
    if (pc === undefined) {
      throw new Error(`unknown pool: ${l.uniqueId}`)
    }
    return pc
  }

  override getRouteProcessorCode(
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

      if (this.isOnePoolOptimization(token, route))
        res += this.processOnePoolCode(token, route, toAddress)
      else {
        switch (getTokenType(token)) {
          case TokenType.NATIVE:
            res += this.processNativeCode(token, route, toAddress)
            break
          case TokenType.ERC20:
            res += this.processERC20Code(
              i > 0 || source === RouterLiquiditySource.XSwap,
              token,
              route,
              toAddress,
            )
            break
          case TokenType.BENTO:
            res += this.processBentoCode(token, route, toAddress)
            break
          default:
            throw new Error(`Unknown token type of token ${token.symbol}`)
        }
      }
    })

    return res as Hex
  }

  override isOnePoolOptimization(token: RToken, route: MultiRoute) {
    if (getTokenType(token) === TokenType.NATIVE) return false
    const outputDistribution =
      this.tokenOutputLegs.get(token.tokenId as string) || []
    if (outputDistribution.length !== 1) return false
    if (token.tokenId === route.fromToken.tokenId) return false

    const startPoint = this.getPoolCode(outputDistribution[0]!).getStartPoint(
      outputDistribution[0]!,
      route,
    )
    return startPoint === outputDistribution[0]!.poolAddress
  }

  override swapCode(
    leg: RouteLeg,
    route: MultiRoute,
    toAddress: string,
  ): string {
    const pc = this.getPoolCode(leg)
    const to = this.getPoolOutputAddress(leg, route, toAddress)
    return pc.getSwapCodeForRouteProcessor4(leg, route, to)
  }
}

export function getRouteProcessor4Code(
  route: MultiRoute,
  routeProcessorAddress: string,
  toAddress: string,
  pools: Map<string, PoolCode>,
  permits: PermitData[] = [],
  source = RouterLiquiditySource.Sender,
): string {
  const rpc = new TinesToRouteProcessor4(
    routeProcessorAddress,
    route.fromToken.chainId as ChainId,
    pools,
  )
  return rpc.getRouteProcessorCode(route, toAddress, permits, source)
}
