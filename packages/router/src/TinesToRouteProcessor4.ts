import { ChainId } from '@sushiswap/chain'
import { MultiRoute, RouteLeg } from '@sushiswap/tines'

import { PoolCode } from './pools/PoolCode'
import { PermitData, TinesToRouteProcessor2 } from './TinesToRouteProcessor2'

class TinesToRouteProcessor4 extends TinesToRouteProcessor2 {
  constructor(routeProcessorAddress: string, chainId: ChainId, pools: Map<string, PoolCode>) {
    super(routeProcessorAddress, chainId, pools)
  }

  swapCode(leg: RouteLeg, route: MultiRoute, toAddress: string): string {
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
  permits: PermitData[] = []
): string {
  const rpc = new TinesToRouteProcessor4(routeProcessorAddress, route.fromToken.chainId as ChainId, pools)
  return rpc.getRouteProcessorCode(route, toAddress, permits)
}
