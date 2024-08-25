import type { ChainId } from '../chain/index.js'
import type { MultiRoute, RouteLeg } from '../tines/index.js'
import type { PoolCode } from './pool-codes/PoolCode.js'
import {
  type PermitData,
  RouterLiquiditySource,
} from './tines-to-route-processor-2.js'
import { TinesToRouteProcessor4 } from './tines-to-route-processor-4.js'

class TinesToRouteProcessor6 extends TinesToRouteProcessor4 {
  override swapCode(
    leg: RouteLeg,
    route: MultiRoute,
    toAddress: string,
  ): string {
    const pc = this.getPoolCode(leg)
    const to = this.getPoolOutputAddress(leg, route, toAddress)
    return pc.getSwapCodeForRouteProcessor6(leg, route, to)
  }
}

export function getRouteProcessor6Code(
  route: MultiRoute,
  routeProcessorAddress: string,
  toAddress: string,
  pools: Map<string, PoolCode>,
  permits: PermitData[] = [],
  source = RouterLiquiditySource.Sender,
): string {
  const rpc = new TinesToRouteProcessor6(
    routeProcessorAddress,
    route.fromToken.chainId as ChainId,
    pools,
  )
  return rpc.getRouteProcessorCode(route, toAddress, permits, source)
}
