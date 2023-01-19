import { ChainId } from '@sushiswap/chain'
import routeProcessorExports from '@sushiswap/route-processor/exports'

export function getRouteProcessorAddressForChainId(chainId: ChainId) {
  if (!(chainId in routeProcessorExports)) {
    throw new Error(`Unsupported route processor network for ${chainId}`)
  }
  return routeProcessorExports[chainId.toString() as keyof Omit<typeof routeProcessorExports, '31337'>][0].contracts
    .RouteProcessor.address
}
